import test from 'node:test'
import assert from 'node:assert/strict'
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

function ids(list) {
  return Array.from({ length: list.size }, (_, index) => __read(index, list))
}

test('unit: CRList public surface and events', () => {
  const list = new CRList()
  const events = { delta: [], change: [], snapshot: [], ack: [] }
  const onDelta = (event) => events.delta.push(event.detail)

  list.addEventListener('delta', onDelta)
  list.addEventListener('change', (event) => events.change.push(event.detail))
  list.addEventListener('snapshot', (event) =>
    events.snapshot.push(event.detail)
  )
  list.addEventListener('ack', (event) => events.ack.push(event.detail))

  list.append({ id: 'a' })
  list.append({ id: 'b' })
  list.prepend({ id: 'z' })
  list[1] = { id: 'x' }

  assert.equal(list.size, 3)
  assert.equal(list[0].id, 'z')
  assert.equal(list[1].id, 'x')
  assert.equal(list[2].id, 'b')
  assert.equal(1 in list, true)
  assert.equal('append' in list, true)
  assert.deepEqual(Object.keys(list), ['0', '1', '2'])
  assert.equal(Object.getOwnPropertyDescriptor(list, '1').value.id, 'x')
  assert.deepEqual(
    [...list].map((value) => value.id),
    ['z', 'x', 'b']
  )

  const forEachIds = []
  list.forEach(
    function (value, index, target) {
      assert.equal(this.marker, true)
      assert.equal(target, list)
      forEachIds.push(`${index}:${value.id}`)
    },
    { marker: true }
  )
  assert.deepEqual(forEachIds, ['0:z', '1:x', '2:b'])

  assert.equal(Reflect.set(list, 'not-index', { id: 'bad' }), false)
  assert.equal(Reflect.set(list, '-1', { id: 'bad' }), false)
  assert.throws(() => Reflect.set(list, '0', () => undefined), /VALUE_NOT_CLONEABLE/)
  assert.throws(() => {
    Reflect.deleteProperty(list, '99')
  }, /INDEX_OUT_OF_BOUNDS/)
  assert.throws(() => {
    delete list[99]
  }, /INDEX_OUT_OF_BOUNDS/)
  assert.equal(Reflect.get(list, '9007199254740992'), undefined)
  assert.equal(Reflect.deleteProperty(list, 'not-index'), false)

  delete list[2]
  assert.equal(list.size, 2)
  list.snapshot()
  list.acknowledge()
  list.garbageCollect([...events.ack])

  const json = list.toJSON()
  assert.deepEqual(
    json.values.map((entry) => entry.value.id),
    ['z', 'x']
  )
  assert.equal(list.toString(), JSON.stringify(json))
  assert.deepEqual(list[Symbol.for('nodejs.util.inspect.custom')](), json)
  assert.deepEqual(list[Symbol.for('Deno.customInspect')](), json)
  assert.equal(events.delta.length >= 5, true)
  assert.equal(events.change.length >= 5, true)
  assert.equal(events.snapshot.length, 1)
  assert.equal(events.ack.length, 1)

  list.removeEventListener('delta', onDelta)
  list.append({ id: 'after-remove-listener' })
  assert.equal(events.delta.length >= 5, true)

  const falseResultList = new CRList()
  falseResultList.append({ id: 'only' })
  const falseResultState = Object.getOwnPropertyDescriptor(
    falseResultList,
    'state'
  ).value
  const falseResultEntry = falseResultState.cursor
  falseResultState.size = 2
  falseResultEntry.next = undefined
  assert.equal(Reflect.set(falseResultList, '1', { id: 'no-set' }), false)
  falseResultState.cursor = falseResultEntry
  assert.equal(Reflect.deleteProperty(falseResultList, '1'), false)
  falseResultState.cursor = falseResultEntry
  falseResultList.prepend({ id: 'no-prepend' }, 1)
  falseResultState.cursor = falseResultEntry
  falseResultList.append({ id: 'no-append' }, 1)
  falseResultState.cursor = falseResultEntry
  falseResultList.remove(1)
  const throwingSetList = new CRList()
  throwingSetList.append({ id: 'set-throw' })
  Object.getOwnPropertyDescriptor(throwingSetList, 'eventTarget').value.dispatchEvent = () => {
    throw new Error('listener-set')
  }
  assert.equal(Reflect.set(throwingSetList, '0', { id: 'set-catch' }), false)
  const throwingDeleteList = new CRList()
  throwingDeleteList.append({ id: 'delete-throw' })
  Object.getOwnPropertyDescriptor(throwingDeleteList, 'eventTarget').value.dispatchEvent = () => {
    throw new Error('listener-delete')
  }
  assert.equal(Reflect.deleteProperty(throwingDeleteList, '0'), false)

  const remote = new CRList()
  remote.append({ id: 'remote' })
  list.merge(remote.toJSON())
  list.merge({ tombstones: ['not-a-uuid'] })
  list.remove(0)
})

