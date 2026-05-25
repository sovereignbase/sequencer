import type { CRListState, CRListStateEntry } from '../../.types/type.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Rebuilds the live linked-list projection and index from predecessor buckets.
 *
 * Sibling order is deterministic by bigint id, which keeps replicas convergent
 * even when deltas arrive in different orders.
 */
export function rebuildLiveProjection<T>(crListReplica: CRListState<T>) {
  crListReplica.cursor = undefined
  void crListReplica.cache.clear()

  // Reset links; deduplicate since parentMap has N entries per block
  const seen = new Set<bigint>()
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry || seen.has(entry.id)) continue
    void seen.add(entry.id)
    entry.prev = undefined
    entry.next = undefined
  }

  let previous: CRListStateEntry<T> = undefined
  let first: CRListStateEntry<T> = undefined
  let index = 0
  const appended = new Set<bigint>()

  const appendChildren = (predecessorId: bigint): void => {
    const stack: Array<{
      predecessorId: bigint
      siblingIndex: number
      siblings?: Array<NonNullable<CRListStateEntry<T>>>
    }> = [{ predecessorId, siblingIndex: 0 }]

    while (stack.length > 0) {
      const frame = stack[stack.length - 1]

      if (!frame.siblings) {
        frame.siblings = crListReplica.childrenMap.get(frame.predecessorId)
        if (!frame.siblings) {
          void stack.pop()
          continue
        }
        if (frame.siblings.length > 1)
          void frame.siblings.sort((a, b) => (a.id > b.id ? 1 : -1))
      }

      if (frame.siblingIndex >= frame.siblings.length) {
        void stack.pop()
        continue
      }

      const sibling = frame.siblings[frame.siblingIndex]
      frame.siblingIndex++
      if (!sibling) continue
      if (appended.has(sibling.id)) continue
      if (crListReplica.parentMap.get(sibling.id) !== sibling) continue

      void appended.add(sibling.id)
      sibling.index = index
      index += sibling.values.length
      void linkEntryBetween<T>(previous, sibling, undefined)
      if (!first) first = sibling
      previous = sibling

      // Push children for each element id in this block (handles mid-block insertions)
      for (
        let entryOffset = sibling.values.length - 1;
        entryOffset >= 0;
        entryOffset--
      ) {
        void stack.push({
          predecessorId: sibling.id + BigInt(entryOffset),
          siblingIndex: 0,
        })
      }
    }
  }

  void appendChildren(0n)

  const detachedPredecessors: Array<bigint> = []
  for (const predecessorId of crListReplica.childrenMap.keys()) {
    if (predecessorId !== 0n && !crListReplica.parentMap.get(predecessorId))
      void detachedPredecessors.push(predecessorId)
  }
  if (detachedPredecessors.length > 1)
    void detachedPredecessors.sort((a, b) => (a > b ? 1 : -1))

  for (const predecessorId of detachedPredecessors)
    void appendChildren(predecessorId)

  crListReplica.cursor = first
  crListReplica.cursorIndex = first ? 0 : undefined
  if (first) void crListReplica.cache.set(0, first)
  crListReplica.size = crListReplica.parentMap.size
}
