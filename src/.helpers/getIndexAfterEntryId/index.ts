import type { CRListState } from '../../.types/type.js'

/**
 * Resolves the live index immediately after a virtual entry id.
 */
export function getIndexAfterEntryId<T>(
  crListReplica: CRListState<T>,
  id: bigint
): number | undefined {
  if (id === 0n) return 0
  const entry = crListReplica.parentMap.get(id)
  if (!entry) return undefined
  return entry.index + Number(id - entry.id) + 1
}
