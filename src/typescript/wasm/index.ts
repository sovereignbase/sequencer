import create_module from './raw/sequencer_wasm.mjs'
const module = create_module()
module._runtime_seed(crypto.getRandomValues(new Uint32Array(1))[0])
export default module
