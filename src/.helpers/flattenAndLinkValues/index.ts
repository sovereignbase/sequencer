import { isUuidV7 } from '@sovereignbase/utils'
import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
export function flattenAndLinkValues<T>(crListReplica: CRListReplica<T>): void {
  crListReplica.size = 0
  const resolvedSiblingPredecessors = new Set<string>()
  for (const entry of Object.values(crListReplica.parentMap)) {
    if (!entry) continue
    const predecessorIdentifier = entry.predecessor
    const isRootPredecessor = predecessorIdentifier === '\0'
    const predecessor = isRootPredecessor
      ? undefined
      : crListReplica.parentMap[predecessorIdentifier]

    if (
      !isRootPredecessor &&
      (!predecessor || predecessorIdentifier !== predecessor.uuidv7)
    )
      continue

    let siblings = crListReplica.childrenMap[predecessorIdentifier] as Array<
      NonNullable<DoublyLinkedListEntry<T>>
    >

    if (!Array.isArray(siblings)) continue

    siblings = siblings.map((sibling) => {
      return crListReplica.parentMap[sibling.uuidv7]
    }) as Array<NonNullable<DoublyLinkedListEntry<T>>>

    siblings = siblings.filter((sibling) => sibling)

    if (resolvedSiblingPredecessors.has(predecessorIdentifier)) continue

    siblings.sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev: DoublyLinkedListEntry<T> = predecessor
    const predecessorNext = prev?.next
    const siblingSet = new Set(siblings)
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      const next = siblings[index + 1]

      sibling.prev = prev
      if (!prev) continue
      prev.next = sibling

      while (prev.next && !siblingSet.has(prev.next)) {
        prev = prev.next as NonNullable<DoublyLinkedListEntry<T>>
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
  crListReplica.size = Object.keys(crListReplica.parentMap).length
}
