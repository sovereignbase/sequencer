import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { insertBetween } from '../insertBetween/index.js'
export function flattenAndLinkTrustedState<T>(crListReplica: CRListReplica<T>) {
  crListReplica.cursor = undefined
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue
    entry.prev = undefined
    entry.next = undefined
  }
  const keys = [...crListReplica.childrenMap.keys()].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  )
  for (const predecessorIdentifier of keys) {
    const siblings = crListReplica.childrenMap.get(predecessorIdentifier)
    if (!siblings) continue

    if (siblings.length > 1)
      siblings.sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    const predecessor =
      predecessorIdentifier === '\0'
        ? undefined
        : crListReplica.parentMap.get(predecessorIdentifier)
    let prev: DoublyLinkedListEntry<T> = predecessor ?? crListReplica.cursor
    const predecessorNext = predecessor?.next
    if (siblings.length === 1) {
      const sibling = siblings[0]
      insertBetween<T>(prev, sibling, sibling.next)
      prev = sibling
      while (prev.next && prev.next !== sibling) {
        prev = prev.next
      }
      if (predecessorNext && predecessorNext !== sibling) {
        prev.next = predecessorNext
        predecessorNext.prev = prev
      } else {
        prev.next = undefined
      }
      if (!predecessorNext) crListReplica.cursor = prev
      continue
    }
    const siblingSet = new Set(siblings)
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      const next = siblings[index + 1]

      insertBetween<T>(prev, sibling, sibling.next)
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
    if (!predecessorNext) crListReplica.cursor = prev
  }
  crListReplica.size = crListReplica.parentMap.size
}
