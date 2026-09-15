import type { Replica, Snapshot } from '../../types/type.js'
import {
  clear_footage_spans,
  read_footage_spans,
  get_snapshot_frontiers,
  read_snapshot_deltas,
  snapshot_sequence,
} from '../../wasm/index.js'

/** Captures frontiers and dependency-ordered origin Deltas. */
export function snapshot<T>(state: Replica<T>): Snapshot<T> {
  snapshot_sequence(state[0])
  const deltas = read_snapshot_deltas<T>()
  for (const delta of deltas)
    if (delta[0] === 1) delta[8] = new Array<T | undefined>(delta[2])

  const spans = read_footage_spans()
  for (let span = 0; span < spans.length; span += 4) {
    const footage = deltas[spans[span]][8]
    if (!footage) continue
    const source = spans[span + 1]
    const length = spans[span + 2]
    const target = spans[span + 3]
    for (let frame = 0; frame < length; ++frame)
      footage[target + frame] = state[1][source + frame]
  }
  clear_footage_spans()
  return [get_snapshot_frontiers(state[0]), deltas]
}
