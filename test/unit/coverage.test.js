import test from 'node:test'
import assert from 'node:assert/strict'
import { v7 as uuidv7 } from 'uuid'
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

  const found = list.find(
    function (value, index, target) {
      assert.equal(this.marker, true)
      assert.equal(target, list)
      if (value.id === 'x') assert.equal(index, 1)
      return value.id === 'x'
    },
    { marker: true }
  )
  assert.equal(found.id, 'x')
  found.id = 'mutated'
  assert.equal(list[1].id, 'mutated')
  assert.equal(
    list.find((value) => value.id === 'missing'),
    undefined
  )
  assert.equal(
    new CRList().find(() => true),
    undefined
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
  assert.deepEqual(forEachIds, ['0:z', '1:mutated', '2:b'])
  list.state.index.delete(0)
  list.state.cursor = list.state.index.get(1)
  assert.deepEqual(
    [...list].map((value) => value.id),
    ['z', 'mutated', 'b']
  )
  const fallbackForEachIds = []
  list.forEach((value) => fallbackForEachIds.push(value.id))
  assert.deepEqual(fallbackForEachIds, ['z', 'mutated', 'b'])
  assert.deepEqual([...new CRList()], [])
  const emptyForEachIds = []
  new CRList().forEach((value) => emptyForEachIds.push(value.id))
  assert.deepEqual(emptyForEachIds, [])

  assert.equal(Reflect.set(list, 'not-index', { id: 'bad' }), false)
  assert.equal(Reflect.set(list, '-1', { id: 'bad' }), false)
  assert.equal(Reflect.get(list, '01'), undefined)
  assert.throws(
    () => Reflect.set(list, '99', { id: 'bad' }),
    /INDEX_OUT_OF_BOUNDS/
  )
  const functionValueList = new CRList()
  functionValueList.append({ id: 'replace-me' })
  assert.equal(
    Reflect.set(functionValueList, '0', () => undefined),
    true
  )
  assert.equal(typeof functionValueList[0], 'function')
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
    ['z', 'mutated']
  )
  list.state.index.delete(0)
  assert.equal(list.find((value) => value.id === 'mutated')?.id, 'mutated')
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
  Object.getOwnPropertyDescriptor(
    throwingSetList,
    'eventTarget'
  ).value.dispatchEvent = () => {
    throw new Error('listener-set')
  }
  assert.equal(Reflect.set(throwingSetList, '0', { id: 'set-catch' }), false)
  const throwingDeleteList = new CRList()
  throwingDeleteList.append({ id: 'delete-throw' })
  Object.getOwnPropertyDescriptor(
    throwingDeleteList,
    'eventTarget'
  ).value.dispatchEvent = () => {
    throw new Error('listener-delete')
  }
  assert.equal(Reflect.deleteProperty(throwingDeleteList, '0'), false)

  const remote = new CRList()
  remote.append({ id: 'remote' })
  list.merge(remote.toJSON())
  list.merge({ tombstones: ['not-a-uuid'] })
  list.remove(0)
})

