import type {
  Acknowledgement,
  Delta,
  Projection,
} from '../../types/type.js'
import { is_uint32 } from '../is_uint32/index.js'

export function is_delta<T>(data: unknown): data is Delta<T> {
  if (!Array.isArray(data) || (data.length !== 2 && data.length !== 3))
    return false
  if (!is_acknowledgement(data[0]) || !is_projection(data[1])) return false
  let footageLength = 0
  for (let offset = 0; offset < data[1].length; offset += 8)
    if (data[1][offset] === 1) footageLength += data[1][offset + 2]
  return footageLength === 0
    ? data[2] === undefined
    : Array.isArray(data[2]) && data[2].length === footageLength
}

export function is_projection(data: unknown): data is Projection {
  if (
    (!Array.isArray(data) && !(data instanceof Uint32Array)) ||
    data.length === 0 ||
    data.length % 8 !== 0
  )
    return false
  for (let offset = 0; offset < data.length; offset += 8) {
    for (let word = 0; word < 8; ++word)
      if (!is_uint32(data[offset + word])) return false
    const type = data[offset]
    const prefix = data[offset + 1]
    const length = data[offset + 2]
    const time = data[offset + 7]
    if (
      (type !== 1 && type !== 2) ||
      length === 0 ||
      time <= prefix ||
      time - prefix !== length + 1
    )
      return false
  }
  return true
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
