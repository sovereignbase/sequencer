import createModule from '../dist/crlist_wasm.mjs'

const wasm = await createModule()

wasm._size()
