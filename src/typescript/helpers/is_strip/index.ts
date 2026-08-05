import { isUint32 as is_uint32 } from '@sovereignbase/utils'
import type { Strip } from '../../types/type.js'

/**
 * Checks whether an unknown value has the transferable `Strip<T>` tuple shape.
 *
 * A valid Strip contains:
 * - an eight-entry metadata tuple of unsigned 32-bit integers
 * - optionally, a non-empty Footage array
 *
 * The exact Footage length is validated by the consuming operation because
 * visible Strips and Masks have different Footage requirements.
 *
 * @typeParam T Value represented by a single Frame.
 * @param data Value to validate.
 * @returns Whether `data` is structurally valid as a `Strip<T>`.
 */
export function is_strip<T>(data: unknown): data is Strip<T> {
  if (!Array.isArray(data) || data.length < 1 || data.length > 2) {
    return false
  }

  const meta = data[0]

  if (
    !Array.isArray(meta) ||
    meta.length !== 8 ||
    !is_uint32(meta[0]) ||
    !is_uint32(meta[1]) ||
    !is_uint32(meta[2]) ||
    !is_uint32(meta[3]) ||
    !is_uint32(meta[4]) ||
    !is_uint32(meta[5]) ||
    !is_uint32(meta[6]) ||
    !is_uint32(meta[7])
  ) {
    return false
  }

  const footage = data[1]

  return footage === undefined || (Array.isArray(footage) && footage.length > 0)
}
