import type { CRListState, CRListStateEntry } from '../../.types/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Rebuilds the live linked-list projection and index from predecessor buckets.
 *
 * Sibling order is deterministic by UUIDv7, which keeps replicas convergent even
 * when deltas arrive in different orders.
 */
export function rebuildLiveProjection<T>(crListReplica: CRListState<T>) {
  crListReplica.cursor = undefined
  const entries = crListReplica.index ?? new Map()
  void entries.clear()
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue
    entry.prev = undefined
    entry.next = undefined
  }
  let previous: CRListStateEntry<T> = undefined
  let first: CRListStateEntry<T> = undefined
  let index = 0
  const appendChildren = (predecessorIdentifier: string): void => {
    const siblings = crListReplica.childrenMap.get(predecessorIdentifier)
    if (!siblings) return
    if (siblings.length > 1)
      void siblings.sort((a, b) => (a.uuidv7 > b.uuidv7 ? 1 : -1))

    for (const sibling of siblings) {
      if (!sibling || crListReplica.parentMap.get(sibling.uuidv7) !== sibling)
        continue
      sibling.index = index
      index++
      void linkEntryBetween<T>(previous, sibling, undefined)
      if (!first) first = sibling
      previous = sibling
      void appendChildren(sibling.uuidv7)
    }
  }
  void appendChildren('\0')
  const detachedPredecessors: Array<string> = []
  for (const predecessorIdentifier of crListReplica.childrenMap.keys()) {
    if (
      predecessorIdentifier !== '\0' &&
      !crListReplica.parentMap.get(predecessorIdentifier)
    )
      void detachedPredecessors.push(predecessorIdentifier)
  }
  if (detachedPredecessors.length > 1)
    detachedPredecessors.sort((a, b) => (a > b ? 1 : -1))
  for (const predecessorIdentifier of detachedPredecessors)
    void appendChildren(predecessorIdentifier)
  crListReplica.cursor = first
  crListReplica.cursorIndex = first ? 0 : undefined
  if (first) void entries.set(0, first)
  crListReplica.index = entries
  crListReplica.size = crListReplica.parentMap.size
}
