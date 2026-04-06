import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
type LinkedListEntry<T> = Exclude<DoublyLinkedListEntry<T>, undefined>
export function flattenAndLinkValues<T>(crListReplica: CRListReplica<T>): void {
  crListReplica.size = 0
  const resolvedSiblingPredecessors = new Set<string>()
  for (const entry of Object.values(crListReplica.parentMap)) {
    if (!entry) continue
    if (crListReplica.tombstones.has(entry.uuidv7)) {
      delete crListReplica.parentMap[entry.uuidv7]
      continue
    }
    crListReplica.cursor = entry
    const predecessorIdentifier = entry.predecessor
    const predecessor = crListReplica.parentMap[predecessorIdentifier]

    if (!predecessor || predecessorIdentifier !== predecessor.uuidv7) continue

    let siblings = crListReplica.childrenMap[predecessorIdentifier] as Array<
      LinkedListEntry<T>
    >

    if (!Array.isArray(siblings)) {
      delete crListReplica.childrenMap[predecessorIdentifier]
      continue
    }
    crListReplica.size++
    siblings = siblings.map((sibling) => {
      return crListReplica.parentMap[sibling.uuidv7]
    }) as Array<LinkedListEntry<T>>

    siblings = siblings.filter(
      (sibling) => !crListReplica.tombstones.has(sibling.uuidv7)
    )

    if (resolvedSiblingPredecessors.has(predecessorIdentifier)) continue

    siblings.sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev: LinkedListEntry<T> = predecessor
    const predecessorNext = prev.next
    const siblingSet = new Set(siblings)
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      const next = siblings[index + 1]

      sibling.prev = prev
      prev.next = sibling
      prev = sibling

      while (prev.next && !siblingSet.has(prev.next)) {
        prev = prev.next as LinkedListEntry<T>
      }

      if (next) {
        prev.next = next
        next.prev = prev
      } else if (predecessorNext && !siblingSet.has(predecessorNext)) {
        prev.next = predecessorNext
        predecessorNext.prev = prev
      } else {
        prev.next = undefined
      }
    }
    resolvedSiblingPredecessors.add(predecessorIdentifier)
  }
  if (crListReplica.cursor) crListReplica.size++
}
