import type { Acknowledgement, Delta } from '../../types/type.js'
import { is_uint32 } from '../is_uint32/index.js'

export function is_delta<T>(data: unknown): data is Delta<T> {
  if (!Array.isArray(data) || (data.length !== 8 && data.length !== 9))
    return false
  for (let index = 0; index < 8; ++index)
    if (!is_uint32(data[index])) return false
  const type = data[0]
  const length = data[2]
  return (
    (type === 1 && Array.isArray(data[8]) && data[8].length === length) ||
    (type === 2 && data[8] === undefined)
  )
}

export function is_acknowledgement(data: unknown): data is Acknowledgement {
  if (
    (!Array.isArray(data) && !(data instanceof Uint32Array)) ||
    data.length % 2 !== 1
  )
    return false
  for (let index = 0; index < data.length; ++index)
    if (!is_uint32(data[index])) return false
  return true
}
