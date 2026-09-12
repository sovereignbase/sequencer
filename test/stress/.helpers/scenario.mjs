/** Executes one generated convergence scenario inside an interruptible Worker. */
import { parentPort, workerData as scenario } from 'node:worker_threads'
import { writeSync as write_sync } from 'node:fs'
import {
  create,
  insert,
  length,
  merge,
  snapshot,
  values,
} from '../../../dist/index.js'

const debug = process.env.SEQUENCER_STRESS_DEBUG === 'true'
const mark = (...values) => {
  if (debug) write_sync(2, `[stress] ${values.join(' ')}\n`)
}

// Report exactly one terminal result to the controlling Vitest process.
let finished = false
const finish = (ok, message) => {
  if (finished) return
  finished = true
  parentPort.postMessage({ ok, message })
}

// Convert one Replica into its deterministic visible Projection signature.
const signature = (state) => {
  mark('signature', 'start', length(state))
  const result = JSON.stringify(values(state))
  mark('signature', 'done')
  return result
}

const deliver = (base_delta, strips, restart_index, label = 'delivery') => {
  mark(label, 'create')
  let state = create(base_delta)
  for (let index = 0; index < strips.length; ++index) {
    if (index === restart_index) state = create(snapshot(state))
    merge(state, strips[index])
  }
  mark(label, 'done')
  return state
}

// Build the common base and independent concurrent writer branches.
const base = create()
if (scenario.base_frame_count > 0) {
  const result = insert(
    base,
    0,
    Array.from(
      { length: scenario.base_frame_count },
      (_, index) => `base-${index}`
    )
  )
  if (result === false) finish(false, 'base update was rejected')
}

const base_delta = snapshot(base)
const actors = await Promise.all(
  Array.from(
    { length: scenario.replica_count },
    (_, index) => import(`../../../dist/index.js?actor=${index}`)
  )
)
const replicas = actors.map((actor) => actor.create(base_delta))
const strips = []

// Apply mixed generated operations and retain every produced gossip Strip.
for (
  let operation_index = 0;
  operation_index < scenario.operations.length;
  operation_index++
) {
  mark('operation', operation_index, 'start')
  const operation = scenario.operations[operation_index]
  const replica_index = operation.replica_selector % scenario.replica_count
  const replica = replicas[replica_index]
  const actor = actors[replica_index]
  const projection_length = actor.length(replica)

  if (operation.kind === 'remove') {
    if (projection_length === 0) continue
    const start_index = operation.index_selector % projection_length
    const result = actor.remove(
      replica,
      start_index,
      Math.min(projection_length, start_index + operation.frame_count),
      operation.hard
    )
    if (result === false) finish(false, `operation ${operation_index} rejected`)
    else strips.push(result)
    continue
  }

  const values = Array.from(
    { length: operation.frame_count },
    (_, frame_index) =>
      `replica-${replica_index}-operation-${operation_index}-frame-${frame_index}`
  )
  const selected_index = operation.index_selector % (projection_length + 1)
  let result
  if (operation.kind === 'replace') {
    if (projection_length === 0) continue
    const replacement_index = operation.index_selector % projection_length
    result = actor.replace(
      replica,
      replacement_index,
      values.slice(0, projection_length - replacement_index),
      operation.hard
    )
  } else {
    result = actor.insert(replica, selected_index, values)
  }
  if (result === false) {
    finish(false, `operation ${operation_index} rejected`)
    continue
  }
  strips.push(result)
  mark('operation', operation_index, 'done')
}

// Derive every delivery family from the same immutable Strip collection.
const shuffled = strips
  .map((strip, index) => ({
    strip,
    index,
    key: scenario.delivery_keys[index % scenario.delivery_keys.length],
  }))
  .sort((left, right) => left.key - right.key || left.index - right.index)
  .map(({ strip }) => strip)
const duplicated = shuffled.flatMap((strip, index) =>
  index % 3 === 0 ? [strip, strip] : [strip]
)
const ordered = deliver(base_delta, strips, undefined, 'ordered')
const expected = signature(ordered)
const targets = [
  ['reverse', deliver(base_delta, [...strips].reverse(), undefined, 'reverse')],
  ['shuffle', deliver(base_delta, shuffled, undefined, 'shuffle')],
  ['duplicate', deliver(base_delta, duplicated, undefined, 'duplicate')],
  [
    'restart',
    deliver(base_delta, shuffled, Math.ceil(shuffled.length / 2), 'restart'),
  ],
]
const batched = create(base_delta)
merge(batched, [
  strips.flatMap((strip) => strip[0]),
  strips.flatMap((strip) => strip[1] ?? []),
])
targets.push(['batch', batched])
const saved = snapshot(ordered)
const restored_remote = create()
merge(restored_remote, saved)
targets.push(['full-snapshot', restored_remote])
const partial_remote = deliver(
  base_delta,
  strips.slice(0, Math.ceil(strips.length / 2))
)
merge(partial_remote, saved)
targets.push(['partial-snapshot', partial_remote])

// Compare every hostile target with the chronological reference state.
for (const [delivery_name, target] of targets) {
  if (delivery_name !== 'batch' && !delivery_name.endsWith('snapshot'))
    for (const strip of strips) merge(target, strip)
  const actual = signature(target)
  if (actual !== expected) {
    finish(
      false,
      `${delivery_name} delivery diverged; scenario=${JSON.stringify(
        scenario
      )}; expected=${expected}; actual=${actual}`
    )
    break
  }
}

finish(true)
