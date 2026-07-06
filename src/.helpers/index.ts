import type {
  CRListSnapshotRange,
  CRListState,
  Uint32UuidV7,
} from '../.types/type.js'
import createModule, { type MainModule } from '../../wasm/dist/crlist_wasm.mjs'

// Lets make well type helper wrappers that do the buffer reads and possible writes etc. so the rest of the typescript has a nice DX

export const projector = createModule() as unknown as MainModule

const timecode_buffer_pointer = wasm._timecode_buffer_pointer()
const timecode_buffer = wasm.HEAPU32.subarray(
  timecode_buffer_pointer >>> 2,
  (timecode_buffer_pointer >>> 2) + 4
)

const previous_timecode_buffer_pointer =
  wasm._previous_timecode_buffer_pointer()
const previous_timecode_buffer = wasm.HEAPU32.subarray(
  previous_timecode_buffer_pointer >>> 2,
  (previous_timecode_buffer_pointer >>> 2) + 4
)

export function isSafeIndex(
  index: unknown,
  length: number,
  allowEnd = false
): index is number {
  return (
    Number.isSafeInteger(index) &&
    (index as number) >= 0 &&
    (allowEnd ? (index as number) <= length : (index as number) < length)
  )
}

function projectionRangeId(
  replica: CRListState<unknown>,
  rangeIndex: number,
  previousFlag = 0
): Uint32UuidV7 {
  return [
    wasmModule._get_range_id(
      rangeIndex,
      previousFlag,
      0,
      ...replica.instanceId
    ) >>> 0,
    wasmModule._get_range_id(
      rangeIndex,
      previousFlag,
      1,
      ...replica.instanceId
    ) >>> 0,
    wasmModule._get_range_id(
      rangeIndex,
      previousFlag,
      2,
      ...replica.instanceId
    ) >>> 0,
    wasmModule._get_range_id(
      rangeIndex,
      previousFlag,
      3,
      ...replica.instanceId
    ) >>> 0,
  ]
}

export function getRangeIdAtIndex(
  replica: CRListState<unknown>,
  targetIndex: number
): Uint32UuidV7 {
  let index = 0
  const rangeAmount = wasmModule._get_range_amount(...replica.instanceId)
  for (let rangeIndex = 0; rangeIndex < rangeAmount; rangeIndex++) {
    const length = wasmModule._get_range_length(
      rangeIndex,
      ...replica.instanceId
    )
    if (wasmModule._get_range_deleted(rangeIndex, ...replica.instanceId))
      continue
    if (targetIndex < index + length)
      return idAtTick(
        projectionRangeId(replica, rangeIndex),
        targetIndex - index
      )
    index += length
  }
  return [0, 0, 0, 0]
}

export function getPreviousRangeId(
  replica: CRListState<unknown>,
  targetIndex: number
): Uint32UuidV7 {
  return targetIndex <= 0
    ? [0, 0, 0, 0]
    : getRangeIdAtIndex(replica, targetIndex - 1)
}

export function snapshotRangeEnd(
  range: CRListSnapshotRange<unknown>
): Uint32UuidV7 {
  return idAtTick(range.id, (range.items?.length ?? range.length ?? 1) - 1)
}

export function validateSnapshotRange<T>(
  range: unknown
): range is CRListSnapshotRange<T> {
  if (!range || typeof range !== 'object') return false
  const candidate = range as Partial<CRListSnapshotRange<T>>
  const length = candidate.items?.length ?? candidate.length ?? 0
  return (
    validateUint32UuidV7(candidate.id) &&
    validateUint32UuidV7(candidate.previousRangeId) &&
    (Array.isArray(candidate.items) || candidate.items === undefined) &&
    isUint32(length) &&
    length > 0
  )
}

export function generateSnapshotRange<T>(
  replica: CRListState<T>,
  items: Array<T> | undefined,
  previousRangeId: Uint32UuidV7,
  length = items?.length ?? 0,
  id?: Uint32UuidV7
): CRListSnapshotRange<T> {
  const generated = id === undefined
  const rangeId = id ?? idAtTick(replica.instanceId, replica.clock)
  const range = items
    ? {
        id: rangeId,
        items,
        previousRangeId,
      }
    : {
        id: rangeId,
        items,
        length,
        previousRangeId,
      }
  if (generated) replica.clock += length
  return range
}
