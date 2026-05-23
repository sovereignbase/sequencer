import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from 'node:worker_threads'
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
} from '../dist/index.js'
import { v7 as uuidv7 } from 'uuid'
import * as Y from 'yjs'
import * as Automerge from '@automerge/automerge'
import { Model as JsonJoyModel } from 'json-joy/lib/json-crdt/model/Model.js'

const RUN_TIMES = 250
const LIST_SIZE = 5_000
const LIBRARIES = ['crlist', 'yjs', 'jsonJoy', 'automerge']

const BENCHMARKS = [
  ['crud', 'create / hydrate snapshot'],
  ['crud', 'read / random indexed reads'],
  ['crud', 'update / append after tail'],
  ['crud', 'update / insert before middle'],
  ['crud', 'update / insert at head'],
  ['crud', 'update / overwrite random'],
  ['crud', 'delete / single deletes from middle'],
  ['crud', 'delete / range deletes'],
  ['mags', 'snapshot'],
  ['mags', 'acknowledge'],
  ['mags', 'garbage collect'],
  ['mags', 'merge ordered deltas'],
  ['mags', 'merge shuffled gossip'],
  ['class', 'constructor / hydrate snapshot'],
  ['class', 'append after tail'],
  ['class', 'prepend before middle'],
  ['class', 'remove from middle'],
  ['class', 'find near tail'],
  ['class', 'snapshot'],
  ['class', 'acknowledge'],
  ['class', 'garbage collect'],
  ['class', 'merge ordered deltas'],
  ['class', 'merge shuffled gossip'],
  ['latency', 'append write to remote visible'],
  ['latency', 'middle insert write to remote visible'],
  ['latency', 'head insert write to remote visible'],
  ['latency', 'head delete to remote hidden'],
  ['latency', 'middle delete to remote hidden'],
  ['latency', 'tail delete to remote hidden'],
  ['latency', 'out-of-order write delivery to remote visible'],
  ['latency', 'out-of-order delete delivery to remote convergence'],
].map(([group, name]) => ({ group, name, n: LIST_SIZE, ops: RUN_TIMES }))

function value(id) {
  return { id, payload: { text: `value:${id}`, number: id } }
}

function random(seed) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 0x1_0000_0000
  }
}

function shuffledIndices(length, seed) {
  const indices = Array.from({ length }, (_, index) => index)
  const rand = random(seed)
  for (let index = indices.length - 1; index > 0; index--) {
    const next = Math.floor(rand() * (index + 1))
    ;[indices[index], indices[next]] = [indices[next], indices[index]]
  }
  return indices
}

function time(fn) {
  const start = process.hrtime.bigint()
  const ops = fn()
  const end = process.hrtime.bigint()
  return { ms: Number(end - start) / 1_000_000, ops }
}

function sameIds(left, right) {
  if (left.length !== right.length) return false
  for (let index = 0; index < left.length; index++)
    if (left[index] !== right[index]) return false
  return true
}

function validate(result, sourceIds, targetIds, required = false) {
  if (!sameIds(sourceIds(), targetIds())) {
    if (required) throw new Error('source and target live views diverged')
    return undefined
  }
  return result
}

function createPlan(amount, initialSize, options) {
  const {
    idPrefix,
    mixed = false,
    offset = initialSize,
    position = 'tail',
    seed = 0xc0ffee,
    type = 'insert',
  } = options
  const rand = random(seed)
  const ids = Array.from({ length: initialSize }, (_, index) => index)
  const operations = []

  for (let opIndex = 0; opIndex < amount; opIndex++) {
    const deleteOp = type === 'delete' || (mixed && opIndex % 4 === 0)
    if (deleteOp) {
      if (ids.length === 0) break
      const index =
        position === 'head'
          ? 0
          : position === 'tail'
            ? ids.length - 1
            : position === 'middle'
              ? Math.floor(ids.length / 2)
              : Math.floor(rand() * ids.length)
      const [id] = ids.splice(index, 1)
      operations.push({ type: 'delete', index, id })
      continue
    }

    const index =
      position === 'head'
        ? 0
        : position === 'middle'
          ? Math.floor(ids.length / 2)
          : position === 'tail'
            ? ids.length
            : Math.floor(rand() * (ids.length + 1))
    const id = idPrefix ? `${idPrefix}:${offset + opIndex}` : offset + opIndex
    ids.splice(index, 0, id)
    operations.push({ type: 'insert', index, id })
  }

  const finalIndexById = new Map(ids.map((id, index) => [id, index]))
  for (const operation of operations) {
    if (operation.type === 'insert')
      operation.finalIndex = finalIndexById.get(operation.id)
  }

  return operations
}

function tombstones(size) {
  return Array.from({ length: size }, () => uuidv7())
}

function createReplica(size) {
  const replica = __create()
  for (let index = 0; index < size; index++) {
    const result = __update(replica.size, [value(index)], replica, 'after')
    if (!result) throw new Error(`seed failed at ${index}`)
  }
  return replica
}

function createList(size) {
  const list = new CRList()
  for (let index = 0; index < size; index++) list.append(value(index))
  return list
}

function createYjs(size) {
  const doc = new Y.Doc()
  const list = doc.getArray('list')
  list.push(Array.from({ length: size }, (_, index) => value(index)))
  return { doc, list }
}

function createJsonJoy(size) {
  const model = JsonJoyModel.create()
  model.api.set(Array.from({ length: size }, (_, index) => value(index)))
  model.api.flush()
  return { model, list: model.api.get().asArr() }
}

function createAutomerge(size) {
  return Automerge.from({
    list: Array.from({ length: size }, (_, index) => value(index)),
  })
}

function crlistIds(replica) {
  return Array.from(
    { length: replica.size },
    (_, index) => __read(index, replica).id
  )
}

