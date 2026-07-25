import { isUint32 } from '@sovereignbase/utils'
import {
  write_to_strip_start_buffer,
  this_strip_start_buffer,
} from '../wasm/index.js'

const buf = new Uint32Array(4)
crypto.getRandomValues(buf.subarray(0, 3))

export function tick(length: number): void {
  const next = buf[3] + length
  if (!isUint32(next)) {
    crypto.getRandomValues(buf.subarray(0, 3))
    buf[3] = length
  } else {
    buf[3] = next
  }
  void write_to_strip_start_buffer(this_strip_start_buffer, [
    buf[0],
    buf[1],
    buf[2],
    buf[3],
  ])
}
