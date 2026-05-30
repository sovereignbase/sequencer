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
  if (id === 0n) return 0

  const block = replica.blocksById.get(id)
  if (!block) return undefined

  const offsetAfterItem = Number(id - block.id) + 1
  const blockStartIndex = getBlockStartIndex(replica, block)
  return blockStartIndex === undefined
    ? undefined
    : blockStartIndex + offsetAfterItem
}
