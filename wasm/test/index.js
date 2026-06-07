import assert from 'node:assert/strict'
import { v7 } from 'uuid'
import createModule from '../dist/crlist_wasm.mjs'

const root = [0, 0, 0, 0]
const values = []

function generateId() {
  const clockSeed = new Uint8Array(16)
  void v7(undefined, clockSeed)
  return [...new Uint32Array(clockSeed.buffer)]
}

function appendValues(items) {
  const consumerReference = values.length
  values.push(...items)
  return consumerReference
}

function readValues(wasm, instance) {
  const length = wasm._get_live_item_amount(...instance)
  const output = []
  for (let index = 0; index < length; index++) {
    output.push(values[wasm._get_consumer_reference_of(index, ...instance)])
  }
  return output
}

function addRange(wasm, instance, range, previous, items, deleted = false) {
  wasm._add_range_to(
    items.length,
    appendValues(items),
    deleted ? 1 : 0,
    ...instance,
    ...range,
    ...previous
  )
}

function applyLocal(
  wasm,
  instance,
  targetIndex,
  range,
  previous,
  items,
  deleted = false
) {
  wasm._applyLocal(
    targetIndex,
    items.length,
    deleted ? 1 : 0,
    appendValues(items),
    ...instance,
    ...range,
    ...previous
  )
}

function applyRemote(wasm, instance, range, previous, items, deleted = false) {
  return wasm._applyRemote(
    items.length,
    deleted ? 1 : 0,
    appendValues(items),
    ...instance,
    ...range,
    ...previous
  )
}

const wasm = await createModule()

{
  const instance = generateId()
  const base = generateId()
  const inserted = generateId()
  const removed = generateId()

  wasm._add_instance(...instance)
  addRange(wasm, instance, base, root, ['A', 'B', 'C'])
  wasm._resolve_order_for(...instance)
  assert.deepEqual(readValues(wasm, instance), ['A', 'B', 'C'])

  applyLocal(wasm, instance, 1, inserted, base, ['X', 'Y'])
  assert.deepEqual(readValues(wasm, instance), ['A', 'X', 'Y', 'B', 'C'])

  applyLocal(wasm, instance, 2, removed, inserted, ['Y'], true)
  assert.deepEqual(readValues(wasm, instance), ['A', 'X', 'B', 'C'])
}

{
  const instance = generateId()
  const left = generateId()
  const right = generateId()

  wasm._add_instance(...instance)
  assert.equal(applyRemote(wasm, instance, left, root, ['remote-root']), 0)
  assert.equal(applyRemote(wasm, instance, right, left, ['remote-after']), 1)
  assert.deepEqual(readValues(wasm, instance), ['remote-root', 'remote-after'])
}

{
  const instance = generateId()
  const base = generateId()
  const remote = generateId()

  wasm._add_instance(...instance)
  addRange(wasm, instance, base, root, ['R0', 'R1', 'R2'])
  wasm._resolve_order_for(...instance)

  const changedAt = applyRemote(wasm, instance, remote, base, ['REMOTE'])
  const observed = readValues(wasm, instance)
  const expectedWithSplit = ['R0', 'REMOTE', 'R1', 'R2']

  assert.equal(changedAt, 1)
  assert.deepEqual(observed, expectedWithSplit)
}

console.log('wasm PoC ok')
