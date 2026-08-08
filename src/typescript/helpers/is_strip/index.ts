import type { Strip } from '../../types/type.js'
import { is_uint32 } from '../is_uint32/index.js'

/**
 * Checks whether an unknown value has the transferable `Strip<T>` tuple shape.
 *
 * A valid Strip contains an eight-entry metadata tuple of unsigned 32-bit
 * integers. When `meta[0]` is zero, Footage must be absent. Otherwise, Footage
 * must be a non-empty array whose length matches the Frame count in `meta[1]`.
 *
 * @typeParam T Value represented by a single Frame.
 * @param data Value to validate.
 * @returns Whether `data` is structurally valid as a `Strip<T>`.
 */
export function is_strip<T>(data: unknown): data is Strip<T> {
  if (!Array.isArray(data) || data.length < 1 || data.length > 2) return false

  const meta = data[0]
  const footage = data[1]

  return (
    Array.isArray(meta) &&
    meta.length === 8 &&
    is_uint32(meta[0]) &&
    is_uint32(meta[1]) &&
    is_uint32(meta[2]) &&
    is_uint32(meta[3]) &&
    is_uint32(meta[4]) &&
    is_uint32(meta[5]) &&
    is_uint32(meta[6]) &&
    is_uint32(meta[7]) &&
    is_uint32(meta[8]) &&
    ((meta[0] === 0 && footage === undefined) ||
      (Array.isArray(footage) &&
        footage.length > 0 &&
        footage.length === meta[2]))
  )
}
