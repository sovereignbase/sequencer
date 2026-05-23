import { createPlan } from '../helpers/plan.js'
import { random } from '../helpers/random.js'
import {
  applyLocal,
  createArtifacts,
  createSparseState,
  createTombstonedState,
  measured,
  mergeArtifacts,
  maybeGarbageCollect,
  operation,
  visibleConvergence,
} from './shared.js'

function localSession(adapter, definition, profile) {
  let state = profile.includes('tombstoned')
    ? createTombstonedState(adapter, definition.n, 0.75)
    : profile.includes('sparse')
      ? createSparseState(adapter, definition.n, 0.75)
      : adapter.create(definition.n)
  if (profile.includes('post-gc')) maybeGarbageCollect(adapter, state)
  const rand = random(0x1212)

  return measured(() => {
    let completed = 0
    for (let op = 0; op < definition.ops; op++) {
      const size = Math.max(1, adapter.size(state))
      const read = Math.floor(rand() * size)
      if (profile.includes('read heavy') || op % 5 === 0) {
        adapter.readId(state, read)
        completed++
        continue
      }

      const kind = profile.includes('delete')
        ? 'delete'
        : profile.includes('overwrite')
          ? 'overwrite'
          : 'insert'
      const position = profile.includes('prepend')
        ? 'head'
        : profile.includes('middle') || profile.includes('text editing')
          ? 'middle'
          : profile.includes('random')
            ? 'random'
            : 'tail'
      const mixed =
        profile.includes('balanced') ||
        profile.includes('random edit') ||
        profile.includes('local app') ||
        profile.includes('write heavy')
      const type = mixed
        ? op % 4 === 0
          ? 'delete'
          : op % 4 === 1
            ? 'overwrite'
            : 'insert'
        : kind
      state = applyLocal(
        adapter,
        state,
        operation(
          type,
          position,
          `workload:${profile}:${op}`,
          adapter.size(state),
          0x1300 + op
        )
      )
      completed++
    }
    return completed
  })
}

function collaborativeSession(adapter, definition) {
  const snapshot = adapter.snapshot(adapter.create(definition.n))
  const leftArtifacts = createArtifacts(
    adapter,
    adapter.hydrate(snapshot),
    createPlan(definition.ops, definition.n, {
      idPrefix: 'workload:left',
      mixed: true,
      position: 'middle',
    })
  )
  const rightArtifacts = createArtifacts(
    adapter,
    adapter.hydrate(snapshot),
    createPlan(definition.ops, definition.n, {
      idPrefix: 'workload:right',
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

function syncCleanupSession(adapter, definition) {
  if (!adapter.garbageCollect || !adapter.acknowledge)
    return collaborativeSession(adapter, definition)

  let left = createTombstonedState(adapter, definition.n, 0.5)
  let right = adapter.hydrate(adapter.snapshot(left))
  const { state, artifacts } = createArtifacts(
    adapter,
    left,
    createPlan(definition.ops, adapter.size(left), {
      idPrefix: 'cleanup',
      mixed: true,
      position: 'middle',
    })
  )
  left = state

  const synced = measured(() => {
    right = mergeArtifacts(adapter, right, artifacts)
    const leftAck = adapter.acknowledge(left)
    const rightAck = adapter.acknowledge(right)
    const frontiers = [leftAck, rightAck].filter(Boolean)
    adapter.garbageCollect(left, frontiers)
    adapter.garbageCollect(right, frontiers)
    return artifacts.length + frontiers.length
  })
  return visibleConvergence(synced, adapter, left, right)
}

export function runWorkload(adapter, definition) {
  if (definition.name.includes('collaborative offline'))
    return collaborativeSession(adapter, definition)
  if (definition.name.includes('sync and cleanup'))
    return syncCleanupSession(adapter, definition)
  return localSession(adapter, definition, definition.name)
}
