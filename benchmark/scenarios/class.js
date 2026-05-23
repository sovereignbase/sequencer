import { createPlan } from '../helpers/plan.js'
import {
  BATCH_SIZE,
  createArtifacts,
  createTombstonedState,
  createValues,
  measured,
  measuredSize,
  mergeArtifacts,
  mergeArtifactsByOrder,
  maybeGarbageCollect,
  operation,
  positionFromName,
  safeIndex,
  shuffledOrder,
  visibleConvergence,
} from './shared.js'
import { random } from '../helpers/random.js'

function classOps(adapter) {
  return {
    create: adapter.createClass ?? adapter.create,
    size: adapter.classSize ?? adapter.size,
    ids: adapter.classIds ?? adapter.ids,
    readId: adapter.classReadId ?? adapter.readId,
    snapshot: adapter.classSnapshot ?? adapter.snapshot,
    hydrate: adapter.classHydrate ?? adapter.hydrate,
    merge: adapter.classMerge ?? adapter.merge,
    change: adapter.classChange ?? adapter.change,
    append: adapter.classAppend ?? adapter.append,
    prepend: adapter.classPrepend ?? adapter.prepend,
    insertBefore: adapter.classInsertBefore ?? adapter.insertBefore,
    overwrite: adapter.classOverwrite ?? adapter.overwrite,
    deleteAt: adapter.classRemove ?? adapter.deleteAt,
    deleteRange:
      adapter.classRemove ??
      ((state, index, count) => adapter.deleteRange(state, index, count)),
    acknowledge: adapter.classAcknowledge ?? adapter.acknowledge,
    garbageCollect: adapter.classGarbageCollect ?? adapter.garbageCollect,
  }
}

function findById(ops, state, id) {
  for (let index = 0; index < ops.size(state); index++)
    if (ops.readId(state, index) === id) return ops.readId(state, index)
  return undefined
}

function readBenchmark(ops, definition) {
  const state = ops.create(definition.n)
  const index = safeIndex(ops, state, positionFromName(definition.name))
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) ops.readId(state, index)
    return definition.ops
  })
}

function findBenchmark(ops, definition) {
  const state = ops.create(definition.n)
  const id = ops.readId(
    state,
    safeIndex(ops, state, positionFromName(definition.name))
  )
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) findById(ops, state, id)
    return definition.ops
  })
}

function iterateBenchmark(ops, definition) {
  const state = ops.create(definition.n)
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) ops.ids(state)
    return definition.ops
  })
}

function insertBenchmark(ops, definition) {
  let state = ops.create(definition.n)
  const batch = definition.name.includes('batch')
  const amount = batch ? BATCH_SIZE : 1
  const middle = definition.name.includes('middle')

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) {
      const values = createValues(definition.n + op * amount, amount)
      if (definition.name.includes('append')) state = ops.append(state, values)
      else if (definition.name.includes('prepend'))
        state = ops.prepend(state, values)
      else
        state = ops.insertBefore(
          state,
          middle ? Math.floor(ops.size(state) / 2) : 0,
          values
        )
    }
    return definition.ops * amount
  })
}

function overwriteBenchmark(ops, definition) {
  let state = ops.create(definition.n)
  const fixed = safeIndex(ops, state, positionFromName(definition.name))
  const rand = random(0x6600)

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) {
      const index = definition.name.includes('random')
        ? Math.floor(rand() * ops.size(state))
        : Math.min(fixed, ops.size(state) - 1)
      state = ops.overwrite(state, index, [`class:overwrite:${op}`])
    }
    return definition.ops
  })
}

function removeBenchmark(ops, definition) {
  let state = ops.create(definition.n)
  const range = definition.name.includes('range') ? BATCH_SIZE : 1
  const position = positionFromName(definition.name)

  return measured(() => {
    let removed = 0
    for (let op = 0; op < definition.ops && ops.size(state) > 0; op++) {
      const index =
        position === 'tail'
          ? Math.max(0, ops.size(state) - range)
          : position === 'middle'
            ? Math.floor(ops.size(state) / 2)
            : 0
      const count = Math.min(range, ops.size(state) - index)
      state = ops.deleteRange(state, index, count)
      removed += count
    }
    return removed
  })
}