function classIds(list) {
  return Array.from({ length: list.size }, (_, index) => list[index].id)
}

function yjsIds(list) {
  const ids = []
  for (let index = 0; index < list.length; index++) ids.push(list.get(index).id)
  return ids
}

function jsonJoyIds(list) {
  const ids = []
  for (let index = 0; index < list.length(); index++)
    ids.push(list.get(index).view().id)
  return ids
}

function automergeIds(doc) {
  return doc.list.map((entry) => entry.id)
}

function reachedAtIndex(operation, size, readId) {
  if (operation.type === 'delete')
    return operation.index >= size() || readId(operation.index) !== operation.id
  return operation.index < size() && readId(operation.index) === operation.id
}

function reachedAtFinalIndex(operation, size, readId) {
  if (operation.type === 'delete')
    return reachedAtIndex(operation, size, readId)
  return (
    operation.finalIndex !== undefined &&
    operation.finalIndex < size() &&
    readId(operation.finalIndex) === operation.id
  )
}

function applyCrlist(replica, operation) {
  if (operation.type === 'delete') {
    if (__read(operation.index, replica).id !== operation.id)
      throw new Error('planned CRList delete mismatch')
    return __delete(replica, operation.index, operation.index + 1)?.delta
  }

  const mode = operation.index >= replica.size ? 'after' : 'before'
  const index = mode === 'after' ? replica.size : operation.index
  return __update(index, [value(operation.id)], replica, mode)?.delta
}

function applyClass(list, operation) {
  if (operation.type === 'delete') {
    if (list[operation.index].id !== operation.id)
      throw new Error('planned class delete mismatch')
    list.remove(operation.index)
  } else if (operation.index >= list.size) {
    list.append(value(operation.id))
  } else {
    list.prepend(value(operation.id), operation.index)
  }
}

function applyYjs(source, operation) {
  if (operation.type === 'delete') {
    if (source.list.get(operation.index).id !== operation.id)
      throw new Error('planned Yjs delete mismatch')
    source.list.delete(operation.index, 1)
  } else if (operation.index >= source.list.length) {
    source.list.push([value(operation.id)])
  } else {
    source.list.insert(operation.index, [value(operation.id)])
  }
}

function applyJsonJoy(source, operation) {
  if (operation.type === 'delete') {
    if (source.list.get(operation.index).view().id !== operation.id)
      throw new Error('planned json-joy delete mismatch')
    source.list.del(operation.index, 1)
  } else if (operation.index >= source.list.length()) {
    source.list.push(value(operation.id))
  } else {
    source.list.ins(operation.index, [value(operation.id)])
  }
}

function changeAutomerge(doc, operation) {
  return Automerge.change(doc, (draft) => {
    if (operation.type === 'delete') {
      if (draft.list[operation.index].id !== operation.id)
        throw new Error('planned Automerge delete mismatch')
      draft.list.deleteAt(operation.index, 1)
    } else if (operation.index >= draft.list.length) {
      draft.list.push(value(operation.id))
    } else {
      draft.list.insertAt(operation.index, value(operation.id))
    }
  })
}

function crlistArtifacts(source, operations) {
  return operations.map((operation) => {
    const delta = applyCrlist(source, operation)
    if (!delta) throw new Error('CRList operation produced no delta')
    return { operation, artifact: delta }
  })
}

function classArtifacts(source, operations) {
  const deltas = []
  source.addEventListener('delta', (event) => {
    deltas.push(event.detail)
  })
  return operations.map((operation) => {
    applyClass(source, operation)
    return { operation, artifact: deltas[deltas.length - 1] }
  })
}

function yjsArtifacts(source, operations) {
  const updates = []
  source.doc.on('update', (update) => {
    updates.push(update)
  })
  return operations.map((operation) => {
    applyYjs(source, operation)
    return { operation, artifact: updates[updates.length - 1] }
  })
}

function jsonJoyArtifacts(source, operations) {
  return operations.map((operation) => {
    applyJsonJoy(source, operation)
    return { operation, artifact: source.model.api.flush() }
  })
}

function automergeArtifacts(source, operations) {
  let doc = source
  const writes = operations.map((operation) => {
    const next = changeAutomerge(doc, operation)
    const changes = Automerge.getChanges(doc, next)
    doc = next
    return { operation, artifact: changes }
  })
  return { doc, writes }
}

function positionFromName(name) {
  if (name.includes('head')) return 'head'
  if (name.includes('append') || name.includes('tail')) return 'tail'
  return 'middle'
}

function timedDelivery(writes, deliver) {
  return time(() => {
    for (const write of writes) deliver(write.artifact)
    return writes.length
  })
}

function timedShuffledDelivery(writes, deliver) {
  const order = shuffledIndices(writes.length, 0xbeef)
  return time(() => {
    for (const index of order) deliver(writes[index].artifact)
    return order.length
  })
}

function timedTrackedLatency(operations, write, deliver, reached) {
  let ops = 0
  let ms = 0
  for (const operation of operations) {
    const start = process.hrtime.bigint()
    deliver(write(operation))
    if (!reached(operation)) return undefined
    ms += Number(process.hrtime.bigint() - start) / 1_000_000
    ops++
  }
  return { ms, ops }
}

function timedTrackedShuffledLatency(operations, write, deliver, reached) {
  const writes = operations.map((operation) => ({
    artifact: undefined,
    delivered: false,
    localMs: 0,
    operation,
  }))
  for (const writeRecord of writes) {
    const start = process.hrtime.bigint()
    writeRecord.artifact = write(writeRecord.operation)
    writeRecord.localMs = Number(process.hrtime.bigint() - start) / 1_000_000
  }
  const order = shuffledIndices(writes.length, 0xbeef)
  let ms = 0
  let ops = 0
  for (const index of order) {
    const current = writes[index]
    current.sentAt = process.hrtime.bigint()
    deliver(current.artifact)
    current.delivered = true
    const end = process.hrtime.bigint()
    for (const writeRecord of writes) {
      if (!writeRecord.delivered || writeRecord.done) continue
      if (!reached(writeRecord.operation)) continue
      writeRecord.done = true
      ms += writeRecord.localMs + Number(end - writeRecord.sentAt) / 1_000_000
      ops++
    }
  }
  return ops === writes.length ? { ms, ops } : undefined
}

