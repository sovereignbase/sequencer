import { isUint32 } from '@sovereignbase/utils'
import {
  write_to_strip_start_buffer,
  this_strip_start_buffer,
} from '../wasm/index.js'
import { SequencePoint } from '../types/type.js'

const buf = new Uint32Array(4)
void crypto.getRandomValues(buf.subarray(0, 3))

/**
 * used by updates to get sequence points for the produced strips
 * @param length
 */
export function tick(length: number): void {
  const next = buf[3] + length
  if (!isUint32(next)) {
    void crypto.getRandomValues(buf.subarray(0, 3))
    buf[3] = length
  } else {
    buf[3] = next
  }
  void write_to_strip_start_buffer(
    this_strip_start_buffer,
    buf as unknown as SequencePoint
  )
}
