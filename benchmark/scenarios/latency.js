import { createPlan } from '../helpers/plan.js'
import {
  createArtifacts,
  findIndexById,
  measured,
  mergeArtifacts,
  mergeArtifactsByOrder,
  operation,
  positionFromName,
  shuffledOrder,
  visibleConvergence,
} from './shared.js'

function latencyKind(name) {
  if (name.includes('delete')) return 'delete'
  if (name.includes('overwrite')) return 'overwrite'
  return 'insert'
}

function latencyPosition(name) {
  if (name.includes('append tail')) return 'tail'
  if (name.includes('prepend head')) return 'head'
  if (name.includes('head insert')) return 'head'
  return positionFromName(name)
}

function latencyOperation(adapter, source, definition, index) {
  const kind = latencyKind(definition.name)
  const position = latencyPosition(definition.name)
  const op = operation(
    kind,
    position,
    `latency:${definition.name}:${index}`,
    adapter.size(source),
    0x8880 + index
  )
  if (kind === 'delete') op.id = adapter.readId(source, op.index)
  return op
}

function consume(adapter, target, op) {
  if (op.type === 'delete') return findIndexById(adapter, target, op.id) === -1
  return findIndexById(adapter, target, op.id) >= 0
}

function remoteLatency(adapter, definition, remoteCount = 1) {
  let source = adapter.create(definition.n)
  const snapshot = adapter.snapshot(source)
  const remotes = Array.from({ length: remoteCount }, () =>
    adapter.hydrate(snapshot)
  )

  return measured(() => {
    let visible = 0
    for (let index = 0; index < definition.ops; index++) {
      const op = latencyOperation(adapter, source, definition, index)
      const result = adapter.change(source, op)
      source = result.state
      for (let remote = 0; remote < remotes.length; remote++) {
        remotes[remote] = adapter.merge(remotes[remote], result.artifact)
        if (consume(adapter, remotes[remote], op)) visible++
      }
    }
    return visible
  })
}

function outOfOrderOptions(definition) {
  if (definition.name.includes('append'))
    return { position: 'tail', type: 'insert' }
  if (definition.name.includes('prepend'))
    return { position: 'head', type: 'insert' }
  if (definition.name.includes('middle insert'))
    return { position: 'middle', type: 'insert' }
  if (definition.name.includes('overwrite'))
    return { position: 'middle', type: 'overwrite' }
  if (definition.name.includes('delete'))
    return { position: 'middle', type: 'delete' }
  return { position: 'middle', type: 'insert' }
}

function outOfOrderBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const plan = createPlan(definition.ops, definition.n, {
    idPrefix: 'ooo',
    ...outOfOrderOptions(definition),
  })
  const { state, artifacts } = createArtifacts(adapter, source, plan)
  const order = shuffledOrder(artifacts.length, 0x9990)

  const delivered = measured(() => {
    let visible = 0
    for (const index of order) {
      target = adapter.merge(target, artifacts[index])
      const op = plan[index]
      if (op.type === 'delete' || consume(adapter, target, op)) visible++
    }
    return visible
  })
  return visibleConvergence(delivered, adapter, state, target)
}

function offlineBurstBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const { state, artifacts } = createArtifacts(
    adapter,
    source,
    createPlan(1_000, definition.n, {
      idPrefix: 'offline',
      mixed: true,
      position: 'middle',
    })
  )

  const synced = measured(() => {
    target = mergeArtifacts(adapter, target, artifacts)
    return artifacts.length
  })
  return visibleConvergence(synced, adapter, state, target)
}

function forkedBenchmark(adapter, definition) {
  const snapshot = adapter.snapshot(adapter.create(definition.n))
  const leftArtifacts = createArtifacts(
    adapter,
    adapter.hydrate(snapshot),
    createPlan(definition.ops, definition.n, {
      idPrefix: 'latency:left',
      mixed: true,
      position: 'middle',
    })
  )
  const rightArtifacts = createArtifacts(
    adapter,
    adapter.hydrate(snapshot),
    createPlan(definition.ops, definition.n, {
      idPrefix: 'latency:right',
      mixed: true,
      position: 'tail',
    })
  )
  let left = leftArtifacts.state
  let right = rightArtifacts.state

  const synced = measured(() => {
    left = mergeArtifacts(adapter, left, rightArtifacts.artifacts)
    right = mergeArtifacts(adapter, right, leftArtifacts.artifacts)
    return leftArtifacts.artifacts.length + rightArtifacts.artifacts.length
  })
  return visibleConvergence(synced, adapter, left, right)
}

function duplicateGossipBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const { state, artifacts } = createArtifacts(
    adapter,
    source,
    createPlan(definition.ops, definition.n, {
      idPrefix: 'duplicate:gossip',
      mixed: true,
      position: 'middle',
    })
  )
  const order = shuffledOrder(artifacts.length, 0x1010)

  const synced = measured(() => {
    target = mergeArtifactsByOrder(adapter, target, artifacts, order)
    target = mergeArtifactsByOrder(adapter, target, artifacts, order)
    return artifacts.length * 2
  })
  return visibleConvergence(synced, adapter, state, target)
}

function snapshotPendingBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  const plan = createPlan(definition.ops, definition.n, {
    idPrefix: 'snapshot:pending',
    mixed: true,
    position: 'middle',
  })
  const { state, artifacts } = createArtifacts(adapter, source, plan)
  const snapshot = adapter.snapshot(state)
  let target

  const applied = measured(() => {
    target = adapter.hydrate(snapshot)
    target = mergeArtifacts(adapter, target, artifacts)
    return artifacts.length
  })
  return visibleConvergence(applied, adapter, state, target)
}

export function runLatency(adapter, definition) {
  if (definition.name.includes('10 remotes'))
    return remoteLatency(adapter, definition, 10)
  if (definition.name.startsWith('out-of-order'))
    return outOfOrderBenchmark(adapter, definition)
  if (definition.name.startsWith('offline burst'))
    return offlineBurstBenchmark(adapter, definition)
  if (definition.name.startsWith('forked replicas'))
    return forkedBenchmark(adapter, definition)
  if (definition.name.startsWith('duplicate shuffled'))
    return duplicateGossipBenchmark(adapter, definition)
  if (definition.name.startsWith('remote snapshot'))
    return snapshotPendingBenchmark(adapter, definition)
  return remoteLatency(adapter, definition)
}
