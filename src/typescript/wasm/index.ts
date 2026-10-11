import create_module from './raw/sequencer_wasm.mjs'
import { Ready, Failure, type Request } from '../runtime/protocol.js'
const scope = self as unknown as DedicatedWorkerGlobalScope
const module = create_module()
module._runtime_seed(crypto.getRandomValues(new Uint32Array(1))[0])
scope.postMessage([Ready])
scope.onmessage = ({ data }: MessageEvent<Request>) => {
  try {
    const request = new Uint32Array(data)
    const pointer = module._runtime_reserve(request[7])
    module.HEAPU32.set(request.subarray(8, 8 + request[7]), pointer >>> 2)
    const result = module._runtime_dispatch(request[1], request[2], request[3], request[4], request[5], pointer, request[7]) >>> 2
    const heap = module.HEAPU32
    const count = heap[result + 7]
    const reply = count <= request.length ? request : new Uint32Array(count)
    const slot = request[0]
    reply.set(heap.subarray(result, result + count))
    reply[7] = slot
    scope.postMessage(reply.buffer, [reply.buffer])
  } catch (error) {
    scope.postMessage([
      Failure,
      error instanceof Error ? error : new Error(String(error)),
    ])
  }
}
