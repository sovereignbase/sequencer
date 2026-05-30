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

function uuidV7ToBigIntStr(uuid) {
  return BigInt('0x' + uuid.replace(/-/g, '')).toString()
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

  list.append([{ id: 'a' }])
  list.append([{ id: 'b' }])
  list.prepend([{ id: 'z' }])
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
  list.state.blocksByIndex.delete(0)
  list.state.currentBlock = list.state.blocksByIndex.get(1)
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
  functionValueList.append([{ id: 'replace-me' }])
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
    json.blocks.map((entry) => entry.items[0].id),
    ['z', 'mutated']
  )
  list.state.blocksByIndex.delete(0)
  assert.equal(list.find((value) => value.id === 'mutated')?.id, 'mutated')
  assert.equal(list.toString(), JSON.stringify(json))
  assert.deepEqual(list[Symbol.for('nodejs.util.inspect.custom')](), json)
  assert.deepEqual(list[Symbol.for('Deno.customInspect')](), json)
  assert.equal(events.delta.length >= 5, true)
  assert.equal(events.change.length >= 5, true)
  assert.equal(events.snapshot.length, 1)
  assert.equal(events.ack.length, 1)

  list.removeEventListener('delta', onDelta)
  list.append([{ id: 'after-remove-listener' }])
  assert.equal(events.delta.length >= 5, true)

  const falseResultList = new CRList()
  falseResultList.append([{ id: 'only' }])
  const falseResultState = Object.getOwnPropertyDescriptor(
    falseResultList,
    'state'
  ).value
  const falseResultEntry = falseResultState.currentBlock
  falseResultState.size = 2
  falseResultEntry.nextBlock = undefined
  assert.equal(Reflect.set(falseResultList, '1', { id: 'no-set' }), false)
  falseResultState.currentBlock = falseResultEntry
  assert.equal(Reflect.deleteProperty(falseResultList, '1'), false)
  falseResultState.currentBlock = falseResultEntry
  falseResultList.prepend([{ id: 'no-prepend' }], 1)
  falseResultState.currentBlock = falseResultEntry
  falseResultList.append([{ id: 'no-append' }], 1)
  falseResultState.currentBlock = falseResultEntry
  falseResultList.remove(1)
  const throwingSetList = new CRList()
  throwingSetList.append([{ id: 'set-throw' }])
  throwingSetList.addEventListener('change', () => {})
  Object.getOwnPropertyDescriptor(
    throwingSetList,
    'eventTarget'
  ).value.dispatchEvent = () => {
    throw new Error('listener-set')
  }
  assert.equal(Reflect.set(throwingSetList, '0', { id: 'set-catch' }), false)
  const throwingDeleteList = new CRList()
  throwingDeleteList.append([{ id: 'delete-throw' }])
  throwingDeleteList.addEventListener('change', () => {})
  Object.getOwnPropertyDescriptor(
    throwingDeleteList,
    'eventTarget'
  ).value.dispatchEvent = () => {
    throw new Error('listener-delete')
  }
  assert.equal(Reflect.deleteProperty(throwingDeleteList, '0'), false)

  const remote = new CRList()
  remote.append([{ id: 'remote' }])
  list.merge(remote.toJSON())
  list.merge({ deletedIds: ['not-a-uuid'] })
  list.remove(0)
})

