import { createPlan } from '../helpers/plan.js'
import {
  LARGE_BATCH_SIZE,
  collectFrontiers,
  createArtifacts,
  createSparseState,
  createTombstonedState,
  measured,
  mergeArtifacts,
  mergeArtifactsByOrder,
  maybeGarbageCollect,
  shuffledOrder,
  visibleConvergence,
} from './shared.js'

function namedOperation(name, size, id) {
  const middle = Math.floor(size / 2)
  if (name.includes('delete head') || name.includes('deletes same head'))
    return { type: 'delete', index: 0, id }
  if (name.includes('delete middle') || name.includes('deletes same middle'))
    return { type: 'delete', index: middle, id }
  if (name.includes('delete tail') || name.includes('deletes same tail'))
    return { type: 'delete', index: Math.max(0, size - 1), id }
  if (name.includes('overwrite head') || name.includes('overwrites same head'))
    return { type: 'overwrite', index: 0, id }
  if (
    name.includes('overwrite middle') ||
    name.includes('overwrites same middle')
  )
    return { type: 'overwrite', index: middle, id }
  if (name.includes('overwrite tail') || name.includes('overwrites same tail'))
    return { type: 'overwrite', index: Math.max(0, size - 1), id }
  if (name.includes('append head')) return { type: 'insert', index: 1, id }
  if (name.includes('append tail') || name.includes('appends same tail'))
    return { type: 'insert', index: size, id }
  if (name.includes('prepend head') || name.includes('prepends same head'))
    return { type: 'insert', index: 0, id }
  return { type: 'insert', index: middle, id }
}

function stateForName(adapter, name, size) {
  if (name.includes('90%')) return createTombstonedState(adapter, size, 0.9)
  if (name.includes('50%') || name.includes('tombstoned'))
    return createTombstonedState(adapter, size, 0.5)
  if (name.includes('sparse')) return createSparseState(adapter, size, 0.7)
  return adapter.create(size)
}

function snapshotBenchmark(adapter, definition) {
  let state = stateForName(adapter, definition.name, definition.n)
  if (definition.name.includes('garbage collection')) {
    state = createTombstonedState(adapter, definition.n, 0.5)
    maybeGarbageCollect(adapter, state)
  }

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) adapter.snapshot(state)
    return definition.ops
  })
}

function acknowledgeBenchmark(adapter, definition) {
  if (!adapter.acknowledge) return undefined
  const state = stateForName(adapter, definition.name, definition.n)
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) adapter.acknowledge(state)
    return definition.ops
  })
}

function garbageCollectBenchmark(adapter, definition) {
  if (!adapter.garbageCollect) return undefined
  const state = stateForName(adapter, definition.name, definition.n)
  const replicas = definition.name.includes('10 replicas') ? 10 : 2
  const frontiers = definition.name.includes('no eligible')
    ? []
    : collectFrontiers(adapter, state, replicas)

  return measured(() => {
    for (let op = 0; op < definition.ops; op++)
      adapter.garbageCollect(state, [...frontiers])
    return definition.ops
  })
}

function postGcBenchmark(adapter, definition) {
  const state = createTombstonedState(adapter, definition.n, 0.5)
  maybeGarbageCollect(adapter, state)

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) adapter.ids(state)
    return definition.ops
  })
}

function mergeNamedDelta(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const result = adapter.change(
    source,
    namedOperation(definition.name, definition.n, 'merge:single')
  )

  const merged = measured(() => {
    target = adapter.merge(target, result.artifact)
    return 1
  })
  return visibleConvergence(merged, adapter, result.state, target)
}

function mergePlan(adapter, definition, count, options, order = 'ordered') {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const { state, artifacts } = createArtifacts(
    adapter,
    source,
    createPlan(count, definition.n, options)
  )
  const indices =
    order === 'shuffled'
      ? shuffledOrder(artifacts.length, 0x9090)
      : Array.from({ length: artifacts.length }, (_, index) => index)
  if (order === 'reverse') indices.reverse()

  const merged = measured(() => {
    target = mergeArtifactsByOrder(adapter, target, artifacts, indices)
    return artifacts.length
  })
  return visibleConvergence(merged, adapter, state, target)
}

function duplicateMergeBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const result = adapter.change(source, {
    type: 'insert',
    index: definition.n,
    id: 'duplicate',
  })
  target = adapter.merge(target, result.artifact)

  const duplicate = measured(() => {
    for (let op = 0; op < definition.ops; op++)
      target = adapter.merge(target, result.artifact)
    return definition.ops
  })
  return visibleConvergence(duplicate, adapter, result.state, target)
}

function oldDeltaBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const first = adapter.change(source, {
    type: 'insert',
    index: definition.n,
    id: 'old:first',
  })
  const second = adapter.change(first.state, {
    type: 'insert',
    index: definition.n + 1,
    id: 'old:second',
  })
  target = mergeArtifacts(adapter, target, [first.artifact, second.artifact])

  const old = measured(() => {
    for (let op = 0; op < definition.ops; op++)
      target = adapter.merge(target, first.artifact)
    return definition.ops
  })
  return visibleConvergence(old, adapter, second.state, target)
}

function concurrentBenchmark(adapter, definition) {
  const base = adapter.create(definition.n)
  const snapshot = adapter.snapshot(base)
  const left = adapter.hydrate(snapshot)
  const right = adapter.hydrate(snapshot)
  let targetA = adapter.hydrate(snapshot)
  let targetB = adapter.hydrate(snapshot)
  const leftResult = adapter.change(
    left,
    namedOperation(definition.name, definition.n, 'concurrent:left')
  )
  const rightResult = adapter.change(
    right,
    namedOperation(definition.name, definition.n, 'concurrent:right')
  )

  const merged = measured(() => {
    targetA = mergeArtifacts(adapter, targetA, [
      leftResult.artifact,
      rightResult.artifact,
    ])
    targetB = mergeArtifacts(adapter, targetB, [
      rightResult.artifact,
      leftResult.artifact,
    ])
    return 2
  })
  return visibleConvergence(merged, adapter, targetA, targetB)
}

function concurrentOverwriteDeleteBenchmark(adapter, definition) {
  const base = adapter.create(definition.n)
  const snapshot = adapter.snapshot(base)
  const left = adapter.hydrate(snapshot)
  const right = adapter.hydrate(snapshot)
  let targetA = adapter.hydrate(snapshot)
  let targetB = adapter.hydrate(snapshot)
  const index = Math.floor(definition.n / 2)
  const overwrite = adapter.change(left, {
    type: 'overwrite',
    index,
    id: 'concurrent:overwrite',
  })
  const remove = adapter.change(right, { type: 'delete', index })

  const merged = measured(() => {
    targetA = mergeArtifacts(adapter, targetA, [
      overwrite.artifact,
      remove.artifact,
    ])
    targetB = mergeArtifacts(adapter, targetB, [
      remove.artifact,
      overwrite.artifact,
    ])
    return 2
  })
  return visibleConvergence(merged, adapter, targetA, targetB)
}

function forkedReplicasBenchmark(adapter, definition) {
  const base = adapter.create(definition.n)
  const snapshot = adapter.snapshot(base)
  const leftArtifacts = createArtifacts(
    adapter,
    adapter.hydrate(snapshot),
    createPlan(250, definition.n, {
      idPrefix: 'left',
      mixed: true,
      position: 'middle',
    })
  )
  const rightArtifacts = createArtifacts(
    adapter,
    adapter.hydrate(snapshot),
    createPlan(250, definition.n, {
      idPrefix: 'right',
      mixed: true,
      position: 'tail',
    })
  )
  let left = leftArtifacts.state
  let right = rightArtifacts.state

  try {
    const merged = measured(() => {
      left = mergeArtifacts(adapter, left, rightArtifacts.artifacts)
      right = mergeArtifacts(adapter, right, leftArtifacts.artifacts)
      return leftArtifacts.artifacts.length + rightArtifacts.artifacts.length
    })
    return visibleConvergence(merged, adapter, left, right)
  } catch {
    return undefined
  }
}

