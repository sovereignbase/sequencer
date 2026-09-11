/**
 * Runtime validation of transferable Delta entries.
 *
 * @module
 */
import type { Delta } from '../../types/type.js'
import { is_uint32 } from '../is_uint32/index.js'

/**
 * Checks whether an unknown value has the transferable `Strip<T>` tuple shape.
 *
 * A valid Strip contains nine unsigned 32-bit metadata words and a positive
 * Frame count. Visible Strips carry equally long, non-empty Footage; Masks omit
 * Footage because they address existing Frames.
 *
 * @typeParam T Value represented by a single Frame.
 * @param data Value to validate.
 * @returns Whether `data` is structurally valid as a `Strip<T>`.
 * @remarks This checks the transfer shape only. Native materialization resolves
 * coordinate containment and dependency availability.
 */
export function is_delta<T>(data: unknown): data is Delta<T> {
  if (!Array.isArray(data) || data.length < 1 || data.length > 2) return false

  const [projection, footage] = data as Delta<T>

  return (
    Array.isArray(projection) &&
    projection.length !== 0 &&
    data.length % 10 === 0 &&
    projection.every(is_uint32) &&
    Array.isArray(footage)
  )
}
