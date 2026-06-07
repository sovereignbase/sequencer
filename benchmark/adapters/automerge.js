import * as Automerge from '@automerge/automerge'
import { value } from '../helpers/value.js'

function create(size) {
  return Automerge.from({
    list: Array.from({ length: size }, (_, index) => value(index)),
  })
}

function change(state, fn) {
  const next = Automerge.change(state, fn)
  return { state: next, artifact: Automerge.getChanges(state, next) }
}

function insert(state, index, values) {
  return change(state, (draft) => {
    draft.list.insertAt(index, ...values.map(value))
  })
}

function overwrite(state, index, values) {
  return change(state, (draft) => {
    for (let offset = 0; offset < values.length; offset++)
      draft.list[index + offset] = value(values[offset])
  })
}

function remove(state, index, count = 1) {
  return change(state, (draft) => {
    draft.list.deleteAt(index, count)
  })
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
  ids: (state) => state.list.map((entry) => entry.id),
  readId: (state, index) => state.list[index]?.id,
  find: (state, predicate) => state.list.find(predicate),
  snapshot: (state) => Automerge.save(state),
  hydrate: (snapshot) => Automerge.load(snapshot),
  merge: (state, artifact) => Automerge.applyChanges(state, artifact)[0],
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
  ids: core.ids,
  readId: (state, index) => state.list[index]?.id,
  find: core.find,
  some: (state, predicate) => state.list.some(predicate),
  snapshot: core.snapshot,
  hydrate: core.hydrate,
  merge: core.merge,
  append: core.append,
  prepend: core.prepend,
  insertBefore: core.insertBefore,
  overwrite: core.overwrite,
  deleteAt: core.deleteAt,
  deleteRange: core.deleteRange,
  change: apply,
}

export const automergeAdapter = {
  name: 'automerge',
  core,
  class: classApi,
  create,
  empty: () => create(0),
  size: (state) => state.list.length,
  ids: (state) => state.list.map((entry) => entry.id),
  readId: (state, index) => state.list[index]?.id,
  find: (state, predicate) => state.list.find(predicate),
  snapshot: (state) => Automerge.save(state),
  hydrate: (snapshot) => Automerge.load(snapshot),
  merge: (state, artifact) => Automerge.applyChanges(state, artifact)[0],
  append: (state, values) => insert(state, state.list.length, values).state,
  prepend: (state, values) => insert(state, 0, values).state,
  insertBefore: (state, index, values) => insert(state, index, values).state,
  insertAfter: (state, index, values) => insert(state, index + 1, values).state,
  overwrite: (state, index, values) => overwrite(state, index, values).state,
  deleteAt: (state, index) => remove(state, index, 1).state,
  deleteRange: (state, index, count) => remove(state, index, count).state,
  change: apply,
}
