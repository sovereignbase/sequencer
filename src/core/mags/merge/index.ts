import {
  validateSnapshotRange,
  wasmModule,
} from '../../../.helpers/index.js'
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

  for (const range of delta) {
    if (!validateSnapshotRange<T>(range)) continue

    const length = range.items?.length ?? range.length ?? 0
    const consumerReference = replica.values.length
    if (range.items) void replica.values.push(...range.items)
    void replica.ranges.push(range)

    const index = wasmModule._applyRemote(
      length,
      range.items ? 0 : 1,
      consumerReference,
      ...replica.instanceId,
      ...range.id,
      ...range.previousRangeId
    )
    if (index === 4_294_967_295) continue

    changed = true
    if (!change) continue
    if (!range.items) {
      for (let offset = 0; offset < length; offset++)
        change[index + offset] = undefined
      continue
    }
    for (let offset = 0; offset < range.items.length; offset++)
      change[index + offset] = range.items[offset]
  }

  if (!changed || !change) return false

  // Return the minimal visible patch produced by this merge.
  return change
}
