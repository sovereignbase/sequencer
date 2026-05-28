import type { CRListState, CRListStateEntry } from '../../.types/type.js'

/**
 * Splits a block at offset, returning [left, right].
 *
 * The right block starts at the virtual entry id `block.id + offset`; its
 * predecessor is the left block tail.
 */
export function splitBlock<T>(
  crListReplica: CRListState<T>,
  block: NonNullable<CRListStateEntry<T>>,
  offset: number
): [NonNullable<CRListStateEntry<T>>, NonNullable<CRListStateEntry<T>>] {
  if (offset <= 0 || offset >= block.values.length) return [block, block]

  const rightId = block.id + BigInt(offset)
  const left: NonNullable<CRListStateEntry<T>> = {
    id: block.id,
    idString: block.idString,
    values: block.values.slice(0, offset),
    predecessor: block.predecessor,
    index: block.index,
    prev: block.prev,
    next: undefined,
  }
  const right: NonNullable<CRListStateEntry<T>> = {
    id: rightId,
    idString: rightId.toString(),
    values: block.values.slice(offset),
    predecessor: rightId - 1n,
    index: block.index + offset,
    prev: left,
    next: block.next,
  }
  left.next = right
  if (block.prev) block.prev.next = left
  if (block.next) block.next.prev = right

  for (let entryOffset = 0; entryOffset < block.values.length; entryOffset++)
    void crListReplica.parentMap.delete(block.id + BigInt(entryOffset))
  for (let entryOffset = 0; entryOffset < left.values.length; entryOffset++)
    void crListReplica.parentMap.set(left.id + BigInt(entryOffset), left)
  for (let entryOffset = 0; entryOffset < right.values.length; entryOffset++)
    void crListReplica.parentMap.set(right.id + BigInt(entryOffset), right)

  const siblings = crListReplica.childrenMap.get(block.predecessor)
  if (siblings) {
    const index = siblings.indexOf(block)
    if (index !== -1) siblings[index] = left
  }

  const rightSiblings = crListReplica.childrenMap.get(right.predecessor)
  if (rightSiblings) {
    if (!rightSiblings.includes(right)) void rightSiblings.push(right)
  } else {
    void crListReplica.childrenMap.set(right.predecessor, [right])
  }

  if (crListReplica.cursor === block) crListReplica.cursor = left
  void crListReplica.cache.clear()

  return [left, right]
}
