import type {
  CRListSnapshotRange,
  CRListState,
  Uint32UuidV7,
} from '../.types/type.js'
import createModule, { type MainModule } from '../../wasm/dist/crlist_wasm.mjs'

export const wasmModule = createModule() as unknown as MainModule

function isUint32(part: unknown): part is number {
  return (
    Number.isSafeInteger(part) &&
    (part as number) >= 0 &&
    (part as number) <= 4_294_967_295
  )
}

export function validateUint32UuidV7(value: unknown): value is Uint32UuidV7 {
  return Array.isArray(value) && value.length === 4 && value.every(isUint32)
}

export function isSafeIndex(
  index: unknown,
  liveAmount: number,
  allowEnd = false
): index is number {
  return (
    Number.isSafeInteger(index) &&
    (index as number) >= 0 &&
    (allowEnd
      ? (index as number) <= liveAmount
      : (index as number) < liveAmount)
  )
}

export function idAtTick(id: Uint32UuidV7, tick: number): Uint32UuidV7 {
  // Add the local clock tick to the lowest uint32 lane.
  let next = id[3] + tick
  // Keep only the low 32 bits for lane d.
  const d = next >>> 0
  // Add d's overflow carry into lane c.
  next = id[2] + Math.floor(next / 4_294_967_296)
  // Keep only the low 32 bits for lane c.
  const c = next >>> 0
  // Add c's overflow carry into lane b.
  next = id[1] + Math.floor(next / 4_294_967_296)
  // Keep only the low 32 bits for lane b.
  const b = next >>> 0
  // Add b's overflow carry into lane a.
  next = id[0] + Math.floor(next / 4_294_967_296)
  // Return the four uint32 lanes after advancing by tick.
  return [next >>> 0, b, c, d]
}

export function compareUint32UuidV7(
  left: Uint32UuidV7,
  right: Uint32UuidV7
): number {
  for (let index = 0; index < 4; index++) {
    if (left[index] < right[index]) return -1
    if (left[index] > right[index]) return 1
  }
  return 0
}

export function distanceBetweenUint32UuidV7(
  left: Uint32UuidV7,
  right: Uint32UuidV7
): number {
  let borrow = 0
  const distance = [0, 0, 0, 0]

  for (let index = 3; index >= 0; index--) {
    let part = right[index] - left[index] - borrow
    if (part < 0) {
      part += 4_294_967_296
      borrow = 1
    } else {
      borrow = 0
    }
    distance[index] = part
  }

  return distance[3]
}

export function snapshotRangeEnd(
  range: CRListSnapshotRange<unknown>
): Uint32UuidV7 {
  return idAtTick(range.id, (range.items?.length ?? range.length ?? 1) - 1)
}

export function getPreviousRangeId<T>(
  replica: CRListState<T>,
  index: number
): Uint32UuidV7 {
  if (index <= 0) return [0, 0, 0, 0]

  const consumerReference = wasmModule._get_consumer_reference_of(
    index - 1,
    ...replica.instanceId
  )
  let valueOffset = 0

  for (const range of replica.ranges) {
    if (!range.items) continue
    const nextOffset = valueOffset + range.items.length
    if (consumerReference < nextOffset)
      return idAtTick(range.id, consumerReference - valueOffset)
    valueOffset = nextOffset
  }

  return [0, 0, 0, 0]
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
  length = items?.length ?? 0
): CRListSnapshotRange<T> {
  const range = items
    ? {
        id: idAtTick(replica.instanceId, replica.clock),
        items,
        previousRangeId,
      }
    : {
        id: idAtTick(replica.instanceId, replica.clock),
        items,
        length,
        previousRangeId,
      }
  replica.clock += length
  return range
}