test('unit: CRList remove deletes a range with one event pair', () => {
  const list = new CRList()
  for (const id of ['a', 'b', 'c', 'd', 'e']) list.append({ id })

  const deltas = []
  const changes = []
  list.addEventListener('delta', (event) => deltas.push(event.detail))
  list.addEventListener('change', (event) => changes.push(event.detail))

  list.remove(1, 3)

  assert.equal(list.size, 2)
  assert.deepEqual(
    [...list].map((value) => value.id),
    ['a', 'e']
  )
  assert.equal(deltas.length, 1)
  assert.equal(changes.length, 1)
  assert.equal(deltas[0].tombstones.length >= 3, true)
  assert.equal(Object.keys(changes[0]).length, 3)
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
  const keepCursorIndexUndefined = (state) => {
    Object.defineProperty(state, 'cursorIndex', {
      get() {
        return undefined
      },
      set() {},
      configurable: true,
    })
  }

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
  assert(__update(0, [() => undefined], __create(), 'after'))
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
  const indexedEntry = range.index.get(1)
  range.index.set(1, { ...indexedEntry })
  assert.equal(__read(1, range).id, 'b')
  assert.equal(range.index.get(1), range.cursor)

  const fallbackRead = __create()
  assert(
    __update(0, [{ id: 'read-a' }, { id: 'read-b' }], fallbackRead, 'after')
  )
  fallbackRead.index.clear()
  fallbackRead.cursorIndex = undefined
  assert.equal(__read(0, fallbackRead).id, 'read-a')

  const fallbackDelete = __create()
  assert(__update(0, [{ id: 'delete-a' }], fallbackDelete, 'after'))
  keepCursorIndexUndefined(fallbackDelete)
  assert(__delete(fallbackDelete, 0, 1))

  const fallbackAppendOverwrite = __create()
  assert(__update(0, [{ id: 'append-base' }], fallbackAppendOverwrite, 'after'))
  keepCursorIndexUndefined(fallbackAppendOverwrite)
  assert(
    __update(
      fallbackAppendOverwrite.size,
      [{ id: 'append-overwrite-fallback' }],
      fallbackAppendOverwrite,
      'overwrite'
    )
  )

  const fallbackOverwrite = __create()
  assert(__update(0, [{ id: 'overwrite-base' }], fallbackOverwrite, 'after'))
  keepCursorIndexUndefined(fallbackOverwrite)
  assert(
    __update(0, [{ id: 'overwrite-fallback' }], fallbackOverwrite, 'overwrite')
  )

  const fallbackAfter = __create()
  assert(__update(0, [{ id: 'after-base' }], fallbackAfter, 'after'))
  keepCursorIndexUndefined(fallbackAfter)
  assert(__update(0, [{ id: 'after-fallback' }], fallbackAfter, 'after'))

  const fallbackBefore = __create()
  assert(__update(0, [{ id: 'before-base' }], fallbackBefore, 'after'))
  keepCursorIndexUndefined(fallbackBefore)
  assert(__update(0, [{ id: 'before-fallback' }], fallbackBefore, 'before'))

  const noIndexSource = __create()
  assert(
    __update(
      0,
      [{ id: 'index-a' }, { id: 'index-b' }, { id: 'index-c' }],
      noIndexSource,
      'after'
    )
  )
  const noIndexTarget = __create(__snapshot(noIndexSource))
  noIndexTarget.index = undefined
  const noIndexDeletion = __delete(noIndexSource, 1, 2)
  assert(
    __merge(noIndexTarget, { tombstones: noIndexDeletion.delta.tombstones })
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
  const functionValueDelta = __update(
    1,
    [{ id: 'function-source' }],
    valid,
    'after'
  ).delta
  const validEntry = validDelta.values[0]
  const functionValueEntry = functionValueDelta.values[0]
  const invalidSnapshot = __create({
    tombstones: ['not-a-uuid', validEntry.uuidv7],
    values: [
      validEntry,
      { ...validEntry, uuidv7: 'not-a-uuid' },
      { ...validEntry, uuidv7: validEntry.predecessor },
      { ...functionValueEntry, value: () => undefined },
      { ...validEntry, predecessor: 'not-a-uuid' },
    ],
  })
  assert.equal(ids(invalidSnapshot).length, 1)
  assert.equal(typeof ids(invalidSnapshot)[0], 'function')

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
  assert.equal(__merge(target, { values: [moved.values[0], null] }), false)

  const invalidPredecessorTarget = __create()
  const invalidPredecessorDelta = __update(
    0,
    [{ id: 'invalid-predecessor' }],
    invalidPredecessorTarget,
    'after'
  ).delta
  assert.equal(
    __merge(invalidPredecessorTarget, {
      values: [
        {
          ...invalidPredecessorDelta.values[0],
          predecessor: 'not-a-uuid',
        },
        null,
      ],
    }),
    false
  )

  const deletion = __delete(source, 0, 1).delta
  assert(__merge(target, { tombstones: deletion.tombstones }))
  const ack = __acknowledge(target)
  assert.equal(typeof ack, 'string')
  __garbageCollect([ack], target)
})

test('unit: deleting a predecessor re-anchors the first live successor', () => {
  const source = __create()
  assert(
    __update(
      0,
      [{ id: 'before' }, { id: 'anchor' }, { id: 'after' }],
      source,
      'after'
    )
  )
  const target = __create(__snapshot(source))

  const inserted = __update(
    source.size - 2,
    [{ id: 'deleted-parent' }],
    source,
    'after'
  )
  const removed = __delete(source, source.size - 2, source.size - 1)
  const reanchored = removed.delta.values.find(
    (entry) => entry.value.id === 'after'
  )

  assert(reanchored)
  assert.equal(removed.delta.tombstones.length, 2)
  assert.notEqual(reanchored.uuidv7, inserted.delta.values[0].uuidv7)
  assert.deepEqual(
    ids(__create(__snapshot(source))).map((value) => value.id),
    ids(source).map((value) => value.id)
  )

  assert(__merge(target, inserted.delta))
  assert(__merge(target, removed.delta))
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ids(source).map((value) => value.id)
  )
})

test('unit: merge treats empty values tail delete as tombstone-only', () => {
  const source = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], source, 'after'))
  const target = __create(__snapshot(source))
  assert.equal(target.cursorIndex, 2)

  const deleted = __delete(source, 2, 3)
  assert(deleted)
  assert.deepEqual(deleted.delta.values, [])
  assert.equal(deleted.delta.tombstones.length, 1)

  assert.deepEqual(__merge(target, deleted.delta), { 2: undefined })
  assert.equal(target.size, 2)
  assert.equal(target.cursorIndex, 1)
  assert.equal(target.cursor.value.id, 'b')
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ids(source).map((value) => value.id)
  )
})

