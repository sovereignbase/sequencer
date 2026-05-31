import * as Y from 'yjs'
import { value } from '../helpers/value.js'

function create(size) {
  const doc = new Y.Doc()
  const list = doc.getArray('list')
  list.push(Array.from({ length: size }, (_, index) => value(index)))
  return { doc, list }
}

function hydrate(snapshot) {
  const doc = new Y.Doc()
  Y.applyUpdate(doc, snapshot)
  return { doc, list: doc.getArray('list') }
}

function ids(state) {
  const result = []
  for (let index = 0; index < state.list.length; index++)
    result.push(state.list.get(index).id)
  return result
}

function find(state, predicate) {
  for (let index = 0; index < state.list.length; index++) {
    const value = state.list.get(index)
    if (predicate(value)) return value
  }
  return undefined
}

function snapshot(state) {
  return Y.encodeStateAsUpdate(state.doc)
}

function transact(state, fn) {
  const before = Y.encodeStateVector(state.doc)
  fn()
  return { state, artifact: Y.encodeStateAsUpdate(state.doc, before) }
}

function insert(state, index, values) {
  return transact(state, () =>
    state.list.insert(
      index,
      values.map((id) => value(id))
    )
  )
}

function overwrite(state, index, values) {
  return transact(state, () => {
    state.list.delete(index, Math.min(values.length, state.list.length - index))
    state.list.insert(
      index,
      values.map((id) => value(id))
    )
  })
}

function remove(state, index, count = 1) {
  return transact(state, () =>
    state.list.delete(index, Math.min(count, state.list.length - index))
  )
}

function apply(state, operation) {
  if (operation.type === 'delete') return remove(state, operation.index, 1)
  if (operation.type === 'overwrite')
    return overwrite(state, operation.index, [operation.id])
  return insert(state, operation.index, [operation.id])
}

const core = {
  create,
  empty: () => create(0),
  size: (state) => state.list.length,
  ids,
  readId: (state, index) => state.list.get(index)?.id,
  find,
  snapshot,
  hydrate,
  merge: (state, artifact) => {
    Y.applyUpdate(state.doc, artifact)
    return state
  },
  append: (state, values) => insert(state, state.list.length, values).state,
  prepend: (state, values) => insert(state, 0, values).state,
  insertBefore: (state, index, values) => insert(state, index, values).state,
  insertAfter: (state, index, values) => insert(state, index + 1, values).state,
  overwrite: (state, index, values) => overwrite(state, index, values).state,
  deleteAt: (state, index) => remove(state, index, 1).state,
  deleteRange: (state, index, count) => remove(state, index, count).state,
  change: apply,
}

const classApi = {
  create,
  size: (state) => state.list.length,
  ids,
  readId: (state, index) => state.list.get(index)?.id,
  snapshot,
  hydrate,
  merge: core.merge,
  append: core.append,
  prepend: core.prepend,
  insertBefore: core.insertBefore,
  overwrite: core.overwrite,
  deleteAt: core.deleteAt,
  deleteRange: core.deleteRange,
  change: apply,
}

export const yjsAdapter = {
  name: 'yjs',
  core,
  class: classApi,
  create,
  empty: () => create(0),
  size: (state) => state.list.length,
  ids,
  readId: (state, index) => state.list.get(index)?.id,
  find,
  snapshot,
  hydrate,
  merge: (state, artifact) => {
    Y.applyUpdate(state.doc, artifact)
    return state
  },
  append: (state, values) => insert(state, state.list.length, values).state,
  prepend: (state, values) => insert(state, 0, values).state,
  insertBefore: (state, index, values) => insert(state, index, values).state,
  insertAfter: (state, index, values) => insert(state, index + 1, values).state,
  overwrite: (state, index, values) => overwrite(state, index, values).state,
  deleteAt: (state, index) => remove(state, index, 1).state,
  deleteRange: (state, index, count) => remove(state, index, count).state,
  change: apply,
}