test('unit: change event payloads are detached from replica state', () => {
  const mutateChangePayload = (event) => {
    for (const key of Object.keys(event.detail)) {
      const value = event.detail[key]
      if (!value) continue
      value.meta.label = `mutated-${key}`
      event.detail[key] = { id: `replaced-${key}`, meta: { label: 'replaced' } }
    }
  }

  const list = new CRList()

  list.addEventListener('change', mutateChangePayload)

  list.append({ id: 'local', meta: { label: 'original-local' } })

  assert.deepEqual(list[0], {
    id: 'local',
    meta: { label: 'original-local' },
  })

  const remote = new CRList()

  remote.append({ id: 'remote', meta: { label: 'original-remote' } })

  const merged = new CRList()

  merged.addEventListener('change', mutateChangePayload)

  merged.merge(remote.toJSON())

  assert.deepEqual(merged[0], {
    id: 'remote',
    meta: { label: 'original-remote' },
  })
})

test('unit: merge relink path does not emit duplicate change entries', () => {
  const source = __create()
  const list = new CRList()
  const changes = []

  list.addEventListener('change', (event) => {
    changes.push(
      Object.fromEntries(
        Object.entries(event.detail).map(([key, value]) => [key, value?.id])
      )
    )
  })

  const insert = __update(0, [{ id: 'remote' }], source, 'after').delta
  const moved = __update(0, [{ id: 'next' }], source, 'after').delta

  list.merge({ values: [{ ...moved.values[0], predecessor: '\0' }] })
  list.merge({ values: [{ ...moved.values[0] }] })
  list.merge(insert)

  assert.deepEqual(changes, [{ 0: 'next' }, { 0: 'remote' }])
  assert.deepEqual(
    [...list].map((value) => value.id),
    ['remote', 'next']
  )
})

