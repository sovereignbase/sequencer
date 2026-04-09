import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { insertBetween } from '../insertBetween/index.js'
export function flattenAndLinkTrustedState<T>(crListReplica: CRListReplica<T>) {
  crListReplica.cursor = undefined
  const resolvedSiblingPredecessors = new Set<string>()
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue
    entry.prev = undefined
    entry.next = undefined
  }
  const keys = [...crListReplica.childrenMap.keys()].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  )
  let hasProgress = true
  while (hasProgress) {
    hasProgress = false
    for (const predecessorIdentifier of keys) {
      if (resolvedSiblingPredecessors.has(predecessorIdentifier)) continue
      const siblings = crListReplica.childrenMap.get(predecessorIdentifier)
      if (!siblings) continue

      if (siblings.length > 1)
        siblings.sort((a, b) =>
          a.uuidv7 > b.uuidv7 ? 1 : -1
        )

      const predecessor =
        predecessorIdentifier === '\0'
          ? undefined
          : crListReplica.parentMap.get(predecessorIdentifier)
      if (
        predecessor &&
        !predecessor.prev &&
        !predecessor.next &&
        crListReplica.cursor !== predecessor
      )
        continue
      let prev: DoublyLinkedListEntry<T> = predecessor ?? crListReplica.cursor
      const predecessorNext = predecessor?.next
      if (siblings.length === 1) {
        const sibling = siblings[0]
        insertBetween<T>(prev, sibling, sibling.next)
        prev = sibling
        if (predecessorNext && predecessorNext !== sibling) {
          prev.next = predecessorNext
          predecessorNext.prev = prev
        } else {
          prev.next = undefined
        }
        if (!predecessorNext) crListReplica.cursor = prev
        resolvedSiblingPredecessors.add(predecessorIdentifier)
        hasProgress = true
        continue
      }
      const siblingSet = new Set(siblings)
      for (let index = 0; index < siblings.length; index++) {
        const sibling = siblings[index]
        const next = siblings[index + 1]

        insertBetween<T>(prev, sibling, sibling.next)
        prev = sibling

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
      if (!predecessorNext) crListReplica.cursor = prev
      resolvedSiblingPredecessors.add(predecessorIdentifier)
      hasProgress = true
    }
  }
  crListReplica.size = crListReplica.parentMap.size
}
