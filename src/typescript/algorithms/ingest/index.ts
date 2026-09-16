import { is_delta } from '../../helpers/index.js'
import type { Change, Delta, Replica } from '../../types/type.js'
import {
  clear_footage_spans,
  ingest_sequence,
  no_projection_frame_index,
} from '../../wasm/index.js'

type Pending = Map<string, Map<string, Delta<unknown>>>

/** Missing causal children retained by reference until their parent arrives. */
const pending_by_replica = new WeakMap<object, Pending>()

const clock_key = (actor: number, time: number): string => `${actor}:${time}`

const dependency_key = <T>(delta: Delta<T>): string =>
  clock_key(delta[1][4], delta[1][5])

const operation_key = <T>(delta: Delta<T>): string =>
  `${delta[1][6]}:${delta[1][7]}:${delta[1].length}`

function retain_pending<T>(state: Replica<T>, delta: Delta<T>): void {
  let dependencies = pending_by_replica.get(state)
  if (dependencies === undefined) {
    dependencies = new Map()
    pending_by_replica.set(state, dependencies)
  }
  const dependency = dependency_key(delta)
  let operations = dependencies.get(dependency)
  if (operations === undefined) {
    operations = new Map()
    dependencies.set(dependency, operations)
  }
  operations.set(operation_key(delta), delta as Delta<unknown>)
}

function integrate<T>(
  state: Replica<T>,
  delta: Delta<T>
): Change<T> | false | null {
  const [acknowledgement, projection, footage] = delta
  const spans = ingest_sequence(
    state[0],
    acknowledgement,
    projection,
    state[1].length,
    footage?.length ?? 0
  )
  if (spans === null || spans === false) return spans

  const change: Change<T> = {}
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

/** Integrates one cached acknowledgement plus its native Delta batch. */
export function ingest<T>(state: Replica<T>, data: unknown): Change<T> | false {
  if (!is_delta<T>(data)) return false
  const delta = data as Delta<T>
  const initial = integrate(state, delta)
  if (initial === false) return false
  if (initial === null) {
    retain_pending(state, delta)
    return {}
  }

  const change = initial
  const dependencies = pending_by_replica.get(state)
  if (dependencies === undefined) return change
  const ready: Array<string> = []
  for (let row = 0; row < delta[1].length; row += 8)
    ready.push(clock_key(delta[1][row + 6], delta[1][row + 7]))
  for (let next = 0; next < ready.length; ++next) {
    const operations = dependencies.get(ready[next])
    if (operations === undefined) continue
    dependencies.delete(ready[next])
    for (const pending of operations.values()) {
      const result = integrate(state, pending as Delta<T>)
      if (result === null) {
        retain_pending(state, pending as Delta<T>)
        continue
      }
      if (result === false) continue
      Object.assign(change, result)
      for (let row = 0; row < pending[1].length; row += 8)
        ready.push(clock_key(pending[1][row + 6], pending[1][row + 7]))
    }
  }
  if (dependencies.size === 0) pending_by_replica.delete(state)
  return change
}