function timedTrackedShuffledVisibility(
  operations,
  write,
  deliver,
  visibleIds
) {
  const writes = operations.map((operation) => ({
    artifact: undefined,
    delivered: false,
    localMs: 0,
    operation,
  }))
  for (const writeRecord of writes) {
    const start = process.hrtime.bigint()
    writeRecord.artifact = write(writeRecord.operation)
    writeRecord.localMs = Number(process.hrtime.bigint() - start) / 1_000_000
  }
  const order = shuffledIndices(writes.length, 0xbeef)
  let ms = 0
  let ops = 0
  for (const index of order) {
    const current = writes[index]
    current.sentAt = process.hrtime.bigint()
    deliver(current.artifact)
    current.delivered = true
    const end = process.hrtime.bigint()
    const visible = visibleIds()
    for (const writeRecord of writes) {
      if (!writeRecord.delivered || writeRecord.done) continue
      if (!visible.has(writeRecord.operation.id)) continue
      writeRecord.done = true
      ms += writeRecord.localMs + Number(end - writeRecord.sentAt) / 1_000_000
      ops++
    }
  }
  return ops === writes.length ? { ms, ops } : undefined
}

function optional(fn) {
  try {
    return fn()
  } catch {
    return undefined
  }
}

function runCrlist(definition) {
  const key = `${definition.group}:${definition.name}`
  switch (key) {
    case 'crud:create / hydrate snapshot': {
      const snapshot = __snapshot(createReplica(definition.n))
      return time(() => {
        for (let index = 0; index < definition.ops; index++) __create(snapshot)
        return definition.ops
      })
    }
    case 'crud:read / random indexed reads': {
      const replica = createReplica(definition.n)
      const rand = random(0x1234)
      return time(() => {
        let checksum = 0
        for (let index = 0; index < definition.ops; index++)
          checksum += __read(Math.floor(rand() * replica.size), replica).id
        if (checksum < 0) throw new Error('unreachable')
        return definition.ops
      })
    }
    case 'crud:update / append after tail': {
      const replica = createReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          __update(
            replica.size,
            [value(definition.n + index)],
            replica,
            'after'
          )
        return definition.ops
      })
    }
    case 'crud:update / insert before middle': {
      const replica = createReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          __update(
            Math.floor(replica.size / 2),
            [value(definition.n + index)],
            replica,
            'before'
          )
        return definition.ops
      })
    }
    case 'crud:update / insert at head': {
      const replica = createReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          __update(0, [value(definition.n + index)], replica, 'before')
        return definition.ops
      })
    }
    case 'crud:update / overwrite random': {
      const replica = createReplica(definition.n)
      const rand = random(0x5678)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          __update(
            Math.floor(rand() * replica.size),
            [value(definition.n + index)],
            replica,
            'overwrite'
          )
        return definition.ops
      })
    }
    case 'crud:delete / single deletes from middle': {
      const replica = createReplica(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && replica.size > 0) {
          const index = Math.floor(replica.size / 2)
          __delete(replica, index, index + 1)
          deleted++
        }
        return deleted
      })
    }
    case 'crud:delete / range deletes': {
      const replica = createReplica(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && replica.size > 0) {
          const start = Math.floor(replica.size / 3)
          __delete(replica, start, Math.min(replica.size, start + 8))
          deleted++
        }
        return deleted
      })
    }
    case 'mags:snapshot': {
      const replica = createReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) __snapshot(replica)
        return definition.ops
      })
    }
    case 'mags:acknowledge': {
      const replica = __create({
        values: [],
        tombstones: tombstones(definition.n),
      })
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          __acknowledge(replica)
        return definition.ops
      })
    }
    case 'mags:garbage collect': {
      const deleted = tombstones(definition.n)
      const frontier = deleted[deleted.length - 1]
      const replicas = Array.from({ length: definition.ops }, () =>
        __create({ values: [], tombstones: deleted })
      )
      return time(() => {
        for (const replica of replicas) __garbageCollect([frontier], replica)
        return definition.ops
      })
    }
    case 'mags:merge ordered deltas': {
      const source = createReplica(definition.n)
      const target = __create(__snapshot(source))
      const writes = crlistArtifacts(
        source,
        createPlan(definition.ops, definition.n, { position: 'tail' })
      )
      const result = timedDelivery(writes, (delta) => __merge(target, delta))
      return validate(
        result,
        () => crlistIds(source),
        () => crlistIds(target)
      )
    }
    case 'mags:merge shuffled gossip': {
      const source = createReplica(definition.n)
      const target = __create(__snapshot(source))
      const writes = crlistArtifacts(
        source,
        createPlan(definition.ops, definition.n, {
          mixed: true,
          position: 'random',
        })
      )
      const result = timedShuffledDelivery(writes, (delta) =>
        __merge(target, delta)
      )
      return validate(
        result,
        () => crlistIds(source),
        () => crlistIds(target)
      )
    }
    case 'latency:append write to remote visible':
    case 'latency:middle insert write to remote visible':
    case 'latency:head insert write to remote visible':
    case 'latency:head delete to remote hidden':
    case 'latency:middle delete to remote hidden':
    case 'latency:tail delete to remote hidden': {
      const source = createReplica(definition.n)
      const target = __create(__snapshot(source))
      const isDelete = definition.name.includes('delete')
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: positionFromName(definition.name),
        type: isDelete ? 'delete' : 'insert',
      })
      const result = timedTrackedLatency(
        operations,
        (operation) => applyCrlist(source, operation),
        (delta) => __merge(target, delta),
        (operation) =>
          reachedAtIndex(
            operation,
            () => target.size,
            (index) => __read(index, target).id
          )
      )
      return validate(
        result,
        () => crlistIds(source),
        () => crlistIds(target)
      )
    }
    case 'latency:out-of-order write delivery to remote visible': {
      const source = createReplica(definition.n)
      const target = __create(__snapshot(source))
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0x0ff1ce,
        type: 'insert',
      })
      const result = timedTrackedShuffledVisibility(
        operations,
        (operation) => applyCrlist(source, operation),
        (delta) => __merge(target, delta),
        () => new Set(crlistIds(target))
      )
      return validate(
        result,
        () => crlistIds(source),
        () => crlistIds(target)
      )
    }
    case 'latency:out-of-order delete delivery to remote convergence': {
      const source = createReplica(definition.n)
      const target = __create(__snapshot(source))
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0xde1e7e,
        type: 'delete',
      })
      const result = timedTrackedShuffledLatency(
        operations,
        (operation) => applyCrlist(source, operation),
        (delta) => __merge(target, delta),
        (operation) =>
          reachedAtFinalIndex(
            operation,
            () => target.size,
            (index) => __read(index, target).id
          )
      )
      return validate(
        result,
        () => crlistIds(source),
        () => crlistIds(target)
      )
    }
    case 'class:constructor / hydrate snapshot': {
      const snapshot = __snapshot(createReplica(definition.n))
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          new CRList(snapshot)
        return definition.ops
      })
    }
    case 'class:append after tail': {
      const list = createList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.append(value(definition.n + index))
        return definition.ops
      })
    }
    case 'class:prepend before middle': {
      const list = createList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.prepend(value(definition.n + index), Math.floor(list.size / 2))
        return definition.ops
      })
    }
    case 'class:remove from middle': {
      const list = createList(definition.n)
      return time(() => {
        let removed = 0
        while (removed < definition.ops && list.size > 0) {
          list.remove(Math.floor(list.size / 2))
          removed++
        }
        return removed
      })
    }
    case 'class:find near tail': {
      const list = createList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.find((entry) => entry.id === definition.n - 1)
        return definition.ops
      })
    }
    case 'class:snapshot': {
      const list = createList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) list.snapshot()
        return definition.ops
      })
    }
    case 'class:acknowledge': {
      const list = new CRList({
        values: [],
        tombstones: tombstones(definition.n),
      })
      return time(() => {
        for (let index = 0; index < definition.ops; index++) list.acknowledge()
        return definition.ops
      })
    }
    case 'class:garbage collect': {
      const deleted = tombstones(definition.n)
      const frontier = deleted[deleted.length - 1]
      const lists = Array.from(
        { length: definition.ops },
        () => new CRList({ values: [], tombstones: deleted })
      )
      return time(() => {
        for (const list of lists) list.garbageCollect([frontier])
        return definition.ops
      })
    }
    case 'class:merge ordered deltas': {
      const source = createList(definition.n)
      const target = new CRList(source.toJSON())
      const writes = classArtifacts(
        source,
        createPlan(definition.ops, definition.n, { position: 'tail' })
      )
      const result = timedDelivery(writes, (delta) => target.merge(delta))
      return validate(
        result,
        () => classIds(source),
        () => classIds(target)
      )
    }
    case 'class:merge shuffled gossip': {
      const source = createList(definition.n)
      const target = new CRList(source.toJSON())
      const writes = classArtifacts(
        source,
        createPlan(definition.ops, definition.n, {
          mixed: true,
          position: 'random',
        })
      )
      const result = timedShuffledDelivery(writes, (delta) =>
        target.merge(delta)
      )
      return validate(
        result,
        () => classIds(source),
        () => classIds(target)
      )
    }
    default:
      return undefined
  }
}

