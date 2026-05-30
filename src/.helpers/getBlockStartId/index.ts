import type { CRListState } from '../../.types/type.js'

export function getBlockStartId<T>(
  crListReplica: CRListState<T>,
  length?: number
): bigint {
  const now: bigint = crListReplica.clock
  const out: bigint = now + 1n
  crListReplica.clock = length ? now + BigInt(length) : now

  return out
}
