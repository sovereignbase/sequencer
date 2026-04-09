import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { insertBetween } from '../insertBetween/index.js'
export function flattenAndLinkTrustedState<T>(
  crListReplica: CRListReplica<T>
): Set<NonNullable<DoublyLinkedListEntry<T>>> {
  crListReplica.cursor = undefined
  const resolvedSiblingPredecessors = new Set<string>()
  const danglingEntries = new Set<NonNullable<DoublyLinkedListEntry<T>>>()
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue
    if (crListReplica.tombstones.has(entry.predecessor))
      danglingEntries.add(entry)
    entry.prev = undefined
    entry.next = undefined
  }
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue
    const originalPredecessorIdentifier = entry.predecessor
    const predecessorIdentifier =
      originalPredecessorIdentifier === '\0' ||
      crListReplica.parentMap.has(originalPredecessorIdentifier)
        ? originalPredecessorIdentifier
        : undefined
    if (predecessorIdentifier === undefined) {
      danglingHeads.add(entry)
      continue
    }
    const isRootPredecessor = predecessorIdentifier === '\0'
    const predecessor = isRootPredecessor
      ? undefined
      : crListReplica.parentMap.get(predecessorIdentifier)

    if (
      !isRootPredecessor &&
      (!predecessor || predecessorIdentifier !== predecessor.uuidv7)
    )
      continue

    if (resolvedSiblingPredecessors.has(predecessorIdentifier)) continue

    const siblings = crListReplica.childrenMap.get(predecessorIdentifier)
    if (!siblings) continue

    if (siblings.length > 1)
      siblings.sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev: DoublyLinkedListEntry<T> = predecessor
    const predecessorNext = prev?.next
    if (siblings.length === 1) {
      const sibling = siblings[0]
      if (danglingHeads.has(sibling)) danglingHeads.delete(sibling)
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
      resolvedSiblingPredecessors.add(predecessorIdentifier)
      crListReplica.cursor = entry
      continue
    }
    const siblingSet = new Set(siblings)
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      const next = siblings[index + 1]
      if (danglingHeads.has(sibling)) danglingHeads.delete(sibling)

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
    resolvedSiblingPredecessors.add(predecessorIdentifier)
    crListReplica.cursor = entry
  }
  crListReplica.size = crListReplica.parentMap.size
  return danglingHeads
}
