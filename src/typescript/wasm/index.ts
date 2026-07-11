import create_module, {
  type MainModule as MainModule,
} from './raw/crlist_wasm.mjs'

import type { SequencePoint, SequenceCoordinate } from '../types/type.js'

const wasm = create_module() as unknown as MainModule
const timecode_offset = wasm._timecode_buffer_pointer() >>> 2
const previous_timecode_offset = wasm._previous_timecode_buffer_pointer() >>> 2
const timecode_buffer = wasm.HEAPU32.subarray(
  timecode_offset,
  timecode_offset + 4
)
const previous_timecode_buffer = wasm.HEAPU32.subarray(
  previous_timecode_offset,
  previous_timecode_offset + 4
)

/**
 * Creates an empty projector.
 *
 * @returns The handle used by the other projector operations.
 */
export function cue_projector(): number {
  return wasm._cue()
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
 * Returns the application-defined footage code at a visible frame position.
 *
 * @param projector_id The projector to inspect.
 * @param frame_position The zero-based visible frame position.
 */
export function footage_code_of(
  projector_id: number,
  frame_position: number
): number {
  return wasm._footage_code_of(projector_id, frame_position)
}

/**
 * Returns the strip timecodes at a visible frame position.
 *
 * @param projector_id The projector to inspect.
 * @param frame_position The zero-based visible frame position.
 */
export function timecodes_of(
  projector_id: number,
  frame_position: number
): SequenceCoordinate {
  wasm._timecodes_of(projector_id, frame_position)
  return {
    previous: [
      previous_timecode_buffer[0],
      previous_timecode_buffer[1],
      previous_timecode_buffer[2],
      previous_timecode_buffer[3],
    ],
    current: [
      timecode_buffer[0],
      timecode_buffer[1],
      timecode_buffer[2],
      timecode_buffer[3],
    ],
  }
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
  wasm._splice(projector_id, footage_position, masked, length)
}
