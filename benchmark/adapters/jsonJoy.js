import { Model as JsonJoyModel } from 'json-joy/lib/json-crdt/model/Model.js'
import { value } from '../helpers/value.js'

function create(size) {
  const model = JsonJoyModel.create()
  model.api.set(Array.from({ length: size }, (_, index) => value(index)))
  model.api.flush()
  return { model, list: model.api.get().asArr() }
}

function refresh(state) {
  state.list = state.model.api.get().asArr()
  return state
}

function ids(state) {
  const result = []
  for (let index = 0; index < state.list.length(); index++)
    result.push(state.list.get(index).view().id)
  return result
}

function find(state, predicate) {
  for (let index = 0; index < state.list.length(); index++) {
    const value = state.list.get(index)?.view()
    if (predicate(value)) return value
  }
  return undefined
}

function snapshot(state) {
  return state.model.toBinary()
}

function hydrate(snapshot) {
  const model = JsonJoyModel.fromBinary(snapshot)
  return { model, list: model.api.get().asArr() }
}

function patch(state, fn) {
  fn()
  const artifact = state.model.api.flush()
  return { state: refresh(state), artifact }
}

function insert(state, index, values) {
  return patch(state, () => state.list.ins(index, values.map(value)))
}

function overwrite(state, index, values) {
  return patch(state, () => {
    for (let offset = 0; offset < values.length; offset++)
      state.list.upd(index + offset, value(values[offset]))
  })
}

function remove(state, index, count = 1) {
  return patch(state, () => state.list.del(index, count))
}

function apply(state, operation) {
  if (operation.type === 'delete') return remove(state, operation.index, 1)
  if (operation.type === 'overwrite')
    return overwrite(state, operation.index, [operation.id])
  return insert(state, operation.index, [operation.id])
}

export const jsonJoyAdapter = {
  name: 'jsonJoy',
  create,
  empty: () => create(0),
  size: (state) => state.list.length(),
  ids,
  readId: (state, index) => state.list.get(index)?.view().id,
  find,
  snapshot,
  hydrate,
  merge: (state, artifact) => {
    state.model.applyPatch(artifact)
    return refresh(state)
  },
  append: (state, values) => {
    for (const id of values) state.list.push(value(id))
    state.model.api.flush()
    return refresh(state)
  },
  prepend: (state, values) => insert(state, 0, values).state,
  insertBefore: (state, index, values) => insert(state, index, values).state,
  insertAfter: (state, index, values) => insert(state, index + 1, values).state,
  overwrite: (state, index, values) => overwrite(state, index, values).state,
  deleteAt: (state, index) => remove(state, index, 1).state,
  deleteRange: (state, index, count) => remove(state, index, count).state,
  change: apply,
}
