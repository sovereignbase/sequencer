/**
 * Point-issuing visible insertion and overwrite operations.
 *
 * @module
 */
import {
  is_safe_index,
  issue_virtual_strip,
} from '../../../../helpers/index.js'
import type { Change, Reel, Replica } from '../../../../types/type.js'
import {
  get_projection_frame_count,
  merge_strip_into_sequence,
  read_strip_from_buffer,
  write_strip_at_projection_frame_index_to_buffer,
} from '../../../../wasm/index.js'

/**
 * Inserts values relative to one visible index.
 *
 * `before` inserts at `index`, `after` inserts after it, and `overwrite` first
 * masks as many existing values as the insertion can cover before inserting at
 * the original index. Every call issues one contiguous visible Strip and
 * returns the local Change together with the Reel to exchange with Replicas.
 * Update is the only operation that issues new Sequence Points. Native
 * integration orders competing starts ascending after an ordinary point and
 * descending after the Root.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica to update.
 * @param index Zero-based visible index interpreted according to `mode`.
 * @param values Non-empty contiguous values to insert.
 * @param mode Placement or overwrite behavior.
 * @returns The consumer-facing Change and transferable Reel, or `false` when
 * `values` or `index` is invalid.
 */
export function __insert<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
):
  | {
      /** Minimal patch for the consumer's currently visible state. */
      change: Change<T>

      /** Visible Strip and optional Masks to exchange with other Replicas. */
      reel: Reel<T>
    }
  | false {
  const projection_frame_count = get_projection_frame_count(state.id)

  // Validate inserted values and the requested Projection position.
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    !is_safe_index(projection_frame_count, index, true)
  )
    return false

  // Initialize the consumer Change, transferable Reel, and Root context.
  const change: Change<T> = {}
  const reel: Reel<T> = []

  // Cache frame count
  const frame_count = values.length

  // Resolve the containing Strip and its Footage position.
  const footage_frame_index = write_strip_at_projection_frame_index_to_buffer(
    state.id,
    index
  )
  const containing_strip = read_strip_from_buffer<T>()

  // Derive the bounded span and its first existing Frame point.
  const strip_frame_offset = footage_frame_index - containing_strip[9]!

  const meta = issue_virtual_strip<T>(
    0,
    index > 0 ? 0 : 1,
    frame_count,
    containing_strip[6],
    containing_strip[7] + strip_frame_offset,
    containing_strip[8],
    state.footage.length
  )
  void state.footage.push(...values)
  void merge_strip_into_sequence(state.id)
  void reel.push([meta, values])

  // Build the consumer-facing visible Change.
  for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
    change[index + frame_offset] = values[frame_offset]

  // Return both local and transferable update results.
  return { change, reel }
}
