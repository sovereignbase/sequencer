import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'

export function assertListIndices<T>(
  crListReplica: CRListReplica<T>,
  danglingHeads: Array<NonNullable<DoublyLinkedListEntry<T>>> = []
): void {
  let danglingIndex = 0
  if (!crListReplica.cursor) return
  while (crListReplica.cursor.prev)
    crListReplica.cursor = crListReplica.cursor.prev

  if (danglingHeads.length > 1) {
    danglingHeads.sort((a, b) =>
      a.predecessor === b.predecessor
        ? a.uuidv7.localeCompare(b.uuidv7)
        : a.predecessor.localeCompare(b.predecessor)
    )
  }

  for (let i = 0; i < crListReplica.size; i++) {
    if (!crListReplica.cursor) return
    let dangling = danglingHeads[danglingIndex]
    if (dangling === crListReplica.cursor) {
      danglingIndex++
      dangling = danglingHeads[danglingIndex]
    }
    if (dangling && dangling.predecessor < crListReplica.cursor.predecessor) {
      dangling.prev = crListReplica.cursor.prev
      if (dangling.prev) dangling.prev.next = dangling
      crListReplica.cursor.prev = dangling
      dangling.next = crListReplica.cursor
      dangling.index = i
      danglingIndex++
      continue
    }

    crListReplica.cursor.index = i
    if (crListReplica.cursor.next === undefined) break
    crListReplica.cursor = crListReplica.cursor.next
  }
}
