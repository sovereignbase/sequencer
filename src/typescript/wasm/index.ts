/**
 * Typed adapter over the native Projector ABI and its shared transfer buffers.
 *
 * @module
 */
import create_module, { type MainModule } from './raw/sequencer_wasm.mjs'
import type { Acknowledgement, Delta } from '../types/type.js'

type VirtualStrip<T> = Delta<T>[0]

/** Synchronously initialized native Sequencer module shared by this adapter. */
export const wasm: MainModule = create_module()

/** Legacy initial buffer offset; transfers reacquire their current pointers. */
export const strip_buffer_start_index = wasm._get_strip_buffer_pointer() >>> 2

/** Native sentinel indicating that a merged Strip has no Projection position. */
export const no_projection_frame_index = 0xffff_ffff

/**
 * Copies the flattened Virtual Strip from the shared WebAssembly transfer
 * buffer into a new tuple.
 *
 * The reader releases the buffer after copying the tuple.
 *
 * @returns The copied Virtual Strip.
 */
export function read_strip_from_buffer<T>(): VirtualStrip<T> {
  const start = wasm._get_strip_buffer_pointer() >>> 2
  const buffer = wasm.HEAPU32

  const strip: VirtualStrip<T> = [
    buffer[start],
    buffer[start + 1],
    buffer[start + 2],
    buffer[start + 3],
    buffer[start + 4],
    buffer[start + 5],
    buffer[start + 6],
    buffer[start + 7],
    buffer[start + 8],
    buffer[start + 9],
    buffer[start + 10],
    buffer[start + 11],
  ]
  wasm._clear_projection_buffer()
  return strip
}

/**
 * Copies a flattened Virtual Strip to the shared WebAssembly transfer buffer.
 *
 * The optional Footage frame index is written only when present.
 *
 * @param strip Virtual Strip to transfer.
 */
export function write_strip_to_buffer<T>(strip: VirtualStrip<T>): void {
  const start = wasm._prepare_projection_buffer(1) >>> 2
  const buffer = wasm.HEAPU32

  buffer[start] = strip[0]
  buffer[start + 1] = strip[1]
  buffer[start + 2] = strip[2]
  buffer[start + 3] = strip[3]
  buffer[start + 4] = strip[4]
  buffer[start + 5] = strip[5]
  buffer[start + 6] = strip[6]
  buffer[start + 7] = strip[7]
  buffer[start + 8] = strip[8]

  buffer[start + 9] = strip[9]
  buffer[start + 10] = strip[10]
  buffer[start + 11] = strip[11]
}

/**
 * Consumes the prepared Projection buffer into a fresh native Projector.
 *
 * Without an input write, the already-consumed buffer is empty.
 *
 * @returns Its local identifier, stable until `clear_sequence` releases the
 * Projector. A later initialization may reuse a released identifier.
 */
export function initialize_sequence(): number {
  // Allocate or reuse one native Projector registry slot.
  return wasm._initialize_projection() >>> 0
}

/**
 * Releases one native Projector and makes its identifier reusable.
 *
 * Repeated clearing of the same identifier has no effect.
 *
 * @param sequence_id Active local Projector identifier.
 */
export function clear_sequence(sequence_id: number): void {
  // Release the selected native Projector registry slot.
  void wasm._clear_projection(sequence_id)
}

/**
 * Returns the number of Frames in the current Projection.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Sum of the Frame counts of all visible materialized Strips.
 */
export function get_projection_frame_count(sequence_id: number): number {
  // Read the cached native visible Frame count.
  return wasm._get_projection_frame_count(sequence_id) >>> 0
}

/**
 * Resolves one Projection frame index to its Footage frame index.
 *
 * @param sequence_id Active local Projector identifier.
 * @param projection_frame_index Valid zero-based Frame index in the Projection.
 * @returns Corresponding zero-based Frame index in JavaScript Footage.
 */
export function get_footage_frame_index(
  sequence_id: number,
  projection_frame_index: number
): number {
  // Resolve the Projection Frame through the native Gate.
  return (
    wasm._get_footage_frame_index(sequence_id, projection_frame_index) >>> 0
  )
}

/**
 * Writes every materialized Strip's Footage span in structural Sequence order.
 *
 * The returned view contains four-word Footage Span records. The synchronous
 * caller clears the Footage Span buffer immediately after consuming the view.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns A zero-copy view of ordered Footage spans, or `false` when the
 * retained Sequence is empty.
 */
export function get_recovery_footage_spans(
  sequence_id: number
): Uint32Array | false {
  const span_count =
    wasm._write_recovery_footage_spans_to_buffer(sequence_id) >>> 0
  if (span_count === 0) {
    wasm._clear_footage_span_buffer()
    return false
  }

  const span_start = wasm._get_footage_span_buffer_pointer() >>> 2
  return wasm.HEAPU32.subarray(span_start, span_start + span_count * 4)
}

/**
 * Returns ordered Footage Spans for one visible Projection range.
 *
 * Native traversal clips boundary Strips and omits Masks. The returned view is
 * consumed synchronously; the caller then clears the shared Footage Span
 * buffer before invoking another operation.
 *
 * @param sequence_id Active local Projector identifier.
 * @param start_index First visible Projection Frame to include.
 * @param end_index Boundary after the final visible Frame.
 * @returns A zero-copy view of four-word records
 * `(projection_frame_index, footage_frame_index, frame_count, masked)`, or
 * `false` for an empty range. Visible range records always have `masked = 0`.
 * @pre The half-open range is valid for the current Projection.
 */