function runYjs(definition) {
  const key = `${definition.group}:${definition.name}`
  switch (key) {
    case 'crud:create / hydrate snapshot':
    case 'class:constructor / hydrate snapshot': {
      const { doc } = createYjs(definition.n)
      const snapshot = Y.encodeStateAsUpdate(doc)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          const target = new Y.Doc()
          Y.applyUpdate(target, snapshot)
        }
        return definition.ops
      })
    }
    case 'crud:read / random indexed reads': {
      const { list } = createYjs(definition.n)
      const rand = random(0x1234)
      return time(() => {
        let checksum = 0
        for (let index = 0; index < definition.ops; index++)
          checksum += list.get(Math.floor(rand() * list.length)).id
        if (checksum < 0) throw new Error('unreachable')
        return definition.ops
      })
    }
    case 'crud:update / append after tail':
    case 'class:append after tail': {
      const { list } = createYjs(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.push([value(definition.n + index)])
        return definition.ops
      })
    }
    case 'crud:update / insert before middle':
    case 'class:prepend before middle': {
      const { list } = createYjs(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.insert(Math.floor(list.length / 2), [
            value(definition.n + index),
          ])
        return definition.ops
      })
    }
    case 'crud:update / insert at head': {
      const { list } = createYjs(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.insert(0, [value(definition.n + index)])
        return definition.ops
      })
    }
    case 'crud:update / overwrite random': {
      const { list } = createYjs(definition.n)
      const rand = random(0x5678)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          const listIndex = Math.floor(rand() * list.length)
          list.delete(listIndex, 1)
          list.insert(listIndex, [value(definition.n + index)])
        }
        return definition.ops
      })
    }
    case 'crud:delete / single deletes from middle':
    case 'class:remove from middle': {
      const { list } = createYjs(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && list.length > 0) {
          list.delete(Math.floor(list.length / 2), 1)
          deleted++
        }
        return deleted
      })
    }
    case 'crud:delete / range deletes': {
      const { list } = createYjs(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && list.length > 0) {
          const start = Math.floor(list.length / 3)
          list.delete(start, Math.min(list.length, start + 8) - start)
          deleted++
        }
        return deleted
      })
    }
    case 'mags:snapshot':
    case 'class:snapshot': {
      const { doc } = createYjs(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          Y.encodeStateAsUpdate(doc)
        return definition.ops
      })
    }
    case 'class:find near tail': {
      const { list } = createYjs(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          for (let listIndex = 0; listIndex < list.length; listIndex++)
            if (list.get(listIndex).id === definition.n - 1) break
        }
        return definition.ops
      })
    }
    case 'mags:merge ordered deltas':
    case 'class:merge ordered deltas': {
      const source = createYjs(definition.n)
      const target = new Y.Doc()
      Y.applyUpdate(target, Y.encodeStateAsUpdate(source.doc))
      const writes = yjsArtifacts(
        source,
        createPlan(definition.ops, definition.n, { position: 'tail' })
      )
      const result = timedDelivery(writes, (update) =>
        Y.applyUpdate(target, update)
      )
      return validate(
        result,
        () => yjsIds(source.list),
        () => yjsIds(target.getArray('list'))
      )
    }
    case 'mags:merge shuffled gossip':
    case 'class:merge shuffled gossip': {
      const source = createYjs(definition.n)
      const target = new Y.Doc()
      Y.applyUpdate(target, Y.encodeStateAsUpdate(source.doc))
      const writes = yjsArtifacts(
        source,
        createPlan(definition.ops, definition.n, {
          mixed: true,
          position: 'random',
        })
      )
      const result = timedShuffledDelivery(writes, (update) =>
        Y.applyUpdate(target, update)
      )
      return validate(
        result,
        () => yjsIds(source.list),
        () => yjsIds(target.getArray('list'))
      )
    }
    case 'latency:append write to remote visible':
    case 'latency:middle insert write to remote visible':
    case 'latency:head insert write to remote visible':
    case 'latency:head delete to remote hidden':
    case 'latency:middle delete to remote hidden':
    case 'latency:tail delete to remote hidden': {
      const source = createYjs(definition.n)
      const target = new Y.Doc()
      Y.applyUpdate(target, Y.encodeStateAsUpdate(source.doc))
      const targetList = target.getArray('list')
      const updates = []
      source.doc.on('update', (update) => updates.push(update))
      const isDelete = definition.name.includes('delete')
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: positionFromName(definition.name),
        type: isDelete ? 'delete' : 'insert',
      })
      const result = timedTrackedLatency(
        operations,
        (operation) => {
          applyYjs(source, operation)
          return updates[updates.length - 1]
        },
        (update) => Y.applyUpdate(target, update),
        (operation) =>
          reachedAtIndex(
            operation,
            () => targetList.length,
            (index) => targetList.get(index).id
          )
      )
      return validate(
        result,
        () => yjsIds(source.list),
        () => yjsIds(targetList)
      )
    }
    case 'latency:out-of-order write delivery to remote visible': {
      const source = createYjs(definition.n)
      const target = new Y.Doc()
      Y.applyUpdate(target, Y.encodeStateAsUpdate(source.doc))
      const targetList = target.getArray('list')
      const updates = []
      source.doc.on('update', (update) => updates.push(update))
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0x0ff1ce,
        type: 'insert',
      })
      const result = timedTrackedShuffledVisibility(
        operations,
        (operation) => {
          applyYjs(source, operation)
          return updates[updates.length - 1]
        },
        (update) => Y.applyUpdate(target, update),
        () => new Set(yjsIds(targetList))
      )
      return validate(
        result,
        () => yjsIds(source.list),
        () => yjsIds(target.getArray('list'))
      )
    }
    case 'latency:out-of-order delete delivery to remote convergence': {
      const source = createYjs(definition.n)
      const target = new Y.Doc()
      Y.applyUpdate(target, Y.encodeStateAsUpdate(source.doc))
      const targetList = target.getArray('list')
      const updates = []
      source.doc.on('update', (update) => updates.push(update))
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0xde1e7e,
        type: 'delete',
      })
      const result = timedTrackedShuffledLatency(
        operations,
        (operation) => {
          applyYjs(source, operation)
          return updates[updates.length - 1]
        },
        (update) => Y.applyUpdate(target, update),
        (operation) =>
          reachedAtFinalIndex(
            operation,
            () => targetList.length,
            (index) => targetList.get(index).id
          )
      )
      return validate(
        result,
        () => yjsIds(source.list),
        () => yjsIds(target.getArray('list'))
      )
    }
    default:
      return undefined
  }
}

