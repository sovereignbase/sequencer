import { validateSnapshotRange, wasmModule } from '../../../.helpers/index.js'
import type {
  CRListChange,
  CRListDelta,
  CRListState,
} from '../../../.types/type.js'

/**
 * Merges a remote CRList delta into the local replica.
 *
 * @param replica - Replica to mutate.
 * @param delta - Remote gossip delta.
 * @param collectChange - Whether to materialize an index-keyed visible patch.
 * @returns - A minimal local change patch, or `false` when the delta is ignored.
 */
export function __merge<T>(
  replica: CRListState<T>,
  delta: CRListDelta<T>,
  collectChange = true
): CRListChange<T> | false {
  // Ignore malformed deltas; merge is intentionally tolerant at the boundary.
  if (!Array.isArray(delta)) return false

  const change: CRListChange<T> | undefined = collectChange ? {} : undefined
  let changed = false
  const applyRange = (
    range: CRListDelta<T>[number],
    consumerReference: number
  ): boolean => {
    const length = range.items?.length ?? range.length ?? 0
    const index =
      wasmModule._applyRemote(
        length,
        range.items ? 0 : 1,
        consumerReference,
        ...replica.instanceId,
        ...range.id,
        ...range.previousRangeId
      ) >>> 0
    if (index === 4_294_967_295) return false

    changed = true
    if (!change) return true
    if (!range.items) {
      for (let offset = 0; offset < length; offset++)
        change[index + offset] = undefined
      return true
    }
    for (let offset = 0; offset < range.items.length; offset++)
      change[index + offset] = range.items[offset]
    return true
  }

  for (const range of delta) {
    if (!validateSnapshotRange<T>(range)) continue

    const consumerReference = replica.values.length
    if (range.items) void replica.values.push(...range.items)
    if (!applyRange(range, consumerReference))
      void replica.pending.push({ range, consumerReference })
  }

  for (let index = 0; index < replica.pending.length; ) {
    const pending = replica.pending[index]
    if (applyRange(pending.range, pending.consumerReference)) {
      void replica.pending.splice(index, 1)
      index = 0
    } else {
      index++
    }
  }

  if (!changed || !change) return false

  // Return the minimal visible patch produced by this merge.
  return change
}