function tenReplicaBenchmark(adapter, definition) {
  const base = adapter.create(definition.n)
  const snapshot = adapter.snapshot(base)
  const replicas = Array.from({ length: 10 }, (_, index) => ({
    index,
    state: adapter.hydrate(snapshot),
  }))
  const artifacts = replicas.map((replica) => {
    const result = adapter.change(replica.state, {
      type: 'insert',
      index: definition.n,
      id: `replica:${replica.index}`,
    })
    replica.state = result.state
    return result.artifact
  })

  const gossip = measured(() => {
    let merges = 0
    for (const replica of replicas) {
      for (const artifact of artifacts) {
        replica.state = adapter.merge(replica.state, artifact)
        merges++
      }
    }
    return merges
  })

  return replicas.every((replica) =>
    replicas[0]
      ? visibleConvergence(gossip, adapter, replicas[0].state, replica.state)
      : false
  )
    ? gossip
    : undefined
}

function snapshotMergeBenchmark(adapter, definition) {
  const { state, artifacts } = createArtifacts(
    adapter,
    adapter.create(definition.n),
    createPlan(definition.ops, definition.n, {
      idPrefix: 'snapshot',
      mixed: true,
      position: 'middle',
    })
  )
  const snapshot = adapter.snapshot(state)

  return measured(() => {
    let target = adapter.hydrate(snapshot)
    target = mergeArtifacts(adapter, target, artifacts)
    return artifacts.length + adapter.size(target)
  })
}

function mergeBenchmark(adapter, definition) {
  if (definition.name.includes('duplicate delta ignored'))
    return duplicateMergeBenchmark(adapter, definition)
  if (definition.name.includes('old delta ignored'))
    return oldDeltaBenchmark(adapter, definition)
  if (definition.name.includes('concurrent overwrite delete'))
    return concurrentOverwriteDeleteBenchmark(adapter, definition)
  if (definition.name.includes('concurrent'))
    return concurrentBenchmark(adapter, definition)
  if (definition.name.includes('forked replicas'))
    return forkedReplicasBenchmark(adapter, definition)
  if (definition.name.includes('10 replicas'))
    return tenReplicaBenchmark(adapter, definition)
  if (definition.name.includes('snapshot merge'))
    return snapshotMergeBenchmark(adapter, definition)
  if (definition.name.includes('ordered 1,000 append'))
    return mergePlan(adapter, definition, LARGE_BATCH_SIZE, {
      idPrefix: 'append',
      position: 'tail',
      type: 'insert',
    })
  if (definition.name.includes('ordered 1,000 prepend'))
    return mergePlan(adapter, definition, LARGE_BATCH_SIZE, {
      idPrefix: 'prepend',
      position: 'head',
      type: 'insert',
    })
  if (definition.name.includes('ordered 1,000 middle'))
    return mergePlan(adapter, definition, LARGE_BATCH_SIZE, {
      idPrefix: 'middle',
      position: 'middle',
      type: 'insert',
    })
  if (definition.name.includes('shuffled 1,000'))
    return mergePlan(
      adapter,
      definition,
      LARGE_BATCH_SIZE,
      { idPrefix: 'shuffled', mixed: true, position: 'middle' },
      'shuffled'
    )
  if (definition.name.includes('reverse ordered 1,000'))
    return mergePlan(
      adapter,
      definition,
      LARGE_BATCH_SIZE,
      { idPrefix: 'reverse', mixed: true, position: 'middle' },
      'reverse'
    )
  if (definition.name === 'merge ordered deltas')
    return mergePlan(adapter, definition, definition.ops, {
      idPrefix: 'ordered',
      mixed: true,
      position: 'middle',
    })
  if (definition.name === 'merge shuffled gossip')
    return mergePlan(
      adapter,
      definition,
      definition.ops,
      { idPrefix: 'shuffled', mixed: true, position: 'middle' },
      'shuffled'
    )
  return mergeNamedDelta(adapter, definition)
}

export function runMags(adapter, definition) {
  if (definition.name.startsWith('snapshot'))
    return snapshotBenchmark(adapter, definition)
  if (definition.name.startsWith('acknowledge'))
    return acknowledgeBenchmark(adapter, definition)
  if (definition.name.startsWith('garbage collect'))
    return garbageCollectBenchmark(adapter, definition)
  if (definition.name.startsWith('post-gc'))
    return postGcBenchmark(adapter, definition)
  if (definition.name.startsWith('merge'))
    return mergeBenchmark(adapter, definition)
  throw new Error(`Unhandled mags benchmark: ${definition.name}`)
}