function runJsonJoy(definition) {
  const key = `${definition.group}:${definition.name}`
  switch (key) {
    case 'crud:create / hydrate snapshot':
    case 'class:constructor / hydrate snapshot': {
      const { model } = createJsonJoy(definition.n)
      const snapshot = model.toBinary()
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          JsonJoyModel.fromBinary(snapshot)
        return definition.ops
      })
    }
    case 'crud:read / random indexed reads': {
      const { list } = createJsonJoy(definition.n)
      const rand = random(0x1234)
      return time(() => {
        let checksum = 0
        for (let index = 0; index < definition.ops; index++)
          checksum += list.get(Math.floor(rand() * list.length())).view().id
        if (checksum < 0) throw new Error('unreachable')
        return definition.ops
      })
    }
    case 'crud:update / append after tail':
    case 'class:append after tail': {
      const { list } = createJsonJoy(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.push(value(definition.n + index))
        return definition.ops
      })
    }
    case 'crud:update / insert before middle':
    case 'class:prepend before middle': {
      const { list } = createJsonJoy(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.ins(Math.floor(list.length() / 2), [value(definition.n + index)])
        return definition.ops
      })
    }
    case 'crud:update / insert at head': {
      const { list } = createJsonJoy(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.ins(0, [value(definition.n + index)])
        return definition.ops
      })
    }
    case 'crud:update / overwrite random': {
      const { list } = createJsonJoy(definition.n)
      const rand = random(0x5678)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          list.upd(
            Math.floor(rand() * list.length()),
            value(definition.n + index)
          )
        return definition.ops
      })
    }
    case 'crud:delete / single deletes from middle':
    case 'class:remove from middle': {
      const { list } = createJsonJoy(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && list.length() > 0) {
          list.del(Math.floor(list.length() / 2), 1)
          deleted++
        }
        return deleted
      })
    }
    case 'crud:delete / range deletes': {
      const { list } = createJsonJoy(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && list.length() > 0) {
          const start = Math.floor(list.length() / 3)
          list.del(start, Math.min(list.length(), start + 8) - start)
          deleted++
        }
        return deleted
      })
    }
    case 'mags:snapshot':
    case 'class:snapshot': {
      const { model } = createJsonJoy(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) model.toBinary()
        return definition.ops
      })
    }
    case 'class:find near tail': {
      const { list } = createJsonJoy(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          for (let listIndex = 0; listIndex < list.length(); listIndex++)
            if (list.get(listIndex).view().id === definition.n - 1) break
        }
        return definition.ops
      })
    }
    case 'mags:merge ordered deltas':
    case 'class:merge ordered deltas': {
      const source = createJsonJoy(definition.n)
      const target = JsonJoyModel.fromBinary(source.model.toBinary())
      const writes = jsonJoyArtifacts(
        source,
        createPlan(definition.ops, definition.n, { position: 'tail' })
      )
      const result = timedDelivery(writes, (patch) => target.applyPatch(patch))
      return validate(
        result,
        () => jsonJoyIds(source.list),
        () => jsonJoyIds(target.api.get().asArr())
      )
    }
    case 'mags:merge shuffled gossip':
    case 'class:merge shuffled gossip': {
      const source = createJsonJoy(definition.n)
      const target = JsonJoyModel.fromBinary(source.model.toBinary())
      const writes = jsonJoyArtifacts(
        source,
        createPlan(definition.ops, definition.n, {
          mixed: true,
          position: 'random',
        })
      )
      const result = timedShuffledDelivery(writes, (patch) =>
        target.applyPatch(patch)
      )
      return validate(
        result,
        () => jsonJoyIds(source.list),
        () => jsonJoyIds(target.api.get().asArr())
      )
    }
    case 'latency:append write to remote visible':
    case 'latency:middle insert write to remote visible':
    case 'latency:head insert write to remote visible':
    case 'latency:head delete to remote hidden':
    case 'latency:middle delete to remote hidden':
    case 'latency:tail delete to remote hidden': {
      const source = createJsonJoy(definition.n)
      const target = JsonJoyModel.fromBinary(source.model.toBinary())
      const isDelete = definition.name.includes('delete')
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: positionFromName(definition.name),
        type: isDelete ? 'delete' : 'insert',
      })
      const result = timedTrackedLatency(
        operations,
        (operation) => {
          applyJsonJoy(source, operation)
          return source.model.api.flush()
        },
        (patch) => target.applyPatch(patch),
        (operation) => {
          const list = target.api.get().asArr()
          return reachedAtIndex(
            operation,
            () => list.length(),
            (index) => list.get(index).view().id
          )
        }
      )
      return validate(
        result,
        () => jsonJoyIds(source.list),
        () => jsonJoyIds(target.api.get().asArr())
      )
    }
    case 'latency:out-of-order write delivery to remote visible': {
      const source = createJsonJoy(definition.n)
      const target = JsonJoyModel.fromBinary(source.model.toBinary())
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0x0ff1ce,
        type: 'insert',
      })
      const result = timedTrackedShuffledVisibility(
        operations,
        (operation) => {
          applyJsonJoy(source, operation)
          return source.model.api.flush()
        },
        (patch) => target.applyPatch(patch),
        () => new Set(jsonJoyIds(target.api.get().asArr()))
      )
      return validate(
        result,
        () => jsonJoyIds(source.list),
        () => jsonJoyIds(target.api.get().asArr())
      )
    }
    case 'latency:out-of-order delete delivery to remote convergence': {
      const source = createJsonJoy(definition.n)
      const target = JsonJoyModel.fromBinary(source.model.toBinary())
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0xde1e7e,
        type: 'delete',
      })
      const result = timedTrackedShuffledLatency(
        operations,
        (operation) => {
          applyJsonJoy(source, operation)
          return source.model.api.flush()
        },
        (patch) => target.applyPatch(patch),
        (operation) => {
          const list = target.api.get().asArr()
          return reachedAtFinalIndex(
            operation,
            () => list.length(),
            (index) => list.get(index).view().id
          )
        }
      )
      return validate(
        result,
        () => jsonJoyIds(source.list),
        () => jsonJoyIds(target.api.get().asArr())
      )
    }
    default:
      return undefined
  }
}

