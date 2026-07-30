import { isUint32 } from '@sovereignbase/utils'
import {
  write_to_strip_start_buffer,
  this_strip_start_buffer,
} from '../wasm/index.js'
import { SequencePoint } from '../types/type.js'

const buf = new Uint32Array(3)
void crypto.getRandomValues(buf.subarray(0, 1))
buf[1] = Date.now() >>> 0
buf[2] = 0

/**
 * used by updates to get sequence points for the produced strips
 * @param length Strip lenght (how much the sequence has advanced)
 */
export function tick(length: number): void {
  const next = buf[3] + length
  if (!isUint32(next)) {
    void crypto.getRandomValues(buf.subarray(0, 1))
    buf[1] = Date.now() >>> 0
    buf[2] = 0
  } else {
    buf[2] = next
  }
  void write_to_strip_start_buffer(
    this_strip_start_buffer,
    buf as unknown as SequencePoint
  )
}
