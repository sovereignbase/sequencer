import type {
  CRListState,
  CRListSnapshotBlock,
  CRListStateBlock,
} from '../../.types/type.js'
import { isRecord, uuidV7BigIntStringToBigInt } from '@sovereignbase/utils'

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
  if (
    !isRecord(block) ||
    !Array.isArray(block.items) ||
    block.items.length === 0 ||
    replica.deletedIds.has(block.id)
  )
    return undefined

  const bigIntId = parsedId ?? uuidV7BigIntStringToBigInt(block.id)
  if (bigIntId === false) return undefined

  const bigIntPreviousBlockId =
    block.previousBlockId === '0'
      ? 0n
      : uuidV7BigIntStringToBigInt(block.previousBlockId)

  if (bigIntPreviousBlockId === false || replica.blocksById.has(bigIntId))
    return undefined

  return {
    id: bigIntId,
    idString: block.id,
    items: block.items,
    nextBlock: undefined,
    previousBlock: undefined,
    previousBlockId: bigIntPreviousBlockId,
  }
}
