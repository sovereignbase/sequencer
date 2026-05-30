import type { CRListState, CRListStateBlock } from '../../.types/type.js'
import { isDeleted } from '../deletedRanges/index.js'

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
  // Result contains contiguous sub-blocks of unseen, non-deleted item ids.
  const blocks: Array<NonNullable<CRListStateBlock<T>>> = []

  // Start offset of the current unseen run, if one is open.
  let start: number | undefined

  // Scan one sentinel offset past the block to flush a trailing run.
  for (let offset = 0; offset <= block.items.length; offset++) {
    // Virtual id for the current item offset.
    const id = block.id + BigInt(offset)

    // Item is accepted only if it is inside the block and unseen locally.
    const isUnseen =
      offset < block.items.length &&
      !replica.blocksById.has(id) &&
      !isDeleted(replica.deletedRanges, id)

    // Open an unseen run or continue the current one.
    if (isUnseen) {
      if (start === undefined) start = offset
      continue
    }

    // Seen/deleted/sentinel offsets without an open run require no output.
    if (start === undefined) continue

    // The accepted sub-block starts at the first unseen offset.
    const blockId = block.id + BigInt(start)

    // Emit the contiguous unseen run as its own block.
    void blocks.push({
      id: blockId,
      idString: start === 0 ? block.idString : blockId.toString(),
      items: block.items.slice(start, offset),
      nextBlock: undefined,
      previousBlock: undefined,
      previousBlockId: start === 0 ? block.previousBlockId : blockId - 1n,
    })

    // Close the run before continuing the scan.
    start = undefined
  }

  // Return only unseen live sub-blocks to the merge caller.
  return blocks
}