test('unit: core edge paths and malicious inputs', () => {
  const empty = __create()
  assert.equal(__read(0, empty), undefined)
  empty.size = 1
  empty.cursor = undefined
  assert.equal(__read(0, empty), undefined)

  assert.throws(
    () => __update(-1, [{ id: 'bad' }], __create(), 'after'),
    /INDEX_OUT_OF_BOUNDS/
  )
  assert.throws(
    () => __update(0, { id: 'bad' }, __create(), 'after'),
    (error) => error.code === 'UPDATE_EXPECTED_AN_ARRAY'
  )
  assert.throws(
    () => __update(0, [() => undefined], __create(), 'after'),
    (error) => error.code === 'VALUE_NOT_CLONEABLE'
  )
  assert.equal(__update(0, [], __create(), 'after'), false)

  const range = __create()
  const emptyBefore = __create()
  assert(__update(0, [{ id: 'before-empty' }], emptyBefore, 'before'))
  assert.deepEqual(
    ids(emptyBefore).map((value) => value.id),
    ['before-empty']
  )

  assert(__update(0, [{ id: 'a' }, { id: 'b' }], range, 'overwrite'))
  assert(__update(range.size, [{ id: 'append-overwrite' }], range, 'overwrite'))
  assert.deepEqual(
    ids(range).map((value) => value.id),
    ['a', 'b', 'append-overwrite']
  )
  assert(__update(1, [{ id: 'x' }, { id: 'y' }], range, 'before'))
  assert.deepEqual(
    ids(range).map((value) => value.id),
    ['a', 'x', 'y', 'b', 'append-overwrite']
  )
  assert(__update(0, [{ id: 'c' }, { id: 'd' }], range, 'after'))
  assert.deepEqual(
    ids(range).map((value) => value.id),
    ['a', 'c', 'd', 'x', 'y', 'b', 'append-overwrite']
  )

  assert.equal(__delete(range, range.size, range.size), false)
  assert(__delete(range))
  assert.throws(() => __delete(range, -1, 0), /INDEX_OUT_OF_BOUNDS/)
  assert.throws(() => __delete(range, 2, 1), /INDEX_OUT_OF_BOUNDS/)
  assert.throws(() => __delete(range, range.size + 1), /INDEX_OUT_OF_BOUNDS/)

  const corruptEmptyDelete = __create()
  corruptEmptyDelete.size = 1
  corruptEmptyDelete.cursor = undefined
  assert.throws(
    () => __delete(corruptEmptyDelete, 0, 1),
    (error) => error.code === 'LIST_EMPTY'
  )

  const corruptWalkDelete = __create()
  assert(__update(0, [{ id: 'walk-delete' }], corruptWalkDelete, 'after'))
  corruptWalkDelete.size = 2
  corruptWalkDelete.cursor.next = undefined
  assert.equal(__delete(corruptWalkDelete, 1, 2), false)

  const corruptWalkUpdate = __create()
  assert(__update(0, [{ id: 'walk-update' }], corruptWalkUpdate, 'after'))
  corruptWalkUpdate.size = 2
  corruptWalkUpdate.cursor.next = undefined
  assert.equal(
    __update(1, [{ id: 'no-overwrite' }], corruptWalkUpdate, 'overwrite'),
    false
  )
  corruptWalkUpdate.cursor = [...corruptWalkUpdate.parentMap.values()][0]
  assert.equal(
    __update(
      2,
      [{ id: 'no-append-overwrite' }],
      corruptWalkUpdate,
      'overwrite'
    ),
    false
  )
  corruptWalkUpdate.cursor = [...corruptWalkUpdate.parentMap.values()][0]
  assert.equal(
    __update(1, [{ id: 'no-after' }], corruptWalkUpdate, 'after'),
    false
  )
  corruptWalkUpdate.cursor = [...corruptWalkUpdate.parentMap.values()][0]
  assert.equal(
    __update(1, [{ id: 'no-before' }], corruptWalkUpdate, 'before'),
    false
  )

  const corruptDelete = __create()
  assert(__update(0, [{ id: 'gone' }], corruptDelete, 'after'))
  const corruptEntry = corruptDelete.cursor
  corruptDelete.childrenMap.delete(corruptEntry.predecessor)
  assert(__delete(corruptDelete, 0, 1))

  const corruptSnapshot = __create()
  assert(__update(0, [{ id: 'snapshot' }], corruptSnapshot, 'after'))
  corruptSnapshot.parentMap.set('bad', undefined)
  assert.throws(() => __snapshot(corruptSnapshot), /LIST_INTEGRITY_VIOLATION/)

  const valid = __create()
  const validDelta = __update(0, [{ id: 'valid' }], valid, 'after').delta
  const uncloneableDelta = __update(
    1,
    [{ id: 'uncloneable-source' }],
    valid,
    'after'
  ).delta
  const validEntry = validDelta.values[0]
  const uncloneableEntry = uncloneableDelta.values[0]
  const invalidSnapshot = __create({
    tombstones: ['not-a-uuid', validEntry.uuidv7],
    values: [
      validEntry,
      { ...validEntry, uuidv7: 'not-a-uuid' },
      { ...validEntry, uuidv7: validEntry.predecessor },
      { ...uncloneableEntry, value: () => undefined },
      { ...validEntry, predecessor: 'not-a-uuid' },
    ],
  })
  assert.deepEqual(ids(invalidSnapshot), [])

  const missingValues = __create({ tombstones: ['not-a-uuid'] })
  assert.deepEqual(ids(missingValues), [])
})

test('unit: merge, acknowledge, and garbage collection edge paths', () => {
  const source = __create()
  const target = __create()

  assert.equal(__merge(target, undefined), false)
  assert.equal(__merge(target, { tombstones: ['not-a-uuid'] }), false)
  assert.equal(__merge(target, { tombstones: [], values: [] }), false)

  assert.equal(__acknowledge(target), false)
  __garbageCollect('not-an-array', target)
  __garbageCollect([], target)

  const insert = __update(0, [{ id: 'remote' }], source, 'after').delta
  const moved = __update(0, [{ id: 'next' }], source, 'after').delta
  assert.deepEqual(
    __merge(target, { values: [{ ...moved.values[0], predecessor: '\0' }] }),
    { 0: { id: 'next' } }
  )
  assert.equal(__merge(target, { values: [{ ...moved.values[0] }] }), false)
  assert.deepEqual(__merge(target, insert), { 0: { id: 'remote' } })
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['remote', 'next']
  )
  assert.equal(__merge(target, moved), false)
  target.tombstones.add(moved.values[0].uuidv7)
  assert.equal(__merge(target, moved), false)

  const deletion = __delete(source, 0, 1).delta
  assert(__merge(target, { tombstones: deletion.tombstones }))
  const ack = __acknowledge(target)
  assert.equal(typeof ack, 'string')
  __garbageCollect([ack], target)
})

