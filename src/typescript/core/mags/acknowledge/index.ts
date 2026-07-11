import { wasmModule } from '../../../.helpers/index.js'
import type { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Returns the replica deleted-id acknowledgement frontier.
 *
 * @param crListReplica - Replica to acknowledge.
 * @returns - The acknowledgement frontier, or `false` when there are no deleted ids.
 */
export function __acknowledge<T>(
  crListReplica: CRListState<T>
): CRListAck | false {
  if (!wasmModule._has_deleted_range(...crListReplica.instanceId)) return false
  return [
    wasmModule._get_deleted_frontier(0, ...crListReplica.instanceId) >>> 0,
    wasmModule._get_deleted_frontier(1, ...crListReplica.instanceId) >>> 0,
    wasmModule._get_deleted_frontier(2, ...crListReplica.instanceId) >>> 0,
    wasmModule._get_deleted_frontier(3, ...crListReplica.instanceId) >>> 0,
  ]
}
