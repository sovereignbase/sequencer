/**
 * Structural guards and narrow arithmetic helpers shared by TypeScript
 * algorithms.
 *
 * @module
 */
import { isUint32 as is_uint32 } from '@sovereignbase/utils'
import type { SequenceCoordinate, SequencePoint, Strip } from '../types/type.js'

/**
 * Determines whether an unknown value is a transferable Sequence Point.
 *
 * This structural check validates the three unsigned 32-bit lanes only. It
 * deliberately accepts the reserved Root because Root is represented by the
 * same tuple type.
 *
 * @param data Value to inspect without mutation.
 * @returns Whether `data` is a structurally valid Sequence Point.
 */
export function is_sequence_point(data: unknown): data is SequencePoint {
  // Validate tuple width and every unsigned lane.
  return Array.isArray(data) && data.length === 3 && data.every(is_uint32)
}

/**
 * Determines whether an unknown value is a transferable Sequence Coordinate.
 *
 * @param data Value to inspect without mutation.
 * @returns Whether `data` contains valid previous and current Sequence Points.
 */
export function is_sequence_coordinate(
  data: unknown
): data is SequenceCoordinate {
  // Validate coordinate shape before reading its points.
  if (!Array.isArray(data) || data.length !== 2) return false

  const [previous_strip_start, this_strip_start] = data

  // Validate both stable Sequence Points.
  return (
    is_sequence_point(previous_strip_start) &&
    is_sequence_point(this_strip_start)
  )
}

/**
 * Determines whether an unknown value has the transferable Strip shape.
 *
 * Footage length is validated by the operation consuming the Strip because a
 * visible Strip and a Mask have different Footage requirements.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param data Value to inspect without mutation.
 * @returns Whether `data` is a structurally valid Strip tuple.
 */
export function is_strip<T>(data: unknown): data is Strip<T> {
  // Validate transferable tuple shape before destructuring.
  if (!Array.isArray(data)) return false
  const [is_masked, frame_count, coordinate, footage, is_pending] =
    data as Strip<T>

  // Validate visibility, Frame Span, coordinate, and optional Footage.
  return (
    (is_masked === 0 ||
      is_masked === 1 ||
      is_masked === 3 ||
      is_masked === 5 ||
      is_masked === 7) &&
    is_uint32(frame_count) &&
    frame_count > 0 &&
    is_sequence_coordinate(coordinate) &&
    (footage === undefined || (Array.isArray(footage) && footage.length > 0)) &&
    (is_pending === undefined || is_pending === 1)
  )
}

/**
 * Determines whether a value is a valid zero-based index for a given length.
 *
 * @param length Non-negative collection length defining the upper boundary.
 * @param position Candidate index.
 * @param allow_end Whether the boundary immediately after the final value is
 * accepted.
 * @returns Whether `position` is a safe integer inside the selected bounds.
 */
export function is_safe_index(
  length: number,
  position: unknown,
  allow_end = false
): position is number {
  // Validate the integer domain and selected inclusive or exclusive boundary.
  return (
    Number.isSafeInteger(position) &&
    (position as number) >= 0 &&
    (allow_end ? (position as number) <= length : (position as number) < length)
  )
}

// Re-export the internal point issuer used only by update.
/** Issues stable Strip starts from the current Realm. */
export { issue_strip_start } from './issue_strip_start/index.js'