test('unit: nullish snapshot and delta entries are ignored', () => {
  assert.deepEqual(__create({ values: [null, undefined], tombstones: [] }), {
    size: 0,
    cursor: undefined,
    tombstones: new Set(),
    parentMap: new Map(),
    childrenMap: new Map(),
  })

  const target = __create()
  assert.equal(__merge(target, { values: [null, undefined] }), false)
  assert.deepEqual(__snapshot(target), { values: [], tombstones: [] })
})

test('unit: internal defensive branches remain stable under corrupt state', () => {
  const originalIsArray = Array.isArray

  try {
    const deltaValuesReplica = __create()
    Array.isArray = (value) =>
      originalIsArray(value) && value.length === 0
        ? false
        : originalIsArray(value)
    assert(
      __update(0, [{ id: 'delta-values-branch' }], deltaValuesReplica, 'after')
    )
  } finally {
    Array.isArray = originalIsArray
  }

  try {
    const deltaTombstonesReplica = __create()
    assert(
      __update(
        0,
        [{ id: 'delta-tombstones-branch' }],
        deltaTombstonesReplica,
        'after'
      )
    )
    Array.isArray = (value) =>
      originalIsArray(value) && value.length === 0
        ? false
        : originalIsArray(value)
    assert(__delete(deltaTombstonesReplica, 0, 1))
  } finally {
    Array.isArray = originalIsArray
  }

  const source = __create()
  const entries = __update(
    0,
    [
      { id: 'delete' },
      { id: 'parent' },
      { id: 'child' },
      { id: 'missing-parent' },
    ],
    source,
    'after'
  ).delta.values
  const [deleted, parent, child, missingParent] = entries
  const corrupt = __create()
  const deletedEntry = {
    uuidv7: deleted.uuidv7,
    value: deleted.value,
    predecessor: '\0',
    index: 0,
    prev: undefined,
    next: undefined,
  }
  const parentEntry = {
    uuidv7: parent.uuidv7,
    value: parent.value,
    predecessor: '\0',
    index: 1,
    prev: undefined,
    next: undefined,
  }
  const childEntry = {
    uuidv7: child.uuidv7,
    value: child.value,
    predecessor: missingParent.uuidv7,
    index: 2,
    prev: undefined,
    next: undefined,
  }

  corrupt.parentMap.set(deletedEntry.uuidv7, deletedEntry)
  corrupt.parentMap.set(parentEntry.uuidv7, parentEntry)
  corrupt.parentMap.set(childEntry.uuidv7, childEntry)
  corrupt.parentMap.set(missingParent.uuidv7, undefined)
  corrupt.cursor = deletedEntry
  corrupt.size = 3

  assert(__merge(corrupt, { tombstones: [deletedEntry.uuidv7], values: [] }))
})

test('unit: flatten relink branch coverage stays explicit under corrupt buckets', () => {
  const relinkSource = __create()
  assert(__update(0, [{ id: 'existing' }], relinkSource, 'after'))

  const relinkTarget = __create(__snapshot(relinkSource))
  relinkTarget.childrenMap.set('z', undefined)
  relinkTarget.childrenMap.set('a', undefined)
  relinkTarget.childrenMap.set('m', undefined)

  const rootInsert = __create()
  const rootInsertDelta = __update(
    0,
    [{ id: 'remote-root' }],
    rootInsert,
    'after'
  )
  assert(__merge(relinkTarget, rootInsertDelta.delta))
  assert.equal(relinkTarget.size, 2)
  assert.deepEqual(
    ids(relinkTarget)
      .map((value) => value.id)
      .sort(),
    ['existing', 'remote-root']
  )
})

test('unit: assertListIndices forward walk is covered through tombstone-only merge', () => {
  const source = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], source, 'after'))

  const target = __create(__snapshot(source))
  target.cursor = [...target.parentMap.values()].find(
    (entry) => entry.index === 0
  )

  const deletion = __delete(source, 0, 1)
  assert(__merge(target, { tombstones: deletion.delta.tombstones }))

  assert.equal(target.cursor.index, 0)
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['b', 'c']
  )
})
