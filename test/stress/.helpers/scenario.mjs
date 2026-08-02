/** Executes one generated convergence scenario inside an interruptible Worker. */
import { parentPort, workerData as scenario } from 'node:worker_threads'
import { writeSync as write_sync } from 'node:fs'
import {
  __create,
  __delete,
  __length,
  __merge,
  __read,
  __snapshot,
  __update,
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
  mark('signature', 'start', __length(state))
  const result = JSON.stringify(
    Array.from({ length: __length(state) }, (_, index) => __read(state, index))
  )
  mark('signature', 'done')
  return result
}

// Integrate individual Strips and optionally restart from a mid-stream snapshot.
const deliver = (base_reel, strips, restart_index, label = 'delivery') => {
  mark(label, 'create')
  let state = __create(base_reel)
  for (let index = 0; index < strips.length; index++) {
    mark(label, 'merge', index, JSON.stringify(strips[index].slice(0, 3)))
    void __merge(state, [strips[index]])
    if (index + 1 === restart_index) {
      mark(label, 'restart', index)
      state = __create(__snapshot(state))
    }
  }
  mark(label, 'done')
  return state
}

// Build the common base and independent concurrent writer branches.
const base = __create()
if (scenario.base_frame_count > 0) {
  const result = __update(
    base,
    0,
    Array.from(
      { length: scenario.base_frame_count },
      (_, index) => `base-${index}`
    ),
    'after'
  )
  if (result === false) finish(false, 'base update was rejected')
}

const base_reel = __snapshot(base)
const replicas = Array.from({ length: scenario.replica_count }, () =>
  __create(base_reel)
)
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
  const length = __length(replica)

  if (operation.kind === 'delete') {
    if (length === 0) continue
    const start_index = operation.index_selector % length
    const result = __delete(
      replica,
      start_index,
      Math.min(length, start_index + operation.frame_count),
      operation.hard
    )
    if (result !== false) strips.push(...result.reel)
    continue
  }

  const values = Array.from(
    { length: operation.frame_count },
    (_, frame_index) =>
      `replica-${replica_index}-operation-${operation_index}-frame-${frame_index}`
  )
  const result = __update(
    replica,
    operation.index_selector % (length + 1),
    values,
    operation.kind
  )
  if (result === false) {
    finish(false, `operation ${operation_index} rejected`)
    continue
  }
  strips.push(...result.reel)
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
const ordered = deliver(base_reel, strips, undefined, 'ordered')
const expected = signature(ordered)
const targets = [
  ['reverse', deliver(base_reel, [...strips].reverse(), undefined, 'reverse')],
  ['shuffle', deliver(base_reel, shuffled, undefined, 'shuffle')],
  ['duplicate', deliver(base_reel, duplicated, undefined, 'duplicate')],
  [
    'restart',
    deliver(
      base_reel,
      shuffled,
      Math.ceil(shuffled.length / 2),
      'restart'
    ),
  ],
]
const batched = __create(base_reel)
void __merge(batched, strips)
targets.push(['batch', batched])

// Compare every hostile target with the chronological reference state.
for (const [delivery_name, target] of targets) {
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
