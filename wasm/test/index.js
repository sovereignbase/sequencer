import { v7 } from 'uuid'
import createModule from '../dist/crlist_wasm.mjs'

function generateId() {
  const clockSeed = new Uint8Array(16)
  void v7(undefined, clockSeed)
  return new Uint32Array(clockSeed.buffer)
}

const [a, b, c, d] = generateId

const wasm = await createModule()
wasm._add_instance(a, b, c, d)

for (const delta of deltas) {
}
