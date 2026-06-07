import { wasmModule } from '../../../.helpers/index.js'
import type {
  CRListSnapshot,
  CRListState,
  Uint32UuidV7,
} from '../../../.types/type.js'

/**
 * Creates a full CRList snapshot from the current replica state.
 *
 * Each block emits one snapshot block with all contained items. Item payloads
 * are live references.
 *
 * @param replica - Replica to snapshot.
 * @returns - A full snapshot suitable for hydration or transport.
 */
export function __snapshot<T>(replica: CRListState<T>): CRListSnapshot<T> {
  const snapshot: CRListSnapshot<T> = []
  let visibleIndex = 0
  const rangeAmount = wasmModule._get_range_amount(...replica.instanceId)
  const idOf = (rangeIndex: number, previousFlag: number): Uint32UuidV7 => [
    wasmModule._get_range_id(rangeIndex, previousFlag, 0, ...replica.instanceId) >>>
      0,
    wasmModule._get_range_id(rangeIndex, previousFlag, 1, ...replica.instanceId) >>>
      0,
    wasmModule._get_range_id(rangeIndex, previousFlag, 2, ...replica.instanceId) >>>
      0,
    wasmModule._get_range_id(rangeIndex, previousFlag, 3, ...replica.instanceId) >>>
      0,
  ]

  for (let rangeIndex = 0; rangeIndex < rangeAmount; rangeIndex++) {
    const length = wasmModule._get_range_length(rangeIndex, ...replica.instanceId)
    const previousRangeId = idOf(rangeIndex, 1)

    if (wasmModule._get_range_deleted(rangeIndex, ...replica.instanceId)) {
      snapshot.push({
        id: idOf(rangeIndex, 0),
        items: undefined,
        length,
        previousRangeId,
      })
      continue
    }

    snapshot.push({
      id: idOf(rangeIndex, 0),
      items: Array.from(
        { length },
        (_, offset) =>
          replica.values[
            wasmModule._get_consumer_reference_of(
              visibleIndex + offset,
              ...replica.instanceId
            )
          ]
      ),
      previousRangeId,
    })
    visibleIndex += length
  }

  return snapshot
}
