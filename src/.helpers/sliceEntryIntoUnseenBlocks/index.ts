import type { CRListState, CRListStateEntry } from '../../.types/type.js'

/**
 * Slices an RLE entry into contiguous runs whose virtual ids are still unseen.
 */
export function sliceEntryIntoUnseenBlocks<T>(
  crListReplica: CRListState<T>,
  entry: NonNullable<CRListStateEntry<T>>
): Array<NonNullable<CRListStateEntry<T>>> {
  const blocks: Array<NonNullable<CRListStateEntry<T>>> = []
  let start: number | undefined

  for (let offset = 0; offset <= entry.values.length; offset++) {
    const id = entry.id + BigInt(offset)
    const isUnseen =
      offset < entry.values.length &&
      !crListReplica.parentMap.has(id) &&
      !crListReplica.tombstones.has(id.toString())

    if (isUnseen) {
      if (start === undefined) start = offset
      continue
    }

    if (start === undefined) continue
    const blockId = entry.id + BigInt(start)
    void blocks.push({
      id: blockId,
      idString: start === 0 ? entry.idString : blockId.toString(),
      values: entry.values.slice(start, offset),
      predecessor: start === 0 ? entry.predecessor : blockId - 1n,
      index: 0,
      next: undefined,
      prev: undefined,
    })
    start = undefined
  }

  return blocks
}
