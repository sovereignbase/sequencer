import { v7 } from 'uuid'
import {
  validateSnapshotRange,
  wasmModule,
} from '../../../.helpers/index.js'
import type { CRListSnapshot, CRListState } from '../../../.types/type.js'

/**
 * Creates a local CRList replica from an optional snapshot.
 *
 * A snapshot stores blocks, but list operations still target items. During
 * hydration every block is indexed under each contained item id so later
 * item-level reads, writes, deletes, and merges can find the containing block.
 */
export function __create<T>(snapshot?: CRListSnapshot<T>): CRListState<T> {
  // Seed the local UUIDv7 clock with a sortable, replica-unique identifier.
  const clockSeed = new Uint8Array(16)
  void v7(undefined, clockSeed)
  const [a, b, c, d] = new Uint32Array(clockSeed.buffer)
  void wasmModule._add_instance(a, b, c, d)

  // Initialize all mutable indexes before any optional snapshot hydration.
  const replica: CRListState<T> = {
    instanceId: [a, b, c, d],
    clock: 0,
    ranges: [],
    values: [],
  }

  // Non-Array snapshots are ignored so construction remains tolerant.
  if (!Array.isArray(snapshot)) return replica

  for (const range of snapshot) {
    if (!validateSnapshotRange<T>(range)) continue
    const length = range.items?.length ?? range.length ?? 0
    const consumerReference = replica.values.length
    void replica.ranges.push(range)
    if (range.items) void replica.values.push(...range.items)
    void wasmModule._add_range_to(
      length,
      consumerReference,
      range.items ? 0 : 1,
      ...replica.instanceId,
      ...range.id,
      ...range.previousRangeId
    )
  }

  if (replica.ranges.length > 0) void wasmModule._resolve_order_for(a, b, c, d)

  // Return the hydrated mutable replica state.
  return replica
}
