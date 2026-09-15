import assert from 'node:assert/strict'
import {
  create,
  ingest,
  insert,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import { wasm } from '../../src/typescript/wasm/index.js'

const author = create<string>(1)
const birth = insert(author, 0, ['a', 'b', 'c', 'd'])
assert.notEqual(birth, false)
const mask = remove(author, 1, 3)
assert.notEqual(mask, false)
const saved = snapshot(author)
assert.deepEqual(values(author), ['a', 'd'])

const restored = create<string>(2, saved)
assert.deepEqual(values(restored), values(author))
assert.equal(ingest(restored, mask), false)
assert.equal(wasm._get_projection_buffer_word_count(), 0)
assert.equal(wasm._get_footage_span_buffer_count(), 0)

let editing = create<string>(10)
const expected: string[] = []
for (let edit = 0; edit < 100; ++edit) {
  const position =
    edit % 3 === 0 ? expected.length : (edit * 7) % (expected.length + 1)
  const text = [String(edit), '!']
  const mutation = insert(editing, position, text)
  assert.notEqual(mutation, false)
  expected.splice(position, 0, ...text)
  assert.deepEqual(values(editing), expected)
  if (edit % 20 === 0) editing = create<string>(10, snapshot(editing))
}
assert.deepEqual(snapshot(create(11)), [[], []])
console.log('Public WASM snapshot round trips passed.')