test('unit: CRList remove deletes a range with one event pair', () => {
  const list = new CRList()
  for (const id of ['a', 'b', 'c', 'd', 'e']) list.append([{ id }])

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
  assert.equal(deltas[0].deletedIds.length >= 3, true)
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

  list.merge({ blocks: [{ ...moved.blocks[0], previousBlockId: '\0' }] })
  list.merge({ blocks: [{ ...moved.blocks[0] }] })
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
  empty.currentBlock = undefined
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

  assert(__update(0, [{ id: 'a' }], range, 'overwrite'))
  assert(__update(range.size, [{ id: 'b' }], range, 'overwrite'))
  assert(__update(range.size, [{ id: 'append-overwrite' }], range, 'overwrite'))
  assert.deepEqual(
    ids(range).map((value) => value.id),
    ['a', 'b', 'append-overwrite']
  )
  const indexedEntry = range.blocksByIndex.get(1)
  range.blocksByIndex.set(1, { ...indexedEntry })
  assert.equal(__read(1, range).id, 'b')
  assert.equal(range.blocksByIndex.get(1), range.currentBlock)

  const fallbackRead = __create()
  assert(
    __update(0, [{ id: 'read-a' }, { id: 'read-b' }], fallbackRead, 'after')
  )
  fallbackRead.blocksByIndex.clear()
  assert.equal(__read(0, fallbackRead).id, 'read-a')

  const fallbackDelete = __create()
  assert(__update(0, [{ id: 'delete-a' }], fallbackDelete, 'after'))
  assert(__delete(fallbackDelete, 0, 1))

  const fallbackAppendOverwrite = __create()
  assert(__update(0, [{ id: 'append-base' }], fallbackAppendOverwrite, 'after'))
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
  assert(
    __update(0, [{ id: 'overwrite-fallback' }], fallbackOverwrite, 'overwrite')
  )

  const fallbackAfter = __create()
  assert(__update(0, [{ id: 'after-base' }], fallbackAfter, 'after'))
  assert(__update(0, [{ id: 'after-fallback' }], fallbackAfter, 'after'))

  const fallbackBefore = __create()
  assert(__update(0, [{ id: 'before-base' }], fallbackBefore, 'after'))
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
  noIndexTarget.blocksByIndex = new Map()
  const noIndexDeletion = __delete(noIndexSource, 1, 2)
  assert(
    __merge(noIndexTarget, { deletedIds: noIndexDeletion.delta.deletedIds })
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
  corruptEmptyDelete.currentBlock = undefined
  assert.throws(
    () => __delete(corruptEmptyDelete, 0, 1),
    (error) => error.code === 'LIST_EMPTY'
  )

  const corruptWalkDelete = __create()
  assert(__update(0, [{ id: 'walk-delete' }], corruptWalkDelete, 'after'))
  corruptWalkDelete.size = 2
  corruptWalkDelete.currentBlock.nextBlock = undefined
  assert.equal(__delete(corruptWalkDelete, 1, 2), false)

  const corruptWalkUpdate = __create()
  assert(__update(0, [{ id: 'walk-update' }], corruptWalkUpdate, 'after'))
  corruptWalkUpdate.size = 2
  corruptWalkUpdate.currentBlock.nextBlock = undefined
  assert.equal(
    __update(1, [{ id: 'no-overwrite' }], corruptWalkUpdate, 'overwrite'),
    false
  )
  corruptWalkUpdate.currentBlock = [...corruptWalkUpdate.blocksById.values()][0]
  assert.equal(
    __update(
      2,
      [{ id: 'no-append-overwrite' }],
      corruptWalkUpdate,
      'overwrite'
    ),
    false
  )
  corruptWalkUpdate.currentBlock = [...corruptWalkUpdate.blocksById.values()][0]
  assert.equal(
    __update(1, [{ id: 'no-after' }], corruptWalkUpdate, 'after'),
    false
  )
  corruptWalkUpdate.currentBlock = [...corruptWalkUpdate.blocksById.values()][0]
  assert.equal(
    __update(1, [{ id: 'no-before' }], corruptWalkUpdate, 'before'),
    false
  )

  const corruptDelete = __create()
  assert(__update(0, [{ id: 'gone' }], corruptDelete, 'after'))
  const corruptEntry = corruptDelete.currentBlock
  corruptDelete.blocksByPreviousBlockId.delete(corruptEntry.previousBlockId)
  assert(__delete(corruptDelete, 0, 1))

  const corruptSnapshot = __create()
  assert(__update(0, [{ id: 'snapshot' }], corruptSnapshot, 'after'))
  corruptSnapshot.blocksById.set('bad', undefined)
  const corruptSnapshotResult = __snapshot(corruptSnapshot)
  assert.equal(corruptSnapshotResult.blocks.length, 1)

  const valid = __create()
  const validDelta = __update(0, [{ id: 'valid' }], valid, 'after').delta
  const functionValueDelta = __update(
    1,
    [{ id: 'function-source' }],
    valid,
    'after'
  ).delta
  const validEntry = validDelta.blocks[0]
  const functionValueEntry = functionValueDelta.blocks[0]
  const invalidSnapshot = __create({
    deletedIds: ['not-a-bigint', validEntry.id],
    blocks: [
      validEntry,
      { ...validEntry, id: 'not-a-bigint' },
      { ...validEntry, id: validEntry.previousBlockId },
      { ...functionValueEntry, items: [() => undefined] },
      { ...validEntry, previousBlockId: 'not-a-bigint' },
    ],
  })
  assert.equal(ids(invalidSnapshot).length, 1)
  assert.equal(typeof ids(invalidSnapshot)[0], 'function')

  const missingValues = __create({ deletedIds: ['not-a-uuid'] })
  assert.deepEqual(ids(missingValues), [])
})

test('unit: merge, acknowledge, and garbage collection edge paths', () => {
  const source = __create()
  const target = __create()

  assert.equal(__merge(target, undefined), false)
  assert.equal(__merge(target, { deletedIds: ['not-a-uuid'] }), false)
  assert.equal(__merge(target, { deletedIds: [], blocks: [] }), false)

  assert.equal(__acknowledge(target), false)
  __garbageCollect('not-an-array', target)
  __garbageCollect([], target)

  const insert = __update(0, [{ id: 'remote' }], source, 'after').delta
  const moved = __update(0, [{ id: 'next' }], source, 'after').delta
  assert.deepEqual(
    __merge(target, { blocks: [{ ...moved.blocks[0], previousBlockId: '0' }] }),
    { 0: { id: 'next' } }
  )
  assert.equal(__merge(target, { blocks: [{ ...moved.blocks[0] }] }), false)
  assert.deepEqual(__merge(target, insert), { 0: { id: 'remote' } })
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['remote', 'next']
  )
  assert.equal(__merge(target, moved), false)
  target.deletedIds.add(moved.blocks[0].id)
  assert.equal(__merge(target, { blocks: [moved.blocks[0], null] }), false)

  const invalidPredecessorTarget = __create()
  const invalidPredecessorDelta = __update(
    0,
    [{ id: 'invalid-predecessor' }],
    invalidPredecessorTarget,
    'after'
  ).delta
  assert.equal(
    __merge(invalidPredecessorTarget, {
      blocks: [
        {
          ...invalidPredecessorDelta.blocks[0],
          previousBlockId: 'not-a-uuid',
        },
        null,
      ],
    }),
    false
  )

  const deletion = __delete(source, 0, 1).delta
  assert(__merge(target, { deletedIds: deletion.deletedIds }))
  const ack = __acknowledge(target)
  assert.equal(typeof ack, 'string')
  __garbageCollect([ack], target)
})

