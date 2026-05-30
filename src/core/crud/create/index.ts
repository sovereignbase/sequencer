import { isRecord } from '@sovereignbase/utils'
import { toBigInt } from '@sovereignbase/bytecodec'
import { v7 } from 'uuid'
import type {
  CRListSnapshot,
  CRListState,
  CRListStateBlock,
} from '../../../.types/type.js'
import {
  attachBlockToIndexes,
  createStateBlock,
  getBlockEndId,
  linkBlockBetween,
  rebuildLiveProjection,
} from '../../../.helpers/index.js'

/**
 * Creates a local CRList replica from an optional snapshot.
 *
 * A snapshot stores blocks, but list operations still target items. During
 * hydration every block is indexed under each contained item id so later
 * item-level reads, writes, deletes, and merges can find the containing block.
 */
export function __create<T>(snapshot?: CRListSnapshot<T>): CRListState<T> {
  const clockSeed = new Uint8Array(16)
  void v7(undefined, clockSeed)

  const replica: CRListState<T> = {
    size: 0,
    clock: toBigInt(clockSeed),
    firstBlock: undefined,
    currentBlock: undefined,
    lastBlock: undefined,
    currentBlockIndex: undefined,
    blocksById: new Map<bigint, CRListStateBlock<T>>(),
    blocksByIndex: new Map<number, NonNullable<CRListStateBlock<T>>>(),
    blocksByPreviousBlockId: new Map<
      bigint,
      Array<NonNullable<CRListStateBlock<T>>>
    >(),
    deletedIds: new Set<string>(),
  }

  if (!isRecord(snapshot)) return replica

  if (Array.isArray(snapshot.deletedIds)) {
    for (const deletedId of snapshot.deletedIds) {
      if (typeof deletedId === 'string') void replica.deletedIds.add(deletedId)
    }
  }

  if (!Array.isArray(snapshot.blocks) || snapshot.blocks.length === 0)
    return replica

  let linear = true
  let previousBlock: CRListStateBlock<T> = undefined
  let blockStartIndex = 0

  for (const snapshotBlock of snapshot.blocks) {
    const block = createStateBlock<T>(snapshotBlock, replica)
    if (!block) continue

    void attachBlockToIndexes<T>(replica, block)

    const expectedPreviousBlockId = previousBlock
      ? getBlockEndId(previousBlock)
      : 0n
    if (linear && block.previousBlockId === expectedPreviousBlockId) {
      void linkBlockBetween<T>(previousBlock, block, undefined)
      if (!replica.firstBlock) replica.firstBlock = block
      previousBlock = block
      void replica.blocksByIndex.set(blockStartIndex, block)
      blockStartIndex += block.items.length
      continue
    }

    linear = false
  }

  if (linear) {
    replica.lastBlock = previousBlock
    replica.currentBlock = replica.firstBlock
    replica.currentBlockIndex = replica.firstBlock ? 0 : undefined
    replica.size = replica.blocksById.size
    return replica
  }

  void rebuildLiveProjection<T>(replica)
  return replica
}
