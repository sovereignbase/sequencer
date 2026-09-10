import assert from 'node:assert/strict'
import { create } from '../../src/typescript/algorithms/create/index.js'
import { insert } from '../../src/typescript/algorithms/insert/index.js'
import { recover } from '../../src/typescript/algorithms/recover/index.js'
import { acknowledge } from '../../src/typescript/algorithms/acknowledge/index.js'
import { snapshot } from '../../src/typescript/algorithms/snapshot/index.js'
import { values } from '../../src/typescript/algorithms/values/index.js'
import { wasm } from '../../src/typescript/wasm/index.js'

const native = wasm as typeof wasm & {
  _mask_test_projection(projection_id: number): void
}
const absent = 0xffff_ffff

for (const hard of [false, true]) {
  const original = create<string>([
    [
      1,
      4,
      10,
      20,
      0,
      0,
      0,
      0,
      absent,
      absent,
      3,
      2,
      90,
      91,
      0,
      99,
      98,
      0,
      absent,
      absent,
      5,
      2,
      70,
      80,
      3,
      99,
      98,
      0,
      absent,
      absent,
      4,
      1,
      90,
      91,
      3,
      99,
      98,
      0,
      absent,
      absent,
    ],
    ['a', 'b', 'c', 'd', 'p', 'q', 'r'],
  ])
  native._mask_test_projection(original[0])
  if (hard) original[1].fill(undefined, 1, 3)
  const before = original[1].slice()
  const visible = values(original)
  assert.equal(native._get_footage_span_buffer_count(), 0)
  assert.equal(native._get_footage_span_buffer_pointer(), 0)
  assert.deepEqual(recover(original), hard ? ['a', 'd'] : ['a', 'b', 'c', 'd'])
  assert.equal(native._get_footage_span_buffer_count(), 0)
  assert.deepEqual(visible, ['a', 'd'])
  const delta = snapshot(original)
  assert.equal(native._get_projection_buffer_word_count(), 0)
  assert.equal(native._get_projection_buffer_pointer(), 0)
  assert.equal(native._get_footage_span_buffer_count(), 0)
  assert.equal(native._get_footage_span_buffer_pointer(), 0)
  assert.deepEqual(original[1], before)
  assert.deepEqual(
    delta[1].slice(0, 4),
    hard ? ['a', undefined, undefined, 'd'] : ['a', 'b', 'c', 'd']
  )
  assert.equal(delta[1].length, 7)
  assert.equal(delta[0][10], 2)
  assert.equal(delta[0][11], 2)

  let footage_index = 4
  for (let strip_index = 30; strip_index < delta[0].length; strip_index += 10) {
    const type = delta[0][strip_index]
    assert.ok(type >= 3)
    if (type === 5) continue
    const expected = type === 3 ? ['p', 'q'] : ['r']
    assert.deepEqual(
      delta[1].slice(footage_index, footage_index + expected.length),
      expected
    )
    footage_index += expected.length
  }
  assert.equal(footage_index, delta[1].length)

  const restored = create<string>(delta)
  assert.deepEqual(values(restored), visible)
  const again = snapshot(restored)
  assert.deepEqual(again, delta)
  restored[1][1] = 'changed'
  assert.equal(native._get_projection_buffer_word_count(), 0)
  assert.equal(native._get_footage_span_buffer_count(), 0)
  assert.deepEqual(
    delta[1].slice(0, 4),
    hard ? ['a', undefined, undefined, 'd'] : ['a', 'b', 'c', 'd']
  )
  assert.equal(delta[0][10], 2)
}

const masked = create<string>([
  [2, 3, 70, 80, 0, 0, 0, 0, absent, absent],
  ['x', 'y', 'z'],
])
assert.deepEqual(values(masked), [])
assert.deepEqual(snapshot(masked)[1], ['x', 'y', 'z'])
assert.deepEqual(recover(masked), ['x', 'y', 'z'])
assert.equal(native._get_footage_span_buffer_count(), 0)
assert.deepEqual(acknowledge(masked), [70, 80, 4])
assert.equal(native._get_acknowledgement_sequence_point_buffer_pointer(), 0)
const pending = create<string>([
  [3, 2, 90, 91, 0, 99, 98, 0, absent, absent],
  ['p', 'q'],
])
assert.deepEqual(values(pending), [])
assert.deepEqual(snapshot(pending)[1], ['p', 'q'])
assert.deepEqual(recover(pending), [])
assert.equal(native._get_footage_span_buffer_count(), 0)
assert.equal(acknowledge(pending), false)
assert.equal(native._get_acknowledgement_sequence_point_buffer_pointer(), 0)
const pending_mask_words = [5, 3, 70, 80, 0, 99, 98, 0, absent, absent]
const pending_mask = create([pending_mask_words, []])
assert.deepEqual(values(pending_mask), [])
assert.deepEqual(snapshot(pending_mask), [pending_mask_words, []])
assert.deepEqual(snapshot(create([[], []])), [[], []])
snapshot(masked)
assert.deepEqual(snapshot(create()), [[], []])
assert.deepEqual(values(masked), [])
assert.deepEqual(snapshot(masked)[1], ['x', 'y', 'z'])
console.log(
  'Snapshot WASM/TypeScript round trip passed (soft/hard, pending, empty).'
)

let editing = create<string>()
const first_delta = insert(editing, 0, ['a', 'b', 'c'])
assert.notEqual(first_delta, false)
if (!first_delta) throw new Error('birth insert rejected')
assert.equal(first_delta[0].length, 10)
assert.equal(first_delta[0][0], 0)
assert.equal(first_delta[0][1], 3)
assert.deepEqual(values(create<string>(first_delta)), ['a', 'b', 'c'])
let expected = ['a', 'b', 'c']
for (let edit = 0; edit < 100; ++edit) {
  const position =
    edit % 3 === 0 ? expected.length : (edit * 7) % (expected.length + 1)
  const text = [String(edit), '!']
  const delta = insert(editing, position, text)
  assert.notEqual(delta, false)
  if (!delta) throw new Error('insert rejected')
  assert.equal(delta[0][0], position === expected.length ? 1 : 0)
  assert.equal(delta[0][1], text.length)
  assert.deepEqual(delta[1], text)
  assert.equal(native._get_projection_buffer_word_count(), 0)
  expected.splice(position, 0, ...text)
  assert.deepEqual(values(editing), expected)
  if (edit % 20 === 0) {
    editing = create<string>(snapshot(editing))
    assert.deepEqual(values(editing), expected)
  }
}
for (const state of [masked, pending, pending_mask]) {
  assert.notEqual(insert(state, 0, ['X']), false)
  assert.deepEqual(values(state), ['X'])
  const restored = create<string>(snapshot(state))
  assert.deepEqual(values(restored), ['X'])
}
console.log(
  'Public insert WASM/TypeScript path passed (birth, head, body, tail, hydration).'
)