export function get_projection_footage_spans(
  sequence_id: number,
  start_index: number,
  end_index: number
): Uint32Array | false {
  const span_count =
    wasm._write_projection_footage_spans_to_buffer(
      sequence_id,
      start_index,
      end_index
    ) >>> 0
  if (span_count === 0) {
    wasm._clear_footage_span_buffer()
    return false
  }

  const span_start = wasm._get_footage_span_buffer_pointer() >>> 2
  return wasm.HEAPU32.subarray(span_start, span_start + span_count * 4)
}

/**
 * Copies one Replica's acknowledgement Frontier from native memory.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Flat Realm triples with exclusive, gap-free Mask frontiers, or
 * `false` when no Mask Realm verifies. The reader clears the native buffer
 * before returning.
 */
export function get_acknowledgement_frontier(
  sequence_id: number
): Acknowledgement | false {
  const frontier_count: number = wasm._acknowledge_projection(sequence_id) >>> 0
  if (frontier_count === 0) {
    wasm._clear_sequence_point_buffer()
    return false
  }

  const buffer_index =
    wasm._get_acknowledgement_sequence_point_buffer_pointer() >>> 2
  const frontier = Array.from(
    wasm.HEAPU32.subarray(buffer_index, buffer_index + frontier_count * 3)
  )
  wasm._clear_sequence_point_buffer()
  return frontier
}

/** Transfers one selected frontier to native compaction. */
export function compact_sequence(
  sequence_id: number,
  frontier: Acknowledgement
): Uint32Array | false {
  return compact_frontiers(sequence_id, [frontier])
}

/** Transfers all actor frontiers; native code selects their exact agreement. */
export function compact_frontiers(
  sequence_id: number,
  frontiers: Array<Acknowledgement>,
  hard = false
): Uint32Array | false {
  if (frontiers.length === 0) return false
  let point_count = frontiers.length
  for (const frontier of frontiers) point_count += frontier.length / 3
  let start = wasm._prepare_compaction_sequence_point_buffer(point_count) >>> 2
  const buffer = wasm.HEAPU32
  for (const frontier of frontiers) {
    buffer[start] = frontier.length / 3
    buffer[start + 1] = 0
    buffer[start + 2] = 0
    start += 3
    buffer.set(frontier, start)
    start += frontier.length
  }
  const count =
    wasm._compact_projection(sequence_id, hard ? 1 : 0, frontiers.length) >>> 0
  if (count === 0) {
    clear_footage_spans()
    return false
  }
  return read_footage_spans(count)
}

/** Copies packed Strip words into the native input buffer. */
export function write_projection_to_buffer(projection: Array<number>): void {
  const start = wasm._prepare_projection_buffer(projection.length / 12) >>> 2
  wasm.HEAPU32.set(projection, start)
}

/** Copies native Strip words and releases their transfer buffer. */
export function read_projection_from_buffer(
  word_count: number = wasm._get_projection_buffer_word_count() >>> 0
): Array<number> {
  const start = wasm._get_projection_buffer_pointer() >>> 2
  const projection = Array.from(
    wasm.HEAPU32.subarray(start, start + word_count)
  )
  wasm._clear_projection_buffer()
  return projection
}

/** Borrows spans until the synchronous reader calls clear_footage_spans. */
export function read_footage_spans(
  count: number = wasm._get_footage_span_buffer_count() >>> 0
): Uint32Array {
  const start = count === 0 ? 0 : wasm._get_footage_span_buffer_pointer() >>> 2
  return wasm.HEAPU32.subarray(start, start + count * 4)
}

/** Releases spans after their synchronous consumption. */
export function clear_footage_spans(): void {
  wasm._clear_footage_span_buffer()
}

/** Issues one operation and leaves its Strip and optional spans for the reader. */
export function update_sequence(
  sequence_id: number,
  index: number,
  type: 0 | 1 | 2,
  length: number,
  footage_index: number
): number {
  return (
    wasm._update_projection(sequence_id, index, type, length, footage_index) >>>
    0
  )
}

/** Merges input and borrows visible suffix spans, including removed tail slots. */
export function merge_sequence(
  sequence_id: number,
  projection: Array<number>,
  footage_index: number,
  footage_length: number
): Uint32Array | false {
  write_projection_to_buffer(projection)
  const position =
    wasm._merge_projection(sequence_id, footage_index, footage_length) >>> 0
  if (position === no_projection_frame_index) {
    clear_footage_spans()
    return false
  }
  return read_footage_spans()
}

/** Writes both snapshot buffers; the synchronous caller consumes them. */
export function snapshot_sequence(sequence_id: number): void {
  wasm._snapshot_projection(sequence_id)
}

/** Marks the accepted instruction's source content as released. */
export function release_mask_footage(
  sequence_id: number,
  crypto: number,
  unix: number,
  counter: number
): void {
  wasm._release_mask_footage(sequence_id, crypto, unix, counter)
}