test('unit: deleting a predecessor re-anchors the first live successor', () => {
  const source = __create()
  assert(__update(0, [{ id: 'before' }], source, 'after'))
  assert(__update(source.size, [{ id: 'anchor' }], source, 'after'))
  assert(__update(source.size, [{ id: 'after' }], source, 'after'))
  const target = __create(__snapshot(source))

  const inserted = __update(
    source.size - 2,
    [{ id: 'deleted-parent' }],
    source,
    'after'
  )
  const removed = __delete(source, source.size - 2, source.size - 1)
  const reanchored = removed.delta.blocks.find(
    (entry) => entry.items?.[0]?.id === 'after'
  )

  assert(reanchored)
  assert.equal(removed.delta.deletedIds.length, 2)
  assert.notEqual(reanchored.id, inserted.delta.blocks[0].id)
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
  assert(__update(0, [{ id: 'a' }], source, 'after'))
  assert(__update(source.size, [{ id: 'b' }], source, 'after'))
  assert(__update(source.size, [{ id: 'c' }], source, 'after'))
  const target = __create(__snapshot(source))
  assert.equal(__read(2, target).id, 'c')
  assert.equal(target.currentBlockIndex, 2)

  const deleted = __delete(source, 2, 3)
  assert(deleted)
  assert(!deleted.delta.blocks?.length)
  assert.equal(deleted.delta.deletedIds.length, 1)

  assert.deepEqual(__merge(target, deleted.delta), { 2: undefined })
  assert.equal(target.size, 2)
  assert.equal(target.currentBlockIndex, 1)
  assert.equal(target.currentBlock.items[0].id, 'b')
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ids(source).map((value) => value.id)
  )
})

