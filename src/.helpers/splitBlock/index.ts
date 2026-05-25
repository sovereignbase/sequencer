import type { CRListState, CRListStateEntry } from '../../.types/type.js'

/** Splits a block at offset, returning [left, right]. Updates parentMap/childrenMap/links. */
export function splitBlock<T>(
  crListReplica: CRListState<T>,
  block: NonNullable<CRListStateEntry<T>>,
  offset: number
): [NonNullable<CRListStateEntry<T>>, NonNullable<CRListStateEntry<T>>] {
  const left: NonNullable<CRListStateEntry<T>> = {
    id: block.id,
    values: block.values.slice(0, offset),
    predecessor: block.predecessor,
    index: block.index,
    prev: block.prev,
    next: undefined,
  }
  const right: NonNullable<CRListStateEntry<T>> = {
    id: block.id + BigInt(offset),
    values: block.values.slice(offset),
    predecessor: block.id + BigInt(offset) - 1n,
    index: block.index + offset,
    prev: left,
    next: block.next,
  }
  left.next = right
  if (block.prev) block.prev.next = left
  if (block.next) block.next.prev = right

  // Re-register in parentMap
  for (let entryOffset = 0; entryOffset < block.values.length; entryOffset++)
    void crListReplica.parentMap.delete(block.id + BigInt(entryOffset))
  for (let entryOffset = 0; entryOffset < left.values.length; entryOffset++)
    void crListReplica.parentMap.set(left.id + BigInt(entryOffset), left)
  for (let entryOffset = 0; entryOffset < right.values.length; entryOffset++)
    void crListReplica.parentMap.set(right.id + BigInt(entryOffset), right)

  // Update childrenMap: left takes block's position, right is keyed by its predecessor
  const sibslings = crListReplica.childrenMap.get(block.predecessor)
  if (sibslings) {
    const index = sibslings.indexOf(block)
    if (index !== -1) sibslings[index] = left
  }

  if (crListReplica.cursor === block) crListReplica.cursor = left

  return [left, right]
}
