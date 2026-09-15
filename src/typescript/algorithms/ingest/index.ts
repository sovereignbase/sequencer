import { is_delta } from '../../helpers/index.js'
import type { Change, Delta, Replica } from '../../types/type.js'
import {
  clear_footage_spans,
  ingest_sequence,
  no_projection_frame_index,
} from '../../wasm/index.js'

/** Integrates one cached acknowledgement plus its native Delta batch. */
export function ingest<T>(state: Replica<T>, data: unknown): Change<T> | false {
  if (!is_delta<T>(data)) return false
  const [acknowledgement, projection, footage] = data as Delta<T>
  const incomingFootageLength = footage?.length ?? 0
  const spans = ingest_sequence(
    state[0],
    acknowledgement,
    projection,
    state[1].length,
    incomingFootageLength
  )
  if (!spans) return false
  const change: Change<T> = {}
  let changed = false
  for (let span = 0; span < spans.length; span += 4) {
    const projectionIndex = spans[span]
    const footageIndex = spans[span + 1]
    const frameCount = spans[span + 2]
    const masked = spans[span + 3] !== 0
    if (projectionIndex === no_projection_frame_index) {
      const start = state[1].length
      for (let frame = 0; frame < frameCount; ++frame)
        state[1][start + frame] = footage?.[footageIndex + frame]
      continue
    }
    changed = true
    if (masked && footageIndex !== no_projection_frame_index)
      void state[1].fill(undefined, footageIndex, footageIndex + frameCount)
    for (let frame = 0; frame < frameCount; ++frame)
      change[projectionIndex + frame] = masked
        ? undefined
        : state[1][footageIndex + frame]
  }
  clear_footage_spans()
  return change
}