test('unit: merge splices simple concurrent tail siblings', () => {
  const base = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }], base, 'after'))
  const snapshot = __snapshot(base)
  const target = __create(snapshot)
  const left = __create(snapshot)
  const right = __create(snapshot)
  const expectedA = __create(snapshot)
  const expectedB = __create(snapshot)

  const leftDelta = __update(left.size, [{ id: 'left' }], left, 'after').delta
  const rightDelta = __update(
    right.size,
    [{ id: 'right' }],
    right,
    'after'
  ).delta

  assert(__merge(target, leftDelta))
  const change = __merge(target, rightDelta)
  assert(change)
  assert(__merge(expectedA, leftDelta))
  assert(__merge(expectedA, rightDelta))
  assert(__merge(expectedB, rightDelta))
  assert(__merge(expectedB, leftDelta))

  assert.deepEqual(
    ids(target).map((value) => value.id),
    ids(expectedA).map((value) => value.id)
  )
  assert.deepEqual(
    ids(expectedA).map((value) => value.id),
    ids(expectedB).map((value) => value.id)
  )
  assert.equal(target.cursor.value.id, 'right')
  assert.equal(target.index.get(target.cursorIndex), target.cursor)
})

test('unit: nullish snapshot and delta entries are ignored', () => {
  assert.deepEqual(__create({ values: [null, undefined], tombstones: [] }), {
    size: 0,
    cursor: undefined,
    cursorIndex: undefined,
    index: new Map(),
    tombstones: new Set(),
    parentMap: new Map(),
    childrenMap: new Map(),
  })

  const target = __create()
  assert.equal(__merge(target, { values: [null, undefined] }), false)
  assert.deepEqual(__snapshot(target), { values: [], tombstones: [] })
})

test('unit: large non-linear snapshots hydrate 100k entries without recursive stack growth', () => {
  const values = []
  let predecessor = '\0'

  for (let index = 0; index < 100_000; index++) {
    const uuid = uuidv7()
    values.push({
      uuidv7: uuid,
      value: { id: `large-${index}` },
      predecessor,
    })
    predecessor = uuid
  }

  const hydrated = __create({
    values: values.toReversed(),
    tombstones: [],
  })

  assert.equal(hydrated.size, values.length)
  assert.equal(__read(0, hydrated).id, 'large-0')
  assert.equal(__read(49_999, hydrated).id, 'large-49999')
  assert.equal(__read(99_999, hydrated).id, 'large-99999')
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
  relinkTarget.index = undefined
  const rootBucket = relinkTarget.childrenMap.get('\0')
  const rootEntry = rootBucket[0]
  rootBucket.push({ ...rootEntry })
  relinkTarget.childrenMap.set('z', undefined)
  relinkTarget.childrenMap.set('a', undefined)
  relinkTarget.childrenMap.set('m', undefined)
  relinkTarget.childrenMap.set('detached-corrupt', [undefined])

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

test('unit: assertListIndices forward walk is covered through delete merge', () => {
  const source = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], source, 'after'))

  const target = __create(__snapshot(source))
  target.cursor = [...target.parentMap.values()].find(
    (entry) => entry.index === 0
  )

  const deletion = __delete(source, 0, 1)
  assert(__merge(target, deletion.delta))

  assert.equal(target.cursor.index, 0)
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['b', 'c']
  )

  const singleSource = __create()
  assert(__update(0, [{ id: 'single' }], singleSource, 'after'))
  const singleTarget = __create(__snapshot(singleSource))
  const singleDeletion = __delete(singleSource, 0, 1)
  assert(__merge(singleTarget, singleDeletion.delta))
  assert.equal(singleTarget.cursor, undefined)
  assert.equal(singleTarget.cursorIndex, undefined)

  const tailCursorSource = __create()
  assert(
    __update(
      0,
      [{ id: 'tail-a' }, { id: 'tail-b' }, { id: 'tail-c' }],
      tailCursorSource,
      'after'
    )
  )
  const tailCursorTarget = __create(__snapshot(tailCursorSource))
  tailCursorTarget.cursor = [...tailCursorTarget.parentMap.values()].find(
    (entry) => entry.value.id === 'tail-c'
  )
  const headUuid = [...tailCursorTarget.parentMap.values()].find(
    (entry) => entry.value.id === 'tail-a'
  ).uuidv7
  assert(__merge(tailCursorTarget, { tombstones: [headUuid] }))
  assert.deepEqual(
    ids(tailCursorTarget).map((value) => value.id),
    ['tail-b', 'tail-c']
  )

  const corruptUuid = uuidv7()
  const corrupt = __create()
  corrupt.parentMap.set(corruptUuid, {
    uuidv7: corruptUuid,
    value: { id: 'corrupt' },
    predecessor: '\0',
    index: 0,
    prev: undefined,
    next: undefined,
  })
  corrupt.size = 1
  assert(__merge(corrupt, { tombstones: [corruptUuid] }))
  assert.equal(corrupt.cursorIndex, undefined)
})
