import type { CRListState } from '../../.types/type.js'
import { getBlockStartIndex } from '../getBlockStartIndex/index.js'

/**
 * Resolves the live item index immediately after a virtual item id.
 *
 * Blocks do not store absolute indexes. This helper first uses the current
 * cursor when it already points at the containing block, then falls back to the
 * live projection walk.
 */
export function getIndexAfterBlockId<T>(
  replica: CRListState<T>,
  id: bigint
): number | undefined {
  // The root anchor precedes the first live index.
  if (id === 0n) return 0

  // Locate the live block that contains the virtual item id.
  const block = replica.blocksById.get(id)

  // Unknown or tombstoned ids cannot resolve to a live index.
  if (!block) return undefined

  // Compute the offset immediately after the item within its block.
  const offsetAfterItem = Number(id - block.id) + 1

  // Resolve the containing block's absolute start index.
  const blockStartIndex = getBlockStartIndex(replica, block)

  // Combine absolute block start and item offset when the block is live.
  return blockStartIndex === undefined
    ? undefined
    : blockStartIndex + offsetAfterItem
}