function mixedBenchmark(ops, definition) {
  let state = ops.create(definition.n)
  const position = positionFromName(definition.name)
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) {
      const kind =
        op % 3 === 0 ? 'insert' : op % 3 === 1 ? 'overwrite' : 'delete'
      const current = operation(
        kind,
        position,
        `class:mixed:${op}`,
        ops.size(state)
      )
      if (current.type === 'delete') state = ops.deleteAt(state, current.index)
      else if (current.type === 'overwrite')
        state = ops.overwrite(state, current.index, [current.id])
      else if (current.index >= ops.size(state))
        state = ops.append(state, [current.id])
      else state = ops.insertBefore(state, current.index, [current.id])
    }
    return definition.ops
  })
}

function snapshotBenchmark(ops, definition) {
  let state = definition.name.includes('tombstoned')
    ? createTombstonedState(ops, definition.n, 0.5)
    : ops.create(definition.n)
  if (definition.name.includes('garbage collection'))
    state = maybeGarbageCollect(
      ops,
      createTombstonedState(ops, definition.n, 0.5)
    )

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) ops.snapshot(state)
    return definition.ops
  })
}

function acknowledgeBenchmark(ops, definition) {
  if (!ops.acknowledge) return undefined
  const state = createTombstonedState(
    ops,
    definition.n,
    definition.name.includes('90%') ? 0.9 : 0.5
  )
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) ops.acknowledge(state)
    return definition.ops
  })
}

function garbageCollectBenchmark(ops, definition) {
  if (!ops.garbageCollect || !ops.acknowledge) return undefined
  const state = createTombstonedState(
    ops,
    definition.n,
    definition.name.includes('90%') ? 0.9 : 0.5
  )
  const ack = definition.name.includes('no eligible')
    ? undefined
    : ops.acknowledge(state)
  const frontiers = ack ? [ack, ack] : []

  return measured(() => {
    for (let op = 0; op < definition.ops; op++)
      ops.garbageCollect(state, [...frontiers])
    return definition.ops
  })
}

function mergePlanBenchmark(ops, definition, order = 'ordered') {
  const source = ops.create(definition.n)
  let target = ops.hydrate(ops.snapshot(source))
  const { state, artifacts } = createArtifacts(
    ops,
    source,
    createPlan(definition.ops, definition.n, {
      idPrefix: 'class',
      mixed: true,
      position: 'middle',
    })
  )
  const indices =
    order === 'shuffled'
      ? shuffledOrder(artifacts.length, 0x7777)
      : Array.from({ length: artifacts.length }, (_, index) => index)

  const merged = measured(() => {
    target = mergeArtifactsByOrder(ops, target, artifacts, indices)
    return artifacts.length
  })
  return visibleConvergence(merged, ops, state, target)
}

function duplicateMergeBenchmark(ops, definition) {
  const source = ops.create(definition.n)
  let target = ops.hydrate(ops.snapshot(source))
  const result = ops.change(source, {
    type: 'insert',
    index: definition.n,
    id: 'class:duplicate',
  })
  target = ops.merge(target, result.artifact)

  const duplicate = measured(() => {
    for (let op = 0; op < definition.ops; op++)
      target = ops.merge(target, result.artifact)
    return definition.ops
  })
  return visibleConvergence(duplicate, ops, result.state, target)
}

function concurrentMergeBenchmark(ops, definition) {
  const snapshot = ops.snapshot(ops.create(definition.n))
  const left = ops.hydrate(snapshot)
  const right = ops.hydrate(snapshot)
  let targetA = ops.hydrate(snapshot)
  let targetB = ops.hydrate(snapshot)
  const position = positionFromName(definition.name)
  const leftResult = ops.change(
    left,
    operation('insert', position, 'class:left', definition.n)
  )
  const rightResult = ops.change(
    right,
    operation('insert', position, 'class:right', definition.n)
  )

  const merged = measured(() => {
    targetA = mergeArtifacts(ops, targetA, [
      leftResult.artifact,
      rightResult.artifact,
    ])
    targetB = mergeArtifacts(ops, targetB, [
      rightResult.artifact,
      leftResult.artifact,
    ])
    return 2
  })
  return visibleConvergence(merged, ops, targetA, targetB)
}

