import assert from 'node:assert/strict'
import { snapshot } from '../../src/typescript/algorithms/snapshot/index.js'
import { values } from '../../src/typescript/algorithms/values/index.js'
import type { Delta, Replica } from '../../src/typescript/types/type.js'
import { wasm } from '../../src/typescript/wasm/index.js'

const native = wasm as typeof wasm & {
  _prepare_test_projection(count: number): number
  _initialize_test_projection(): number
  _mask_test_projection(projection_id: number): void
}
const absent = 0xffff_ffff

function restore<T>(delta: Delta<T>): Replica<T> {
  const pointer = native._prepare_test_projection(delta[0].length / 10) >>> 2
  native.HEAPU32.set(delta[0], pointer)
  return [native._initialize_test_projection(), delta[1].slice()]
}

for (const hard of [false, true]) {
  const original = restore<string>([
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
  assert.deepEqual(visible, ['a', 'd'])
  const delta = snapshot(original)
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

  const restored = restore(delta)
  assert.deepEqual(values(restored), visible)
  const again = snapshot(restored)
  assert.deepEqual(again, delta)
  restored[1][1] = 'changed'
  native.HEAPU32.fill(
    0,
    native._get_projection_buffer_pointer() >>> 2,
    (native._get_projection_buffer_pointer() >>> 2) + delta[0].length
  )
  assert.deepEqual(
    delta[1].slice(0, 4),
    hard ? ['a', undefined, undefined, 'd'] : ['a', 'b', 'c', 'd']
  )
  assert.equal(delta[0][10], 2)
}

const masked = restore([
  [2, 3, 70, 80, 0, 0, 0, 0, absent, absent],
  ['x', 'y', 'z'],
])
assert.deepEqual(values(masked), [])
assert.deepEqual(snapshot(masked)[1], ['x', 'y', 'z'])
const pending = restore([
  [3, 2, 90, 91, 0, 99, 98, 0, absent, absent],
  ['p', 'q'],
])
assert.deepEqual(values(pending), [])
assert.deepEqual(snapshot(pending)[1], ['p', 'q'])
assert.deepEqual(snapshot(restore([[], []])), [[], []])
console.log(
  'Snapshot WASM/TypeScript round trip passed (soft/hard, pending, empty).'
)
