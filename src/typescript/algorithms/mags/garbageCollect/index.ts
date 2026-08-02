import {
  compareUint32UuidV7,
  validateUint32UuidV7,
  wasmModule,
} from '../../../.helpers/index.js'
import type { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Removes deleted item ids acknowledged by all supplied frontiers.
 *
 * @param frontiers - Acknowledgement frontiers received from peers.
 * @param replica - Replica whose deleted item ids will be collected.
 */
export function __garbageCollect<T>(
  frontiers: Array<CRListAck>,
  replica: CRListState<T>
): void {
  if (!Array.isArray(frontiers)) return

  let smallest: CRListAck | undefined
  for (const frontier of frontiers) {
    if (!validateUint32UuidV7(frontier)) continue
    if (smallest === undefined || compareUint32UuidV7(frontier, smallest) < 0)
      smallest = frontier
  }
  if (!smallest) return

  void wasmModule._collect_deleted_until(...smallest, ...replica.instanceId)
}
