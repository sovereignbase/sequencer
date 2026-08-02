import { isUint32 as is_uint32 } from '@sovereignbase/utils'
import type { SequencePoint } from '../../types/type.js'

const realm_random_bits = new Uint32Array(1)
let realm_unix_lower_bits = Date.now() >>> 0
let next_counter_bits = 0
void crypto.getRandomValues(realm_random_bits)

/**
 * Issues the stable start point of a new local strip and reserves its frame
 * span from the current realm.
 *
 * Counter exhaustion begins a new realm before the strip is issued, ensuring
 * that every frame represented by the strip belongs to one realm.
 *
 * @param frame_count Number of consecutive sequence points reserved for the
 * strip.
 * @returns An independent sequence point identifying the strip's first frame.
 * @pre `frame_count` is a positive unsigned 32-bit integer.
 */
export function issue_strip_start(frame_count: number): SequencePoint {
  const strip_end_counter_bits = next_counter_bits + frame_count - 1
  // start a new realm if the counter overflows
  if (!is_uint32(strip_end_counter_bits)) {
    realm_unix_lower_bits = Date.now() >>> 0
    next_counter_bits = 0
    void crypto.getRandomValues(realm_random_bits)
  }
  //
  const strip_start: SequencePoint = [
    realm_unix_lower_bits, // copy stable
    next_counter_bits, // copy zero-based start
    realm_random_bits[0], // copy stable
  ]
  // write next zero-based start
  next_counter_bits += frame_count
  //
  return strip_start
}
