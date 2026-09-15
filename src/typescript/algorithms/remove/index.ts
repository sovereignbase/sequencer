/**
 * Hard deletion represented by Masks over existing Frames.
 *
 * @module
 */
import type { Delta, Replica } from '../../types/type.js'
import {
  get_projection_frame_count,
  no_projection_frame_index,
  read_acknowledgement,
  read_projection,
  read_footage_spans,
  clear_footage_spans,
  remove_sequence,
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
): Delta<T> | false {
  const deletion_end_index = end_index ?? get_projection_frame_count(state[0])
  const frameCount = deletion_end_index - start_index
  const position = remove_sequence(state[0], start_index, frameCount)
  if (position === no_projection_frame_index) return false

  const projection = read_projection()
  const spans = read_footage_spans()
  for (let span = 0; span < spans.length; span += 4) {
    const footage_frame_index = spans[span + 1]
    const mask_frame_count = spans[span + 2]
    void state[1].fill(
      undefined,
      footage_frame_index,
      footage_frame_index + mask_frame_count
    )
  }
  void clear_footage_spans()

  return [read_acknowledgement(state[0]), projection]
}
