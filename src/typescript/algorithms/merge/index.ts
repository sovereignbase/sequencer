/**
 * Integration of remotely supplied, already-issued Delta material.
 *
 * @module
 */
import { is_delta } from '../../helpers/is_delta/index.js'
import type { Change, Replica } from '../../types/type.js'
import { clear_footage_spans, merge_sequence } from '../../wasm/index.js'

/**
 * Integrates encoded Strips and returns the changed suffix of the visible view.
 * Missing dependencies remain pending. Merge issues no new SequencePoints.
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
  if (footage !== undefined) {
    const start = state[1].length
    state[1].length = start + frame_count
    for (let frame = 0; frame < frame_count; ++frame)
      state[1][start + frame] = footage[frame]
  }
  if (!spans) return false

  const change: Change<T> = {}
  for (let span = 0; span < spans.length; span += 4) {
    const projection_index = spans[span]
    const footage_index = spans[span + 1]
    for (let frame = 0; frame < spans[span + 2]; ++frame)
      change[projection_index + frame] =
        spans[span + 3] === 0 ? state[1][footage_index + frame] : undefined
  }
  clear_footage_spans()
  return change
}
