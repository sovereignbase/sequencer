/**
 * Hard deletion represented by Masks over existing Frames.
 *
 * @module
 */
import type { Mutation, Replica } from '../../types/type.js'
import {
  get_projection_frame_count,
  no_projection_frame_index,
  update_sequence,
  read_acknowledgement,
  read_delta,
  read_footage_spans,
  clear_footage_spans,
} from '../../wasm/index.js'

/**
 * Deletes the half-open visible range `[start_index, end_index)` by masking it.
 *
 * Native update issues one Mask for each containing Strip crossed by the range.
 * Each update reports its actual bounded length and retained Footage span.
 * Each returned packet contains an acknowledgement and one Mask Delta. The
 * corresponding JavaScript Footage is released immediately.
 * Released entries become `undefined`; the Footage array is not compacted, so
 * all retained indexes stay stable.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose visible values are deleted.
 * @param start_index Index of the first value to delete.
 * @param end_index Boundary immediately after the final value to delete;
 * defaults to the current length.
 * @returns The transferable Delta, or `false` when the requested range is
 * empty, or the first issuance is rejected. If a later issuance is
 * rejected, returns the accepted prefix Delta.
 * @remarks The caller supplies valid range boundaries.
 */
export function remove<T>(
  state: Replica<T>,
  start_index = 0,
  end_index?: number
): Mutation<T> | Array<Mutation<T>> | false {
  const deletion_end_index = end_index ?? get_projection_frame_count(state[0])

  const mutations: Array<Mutation<T>> = []
  let remaining_frame_count = deletion_end_index - start_index

  while (remaining_frame_count > 0) {
    const position =
      update_sequence(
        state[0],
        start_index,
        2,
        remaining_frame_count,
        no_projection_frame_index
      ) >>> 0
    if (position === no_projection_frame_index) break

    const mask = read_delta<T>()
    const acknowledgement = read_acknowledgement()
    const mask_frame_count = mask[2]
    void mutations.push([acknowledgement, mask])

    const footage_frame_index = read_footage_spans(1)[1]
    void state[1].fill(
      undefined,
      footage_frame_index,
      footage_frame_index + mask_frame_count
    )
    void clear_footage_spans()
    remaining_frame_count -= mask_frame_count
  }

  return mutations.length === 0
    ? false
    : mutations.length === 1
      ? mutations[0]
      : mutations
}
