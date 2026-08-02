import create_module from './raw/sequencer_wasm.mjs'
import type { SequenceCoordinate } from '../types/type.js'

const wasm = create_module()
const strip_buffer_start_index = wasm._get_strip_buffer_pointer() >>> 2
const no_projection_frame_index = 0xffff_ffff

/**
 * Reads the strip currently held by the shared WebAssembly transfer buffer.
 *
 * The returned coordinate follows the TypeScript order
 * `[previous_strip_start, this_strip_start]` even though the native buffer
 * stores the current strip start first.
 */
export function read_strip_from_buffer(): [
  is_masked: number,
  frame_count: number,
  footage_frame_index: number,
  sequence_coordinate: SequenceCoordinate,
] {
  const buffer = wasm.HEAPU32
  const start = strip_buffer_start_index

  return [
    buffer[start],
    buffer[start + 1],
    buffer[start + 2],
    [
      [buffer[start + 7], buffer[start + 8], buffer[start + 6]],
      [buffer[start + 4], buffer[start + 5], buffer[start + 3]],
    ],
  ]
}

/**
 * Writes one strip to the shared WebAssembly transfer buffer.
 *
 * @param is_masked Zero for a visible strip; nonzero for a mask.
 * @param frame_count Number of consecutive frames represented by the strip.
 * @param footage_frame_index Footage index corresponding to its first frame.
 * @param sequence_coordinate Stable placement coordinate of the strip.
 */
export function write_strip_to_buffer(
  is_masked: number,
  frame_count: number,
  footage_frame_index: number,
  sequence_coordinate: SequenceCoordinate
): void {
  const buffer = wasm.HEAPU32
  const start = strip_buffer_start_index
  const previous_strip_start = sequence_coordinate[0]
  const this_strip_start = sequence_coordinate[1]

  buffer[start] = is_masked
  buffer[start + 1] = frame_count
  buffer[start + 2] = footage_frame_index
  buffer[start + 3] = this_strip_start[2]
  buffer[start + 4] = this_strip_start[0]
  buffer[start + 5] = this_strip_start[1]
  buffer[start + 6] = previous_strip_start[2]
  buffer[start + 7] = previous_strip_start[0]
  buffer[start + 8] = previous_strip_start[1]
}

/** Initializes an empty sequence and returns its stable identifier. */
export function initialize_sequence(): number {
  return wasm._initialize_sequence() >>> 0
}

/** Clears a sequence while retaining its identifier for later reuse. */
export function clear_sequence(sequence_id: number): void {
  wasm._clear_sequence(sequence_id)
}

/** Returns the number of frames in the current projection. */
export function get_projection_frame_count(sequence_id: number): number {
  return wasm._get_projection_frame_count(sequence_id) >>> 0
}

/** Resolves a projection frame index to its footage frame index. */
export function get_footage_frame_index(
  sequence_id: number,
  projection_frame_index: number
): number {
  return (
    wasm._get_footage_frame_index(sequence_id, projection_frame_index) >>> 0
  )
}

/** Writes the strip containing a projection frame index to the shared buffer. */
export function write_strip_at_projection_frame_index_to_buffer(
  sequence_id: number,
  projection_frame_index: number
): void {
  wasm._write_strip_at_projection_frame_index_to_buffer(
    sequence_id,
    projection_frame_index
  )
}

/**
 * Merges the buffered strip and returns its projection start index.
 *
 * A mask is reported at the index its first frame occupied before masking.
 * `false` means that the strip remained pending or was discarded.
 */
export function merge_strip_into_sequence(
  sequence_id: number
): number | false {
  const projection_frame_index =
    wasm._merge_strip_into_sequence(sequence_id) >>> 0
  return projection_frame_index === no_projection_frame_index
    ? false
    : projection_frame_index
}
