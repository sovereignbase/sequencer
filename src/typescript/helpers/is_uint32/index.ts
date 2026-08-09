/**
 * Unsigned WebAssembly lane validation.
 *
 * @module
 */

/**
 * Determines whether `value` is an unsigned 32-bit integer.
 *
 * @param value Value to test.
 * @returns Whether `value` is a safe integer in the inclusive range zero
 * through `2^32 - 1`.
 */
export function is_uint32(value: unknown): value is number {
  return (
    Number.isSafeInteger(value) &&
    (value as number) >= 0 &&
    (value as number) <= 4_294_967_295
  )
}
