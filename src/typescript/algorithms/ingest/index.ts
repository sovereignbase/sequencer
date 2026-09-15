import { is_acknowledgement, is_delta } from '../../helpers/index.js'
import type { Change, Mutation, Replica } from '../../types/type.js'
import {
  clear_footage_spans,
  ingest_sequence,
  no_projection_frame_index,
} from '../../wasm/index.js'

/** Integrates one cached acknowledgement plus its native Delta batch. */
export function ingest<T>(state: Replica<T>, data: unknown): Change<T> | false {
  if (
    !Array.isArray(data) ||
    data.length !== 2 ||
    !is_acknowledgement(data[0]) ||
    !Array.isArray(data[1]) ||
    data[1].length === 0 ||
    !data[1].every(is_delta<T>)
  )
    return false
  const [acknowledgement, deltas] = data as Mutation<T>
  let incomingFootageLength = 0
  for (const delta of deltas) incomingFootageLength += delta[8]?.length ?? 0
  const spans = ingest_sequence(
    state[0],
    acknowledgement,
    deltas,
    state[1].length,
    incomingFootageLength
  )
  if (!spans) return false

  const change: Change<T> = {}
  let changed = false
  let sourceDelta = 0
  let sourceStart = 0
  for (let span = 0; span < spans.length; span += 4) {
    const projectionIndex = spans[span]
    const footageIndex = spans[span + 1]
    const frameCount = spans[span + 2]
    const masked = spans[span + 3] !== 0
    if (projectionIndex === no_projection_frame_index) {
      while (sourceDelta < deltas.length) {
        const source = deltas[sourceDelta][8]
        const sourceEnd = sourceStart + (source?.length ?? 0)
        if (footageIndex < sourceEnd) break
        sourceStart = sourceEnd
        ++sourceDelta
      }
      const source = deltas[sourceDelta]?.[8]
      const start = state[1].length
      for (let frame = 0; frame < frameCount; ++frame)
        state[1][start + frame] = source?.[footageIndex - sourceStart + frame]
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