function forkedBenchmark(ops, definition) {
  const snapshot = ops.snapshot(ops.create(definition.n))
  const leftArtifacts = createArtifacts(
    ops,
    ops.hydrate(snapshot),
    createPlan(250, definition.n, { idPrefix: 'class:left', mixed: true })
  )
  const rightArtifacts = createArtifacts(
    ops,
    ops.hydrate(snapshot),
    createPlan(250, definition.n, { idPrefix: 'class:right', mixed: true })
  )
  let left = leftArtifacts.state
  let right = rightArtifacts.state

  try {
    const merged = measured(() => {
      left = mergeArtifacts(ops, left, rightArtifacts.artifacts)
      right = mergeArtifacts(ops, right, leftArtifacts.artifacts)
      return leftArtifacts.artifacts.length + rightArtifacts.artifacts.length
    })
    return visibleConvergence(merged, ops, left, right)
  } catch {
    return undefined
  }
}

function mergeBenchmark(ops, definition) {
  if (definition.name.includes('shuffled'))
    return mergePlanBenchmark(ops, definition, 'shuffled')
  if (definition.name.includes('duplicate'))
    return duplicateMergeBenchmark(ops, definition)
  if (definition.name.includes('concurrent'))
    return concurrentMergeBenchmark(ops, definition)
  if (definition.name.includes('forked'))
    return forkedBenchmark(ops, definition)
  return mergePlanBenchmark(ops, definition)
}

export function runClass(adapter, definition) {
  const ops = classOps(adapter)
  if (definition.name === 'constructor / hydrate snapshot') {
    const snapshot = ops.snapshot(ops.create(definition.n))
    return measured(() => {
      for (let op = 0; op < definition.ops; op++) ops.hydrate(snapshot)
      return definition.ops
    })
  }
  if (definition.name.startsWith('read /'))
    return readBenchmark(ops, definition)
  if (definition.name.startsWith('find')) return findBenchmark(ops, definition)
  if (
    definition.name.includes('iterate') ||
    definition.name.includes('collect')
  )
    return iterateBenchmark(ops, definition)
  if (
    definition.name.startsWith('append /') ||
    definition.name.startsWith('prepend /') ||
    definition.name.startsWith('insert /') ||
    definition.name.startsWith('paste /')
  )
    return definition.name.startsWith('paste /')
      ? measured(() => {
          let state = ops.create(definition.n)
          state = ops.insertBefore(
            state,
            Math.floor(definition.n / 2),
            createValues(definition.n, 10_000)
          )
          return 10_000
        })
      : insertBenchmark(ops, definition)
  if (definition.name.startsWith('overwrite /'))
    return overwriteBenchmark(ops, definition)
  if (definition.name.startsWith('remove /'))
    return removeBenchmark(ops, definition)
  if (definition.name.startsWith('mixed /'))
    return mixedBenchmark(ops, definition)
  if (definition.name.startsWith('render /')) {
    const state = ops.create(definition.n)
    return measured(() => {
      for (let op = 0; op < definition.ops; op++) ops.ids(state).join('')
      return definition.ops
    })
  }
  if (definition.name.startsWith('snapshot'))
    return snapshotBenchmark(ops, definition)
  if (definition.name.startsWith('acknowledge'))
    return acknowledgeBenchmark(ops, definition)
  if (definition.name.startsWith('garbage collect'))
    return garbageCollectBenchmark(ops, definition)
  if (definition.name.startsWith('merge'))
    return mergeBenchmark(ops, definition)
  throw new Error(`Unhandled class benchmark: ${definition.name}`)
}
