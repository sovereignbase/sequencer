import type {
  CRListState,
  CRListSnapshotBlock,
  CRListStateBlock,
} from '../../.types/type.js'
import { isRecord, uuidV7BigIntStringToBigInt } from '@sovereignbase/utils'
import { isDeleted } from '../deletedRanges/index.js'

/**
 * Converts a snapshot or delta block into local mutable block state.
 *
 * Invalid, deleted, duplicate, or malformed blocks are ignored. Item payloads
 * are kept by reference so CRList can avoid cloning user data.
 */
export function createStateBlock<T>(
  block: CRListSnapshotBlock<T>,
  replica: CRListState<T>,
  parsedId?: bigint
): CRListStateBlock<T> {
  // Reject non-record blocks and empty/non-array item payloads.
  if (
    !isRecord(block) ||
    !Array.isArray(block.items) ||
    block.items.length === 0
  )
    return undefined

  // Use caller-supplied parsed id when available, otherwise parse from string.
  const bigIntId = parsedId ?? uuidV7BigIntStringToBigInt(block.id)

  // Reject malformed ids and ids already known as deleted.
  if (bigIntId === false || isDeleted(replica.deletedRanges, bigIntId))
    return undefined

  // Root anchors are encoded as "0"; all other anchors are UUIDv7 bigint strings.
  const bigIntPreviousBlockId =
    block.previousBlockId === '0'
      ? 0n
      : uuidV7BigIntStringToBigInt(block.previousBlockId)

  // Reject malformed anchors and duplicate first item ids.
  if (bigIntPreviousBlockId === false || replica.blocksById.has(bigIntId))
    return undefined

  // Return a detached local block; linking is performed by callers.
  return {
    id: bigIntId,
    idString: block.id,
    items: block.items,
    nextBlock: undefined,
    previousBlock: undefined,
    previousBlockId: bigIntPreviousBlockId,
  }
}
