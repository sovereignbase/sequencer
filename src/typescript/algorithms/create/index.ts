import { register_replica } from '../../helpers/index.js'
import type { Replica, Snapshot } from '../../types/type.js'
import { create_sequence } from '../../wasm/index.js'

/** Creates a Replica; native creation restores and compacts the snapshot. */
export function create<T>(actorId: number, data?: unknown): Replica<T> {
  const [frontiers, projection, sourceFootage] = (data ?? [
    [],
    new Uint32Array(),
    [],
  ]) as Snapshot<T>
  const footage = sourceFootage.slice()
  const sequenceId = create_sequence(
    actorId,
    frontiers,
    projection,
    footage.length
  )
  const state: Replica<T> = [
    sequenceId,
    footage,
  ]
  register_replica(state)
  return state
}
