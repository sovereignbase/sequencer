import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'

export function resolveSiblingOrdering<T>(crListReplica: CRListReplica<T>) {
  for (const siblingsSet of Object.values(
    crListReplica.seenPredecessorIdentifiersAndTheirEntries
  )) {
    let currCursor: DoublyLinkedListEntry<T>
    let prevCursor: DoublyLinkedListEntry<T>
    let nextAfterSiblings: DoublyLinkedListEntry<T>
    const siblings = Array.from(siblingsSet)
      .filter((entry) => entry !== undefined)
      .sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    const first = siblings[0]
    if (first === undefined) continue
    currCursor = first
    prevCursor =
      crListReplica.seenUuidV7IdentifiersAndTheirEntry[first.predecessor]
    if (prevCursor === undefined) continue
    nextAfterSiblings = prevCursor.next

    for (const sibling of siblings) {
      currCursor = sibling
      currCursor.prev = prevCursor
      currCursor.predecessor = prevCursor.uuidv7
      prevCursor.next = currCursor
      prevCursor = currCursor
    }
    currCursor.next = nextAfterSiblings
  }
}