function runAutomerge(definition) {
  const key = `${definition.group}:${definition.name}`
  switch (key) {
    case 'crud:create / hydrate snapshot':
    case 'class:constructor / hydrate snapshot': {
      const snapshot = Automerge.save(createAutomerge(definition.n))
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          Automerge.load(snapshot)
        return definition.ops
      })
    }
    case 'crud:read / random indexed reads': {
      const doc = createAutomerge(definition.n)
      const rand = random(0x1234)
      return time(() => {
        let checksum = 0
        for (let index = 0; index < definition.ops; index++)
          checksum += doc.list[Math.floor(rand() * doc.list.length)].id
        if (checksum < 0) throw new Error('unreachable')
        return definition.ops
      })
    }
    case 'crud:update / append after tail':
    case 'class:append after tail': {
      let doc = createAutomerge(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          doc = changeAutomerge(doc, {
            type: 'insert',
            index: doc.list.length,
            id: definition.n + index,
          })
        return definition.ops
      })
    }
    case 'crud:update / insert before middle':
    case 'class:prepend before middle': {
      let doc = createAutomerge(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          doc = changeAutomerge(doc, {
            type: 'insert',
            index: Math.floor(doc.list.length / 2),
            id: definition.n + index,
          })
        return definition.ops
      })
    }
    case 'crud:update / insert at head': {
      let doc = createAutomerge(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          doc = changeAutomerge(doc, {
            type: 'insert',
            index: 0,
            id: definition.n + index,
          })
        return definition.ops
      })
    }
    case 'crud:update / overwrite random': {
      let doc = createAutomerge(definition.n)
      const rand = random(0x5678)
      return time(() => {
        for (let index = 0; index < definition.ops; index++)
          doc = Automerge.change(doc, (draft) => {
            draft.list[Math.floor(rand() * draft.list.length)] = value(
              definition.n + index
            )
          })
        return definition.ops
      })
    }
    case 'crud:delete / single deletes from middle':
    case 'class:remove from middle': {
      let doc = createAutomerge(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && doc.list.length > 0) {
          doc = changeAutomerge(doc, {
            type: 'delete',
            index: Math.floor(doc.list.length / 2),
            id: doc.list[Math.floor(doc.list.length / 2)].id,
          })
          deleted++
        }
        return deleted
      })
    }
    case 'crud:delete / range deletes': {
      let doc = createAutomerge(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && doc.list.length > 0) {
          doc = Automerge.change(doc, (draft) => {
            const start = Math.floor(draft.list.length / 3)
            draft.list.deleteAt(
              start,
              Math.min(draft.list.length, start + 8) - start
            )
          })
          deleted++
        }
        return deleted
      })
    }
    case 'mags:snapshot':
    case 'class:snapshot': {
      const doc = createAutomerge(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) Automerge.save(doc)
        return definition.ops
      })
    }
    case 'class:find near tail': {
      const doc = createAutomerge(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          for (let listIndex = 0; listIndex < doc.list.length; listIndex++)
            if (doc.list[listIndex].id === definition.n - 1) break
        }
        return definition.ops
      })
    }
    case 'mags:merge ordered deltas':
    case 'class:merge ordered deltas': {
      const source = createAutomerge(definition.n)
      let target = Automerge.clone(source)
      const { doc, writes } = automergeArtifacts(
        source,
        createPlan(definition.ops, definition.n, { position: 'tail' })
      )
      const result = timedDelivery(writes, (changes) => {
        target = Automerge.applyChanges(target, changes)[0]
      })
      return validate(
        result,
        () => automergeIds(doc),
        () => automergeIds(target)
      )
    }
    case 'mags:merge shuffled gossip':
    case 'class:merge shuffled gossip': {
      const source = createAutomerge(definition.n)
      let target = Automerge.clone(source)
      const { doc, writes } = automergeArtifacts(
        source,
        createPlan(definition.ops, definition.n, {
          mixed: true,
          position: 'random',
        })
      )
      const result = timedShuffledDelivery(writes, (changes) => {
        target = Automerge.applyChanges(target, changes)[0]
      })
      return validate(
        result,
        () => automergeIds(doc),
        () => automergeIds(target)
      )
    }
    case 'latency:append write to remote visible':
    case 'latency:middle insert write to remote visible':
    case 'latency:head insert write to remote visible':
    case 'latency:head delete to remote hidden':
    case 'latency:middle delete to remote hidden':
    case 'latency:tail delete to remote hidden': {
      let source = createAutomerge(definition.n)
      let target = Automerge.clone(source)
      const isDelete = definition.name.includes('delete')
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: positionFromName(definition.name),
        type: isDelete ? 'delete' : 'insert',
      })
      const result = timedTrackedLatency(
        operations,
        (operation) => {
          const next = changeAutomerge(source, operation)
          const changes = Automerge.getChanges(source, next)
          source = next
          return changes
        },
        (changes) => {
          target = Automerge.applyChanges(target, changes)[0]
        },
        (operation) =>
          reachedAtIndex(
            operation,
            () => target.list.length,
            (index) => target.list[index].id
          )
      )
      return validate(
        result,
        () => automergeIds(source),
        () => automergeIds(target)
      )
    }
    case 'latency:out-of-order write delivery to remote visible': {
      let source = createAutomerge(definition.n)
      let target = Automerge.clone(source)
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0x0ff1ce,
        type: 'insert',
      })
      const result = timedTrackedShuffledVisibility(
        operations,
        (operation) => {
          const next = changeAutomerge(source, operation)
          const changes = Automerge.getChanges(source, next)
          source = next
          return changes
        },
        (changes) => {
          target = Automerge.applyChanges(target, changes)[0]
        },
        () => new Set(automergeIds(target))
      )
      return validate(
        result,
        () => automergeIds(source),
        () => automergeIds(target)
      )
    }
    case 'latency:out-of-order delete delivery to remote convergence': {
      let source = createAutomerge(definition.n)
      let target = Automerge.clone(source)
      const operations = createPlan(definition.ops, definition.n, {
        idPrefix: 'latency',
        position: 'random',
        seed: 0xde1e7e,
        type: 'delete',
      })
      const result = timedTrackedShuffledLatency(
        operations,
        (operation) => {
          const next = changeAutomerge(source, operation)
          const changes = Automerge.getChanges(source, next)
          source = next
          return changes
        },
        (changes) => {
          target = Automerge.applyChanges(target, changes)[0]
        },
        (operation) =>
          reachedAtFinalIndex(
            operation,
            () => target.list.length,
            (index) => target.list[index].id
          )
      )
      return validate(
        result,
        () => automergeIds(source),
        () => automergeIds(target)
      )
    }
    default:
      return undefined
  }
}

