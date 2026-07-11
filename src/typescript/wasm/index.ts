import create_module, {
  type MainModule as MainModule,
} from './raw/sequencer_wasm.mjs'
import type { SequencePoint, SequenceCoordinate } from '../types/type.js'
//
const wasm = create_module() as unknown as MainModule
//
const this_strip_start_offset = wasm._this_strip_start_buffer_pointer() >>> 2
const this_strip_start_buffer = wasm.HEAPU32.subarray(
  this_strip_start_offset,
  this_strip_start_offset + 4
)
//
const previous_strip_start_offset =
  wasm._previous_strip_start_buffer_pointer() >>> 2
const previous_strip_start_buffer = wasm.HEAPU32.subarray(
  previous_strip_start_offset,
  previous_strip_start_offset + 4
)
//
export function read_from_strip_start_buffer(
  strip_start_buffer: Uint32Array<ArrayBufferLike>
): SequencePoint {
  return [
    strip_start_buffer[0],
    strip_start_buffer[1],
    strip_start_buffer[2],
    strip_start_buffer[3],
  ]
}
//
export function write_to_strip_start_buffer(
  strip_start_buffer: Uint32Array<ArrayBufferLike>,
  strip_start: SequencePoint
): void {
  ;((strip_start_buffer[0] = strip_start[0]),
    (strip_start_buffer[1] = strip_start[1]),
    (strip_start_buffer[2] = strip_start[2]),
    (strip_start_buffer[3] = strip_start[3]))
}
/**
 * Creates an empty projector.
 *
 * @returns The handle used by the other projector operations.
 */
export function cue_projector(): number {
  return wasm._cue_projector()
}

/**
 * Returns the number of visible frames in a projector.
 *
 * @param projector_id The projector to inspect.
 */
export function size_of(projector_id: number): number {
  return wasm._size_of(projector_id)
}

/**
 * Returns the application-defined footage code at a requested index.
 *
 * @param projector_id The projector to inspect.
 * @param index The desired zero-based index.
 */
export function footage_position_of(
  projector_id: number,
  index: number
): number {
  return wasm._footage_position_of(projector_id, index)
}

/**
 * Returns the strip timecodes at a visible frame position.
 *
 * @param projector_id The projector to inspect.
 * @param index The zero-based visible frame position.
 */
export function sequence_coordinate_of(
  projector_id: number,
  index: number
): SequenceCoordinate {
  void wasm._previous_strip_start_of(projector_id, index)
  void wasm._this_strip_start_of(projector_id, index)
  return [
    read_from_strip_start_buffer(previous_strip_start_buffer),
    read_from_strip_start_buffer(this_strip_start_buffer),
  ]
}

export function prepare_next_sequence_point(): void {
  void wasm._next_sequence_point()
}

/**
 * Splices a strip into a projector.
 *
 * @param projector_id The projector that receives the strip.
 * @param options The strip metadata and sequence coordinates.
 */
export function splice_sequence(
  projector_id: number,
  footage_position: number,
  masked: 1 | 0
): void {
  wasm._splice_sequence(projector_id, footage_position, masked, length)
}