test('unit: merge splices root replacement when successor chain is complete', () => {
  const source = __create()
  assert(__update(0, [{ id: 'a' }], source, 'after'))
  assert(__update(source.size, [{ id: 'b' }], source, 'after'))
  assert(__update(source.size, [{ id: 'c' }], source, 'after'))
  const target = __create(__snapshot(source))
  assert.equal(__read(2, target).id, 'c')
  assert.equal(target.currentBlock.items[0].id, 'c')

  const overwritten = __update(0, [{ id: 'new-head' }], source, 'overwrite')
  assert(overwritten)

  const change = __merge(target, overwritten.delta)

  assert.deepEqual(change, { 0: { id: 'new-head' } })
  assert.equal(target.currentBlock.items[0].id, 'new-head')
  assert.equal(target.blocksByIndex.get(0), target.currentBlock)
  assert.equal(__read(0, target).id, 'new-head')
  assert.equal(__read(1, target).id, 'b')
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['new-head', 'b', 'c']
  )
})

test('unit: merge splices root replacement without successor', () => {
  const source = __create()
  assert(__update(0, [{ id: 'a' }], source, 'after'))
  const target = __create(__snapshot(source))

  const overwritten = __update(0, [{ id: 'new-head' }], source, 'overwrite')
  assert(overwritten)

  const change = __merge(target, overwritten.delta)

  assert.deepEqual(change, { 0: { id: 'new-head' } })
  assert.equal(target.size, 1)
  assert.equal(target.firstBlock.items[0].id, 'new-head')
  assert.equal(target.lastBlock, target.firstBlock)
  assert.equal(__read(0, target).id, 'new-head')
})

test('unit: remote head delete is observable through indexed reads', () => {
  const source = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], source, 'after'))
  const target = __create(__snapshot(source))

  const deleted = __delete(source, 0, 1)
  assert(deleted)
  assert(__merge(target, deleted.delta))

  assert.equal(__read(0, target).id, 'b')
  assert.equal(__read(1, target).id, 'c')
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['b', 'c']
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
  assert.equal(target.currentBlock.items[0].id, 'right')
  assert.equal(
    target.blocksByIndex.get(target.currentBlockIndex),
    target.currentBlock
  )
})

test('unit: merge splices lower root sibling before current head', () => {
  const base = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], base, 'after'))
  const snapshot = __snapshot(base)
  const target = __create(snapshot)
  const left = __create(snapshot)
  const right = __create(snapshot)

  const leftDelta = __update(0, [{ id: 'left' }], left, 'before').delta
  const rightDelta = __update(0, [{ id: 'right' }], right, 'before').delta
  const [higher, lower] =
    BigInt(leftDelta.blocks[0].id) > BigInt(rightDelta.blocks[0].id)
      ? [leftDelta, rightDelta]
      : [rightDelta, leftDelta]

  assert(__merge(target, higher))
  const tail = target.lastBlock
  tail.index = -123
  assert(__merge(target, lower))
  const lowerId = lower.blocks[0].items[0].id
  const higherId = higher.blocks[0].items[0].id

  assert.equal(tail.index, -123)
  assert.deepEqual(
    ids(target).map((value) => value.id),
    [lowerId, higherId, 'a', 'b', 'c']
  )
})

test('unit: merge splices lower non-root sibling before existing subtree', () => {
  const base = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], base, 'after'))
  const snapshot = __snapshot(base)
  const target = __create(snapshot)
  const left = __create(snapshot)
  const right = __create(snapshot)

  const leftDelta = __update(1, [{ id: 'left' }], left, 'before').delta
  const rightDelta = __update(1, [{ id: 'right' }], right, 'before').delta
  const [higher, lower] =
    BigInt(leftDelta.blocks[0].id) > BigInt(rightDelta.blocks[0].id)
      ? [leftDelta, rightDelta]
      : [rightDelta, leftDelta]

  assert(__merge(target, higher))
  const tail = target.lastBlock
  tail.index = -123
  assert(__merge(target, lower))
  const lowerId = lower.blocks[0].items[0].id
  const higherId = higher.blocks[0].items[0].id

  assert.equal(tail.index, -123)
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['a', lowerId, higherId, 'b', 'c']
  )
})

