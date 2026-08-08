/**
 * Typed adapter over the native Projector ABI and its shared transfer buffers.
 *
 * @module
 */
import create_module from './raw/sequencer_wasm.mjs'
import type { Frontier, VirtualStrip } from '../types/type.js'

/** Synchronously initialized native Sequencer module shared by this adapter. */
export const wasm = create_module()

/** Stable unsigned-word index of the shared nine-word StripBuffer. */
export const strip_buffer_start_index = wasm._get_strip_buffer_pointer() >>> 2

/** Native sentinel indicating that a merged Strip has no Projection position. */
export const no_projection_frame_index = 0xffff_ffff

/**
 * Copies the flattened Virtual Strip from the shared WebAssembly transfer
 * buffer into a new tuple.
 *
 * Later writes to the transfer buffer cannot mutate the returned tuple.
 *
 * @returns The copied Virtual Strip.
 */
export function read_strip_from_buffer<T>(): VirtualStrip<T> {
  const buffer = wasm.HEAPU32
  const start = strip_buffer_start_index

  return [
    buffer[start],
    buffer[start + 1],
    buffer[start + 2],
    buffer[start + 3],
    buffer[start + 4],
    buffer[start + 5],
    buffer[start + 6],
    buffer[start + 7],
    buffer[start + 8],
  ]
}

/**
 * Copies a flattened Virtual Strip to the shared WebAssembly transfer buffer.
 *
 * The optional Footage frame index is written only when present.
 *
 * @param strip Virtual Strip to transfer.
 */
export function write_strip_to_buffer<T>(strip: VirtualStrip<T>): void {
  const buffer = wasm.HEAPU32
  const start = strip_buffer_start_index

  buffer[start] = strip[0]
  buffer[start + 1] = strip[1]
  buffer[start + 2] = strip[2]
  buffer[start + 3] = strip[3]
  buffer[start + 4] = strip[4]
  buffer[start + 5] = strip[5]
  buffer[start + 6] = strip[6]
  buffer[start + 7] = strip[7]

  const footage_frame_index = strip[8]
  if (footage_frame_index !== undefined) {
    buffer[start + 8] = footage_frame_index
  }
}

/**
 * Initializes an empty native Projector.
 *
 * @returns Its local identifier, stable until `clear_sequence` releases the
 * Projector. A later initialization may reuse a released identifier.
 */
export function initialize_sequence(): number {
  // Allocate or reuse one native Projector registry slot.
  return wasm._initialize_sequence() >>> 0
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
  void wasm._clear_sequence(sequence_id)
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
 * Writes the first materialized Snapshot Strip to the shared buffer.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Whether a first Snapshot Strip exists and was written.
 */
export function write_first_structural_strip_to_buffer(
  sequence_id: number
): boolean {
  return wasm._write_first_structural_strip_to_buffer(sequence_id) !== 0
}

/**
 * Advances the materialized structural Snapshot stream.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns Whether another Snapshot Strip was written.
 */
export function write_next_structural_strip_to_buffer(
  sequence_id: number
): boolean {
  return wasm._write_next_structural_strip_to_buffer(sequence_id) !== 0
}

/** Stages one buffered Strip without resolving its dependency. */
export function stage_strip_for_sequence(sequence_id: number): void {
  void wasm._stage_strip_for_sequence(sequence_id)
}

/** Resolves every staged dependency reachable from Root. */
export function try_to_resolve_pending(sequence_id: number): void {
  void wasm._try_to_resolve_pending(sequence_id)
}

/**
 * Copies one Replica's acknowledgement Frontier from native memory.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns One greatest materialized Strip start per represented Realm, or
 * `false` when no Strip is materialized.
 */
export function get_acknowledgement_frontier(
  sequence_id: number
): Frontier | false {
  // Materialize one greatest indexed Strip start per represented Realm.
  const frontier_count: number =
    wasm._write_acknowledgement_frontier_to_buffer(sequence_id) >>> 0
  if (frontier_count === 0) return false

  // Resolve the current zero-copy FrontierBuffer view.
  const buffer = wasm.HEAPU32
  let buffer_index = wasm._get_acknowledgement_frontier_buffer_pointer() >>> 2
  const frontier = new Array<Frontier[number]>(frontier_count)

  // Copy every native Realm entry into a TypeScript Sequence Point.
  for (let realm_index = 0; realm_index < frontier_count; realm_index++) {
    frontier[realm_index] = [
      buffer[buffer_index],
      buffer[buffer_index + 1],
      buffer[buffer_index + 2],
    ]
    buffer_index += 3
  }

  return frontier
}

/**
 * Resolves Footage covered by a selected realm-indexed Frontier.
 *
 * The returned view contains `(footage_frame_index, frame_count)` pairs and is
 * valid only until another WebAssembly call rewrites or moves the shared
 * Footage-span buffer.
 *
 * @param sequence_id Active local Projector identifier.
 * @param frontier Selected garbage-collection boundary for each included Realm.
 * @returns A zero-copy view of released Footage spans, or `false` when the
 * Frontier is empty or no Mask Footage is releasable.
 */
export function garbage_collect_sequence(
  sequence_id: number,
  frontier: Frontier
): Uint32Array | false {
  // Validate that at least one selected Realm boundary exists.
  if (frontier.length === 0) return false

  // Prepare zero-copy input memory for the selected Frontier.
  let buffer_index =
    wasm._prepare_garbage_collection_frontier_buffer(frontier.length) >>> 2
  const buffer = wasm.HEAPU32

  // Encode every selected Realm boundary in native lane order.
  for (const [unix_lower_bits, counter_bits, random_bits] of frontier) {
    buffer[buffer_index] = unix_lower_bits
    buffer[buffer_index + 1] = counter_bits
    buffer[buffer_index + 2] = random_bits
    buffer_index += 3
  }

  // Resolve covered native Mask Footage and the released-span count.
  const span_count = wasm._garbage_collect_sequence(sequence_id) >>> 0
  if (span_count === 0) return false

  // Return a zero-copy view over the latest Footage-span result.
  const span_start =
    wasm._get_garbage_collection_footage_span_buffer_pointer() >>> 2
  return wasm.HEAPU32.subarray(span_start, span_start + span_count * 2)
}

/**
 * Merges the buffered Strip into one materialized Sequence.
 *
 * A visible Strip is reported at its resulting Projection start. A Mask is
 * reported at the position its first Frame occupied before masking. A Strip
 * whose previous point has not materialized remains pending; an invalid Mask is
 * discarded. A Mask coordinate uses its containing Strip's indexed start as
 * the previous point and its first masked Frame's existing point as its own
 * start.
 *
 * @param sequence_id Active local Projector identifier.
 * @returns The relevant Projection frame index, or `false` when the Strip stays
 * pending or is discarded.
 * @remarks `write_strip_to_buffer` must have supplied the incoming Strip.
 */
export function merge_strip_into_sequence(sequence_id: number): number | false {
  // Invoke native dependency, Mask, and deterministic insert resolution.
  const projection_frame_index =
    wasm._merge_strip_into_sequence(sequence_id) >>> 0
  // Translate the native no-position sentinel into the TypeScript contract.
  return projection_frame_index === no_projection_frame_index
    ? false
    : projection_frame_index
}
