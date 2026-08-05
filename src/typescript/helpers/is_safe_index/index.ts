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
