import type { Replica, Snapshot } from '../../types/type.js'
import {
  clear_footage_spans,
  read_footage_spans,
  get_snapshot_frontiers,
  read_snapshot_projection,
  snapshot_sequence,
} from '../../wasm/index.js'

/** Captures frontiers and dependency-ordered origin Deltas. */
export function snapshot<T>(state: Replica<T>): Snapshot<T> {
  snapshot_sequence(state[0])
  const projection = read_snapshot_projection()
  let footageLength = 0
  for (let offset = 0; offset < projection.length; offset += 8)
    if (projection[offset] === 1) footageLength += projection[offset + 2]
  const footage = new Array<T | undefined>(footageLength)

  const spans = read_footage_spans()
  let currentDelta = 0
  let targetBase = 0
  for (let span = 0; span < spans.length; span += 4) {
    const delta = spans[span]
    while (currentDelta < delta) {
      const offset = currentDelta++ * 8
      if (projection[offset] === 1) targetBase += projection[offset + 2]
    }
    const source = spans[span + 1]
    const length = spans[span + 2]
    const target = targetBase + spans[span + 3]
    for (let frame = 0; frame < length; ++frame)
      footage[target + frame] = state[1][source + frame]
  }
  clear_footage_spans()
  return [get_snapshot_frontiers(state[0]), projection, footage]
}
