import createModule from './wasm/dist/crlist_wasm.mjs'

const wasm = await createModule()

console.log(wasm._crlist_add(19, 23))
console.log(
  `${wasm._crlist_version_major()}.${wasm._crlist_version_minor()}.${wasm._crlist_version_patch()}`
)
