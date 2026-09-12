import assert from 'node:assert/strict'
import {
  acknowledge,
  create,
  insert,
  merge,
  recover,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import { wasm } from '../../src/typescript/wasm/index.js'

for (const hard of [false, true]) {
  const author = create<string>()
  const birth = insert(author, 0, ['a', 'b', 'c', 'd'])
  assert.notEqual(birth, false)
  const mask = remove(author, 1, 3, hard)
  assert.notEqual(mask, false)
  const saved = snapshot(author)
  assert.deepEqual(values(author), ['a', 'd'])
  assert.deepEqual(recover(author), hard ? ['a', 'd'] : ['a', 'b', 'c', 'd'])
  const restored = create<string>(saved)
  assert.deepEqual(values(restored), values(author))
  assert.deepEqual(recover(restored), recover(author))
  assert.deepEqual(snapshot(restored), saved)
  const remote = create<string>()
  assert.equal(merge(remote, mask), false)
  assert.deepEqual(snapshot(remote), [[], []])
  assert.equal(acknowledge(remote), false)
  merge(remote, saved)
  assert.deepEqual(values(remote), values(author))
  assert.deepEqual(recover(remote), recover(author))
  assert.deepEqual(acknowledge(remote), acknowledge(author))
  assert.equal(merge(remote, saved), false)
  assert.equal(wasm._get_projection_buffer_word_count(), 0)
  assert.equal(wasm._get_footage_span_buffer_count(), 0)
}

let editing = create<string>()
const expected: string[] = []
for (let edit = 0; edit < 100; ++edit) {
  const position =
    edit % 3 === 0 ? expected.length : (edit * 7) % (expected.length + 1)
  const text = [String(edit), '!']
  const delta = insert(editing, position, text)
  assert.notEqual(delta, false)
  expected.splice(position, 0, ...text)
  assert.deepEqual(values(editing), expected)
  if (edit % 20 === 0) editing = create<string>(snapshot(editing))
}
assert.deepEqual(snapshot(create()), [[], []])
console.log(
  'Public WASM snapshot round trips passed: soft/hard, retransmission, empty, mixed inserts.'
)
