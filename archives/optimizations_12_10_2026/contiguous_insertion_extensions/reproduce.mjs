import assert from 'node:assert/strict'
import { Projection } from '../../../dist/index.js'

const root = [
  [
    [0, 0, 0, 100, 0, 2],
    ['a', 'b'],
  ],
]
const suffix = [
  [
    [100, 0, 2, 100, 2, 2],
    ['c', 'd'],
  ],
]
const source = new Projection(1)
source.apply(root)
source.apply(suffix)
source.remove(0, 0)
const snapshot = structuredClone(source.sequence())
const replay = new Projection(2, structuredClone(snapshot))
const continuation = new Projection(3, structuredClone(snapshot))
replay.apply(structuredClone(suffix))
continuation.apply([[[100, 0, 4, 100, 4, 1], ['e']]])
console.log({
  snapshot,
  replay: replay.values(),
  continuation: continuation.values(),
})
assert.deepEqual(
  replay.values(),
  ['b', 'c', 'd'],
  'Old suffix must remain idempotent'
)
assert.deepEqual(
  continuation.values(),
  ['b', 'c', 'd', 'e'],
  'New suffix must materialize'
)
