import type { Request } from '../runtime/protocol.js'

/** Boundary for the forthcoming canonical reference-model C++ ABI. */
export function dispatch(_module: unknown, _request: Request): never {
  // Six-word coordinates/content IDs in; numeric results/spans out.
  // Footage is main-thread-owned. None of the old native exports are adapted.
  throw new Error('The reference-model native dispatcher has not been implemented yet')
}
