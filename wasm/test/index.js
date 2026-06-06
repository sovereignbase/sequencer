import createModule from '../dist/crlist_wasm.mjs'

const deltas = [{}, {}]

const wasm = await createModule()

console.log(wasm._size())

for (const delta of deltas) {
}
