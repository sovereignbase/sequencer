/**
 * Internal Realm state and Sequence Point reservation used exclusively by the
 * update operation.
 *
 * @module
 */
import { isUint32 as is_uint32 } from '@sovereignbase/utils'
import type { SequencePoint } from '../../types/type.js'

/** Mutable one-word storage for the current Realm's random discriminator. */
const realm_random_bits = new Uint32Array(1)

/** Unix component shared by Sequence Points issued from the current Realm. */
let realm_unix_lower_bits = 0

/**
 * Counter of the next unreserved Frame in the current Realm.
 *
 * The exhausted initial value routes the first reservation through the normal
 * Realm rotation branch. Realm initialization cannot run at module scope
 * because Workers runtimes forbid entropy generation during module loading.
 */
let next_counter_bits = 0x1_0000_0000

/**
 * Issues a stable visible Strip start and reserves its complete Frame Span.
 *
 * One module-local Realm supplies consecutive Sequence Points. Each call
 * returns the next available point and advances the Realm counter by the
 * requested Frame count. Counter exhaustion begins a new Realm before the
 * Strip is issued, ensuring that one Frame Span never crosses Realm identity.
 * Only update calls this helper. Masks identify existing Frames and never call
 * it or otherwise issue Sequence Points.
 *
 * @param frame_count Positive number of consecutive Sequence Points to reserve.
 * @returns A new Sequence Point identifying the Strip's first Frame.
 * @remarks `frame_count` must be a positive unsigned 32-bit integer.
 */
export function issue_strip_start(frame_count: number): SequencePoint {
  // Resolve the final counter required by this Frame reservation.
  const strip_end_counter_bits = next_counter_bits + frame_count - 1

  // Start or rotate the Realm before its counter would overflow.
  if (!is_uint32(strip_end_counter_bits)) {
    realm_unix_lower_bits = Date.now() >>> 0
    next_counter_bits = 0
    void crypto.getRandomValues(realm_random_bits)
  }

  // Materialize the first newly reserved Sequence Point.
  const strip_start: SequencePoint = [
    realm_unix_lower_bits,
    next_counter_bits,
    realm_random_bits[0],
  ]

  // Advance the Realm reservation boundary and return the stable Strip start.
  next_counter_bits += frame_count
  return strip_start
}
