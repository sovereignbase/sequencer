/** Executes one generated convergence scenario inside an interruptible Worker. */
import { parentPort, workerData as scenario } from 'node:worker_threads'
import {
  create,
  ingest,
  insert,
  length,
  remove,
  replace,
  snapshot,
  values,
} from '../../../dist/index.js'

let finished = false
const finish = (ok, message) => {
  if (finished) return
  finished = true
  parentPort.postMessage({ ok, message })
}
const signature = (state) => JSON.stringify(values(state))

let target_actor = 10_000
const deliver = (base, mutations, restart_index, label) => {
  let state = create(target_actor++, base)
  let pending = [...mutations]
  let delivered = 0
  while (pending.length !== 0) {
    const next = []
    let progress = false
    for (const mutation of pending) {
      if (delivered === restart_index)
        state = create(target_actor++, snapshot(state))
      if (ingest(state, mutation) === false) next.push(mutation)
      else {
        ++delivered
        progress = true
      }
    }
    if (!progress)
      throw new TypeError(`${label}: ${pending.length} unresolved Mutations`)
    pending = next
  }
  return state
}

try {
  const base = create(1)
  if (scenario.base_frame_count > 0) {
    const mutation = insert(
      base,
      0,
      Array.from(
        { length: scenario.base_frame_count },
        (_, index) => `base-${index}`
      )
    )
    if (mutation === false) throw new TypeError('base insertion was rejected')
  }
  const retained = snapshot(base)
  const replicas = Array.from({ length: scenario.replica_count }, (_, index) =>
    create(100 + index, retained)
  )
  const mutations = []

  for (
    let operation_index = 0;
    operation_index < scenario.operations.length;
    ++operation_index
  ) {
    const operation = scenario.operations[operation_index]
    const replica_index = operation.replica_selector % scenario.replica_count
    const replica = replicas[replica_index]
    const projection_length = length(replica)
    let mutation = false
    if (operation.kind === 'remove') {
      if (projection_length === 0) continue
      const start = operation.index_selector % projection_length
      mutation = remove(
        replica,
        start,
        Math.min(projection_length, start + operation.frame_count)
      )
    } else {
      const frames = Array.from(
        { length: operation.frame_count },
        (_, frame) => `r${replica_index}-o${operation_index}-f${frame}`
      )
      if (operation.kind === 'replace') {
        if (projection_length === 0) continue
        const start = operation.index_selector % projection_length
        const count = Math.min(operation.frame_count, projection_length - start)
        mutation = replace(replica, start, frames.slice(0, count))
      } else {
        const index = operation.index_selector % (projection_length + 1)
        mutation = insert(replica, index, frames)
      }
    }
    if (mutation === false)
      throw new TypeError(`operation ${operation_index} was rejected`)
    mutations.push(mutation)
  }

  const ordered = deliver(retained, mutations, undefined, 'ordered')
  const expected = signature(ordered)
  const keyed = mutations
    .map((mutation, index) => [
      mutation,
      scenario.delivery_keys[index % scenario.delivery_keys.length],
      index,
    ])
    .sort((left, right) => left[1] - right[1] || left[2] - right[2])
    .map(([mutation]) => mutation)
  const hostile = deliver(retained, keyed, undefined, 'hostile')
  const restarted = deliver(
    retained,
    keyed,
    Math.ceil(mutations.length / 2),
    'restart'
  )
  const recreated = create(target_actor++, snapshot(hostile))
  for (const [label, target] of [
    ['hostile', hostile],
    ['restart', restarted],
    ['create', recreated],
  ]) {
    const actual = signature(target)
    if (actual !== expected)
      throw new TypeError(
        `${label} diverged; scenario=${JSON.stringify(scenario)}; expected=${expected}; actual=${actual}`
      )
  }
  finish(true)
} catch (error) {
  finish(false, error instanceof Error ? error.message : String(error))
}