function runLibraryBenchmark(library, definition) {
  return optional(() => {
    if (library === 'crlist') return runCrlist(definition)
    if (library === 'yjs') return runYjs(definition)
    if (library === 'jsonJoy') return runJsonJoy(definition)
    if (library === 'automerge') return runAutomerge(definition)
    throw new Error(`unknown library: ${library}`)
  })
}

function runLibraryBenchmarks(library) {
  return BENCHMARKS.map((definition) => ({
    group: definition.group,
    name: definition.name,
    n: definition.n,
    requestedOps: definition.ops,
    result: runLibraryBenchmark(library, definition),
  }))
}

function runWorker(library, benchmarkIndex) {
  if (benchmarkIndex === undefined) {
    parentPort.postMessage({ library, results: runLibraryBenchmarks(library) })
    return
  }

  const definition = BENCHMARKS[benchmarkIndex]
  parentPort.postMessage({
    index: benchmarkIndex,
    library,
    result: {
      group: definition.group,
      name: definition.name,
      n: definition.n,
      requestedOps: definition.ops,
      result: runLibraryBenchmark(library, definition),
    },
  })
}

function runLibraryWorker(library, benchmarkIndex) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), {
      type: 'module',
      workerData: { benchmarkIndex, library },
    })
    worker.once('message', resolve)
    worker.once('error', reject)
    worker.once('exit', (code) => {
      if (code !== 0)
        reject(new Error(`${library} worker exited with code ${code}`))
    })
  })
}

