import { CRListState, CRListSnapshot } from '../../../.types/type.js'
import { getBlockEndId } from '../../../.helpers/index.js'

/**
 * Creates a full CRList snapshot from the current replica state.
 *
 * Each block emits one snapshot block with all contained items. Item payloads
 * are live references.
 *
 * @param replica - Replica to snapshot.
 * @returns - A full snapshot suitable for hydration or transport.
 */
export function __snapshot<T>(replica: CRListState<T>): CRListSnapshot<T> {
  const blocks: CRListSnapshot<T>['blocks'] = []
  let block =
    replica.firstBlock ?? replica.blocksByIndex.get(0) ?? replica.currentBlock
  while (block?.previousBlock) block = block.previousBlock
  let previous = block?.previousBlock
  while (block) {
    const previousBlockId =
      block.previousBlockId === 0n
        ? '0'
        : previous && block.previousBlockId === getBlockEndId(previous)
          ? previous.items.length === 1
            ? previous.idString
            : block.previousBlockId.toString()
          : block.previousBlockId.toString()
    void blocks.push({
      id: block.idString,
      items: block.items,
      previousBlockId,
    })
    previous = block
    block = block.nextBlock
  }
  return {
    blocks,
    deletedIds: Array.from(replica.deletedIds),
  }
}
