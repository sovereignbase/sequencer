import create_module from './raw/sequencer_wasm.mjs'
import { dispatch } from './dispatch.js'
import type { Request, Response } from '../runtime/protocol.js'

const scope = self as unknown as DedicatedWorkerGlobalScope
// One factory call in the one dedicated worker shared by all Projections.
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
