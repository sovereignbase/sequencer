import { isUuidV7 } from '@sovereignbase/utils'
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
    if (
      crListReplica.tombstones.has(entry.uuidv7) ||
      !isUuidV7(entry.uuidv7) ||
      (entry.predecessor !== '\0' && !isUuidV7(entry.predecessor))
    ) {
      delete crListReplica.parentMap[entry.uuidv7]
      continue
    }
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
      LinkedListEntry<T>
    >

    if (!Array.isArray(siblings)) {
      delete crListReplica.childrenMap[predecessorIdentifier]
      continue
    }
    siblings = siblings.map((sibling) => {
      return crListReplica.parentMap[sibling.uuidv7]
    }) as Array<LinkedListEntry<T>>

    siblings = siblings.filter(
      (sibling) => sibling && !crListReplica.tombstones.has(sibling.uuidv7)
    )

    if (resolvedSiblingPredecessors.has(predecessorIdentifier)) continue

    siblings.sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev: DoublyLinkedListEntry<T> = predecessor
    const predecessorNext = prev?.next
    const siblingSet = new Set(siblings)
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      const next = siblings[index + 1]

      sibling.prev = prev
      if (prev) prev.next = sibling
      let tail: LinkedListEntry<T> = sibling

      while (tail.next && !siblingSet.has(tail.next)) {
        tail = tail.next as LinkedListEntry<T>
      }

      if (next) {
        tail.next = next
        next.prev = tail
      } else if (predecessorNext && !siblingSet.has(predecessorNext)) {
        tail.next = predecessorNext
        predecessorNext.prev = tail
      } else {
        tail.next = undefined
      }
      prev = tail
    }
    resolvedSiblingPredecessors.add(predecessorIdentifier)
    crListReplica.cursor = entry
  }
  crListReplica.size = Object.keys(crListReplica.parentMap).length
}
