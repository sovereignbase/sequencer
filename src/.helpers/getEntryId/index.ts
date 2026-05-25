import type { CRListState } from '../../.types/type.js'

export function getEntryId<T>(
  crListReplica: CRListState<T>,
  length: number = 1
): bigint {
  const now = crListReplica.clock
  const out = now + 1n

  if (length >= 1) crListReplica.clock = now + BigInt(length)
  return out
}
