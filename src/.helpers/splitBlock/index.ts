import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/**
 * Splits a block at an item offset, returning `[left, right]`.
 *
 * The right block starts at the virtual item id `block.id + offset`; its
 * previousBlock is the left block's last item id.
 */
export function splitBlock<T>(
  crListReplica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>,
  offset: number
): [NonNullable<CRListStateBlock<T>>, NonNullable<CRListStateBlock<T>>] {
  if (offset <= 0 || offset >= block.items.length) return [block, block]

  const rightId = block.id + BigInt(offset)
  const left: NonNullable<CRListStateBlock<T>> = {
    id: block.id,
    idString: block.idString,
    items: block.items.slice(0, offset),
    previousBlockId: block.previousBlockId,
    previousBlock: block.previousBlock,
    nextBlock: undefined,
  }
  const right: NonNullable<CRListStateBlock<T>> = {
    id: rightId,
    idString: rightId.toString(),
    items: block.items.slice(offset),
    previousBlockId: rightId - 1n,
    previousBlock: left,
    nextBlock: block.nextBlock,
  }
  left.nextBlock = right
  if (block.previousBlock) block.previousBlock.nextBlock = left
  if (block.nextBlock) block.nextBlock.previousBlock = right
  if (crListReplica.firstBlock === block) crListReplica.firstBlock = left
  if (crListReplica.lastBlock === block) crListReplica.lastBlock = right

  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++)
    void crListReplica.blocksById.delete(block.id + BigInt(itemOffset))
  for (let itemOffset = 0; itemOffset < left.items.length; itemOffset++)
    void crListReplica.blocksById.set(left.id + BigInt(itemOffset), left)
  for (let itemOffset = 0; itemOffset < right.items.length; itemOffset++)
    void crListReplica.blocksById.set(right.id + BigInt(itemOffset), right)

  const siblings = crListReplica.blocksByPreviousBlockId.get(
    block.previousBlockId
  )
  if (siblings) {
    const index = siblings.indexOf(block)
    if (index !== -1) siblings[index] = left
  }

  const rightSiblings = crListReplica.blocksByPreviousBlockId.get(
    right.previousBlockId
  )
  if (rightSiblings) {
    if (!rightSiblings.includes(right)) void rightSiblings.push(right)
  } else {
    void crListReplica.blocksByPreviousBlockId.set(right.previousBlockId, [
      right,
    ])
  }

  if (crListReplica.currentBlock === block) crListReplica.currentBlock = left
  void crListReplica.blocksByIndex.clear()

  return [left, right]
}
