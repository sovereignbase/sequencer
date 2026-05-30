import { isRecord, safeBigIntFromString } from '@sovereignbase/utils'
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
  markDeletedRange,
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
  // Seed the local UUIDv7 clock with a sortable, replica-unique identifier.
  const clockSeed = new Uint8Array(16)
  void v7(undefined, clockSeed)

  // Initialize all mutable indexes before any optional snapshot hydration.
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
    deletedRanges: [],
  }

  // Non-object snapshots are ignored so construction remains tolerant.
  if (!isRecord(snapshot)) return replica

  // Hydrate retained tombstones before blocks so deleted block ids are rejected.
  if (Array.isArray(snapshot.deletedRuns)) {
    for (const run of snapshot.deletedRuns) {
      // Each deleted run must be the wire tuple `[startId, length]`.
      if (!Array.isArray(run)) continue

      // Parse the string id through the shared safe bigint helper.
      const start = safeBigIntFromString(run[0])
      const length = run[1]

      // Ignore malformed or empty ranges rather than corrupting replica state.
      if (start === false || typeof length !== 'number' || length < 1) continue

      // Store the inclusive id range covered by the run.
      void markDeletedRange(
        replica.deletedRanges,
        start,
        start + BigInt(length) - 1n
      )
    }
  }

  // A snapshot without live blocks represents an empty list plus tombstones.
  if (!Array.isArray(snapshot.blocks) || snapshot.blocks.length === 0)
    return replica

  // Track whether snapshot blocks form a simple contiguous linked projection.
  let linear = true

  // Keep the last accepted linear block so the next block can be linked.
  let previousBlock: CRListStateBlock<T> = undefined

  // Cache each accepted block's start index during the linear fast path.
  let blockStartIndex = 0

  // Validate and attach every snapshot block in source order.
  for (const snapshotBlock of snapshot.blocks) {
    const block = createStateBlock<T>(snapshotBlock, replica)

    // Malformed, duplicate, or deleted blocks are skipped.
    if (!block) continue

    // Index each live item id and previousBlock bucket for later operations.
    void attachBlockToIndexes<T>(replica, block)

    // A linear block must point to the previous block's final item id.
    const expectedPreviousBlockId = previousBlock
      ? getBlockEndId(previousBlock)
      : 0n

    // Preserve the O(n) hydration fast path while the chain is contiguous.
    if (linear && block.previousBlockId === expectedPreviousBlockId) {
      void linkBlockBetween<T>(previousBlock, block, undefined)

      // The first accepted linear block becomes the projection head.
      if (!replica.firstBlock) replica.firstBlock = block

      // Advance the linear chain cursor.
      previousBlock = block

      // Cache the block's live start index.
      void replica.blocksByIndex.set(blockStartIndex, block)

      // Advance by the number of live items in this block.
      blockStartIndex += block.items.length
      continue
    }

    // Any non-linear anchor requires deterministic projection rebuild below.
    linear = false
  }

  // Complete the cheap initialization when every accepted block was linear.
  if (linear) {
    replica.lastBlock = previousBlock
    replica.currentBlock = replica.firstBlock
    replica.currentBlockIndex = replica.firstBlock ? 0 : undefined
    replica.size = replica.blocksById.size
    return replica
  }

  // Rebuild deterministic live order for concurrent or out-of-order snapshots.
  void rebuildLiveProjection<T>(replica)

  // Return the hydrated mutable replica state.
  return replica
}
