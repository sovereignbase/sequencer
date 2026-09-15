import { register_replica } from '../../helpers/index.js'
import type { Replica, Snapshot } from '../../types/type.js'
import { create_sequence } from '../../wasm/index.js'

/** Creates a Replica; native creation restores and compacts the snapshot. */
export function create<T>(actorId: number, data?: unknown): Replica<T> {
  const [frontiers, projection] = (data ?? [[], []]) as Snapshot<T>
  let footageLength = 0
  for (const delta of projection) if (delta[0] === 1) footageLength += delta[2]
  const footage = new Array<T | undefined>(footageLength)
  let footageIndex = 0
  for (const delta of projection) {
    if (delta[0] !== 1) continue
    const source = delta[8]
    for (let frame = 0; frame < delta[2]; ++frame)
      footage[footageIndex++] = source?.[frame]
  }
  const state: Replica<T> = [
    create_sequence(actorId, frontiers, projection, footageLength),
    footage,
  ]
  register_replica(state)
  return state
}
