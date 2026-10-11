import create_module from '../wasm/raw/sequencer_wasm.mjs'
import { dispatch } from './native.js'
import type { Request, Response } from './protocol.js'

const scope = self as unknown as DedicatedWorkerGlobalScope
// This is the only factory call. The build embeds it and its WASM in this worker.
const module = create_module()

scope.onmessage = ({ data }: MessageEvent<Request>) => {
  const [slot, generation] = data
  let response: Response
  try {
    response = [slot, generation, 0, dispatch(module, data)]
  } catch (error) {
    response = [slot, generation, 1, error instanceof Error ? error : new Error(String(error))]
  }
  scope.postMessage(response)
}
