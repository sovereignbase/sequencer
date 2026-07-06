import { validateSnapshotRange, wasmModule } from '../../../.helpers/index.js'
import type { CRListSnapshot, CRListState } from '../../../.types/type.js'
import { HLC } from '@sovereignbase/hybrid-logical-clock'

/**
 * Creates a local CRList replica from an optional snapshot.
 *
 * A snapshot stores blocks, but list operations still target items. During
 * hydration every block is indexed under each contained item id so later
 * item-level reads, writes, deletes, and merges can find the containing block.
 */
export function __create<T>(snapshot?: CRListSnapshot<T>): CRListState<T> {
  // Initialize all mutable indexes before any optional snapshot hydration.
  const replica: CRListState<T> = {
    id: wasmModule.cue()
    clock: new HLC(),
    footage: [],
  }

  

  // Non-Array snapshots are ignored so construction remains tolerant.
  if (!Array.isArray(snapshot)) return replica

  const applyRange = (
    range: CRListSnapshot<T>[number],
    consumerReference: number
  ): boolean => {
    const length = range.items?.length ?? range.length ?? 0
    return (
      wasmModule._applyRemote(
        length,
        range.items ? 0 : 1,
        consumerReference,
        ...replica.instanceId,
        ...range.id,
        ...range.previousRangeId
      ) >>>
        0 !==
      4_294_967_295
    )
  }

  for (const range of snapshot) {
    if (!validateSnapshotRange<T>(range)) continue
    const length = range.items?.length ?? range.length ?? 0
    const consumerReference = replica.values.length
    if (range.items) void replica.values.push(...range.items)
    if (range.pending) {
      void replica.pending.push({ range, consumerReference })
      continue
    }
    void wasmModule._add_range_to(
      length,
      consumerReference,
      range.items ? 0 : 1,
      ...replica.instanceId,
      ...range.id,
      ...range.previousRangeId
    )
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

  // Return the hydrated mutable replica state.
  return replica
}
