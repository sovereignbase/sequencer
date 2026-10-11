import create_module from './raw/sequencer_wasm.mjs'
import { Ready, Reserve, Failure, type Request } from '../runtime/protocol.js'
const scope = self as unknown as DedicatedWorkerGlobalScope
const module = create_module()
module._runtime_seed(crypto.getRandomValues(new Uint32Array(1))[0])
let memory = module.HEAPU32.buffer as SharedArrayBuffer
scope.postMessage([Ready, module._runtime_arena_pointer(), memory])
scope.onmessage = ({ data }: MessageEvent<Request>) => {
  const [slot, operation, id, a0, a1, a2, pointer, words] = data
  try {
    if (slot === Reserve) {
      const address = module._runtime_reserve(operation, id)
      memory = module.HEAPU32.buffer as SharedArrayBuffer
      scope.postMessage([Reserve, operation, address, memory])
      return
    }
    const result = module._runtime_dispatch(slot, operation, id, a0, a1, a2, pointer, words)
    const current = module.HEAPU32.buffer as SharedArrayBuffer
    scope.postMessage([
      slot,
      result,
      0,
      current === memory ? undefined : current,
    ])
    memory = current
  } catch (error) {
    scope.postMessage([
      Failure,
      error instanceof Error ? error : new Error(String(error)),
    ])
  }
}
