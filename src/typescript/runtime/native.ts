import type { MainModule } from '../wasm/raw/sequencer_wasm.mjs'
import type { Request } from './protocol.js'

/**
 * Deliberate boundary for the forthcoming reference-model C++ runtime.
 * No old native entry points or reference algorithms are adapted here.
 * The future dispatcher receives only six-word coordinates and content IDs;
 * generic Footage stays in the worker's JS content ownership layer.
 */
export function dispatch(_module: MainModule, _request: Request): never {
  throw new Error('The reference-model native dispatcher has not been implemented yet')
}
