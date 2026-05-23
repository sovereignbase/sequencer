import { createPlan, indexFor, insertIndexFor } from '../helpers/plan.js'
import { random, shuffledIndices } from '../helpers/random.js'
import { time } from '../helpers/timing.js'
import { idsEqual } from '../helpers/value.js'

export const BATCH_SIZE = 100
export const LARGE_BATCH_SIZE = 1_000

export function measured(fn) {
  return time(fn)
}

export function positionFromName(name) {
  if (name.includes('head')) return 'head'
  if (name.includes('tail')) return 'tail'
  if (name.includes('middle')) return 'middle'
  if (name.includes('random')) return 'random'
  return 'middle'
}

export function createValues(start, amount) {
  return Array.from({ length: amount }, (_, index) => start + index)
}

export function findIndexById(adapter, state, id) {
  const size = adapter.size(state)
  for (let index = 0; index < size; index++)
    if (adapter.readId(state, index) === id) return index
  return -1
}

export function safeIndex(adapter, state, position, seed = 0xdecaf) {
  const size = adapter.size(state)
  if (size === 0) return 0
  return Math.min(indexFor(position, size, random(seed)), size - 1)
}

export function safeInsertIndex(adapter, state, position, seed = 0xdecaf) {
  const size = adapter.size(state)
  return Math.min(insertIndexFor(position, size, random(seed)), size)
}

export function createSparseState(adapter, size, ratio = 0.5) {
  let state = adapter.create(size)
  const remove = Math.floor(size * ratio)
  for (let removed = 0; removed < remove; removed++) {
    const liveSize = adapter.size(state)
    if (liveSize === 0) break
    const index = Math.min((removed * 2) % liveSize, liveSize - 1)
    state = adapter.deleteAt(state, index)
  }
  return state
}

export function createTombstonedState(adapter, size, ratio = 0.5) {
  let state = adapter.create(size)
  const remove = Math.floor(size * ratio)
  for (let removed = 0; removed < remove; removed++) {
    const index = Math.max(0, adapter.size(state) - 1)
    state = adapter.deleteAt(state, index)
  }
  return state
}

export function collectFrontiers(adapter, state, amount) {
  const ack = adapter.acknowledge?.(state)
  if (!ack) return []
  return Array.from({ length: amount }, () => ack)
}

export function maybeGarbageCollect(adapter, state, frontiers = 2) {
  if (!adapter.garbageCollect) return state
  adapter.garbageCollect(state, collectFrontiers(adapter, state, frontiers))
  return state
}

export function operation(kind, position, id, size, seed = 0xabc123) {
  const rand = random(seed)
  if (kind === 'delete')
    return { type: 'delete', index: indexFor(position, size, rand), id }
  if (kind === 'overwrite')
    return { type: 'overwrite', index: indexFor(position, size, rand), id }
  return { type: 'insert', index: insertIndexFor(position, size, rand), id }
}

export function applyLocal(adapter, state, op) {
  if (op.type === 'delete') return adapter.deleteAt(state, op.index)
  if (op.type === 'overwrite')
    return adapter.overwrite(state, op.index, [op.id])
  if (op.index <= 0) return adapter.prepend(state, [op.id])
  if (op.index >= adapter.size(state)) return adapter.append(state, [op.id])
  return adapter.insertBefore(state, op.index, [op.id])
}

export function createArtifacts(adapter, initial, operations) {
  let state = initial
  const artifacts = []
  for (const op of operations) {
    const result = adapter.change(state, op)
    state = result.state
    artifacts.push(result.artifact)
  }
  return { state, artifacts }
}

export function mergeArtifacts(adapter, state, artifacts) {
  let target = state
  for (const artifact of artifacts) target = adapter.merge(target, artifact)
  return target
}

export function mergeArtifactsByOrder(adapter, state, artifacts, indices) {
  let target = state
  for (const index of indices) target = adapter.merge(target, artifacts[index])
  return target
}

export function visibleConvergence(result, adapter, left, right) {
  return idsEqual(adapter.ids(left), adapter.ids(right)) ? result : undefined
}

export function plannedArtifacts(adapter, count, size, options) {
  const plan = createPlan(count, size, options)
  return createArtifacts(adapter, adapter.create(size), plan)
}

export function shuffledOrder(length, seed = 0x515151) {
  return shuffledIndices(length, seed)
}

export function readSequential(adapter, state, start, ops) {
  const size = adapter.size(state)
  for (let offset = 0; offset < ops; offset++)
    adapter.readId(state, (start + offset) % size)
  return ops
}
