/**
 * Complete retained state transferred through the native snapshot buffers.
 *
 * @module
 */
import type { Delta, Replica } from '../../types/type.js'
import { wasm } from '../../wasm/index.js'

/**
 * Captures materialized Strips in Head-to-Tail order, then pending Strips.
 *
 * Copies the flat Projection and its ordered Footage spans into independent
 * arrays. Materialized Masks retain their soft-deleted content; released values
 * remain undefined. Pending inserts carry Footage, while unresolved Mask
 * commands do not yet own the content they address.
 *
 * @param state Replica whose complete retained state is captured.
 * @returns A trusted snapshot with snapshot-local links and packed Footage.
 * @remarks Issues no SequencePoints and does not change the source Footage.
 * Array storage is copied; consumer-owned values are not deep-cloned.
 */
export function snapshot<T>(state: Replica<T>): Delta<T> {
  wasm._snapshot_projection(state[0])
  const projection_start = wasm._get_projection_buffer_pointer() >>> 2
  const projection_word_count = wasm._get_projection_buffer_word_count() >>> 0
  const span_start = wasm._get_footage_span_buffer_pointer() >>> 2
  const span_end =
    span_start + (wasm._get_footage_span_buffer_count() >>> 0) * 4
  const buffer = wasm.HEAPU32
  const projection = Array.from(
    buffer.subarray(projection_start, projection_start + projection_word_count)
  )

  let footage_length = 0
  for (let span_index = span_start; span_index < span_end; span_index += 4)
    footage_length += buffer[span_index + 2]

  const footage = new Array<T>(footage_length)
  let result_index = 0
  for (let span_index = span_start; span_index < span_end; span_index += 4) {
    const footage_start = buffer[span_index + 1]
    const footage_end = footage_start + buffer[span_index + 2]
    for (
      let footage_index = footage_start;
      footage_index < footage_end;
      ++footage_index
    )
      footage[result_index++] = state[1][footage_index] as T
  }
  return [projection, footage]
}
