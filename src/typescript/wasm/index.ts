/**
 * Typed adapter over the native Projector ABI and its shared transfer buffers.
 *
 * @module
 */
import create_module from './raw/sequencer_wasm.mjs'
import type { Acknowledgement, VirtualStrip } from '../types/type.js'

/** Synchronously initialized native Sequencer module shared by this adapter. */
export const wasm = create_module()

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

  const footage_frame_index = strip[9]
  if (footage_frame_index !== undefined) {
    buffer[start + 9] = footage_frame_index
  }
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
 * Writes the Strip containing one Projection frame index to the shared buffer.
 *
 * The call also positions the Projector Gate at that Strip.
 *
 * @param sequence_id Active local Projector identifier.
 * @param projection_frame_index Valid zero-based Frame index in the Projection.
 *
 * @returns The exact footage_frame_index of the requested projection_frame_index
 */
export function write_strip_at_projection_frame_index_to_buffer(
  sequence_id: number,
  projection_frame_index: number
): number {
  // Position the native Gate, transfer its Strip, and return its Footage index.
  return (
    wasm._write_strip_at_projection_frame_index_to_buffer(
      sequence_id,
      projection_frame_index
    ) >>> 0
  )
}

/**
 * Writes the first self-linked Pending Strip to the shared buffer.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Whether a Pending Strip exists and was written.
 */
export function write_first_pending_strip_to_buffer(
  sequence_id: number
): boolean {
  return wasm._write_first_pending_strip_to_buffer(sequence_id) !== 0
}

/**
 * Advances the self-linked Pending Snapshot stream.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Whether another Snapshot Strip was written.
 */
export function write_next_pending_strip_to_buffer(
  sequence_id: number
): boolean {
  return wasm._write_next_pending_strip_to_buffer(sequence_id) !== 0
}

/**
 * Writes the first materialized Structural Order Strip to the shared buffer.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Whether Structural Order is non-empty and a Strip was written.
 */
export function write_first_structural_strip_to_buffer(
  sequence_id: number
): boolean {
  return wasm._write_first_structural_strip_to_buffer(sequence_id) !== 0
}

/**
 * Advances the circular materialized Structural Order Snapshot stream.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Whether another Snapshot Strip was written.
 */
export function write_next_structural_strip_to_buffer(
  sequence_id: number
): boolean {
  return wasm._write_next_structural_strip_to_buffer(sequence_id) !== 0
}

/**
 * Builds the initial Projection after all creation-time Strips are staged.
 *
 * Reachable dependencies join sentinel-free Structural Order; unresolved
 * Strips stay Pending. The call also initializes Projection traversal.
 *
 * @param sequence_id Active local Projector identifier.
 * @param projection_frame_index Known local Projection position. Omit it for a
 * remote merge that must locate the position from Structural Order.
 */
export function resolve_initial_projection(sequence_id: number): void {
  void wasm._resolve_initial_projection(sequence_id)
}

/** Stages the buffered Strip for Initial Projection Resolution. */
export function stage_strip(sequence_id: number): boolean {
  return wasm._stage_strip(sequence_id) >>> 0 !== no_projection_frame_index
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

/**
 * Resolves Footage covered by a selected realm-indexed Frontier.
 *
 * The returned view contains four-word Footage Span records. The synchronous
 * caller clears the Footage Span buffer immediately after consuming the view.
 *
 * @param sequence_id Active local Projector identifier.
 * @param frontier Selected compaction boundary for each included Realm.
 * @returns A zero-copy view of released Footage spans, or `false` when the
 * Frontier is empty or no Mask Footage is releasable.
 */
export function compact_sequence(
  sequence_id: number,
  frontier: Acknowledgement
): Uint32Array | false {
  // Validate that at least one selected Realm boundary exists.
  if (frontier.length === 0) return false

  // Prepare zero-copy input memory for the selected Frontier.
  const buffer_index =
    wasm._prepare_compaction_sequence_point_buffer(frontier.length / 3) >>> 2
  const buffer = wasm.HEAPU32

  // Encode every selected Realm boundary in native lane order.
  buffer.set(frontier, buffer_index)

  // Resolve covered native Mask Footage and the released-span count.
  const span_count = wasm._compact_projection(sequence_id) >>> 0
  if (span_count === 0) {
    wasm._clear_footage_span_buffer()
    return false
  }

  // Return a zero-copy view over the latest Footage-span result.
  const span_start = wasm._get_footage_span_buffer_pointer() >>> 2
  return wasm.HEAPU32.subarray(span_start, span_start + span_count * 4)
}

/**
 * Merges the buffered Strip into one materialized Sequence.
 *
 * A visible Strip is reported at its resulting Projection start. A Mask is
 * reported at the position its first Frame occupied before masking. A duplicate
 * produces no position. A new Strip whose dependency is absent, still Pending,
 * or waiting for Initial Projection Resolution remains self-linked and likewise
 * produces no position.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns The relevant Projection frame index, or `false` when the Strip stays
 * pending or is discarded.
 * @remarks `write_strip_to_buffer` must have supplied the incoming Strip.
 */
export function merge_strip_into_sequence(
  sequence_id: number,
  projection_frame_index = no_projection_frame_index
): number | false {
  // Invoke native staging, Mask, or deterministic insertion.
  const merged_projection_frame_index =
    wasm._merge_strip_into_sequence(sequence_id, projection_frame_index) >>> 0
  // Translate the native no-position sentinel into the TypeScript contract.
  return merged_projection_frame_index === no_projection_frame_index
    ? false
    : merged_projection_frame_index
}
