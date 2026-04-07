import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
export function flattenAndLinkTrustedState<T>(
  crListReplica: CRListReplica<T>
): void {
  crListReplica.size = 0
  const resolvedSiblingPredecessors = new Set<string>()
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue
    const predecessorIdentifier = entry.predecessor
    const isRootPredecessor =
      predecessorIdentifier === '\0' ||
      crListReplica.tombstones.has(predecessorIdentifier)
    const predecessor = isRootPredecessor
      ? undefined
      : crListReplica.parentMap.get(predecessorIdentifier)

    if (
      !isRootPredecessor &&
      (!predecessor || predecessorIdentifier !== predecessor.uuidv7)
    )
      continue

    const siblings = crListReplica.childrenMap.get(predecessorIdentifier)

    if (!siblings || resolvedSiblingPredecessors.has(predecessorIdentifier))
      continue

    siblings.sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev: DoublyLinkedListEntry<T> = predecessor
    const predecessorNext = prev?.next
    const siblingSet = new Set(siblings)
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      const next = siblings[index + 1]

      sibling.prev = prev
      if (prev) prev.next = sibling
      prev = sibling

      while (prev.next && !siblingSet.has(prev.next)) {
        prev = prev.next
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
    crListReplica.cursor = entry
  }
  crListReplica.size = crListReplica.parentMap.size
}
