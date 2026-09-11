/**
 * Runtime validation of transferable Delta entries.
 *
 * @module
 */
import type { Delta } from '../../types/type.js'
import { is_uint32 } from '../is_uint32/index.js'

/**
 * Checks the transferable Delta tuple and unsigned metadata word shape.
 *
 * Projection contains complete twelve-word records. Footage is optional; native
 * merge checks whether the supplied content covers the encoded records.
 *
 * @typeParam T Value represented by a single Frame.
 * @param data Value to validate.
 * @returns Whether `data` has the transferable Delta shape.
 * @remarks This checks the transfer shape only. Native materialization resolves
 * coordinate containment and dependency availability.
 */
export function is_delta<T>(data: unknown): data is Delta<T> {
  if (!Array.isArray(data) || data.length < 1 || data.length > 2) return false

  const [projection, footage] = data as Delta<T>

  return (
    Array.isArray(projection) &&
    projection.length % 12 === 0 &&
    projection.every(is_uint32) &&
    (footage === undefined || Array.isArray(footage))
  )
}
