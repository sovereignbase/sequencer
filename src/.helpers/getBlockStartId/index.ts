import type { CRListState } from '../../.types/type.js'

/**
 * Allocates the next local block start id from the replica monotonic clock.
 *
 * `length` reserves a contiguous id span for every item in the new block. The
 * returned id is the first item id, while the clock advances to the last
 * reserved id.
 */
export function getBlockStartId<T>(
  crListReplica: CRListState<T>,
  length?: number
): bigint {
  // Read the current high-water mark before reserving the next id range.
  const now: bigint = crListReplica.clock

  // The next block always starts one id after the current clock value.
  const out: bigint = now + 1n

  // Reserve the full contiguous range when a block length is known.
  crListReplica.clock = length ? now + BigInt(length) : now

  // Return the first reserved id to the caller creating the block.
  return out
}
