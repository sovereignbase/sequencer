import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/**
 * Slices a received block into contiguous item-id runs that are still unseen.
 *
 * A remote block can overlap local item ids after partial deletes or earlier
 * gossip. This returns only the live item ranges that still need local blocks.
 */
export function sliceBlockIntoUnseenBlocks<T>(
  block: NonNullable<CRListStateBlock<T>>,
  replica: CRListState<T>
): Array<NonNullable<CRListStateBlock<T>>> {
  const blocks: Array<NonNullable<CRListStateBlock<T>>> = []
  let start: number | undefined

  for (let offset = 0; offset <= block.items.length; offset++) {
    const id = block.id + BigInt(offset)
    const isUnseen =
      offset < block.items.length &&
      !replica.blocksById.has(id) &&
      !replica.deletedIds.has(id.toString())

    if (isUnseen) {
      if (start === undefined) start = offset
      continue
    }

    if (start === undefined) continue
    const blockId = block.id + BigInt(start)
    void blocks.push({
      id: blockId,
      idString: start === 0 ? block.idString : blockId.toString(),
      items: block.items.slice(start, offset),
      nextBlock: undefined,
      previousBlock: undefined,
      previousBlockId: start === 0 ? block.previousBlockId : blockId - 1n,
    })
    start = undefined
  }

  return blocks
}
