import { isUint32, isRecord } from '@sovereignbase/utils'
import type {
  SequencePoint,
  SequenceCoordinate,
  SequenceStrip,
} from '../types/type.js'

export function is_sequence_point(data: unknown): data is SequencePoint {
  return Array.isArray(data) && data.length === 4 && data.every(isUint32)
}

export function is_sequence_coordinate(
  data: unknown
): data is SequenceCoordinate {
  if (!Array.isArray(data) || data.length !== 2) return false

  const [previous_strip_start, this_strip_start] = data

  return (
    is_sequence_point(previous_strip_start) &&
    is_sequence_point(this_strip_start)
  )
}

export function is_sequence_strip<T>(data: unknown): data is SequenceStrip<T> {
  if (!Array.isArray(data)) return false
  const [mask, length, coordinate, footage] = data as SequenceStrip<T>
  return (
    (mask === 1 || mask === 0) &&
    isUint32(length) &&
    is_sequence_coordinate(coordinate) &&
    (footage === undefined || (Array.isArray(footage) && footage.length > 0))
  )
}

export function is_safe_index(
  length: number,
  position: unknown,
  allowEnd = false
): position is number {
  return (
    Number.isSafeInteger(position) &&
    (position as number) >= 0 &&
    (allowEnd ? (position as number) <= length : (position as number) < length)
  )
}