async function runLibraryWorkers() {
  const messages = []
  for (const library of LIBRARIES) {
    messages.push(await runLibraryWorker(library))
  }
  return messages
}

function combineLibraryResults(messages) {
  const byLibrary = new Map(
    messages.map((message) => [message.library, message.results])
  )
  return BENCHMARKS.map((definition, index) => ({
    ...definition,
    ops: byLibrary.get('crlist')?.[index]?.result?.ops ?? definition.ops,
    crlist: byLibrary.get('crlist')?.[index]?.result,
    yjs: byLibrary.get('yjs')?.[index]?.result,
    jsonJoy: byLibrary.get('jsonJoy')?.[index]?.result,
    automerge: byLibrary.get('automerge')?.[index]?.result,
  }))
}

function formatNumber(number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
    number
  )
}

function formatMetric(result, metric) {
  if (!result || result.ops === 0) return 'n/a'
  if (metric === 'msPerOp') return formatNumber(result.ms / result.ops)
  if (metric === 'opsPerSecond')
    return formatNumber(result.ops / (result.ms / 1_000))
  return formatNumber(result[metric])
}

function opsPerSecond(result) {
  if (!result || result.ops === 0) return undefined
  return result.ops / (result.ms / 1_000)
}

function winner(row) {
  const candidates = [
    ['crlist', opsPerSecond(row.crlist)],
    ['yjs', opsPerSecond(row.yjs)],
    ['json-joy', opsPerSecond(row.jsonJoy)],
    ['automerge', opsPerSecond(row.automerge)],
  ].filter(([, value]) => value !== undefined)
  if (candidates.length < 2) return 'n/a'
  candidates.sort(([, left], [, right]) => right - left)
  return candidates[0][0]
}

function pad(value, width) {
  return String(value).padEnd(width, ' ')
}

function printTable(rows) {
  const columns = [
    ['group', (row) => row.group],
    ['scenario', (row) => row.name],
    ['n', (row) => formatNumber(row.n)],
    ['ops', (row) => formatNumber(row.ops)],
    ['crlist ms', (row) => formatMetric(row.crlist, 'ms')],
    ['crlist ms/op', (row) => formatMetric(row.crlist, 'msPerOp')],
    ['crlist ops/sec', (row) => formatMetric(row.crlist, 'opsPerSecond')],
    ['yjs ms/op', (row) => formatMetric(row.yjs, 'msPerOp')],
    ['yjs ops/sec', (row) => formatMetric(row.yjs, 'opsPerSecond')],
    ['json-joy ms/op', (row) => formatMetric(row.jsonJoy, 'msPerOp')],
    ['json-joy ops/sec', (row) => formatMetric(row.jsonJoy, 'opsPerSecond')],
    ['automerge ms/op', (row) => formatMetric(row.automerge, 'msPerOp')],
    ['automerge ops/sec', (row) => formatMetric(row.automerge, 'opsPerSecond')],
    ['winner', winner],
  ]
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
  console.log(
    columns.map(([header], index) => pad(header, widths[index])).join('  ')
  )
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of rows)
    console.log(
      columns
        .map(([, getter], index) => pad(getter(row), widths[index]))
        .join('  ')
    )
}

async function main() {
  console.log('CRList benchmark')
  console.log(
    `node=${process.version} platform=${process.platform} arch=${process.arch}`
  )
  console.log(`workers=${LIBRARIES.join(', ')}`)
  console.log('')
  const start = process.hrtime.bigint()
  const rows = combineLibraryResults(await runLibraryWorkers())
  printTable(rows)
  const totalMs = Number(process.hrtime.bigint() - start) / 1_000_000
  console.log('')
  console.log(`total wall time: ${formatNumber(totalMs)} ms`)
}

if (isMainThread) {
  await main()
} else {
  runWorker(workerData.library, workerData.benchmarkIndex)
}
