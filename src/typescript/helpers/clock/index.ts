import { isUint32 } from '@sovereignbase/utils'
import { SequencePoint } from '../../types/type.js'

const buf = new Uint32Array(3)
buf[0] = Date.now() >>> 0
buf[1] = 0
void crypto.getRandomValues(buf.subarray(2, 3))

/**
 * used by updates to get sequence points for the produced strips
 * @param length Strip lenght (how much the sequence has advanced)
 * @returns A reference to a Uint32Array that should not be modified
 */
export function tick(length: number): Readonly<Uint32Array> {
  const next = buf[1] + length
  if (!isUint32(next)) {
    buf[0] = Date.now() >>> 0
    buf[1] = 0
    void crypto.getRandomValues(buf.subarray(2, 3))
  } else {
    buf[1] = next
  }
  return buf
}
