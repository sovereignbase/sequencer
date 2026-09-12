/**
 * Integration of remotely supplied, already-issued Delta material.
 *
 * @module
 */
import { is_delta } from '../../helpers/is_delta/index.js'
import type { Change, Replica } from '../../types/type.js'
import {
  clear_footage_spans,
  merge_sequence,
  no_projection_frame_index,
} from '../../wasm/index.js'

/**
 * Integrates encoded Strips and returns the changed suffix of the visible view.
 * Unknown dependencies are ignored, including their Footage. Resend those
 * Strips after their sources, or send a complete snapshot. Merge issues no new
 * SequencePoints. Invalid native metadata stops at the accepted Delta prefix.
 *
 * @param state Replica receiving remote material.
 * @param data Transferable `[projection, footage]` tuple.
 * @returns A visible index patch, or false when no visible change occurs.
 */
export function merge<T>(state: Replica<T>, data: unknown): Change<T> | false {
  if (!is_delta<T>(data)) return false

  const [projection, footage] = data

  const frame_count = footage?.length ?? 0
  const spans = merge_sequence(
    state[0],
    projection,
    state[1].length,
    frame_count
  )
  if (!spans) return false

  const change: Change<T> = {}
  let changed = false
  for (let span = 0; span < spans.length; span += 4) {
    const projection_index = spans[span]
    const footage_index = spans[span + 1]
    if (projection_index === no_projection_frame_index) {
      const start = state[1].length
      state[1].length = start + spans[span + 2]
      for (let frame = 0; frame < spans[span + 2]; ++frame)
        state[1][start + frame] = footage![footage_index + frame]
      continue
    }
    changed = true
    for (let frame = 0; frame < spans[span + 2]; ++frame)
      change[projection_index + frame] =
        spans[span + 3] === 0 ? state[1][footage_index + frame] : undefined
  }
  void clear_footage_spans()
  return changed ? change : false
}
