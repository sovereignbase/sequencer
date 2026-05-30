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
  // Snapshot blocks are emitted in live projection order.
  const blocks: CRListSnapshot<T>['blocks'] = []

  // Start from the best-known projection head, falling back to cached cursor.
  let block =
    replica.firstBlock ?? replica.blocksByIndex.get(0) ?? replica.currentBlock

  // Walk back to the actual head if the fallback cursor was not first.
  while (block?.previousBlock) block = block.previousBlock

  // Track previous block to compact previousBlockId when possible.
  let previous = block?.previousBlock

  // Serialize every live block into transport-safe strings.
  while (block) {
    // Emit "0" for roots, compact single-item predecessor anchors, otherwise id.
    const previousBlockId =
      block.previousBlockId === 0n
        ? '0'
        : previous && block.previousBlockId === getBlockEndId(previous)
          ? previous.items.length === 1
            ? previous.idString
            : block.previousBlockId.toString()
          : block.previousBlockId.toString()

    // Preserve live item references while serializing block metadata as strings.
    void blocks.push({
      id: block.idString,
      items: block.items,
      previousBlockId,
    })

    // Advance projection traversal.
    previous = block
    block = block.nextBlock
  }

  // Serialize retained tombstone ranges as compact `[start, length]` runs.
  const deletedRuns: CRListSnapshot<T>['deletedRuns'] = []

  // Convert inclusive bigint ranges to JSON-compatible decimal strings.
  for (const [start, end] of replica.deletedRanges)
    void deletedRuns.push([start.toString(), Number(end - start + 1n)])

  // Return a complete snapshot suitable for hydration or gossip.
  return {
    blocks,
    deletedRuns,
  }
}
