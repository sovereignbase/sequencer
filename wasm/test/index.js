import assert from 'node:assert/strict'
import createModule from '../dist/crlist_wasm.mjs'

const root = [0, 0, 0, 0]
const first = [1, 0, 0, 0]

function readTimecode(wasm, pointer) {
  const start = pointer >>> 2
  return [...wasm.HEAPU32.subarray(start, start + 4)]
}

function splice(
  wasm,
  projector,
  footageCode,
  masked,
  stripLength,
  timecode,
  previousTimecode
) {
  return wasm._splice(
    projector,
    footageCode,
    masked ? 1 : 0,
    stripLength,
    ...timecode,
    ...previousTimecode
  )
}

const wasm = await createModule()
const projector = wasm._cue()

assert.equal(projector, 0)
assert.equal(wasm._size_of(projector), 0)

assert.equal(splice(wasm, projector, 7, false, 1, first, root), 7)
assert.equal(wasm._size_of(projector), 1)
assert.equal(wasm._footage_code_of(projector, 0), 7)

wasm._timecodes_of(projector, 0)

assert.deepEqual(readTimecode(wasm, wasm._timecode_buffer_pointer()), first)
assert.deepEqual(
  readTimecode(wasm, wasm._previous_timecode_buffer_pointer()),
  root
)

console.log('wasm smoke ok')
