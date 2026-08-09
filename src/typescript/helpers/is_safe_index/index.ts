/**
 * Safe-integer validation for Projection range boundaries.
 *
 * @module
 */

/**
 * Determines whether an index falls within the bounds of a given length.
 *
 * @param index Candidate index.
 * @param length Exclusive upper boundary, or inclusive when `allow_end` is true.
 * @param allow_end Whether an index equal to `length` is accepted.
 * Both operands must be non-negative safe integers. This prevents fractional
 * or lossy JavaScript numbers from being truncated at the unsigned Wasm ABI.
 *
 * @returns Whether `index` falls within the selected integer bounds.
 */
export function is_safe_index(
  index: number,
  length: number,
  allow_end = false
): index is number {
  // Validate the integer domain and selected inclusive or exclusive boundary.
  return (
    Number.isSafeInteger(index) &&
    Number.isSafeInteger(length) &&
    index >= 0 &&
    (allow_end ? index <= length : index < length)
  )
}
