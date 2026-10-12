import create_module from './raw/sequencer_wasm.mjs'
/** Shared synchronous WASM instance; each Projection has independent native history. */
const module = create_module()
export default module
