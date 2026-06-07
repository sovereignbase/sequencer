import {
  CRList,
  __acknowledge,
  __create,
  __delete,
  __garbageCollect,
  __merge,
  __read,
  __snapshot,
  __update,
} from '../../dist/index.js'
import { value } from '../helpers/value.js'

function create(size) {
  const state = __create()
  for (let index = 0; index < size; index++)
    void __update(state.size, [value(index)], state, 'after')
  return state
}

function ids(state) {
  return Array.from(
    { length: state.size },
    (_, index) => __read(index, state).id
  )
}

function find(state, predicate) {
  let block = state.firstBlock
  while (block) {
    for (let index = 0; index < block.items.length; index++) {
      const item = block.items[index]
      if (predicate(item)) return item
    }
    block = block.nextBlock
  }
  return undefined
}

function insert(state, index, values, mode = 'before') {
  const result = __update(index, values.map(value), state, mode)
  return { state, artifact: result?.delta }
}

function overwrite(state, index, values) {
  const result = __update(index, values.map(value), state, 'overwrite')
  return { state, artifact: result?.delta }
}

function remove(state, index, count = 1) {
  const result = __delete(state, index, index + count)
  return { state, artifact: result?.delta }
}

function apply(state, operation) {
  if (operation.type === 'delete') return remove(state, operation.index, 1)
  if (operation.type === 'overwrite')
    return overwrite(state, operation.index, [operation.id])
  const mode = operation.index >= state.size ? 'after' : 'before'
  const index = mode === 'after' ? state.size : operation.index
  return insert(state, index, [operation.id], mode)
}

function createClass(size) {
  const list = new CRList()
  for (let index = 0; index < size; index++) list.append([value(index)])
  return list
}

function classIds(list) {
  const result = []
  list.forEach((entry) => result.push(entry.id))
  return result
}

function classFind(list, predicate) {
  return list.find(predicate)
}

function classSome(list, predicate) {
  return list.some(predicate)
}

function classInsert(list, index, values, mode = 'before') {
  if (mode === 'after') list.append(values.map(value), index)
  else list.prepend(values.map(value), index)
  return list
}

function classRemove(list, index, count = 1) {
  list.delete(index, count)
  return list
}

function captureClassEvent(list, type, fn) {
  let detail
  const listener = (event) => {
    detail = event.detail
  }
  list.addEventListener(type, listener)
  fn()
  list.removeEventListener(type, listener)
  return detail
}

function classChange(list, operation) {
  const artifact = captureClassEvent(list, 'delta', () => {
    if (operation.type === 'delete') {
      list.delete(operation.index)
      return
    }
    if (operation.type === 'overwrite') {
      list.set(operation.index, [value(operation.id)])
      return
    }
    if (operation.index >= list.size) list.append([value(operation.id)])
    else list.prepend([value(operation.id)], operation.index)
  })
  return { state: list, artifact }
}

const core = {
  create,
  empty: () => __create(),
  size: (state) => state.size,
  ids,
  readId: (state, index) => __read(index, state)?.id,
  find,
  snapshot: (state) => __snapshot(state),
  hydrate: (snapshot) => __create(snapshot),
  merge: (state, artifact) => {
    void __merge(state, artifact, false)
    return state
  },
  append: (state, values) => insert(state, state.size, values, 'after').state,
  prepend: (state, values) => insert(state, 0, values, 'before').state,
  insertBefore: (state, index, values) =>
    insert(state, index, values, 'before').state,
  insertAfter: (state, index, values) =>
    insert(state, index, values, 'after').state,
  overwrite: (state, index, values) => overwrite(state, index, values).state,
  deleteAt: (state, index) => remove(state, index, 1).state,
  deleteRange: (state, index, count) => remove(state, index, count).state,
  change: apply,
  acknowledge: (state) => __acknowledge(state),
  garbageCollect: (state, frontiers) => __garbageCollect(frontiers, state),
}

const classApi = {
  create: createClass,
  size: (list) => list.size,
  ids: classIds,
  readId: (list, index) => list.get(index)?.id,
  find: classFind,
  some: classSome,
  snapshot: (list) => list.toJSON(),
  hydrate: (snapshot) => new CRList(snapshot),
  merge: (list, artifact) => {
    list.merge(artifact)
    return list
  },
  change: classChange,
  append: (list, values) => classInsert(list, list.size, values, 'after'),
  prepend: (list, values) => classInsert(list, 0, values, 'before'),
  insertBefore: (list, index, values) =>
    classInsert(list, index, values, 'before'),
  overwrite: (list, index, values) => {
    list.set(index, values.map(value))
    return list
  },
  deleteAt: classRemove,
  deleteRange: classRemove,
  acknowledge: (list) =>
    captureClassEvent(list, 'ack', () => list.acknowledge()),
  garbageCollect: (list, frontiers) => list.garbageCollect(frontiers),
}

export const crlistAdapter = {
  name: 'crlist',
  core,
  class: classApi,
  create,
  empty: () => __create(),
  size: (state) => state.size,
  ids,
  readId: (state, index) => __read(index, state)?.id,
  find,
  snapshot: (state) => __snapshot(state),
  hydrate: (snapshot) => __create(snapshot),
  merge: (state, artifact) => {
    void __merge(state, artifact, false)
    return state
  },
  append: (state, values) => insert(state, state.size, values, 'after').state,
  prepend: (state, values) => insert(state, 0, values, 'before').state,
  insertBefore: (state, index, values) =>
    insert(state, index, values, 'before').state,
  insertAfter: (state, index, values) =>
    insert(state, index, values, 'after').state,
  overwrite: (state, index, values) => overwrite(state, index, values).state,
  deleteAt: (state, index) => remove(state, index, 1).state,
  deleteRange: (state, index, count) => remove(state, index, count).state,
  change: apply,
  acknowledge: (state) => __acknowledge(state),
  garbageCollect: (state, frontiers) => __garbageCollect(frontiers, state),
}
