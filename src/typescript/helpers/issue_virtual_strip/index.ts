/**
 * Internal Realm state and Virtual Strip issuance for the update operation.
 *
 * @module
 */
import { is_uint32 } from '../is_uint32/index.js'
import { write_strip_to_buffer } from '../../wasm/index.js'
import type { Strip, VirtualStrip } from '../../types/type.js'

/** Mutable storage for the current Realm's random discriminator. */
const realm_random_bits = new Uint32Array(1)

/** Low 32 bits of the Unix timestamp identifying the current Realm. */
let realm_unix_lower_bits = 0

/**
 * Counter assigned to the next unreserved Frame in the current Realm.
 *
 * The exhausted initial value forces the first reservation to initialize a
 * Realm through the normal rotation branch. Realm state is initialized lazily
 * so module evaluation performs no entropy-generating side effects.
 */
let next_counter_bits = 0x1_0000_0000

/**
 * Reserves a contiguous Frame Span and writes its Virtual Strip to the shared
 * WebAssembly transfer buffer.
 *
 * The current Realm supplies consecutive Sequence Points. If the requested
 * Frame Span would exceed the unsigned 32-bit counter range, a new Realm is
 * initialized before the reservation. This ensures that one Frame Span never
 * crosses a Realm boundary.
 *
 * The written buffer lanes contain the Mask state, Frame count, issued Strip
 * start, previous Strip start, and Footage frame index. The Realm counter is
 * advanced by `frame_count` after the transfer.
 *
 * @param is_masked Zero for a visible Strip; nonzero for a Mask.
 * @param frame_count Positive number of consecutive Frames to reserve.
 * @param previous_unix_lower_bits Low Unix-time bits of the previous Strip start.
 * @param previous_counter_bits Counter bits of the previous Strip start.
 * @param previous_random_bits Random discriminator of the previous Strip start.
 * @param footage_frame_index Optional footage index corresponding to the first Frame.
 * @remarks All transferred values must fit within an unsigned 32-bit integer.
 */
export function issue_virtual_strip<T>(
  is_masked: number,
  frame_count: number,
  previous_unix_lower_bits: number,
  previous_counter_bits: number,
  previous_random_bits: number,
  footage_frame_index?: number
): Strip<T>[0] {
  // Resolve the final counter required by this Frame reservation.
  const strip_end_counter_bits = next_counter_bits + frame_count - 1

  // Start or rotate the Realm before its counter would overflow.
  if (!is_uint32(strip_end_counter_bits)) {
    realm_unix_lower_bits = Date.now() >>> 0
    next_counter_bits = 0
    void crypto.getRandomValues(realm_random_bits)
  }
  const meta: VirtualStrip<T> = [
    is_masked,
    frame_count,
    realm_unix_lower_bits,
    next_counter_bits,
    realm_random_bits[0],
    previous_unix_lower_bits,
    previous_counter_bits,
    previous_random_bits,
    footage_frame_index,
  ]

  void write_strip_to_buffer<T>(meta)
  next_counter_bits += frame_count
  delete meta[8]
  return meta as Strip<T>[0]
}