test('unit: merge splices first child before concurrent next sibling', () => {
  const base = __create()
  assert(__update(0, [{ id: 'a' }, { id: 'b' }], base, 'after'))
  const snapshot = __snapshot(base)
  const left = __create(snapshot)
  const right = __create(snapshot)
  const target = __create(snapshot)

  const leftFirst = __update(left.size, [{ id: 'left-0' }], left, 'after').delta
  const leftSecond = __update(
    left.size,
    [{ id: 'left-1' }],
    left,
    'after'
  ).delta
  const rightFirst = __update(
    right.size,
    [{ id: 'right-0' }],
    right,
    'after'
  ).delta
  const rightSecond = __update(
    right.size,
    [{ id: 'right-1' }],
    right,
    'after'
  ).delta
  const [lowerFirst, lowerSecond, higherFirst] =
    BigInt(leftFirst.blocks[0].id) < BigInt(rightFirst.blocks[0].id)
      ? [leftFirst, leftSecond, rightFirst]
      : [rightFirst, rightSecond, leftFirst]

  assert(__merge(target, higherFirst))
  assert(__merge(target, lowerFirst))
  assert(__merge(target, lowerSecond))

  const lowerZero = lowerFirst.blocks[0].items[0].id
  const lowerOne = lowerSecond.blocks[0].items[0].id
  const higherZero = higherFirst.blocks[0].items[0].id

  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['a', 'b', lowerZero, lowerOne, higherZero]
  )
})

test('unit: merge splices sibling parent through tombstoned bridge', () => {
  const base = __create()
  assert(
    __update(
      0,
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      base,
      'after'
    )
  )
  const snapshot = __snapshot(base)
  const target = __create(snapshot)
  const overwritten = __create(snapshot)
  const removed = __create(snapshot)

  const overwriteDelta = __update(
    1,
    [{ id: 'overwrite' }],
    overwritten,
    'overwrite'
  ).delta
  const deleteDelta = __delete(removed, 1, 2).delta

  assert(__merge(target, overwriteDelta))
  const tail = target.lastBlock
  tail.index = -123
  assert(__merge(target, deleteDelta))

  assert.equal(tail.index, -123)
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['a', 'overwrite', 'c', 'd']
  )
})

test('unit: nullish snapshot and delta entries are ignored', () => {
  const empty = __create({ blocks: [null, undefined], deletedIds: [] })
  assert.equal(empty.size, 0)
  assert.equal(empty.currentBlock, undefined)
  assert.equal(empty.currentBlockIndex, undefined)
  assert.deepEqual(empty.blocksByIndex, new Map())
  assert.deepEqual(empty.deletedIds, new Set())
  assert.deepEqual(empty.blocksById, new Map())
  assert.deepEqual(empty.blocksByPreviousBlockId, new Map())

  const target = __create()
  assert.equal(__merge(target, { blocks: [null, undefined] }), false)
  assert.deepEqual(__snapshot(target), { blocks: [], deletedIds: [] })
})

