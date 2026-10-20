/** Executes one generated convergence scenario inside an interruptible Worker. */
import { parentPort, workerData as scenario } from 'node:worker_threads'
import { Projection } from '../../../dist/index.js'
let finished = false
/** Posts one terminal outcome so the parent can release this isolated runtime. */
const finish = (ok, message) => {
  if (finished) return
  finished = true
  parentPort.postMessage({ ok, message })
}
/** Compares visible indexed reads and length, independently of snapshot layout or native caches. */
const signature = async (state) =>
  JSON.stringify([
    await state.length(),
    await Promise.all(
      Array.from(
        { length: await state.length() },
        async (_, position) => await state.value(position)
      )
    ),
  ])
let target_actor = 10000
let operation_index = -1
/** Replays whole Gossip batches; optional restart also exercises stale prefix redelivery. */
const deliver = async (base, mutations, restart_index, label) => {
  let state = new Projection(target_actor++, base)
  for (let index = 0; index < mutations.length; ++index) {
    await state.apply(mutations[index])
    if (index + 1 === restart_index) {
      state = new Projection(target_actor++, await state.sequence())
      for (let replay = 0; replay <= index; ++replay)
        await state.apply(mutations[replay])
    }
  }
  return state
}
try {
  // Include native Session ordering in the replayable generated scenario.
  const getRandomValues = crypto.getRandomValues
  let base
  try {
    crypto.getRandomValues = (array) => {
      array[0] = scenario.native_seed
      return array
    }
    base = new Projection(1)
  } finally {
    crypto.getRandomValues = getRandomValues
  }
  // Disconnected authors remain active members before any removal can compact.
  await base.apply(
    Array.from({ length: scenario.replica_count }, (_, index) => [100 + index])
  )
  if (scenario.base_frame_count > 0) {
    await base.insert(
      Array.from(
        { length: scenario.base_frame_count },
        (_, index) => `base-${index}`
      ),
      0
    )
  }
  const retained = await base.sequence()
  // Authors stay disconnected: every local edit uses its author's own visible Projection.
  const replicas = Array.from(
    { length: scenario.replica_count },
    (_, index) => new Projection(100 + index, retained)
  )
  const mutations = []
  for (
    operation_index = 0;
    operation_index < scenario.operations.length;
    ++operation_index
  ) {
    const operation = scenario.operations[operation_index]
    const replica_index = operation.replica_selector % scenario.replica_count
    const replica = replicas[replica_index]
    const projection_length = await replica.length()
    let mutation
    if (operation.kind === 'remove') {
      if (projection_length === 0) continue
      const start = operation.index_selector % projection_length
      mutation = await replica.remove(
        start,
        Math.min(projection_length - 1, start + operation.frame_count - 1)
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
        mutation = await replica.replace(
          frames.slice(0, count),
          start,
          start + count - 1
        )
      } else {
        const index = operation.index_selector % (projection_length + 1)
        mutation = await replica.insert(frames, index)
      }
    }
    mutations.push(mutation)
  }
  const ordered = await deliver(retained, mutations, undefined, 'ordered')
  const expected = await signature(ordered)
  // Stable tie-breaking on original ordinal permutes delivery without dropping duplicate-key updates.
  const keyed = mutations
    .map((mutation, index) => [
      mutation,
      scenario.delivery_keys[index % scenario.delivery_keys.length],
      index,
    ])
    .sort((left, right) => left[1] - right[1] || left[2] - right[2])
    .map(([mutation]) => mutation)
  const hostile = await deliver(retained, keyed, undefined, 'hostile')
  for (const [label, target] of [['hostile', hostile]]) {
    const actual = await signature(target)
    if (actual !== expected)
      throw new TypeError(
        `${label} diverged; scenario=${JSON.stringify(scenario)}; expected=${expected}; actual=${actual}`
      )
  }
  finish(true)
} catch (error) {
  finish(
    false,
    `operation ${operation_index}: ${error instanceof Error ? error.stack : String(error)}`
  )
}