test('unit: large non-linear snapshots hydrate 100k entries without recursive stack growth', () => {
  const values = []
  let predecessor = '0'

  for (let index = 0; index < 100_000; index++) {
    const id = uuidV7ToBigIntStr(uuidv7())
    values.push({
      id,
      items: [{ id: `large-${index}` }],
      previousBlockId: predecessor,
    })
    predecessor = id
  }

  const hydrated = __create({
    blocks: values.toReversed(),
    deletedIds: [],
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

  const corruptSource = __create()
  const d1 = __update(0, [{ id: 'delete' }], corruptSource, 'after').delta
    .blocks[0]
  const d2 = __update(
    corruptSource.size,
    [{ id: 'parent' }],
    corruptSource,
    'after'
  ).delta.blocks[0]
  const d3 = __update(
    corruptSource.size,
    [{ id: 'child' }],
    corruptSource,
    'after'
  ).delta.blocks[0]
  const d4 = __update(
    corruptSource.size,
    [{ id: 'missing-parent' }],
    corruptSource,
    'after'
  ).delta.blocks[0]
  const corrupt = __create()
  const deletedEntry = {
    id: BigInt(d1.id),
    idString: d1.id,
    items: d1.items,
    previousBlockId: 0n,
    previousBlock: undefined,
    nextBlock: undefined,
  }
  const parentEntry = {
    id: BigInt(d2.id),
    idString: d2.id,
    items: d2.items,
    previousBlockId: 0n,
    previousBlock: undefined,
    nextBlock: undefined,
  }
  const childEntry = {
    id: BigInt(d3.id),
    idString: d3.id,
    items: d3.items,
    previousBlockId: BigInt(d4.id),
    previousBlock: undefined,
    nextBlock: undefined,
  }

  corrupt.blocksById.set(deletedEntry.id, deletedEntry)
  corrupt.blocksById.set(parentEntry.id, parentEntry)
  corrupt.blocksById.set(childEntry.id, childEntry)
  corrupt.blocksById.set(BigInt(d4.id), undefined)
  corrupt.firstBlock = deletedEntry
  corrupt.currentBlock = deletedEntry
  corrupt.currentBlockIndex = 0
  corrupt.size = 3

  assert(__merge(corrupt, { deletedIds: [d1.id], blocks: [] }))
})

test('unit: flatten relink branch coverage stays explicit under corrupt buckets', () => {
  const relinkSource = __create()
  assert(__update(0, [{ id: 'existing' }], relinkSource, 'after'))

  const relinkTarget = __create(__snapshot(relinkSource))
  relinkTarget.blocksByIndex = new Map()
  const rootBucket = relinkTarget.blocksByPreviousBlockId.get(0n)
  const rootEntry = rootBucket[0]
  rootBucket.push({ ...rootEntry })
  relinkTarget.blocksByPreviousBlockId.set(1000n, undefined)
  relinkTarget.blocksByPreviousBlockId.set(2000n, undefined)
  relinkTarget.blocksByPreviousBlockId.set(3000n, undefined)
  relinkTarget.blocksByPreviousBlockId.set(4000n, [undefined])

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
  target.currentBlock = target.firstBlock
  target.currentBlockIndex = 0

  const deletion = __delete(source, 0, 1)
  assert(__merge(target, deletion.delta))

  assert.equal(target.currentBlockIndex, 0)
  assert.deepEqual(
    ids(target).map((value) => value.id),
    ['b', 'c']
  )

  const singleSource = __create()
  assert(__update(0, [{ id: 'single' }], singleSource, 'after'))
  const singleTarget = __create(__snapshot(singleSource))
  const singleDeletion = __delete(singleSource, 0, 1)
  assert(__merge(singleTarget, singleDeletion.delta))
  assert.equal(singleTarget.currentBlock, undefined)
  assert.equal(singleTarget.currentBlockIndex, undefined)

  const tailCursorSource = __create()
  assert(__update(0, [{ id: 'tail-a' }], tailCursorSource, 'after'))
  assert(
    __update(
      tailCursorSource.size,
      [{ id: 'tail-b' }],
      tailCursorSource,
      'after'
    )
  )
  assert(
    __update(
      tailCursorSource.size,
      [{ id: 'tail-c' }],
      tailCursorSource,
      'after'
    )
  )
  const tailCursorTarget = __create(__snapshot(tailCursorSource))
  tailCursorTarget.currentBlock = [
    ...tailCursorTarget.blocksById.values(),
  ].find((entry) => entry.items?.[0]?.id === 'tail-c')
  const headUuid = [...tailCursorTarget.blocksById.values()]
    .find((entry) => entry.items?.[0]?.id === 'tail-a')
    .id.toString()
  assert(__merge(tailCursorTarget, { deletedIds: [headUuid] }))
  assert.deepEqual(
    ids(tailCursorTarget).map((value) => value.id),
    ['tail-b', 'tail-c']
  )

  const corruptId = '99999999999999'
  const corrupt = __create()
  corrupt.blocksById.set(BigInt(corruptId), {
    id: BigInt(corruptId),
    idString: corruptId,
    items: [{ id: 'corrupt' }],
    previousBlockId: 0n,
    previousBlock: undefined,
    nextBlock: undefined,
  })
  corrupt.size = 1
  assert(__merge(corrupt, { deletedIds: [corruptId] }))
  assert.equal(corrupt.currentBlockIndex, undefined)
})
