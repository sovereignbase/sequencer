#pragma once

#include "../types/sequence.hpp"
#include <cstdint>

/**
 * @brief Mask a range contained entirely within one visible strip.
 *
 * The containing strip is transformed according to the mask position:
 *
 * @code
 * Full:    [ source ]          -> [ masked source ]
 * Start:   [ source ]          -> [ masked source ][ suffix ]
 * End:     [ source ]          -> [ prefix ][ mask ]
 * Middle:  [ source ]          -> [ prefix ][ mask ][ suffix ]
 * @endcode
 *
 * The existing source start key is always retained. When masking begins at
 * offset zero, that existing entry becomes the masked part; this avoids
 * leaving an obsolete source key in StripIndex, which currently has no erase
 * operation. Otherwise the incoming mask becomes a separate linked entry.
 *
 * Any suffix start is derived by advancing the source point's counter by the
 * mask end offset. Its footage position advances by the same amount. The tail
 * of the replacement chain is connected to the original successor, or becomes
 * the sequence's new last strip when no successor exists.
 *
 * The function subtracts exactly masked_strip.length from sequence.length.
 * It does not move the gate: the entry at the original start remains the first
 * replacement part, so an existing gate key continues to identify that part.
 *
 * @param sequence Sequence containing the strip.
 * @param containing_strip Visible strip containing the complete mask range.
 * @param offset Mask start offset within containing_strip.
 * @param masked_strip Incoming mask operation. Its links and footage position
 * are normalized when it becomes a separate middle or trailing piece.
 *
 * @pre sequence and containing_strip are non-null.
 * @pre offset + masked_strip.length is at most containing_strip->length.
 * @pre masked_strip.mask is non-zero and containing_strip is visible.
 * @pre The source counter plus the mask end offset fits in std::uint32_t.
 * @note Full and start-aligned masks reuse the containing strip entry; the
 * incoming mask's own start key is therefore not inserted in those branches.
 * @complexity A constant number of StripIndex operations and O(1) auxiliary
 * space, excluding storage allocated by newly indexed pieces.
 */
inline void mask_strip(SequenceState *sequence,
                       const StripOfSequence *containing_strip,
                       const std::uint32_t offset,
                       StripOfSequence masked_strip) noexcept {
  // Preserve the source state because subsequent index updates may replace its
  // indexed entry. The original successor is needed when reconnecting the tail.
  StripOfSequence original = *containing_strip;
  const PointInSequence next_start = original.next_strip_start;

  // Fast path: no splitting or new index entry is required for full coverage.
  if (offset == 0 && masked_strip.length == original.length) {
    original.mask = 1;
    sequence->length -= original.length;
    sequence->index.set(original.this_strip_start, original);
    return;
  }

  // `mask_end` partitions the source into an optional prefix, the mask, and an
  // optional suffix. Containment validation guarantees non-negative lengths.
  const std::uint32_t mask_end = offset + masked_strip.length;
  const std::uint32_t suffix_length = original.length - mask_end;
  PointInSequence suffix_start = original.this_strip_start;
  suffix_start.counter_bits += mask_end;

  // Only visible frames disappear; all resulting pieces remain linked.
  sequence->length -= masked_strip.length;

  if (offset == 0) {
    // Start-aligned partial mask: reuse the source entry as the masked prefix
    // and create one visible suffix at the first unmasked sequence point.
    StripOfSequence suffix = original;
    suffix.length = suffix_length;
    suffix.footage_position += mask_end;
    suffix.this_strip_start = suffix_start;
    suffix.previous_strip_start = original.this_strip_start;

    original.mask = 1;
    original.length = masked_strip.length;
    original.next_strip_start = suffix_start;

    sequence->index.set(original.this_strip_start, original);
    sequence->index.set(suffix_start, suffix);
  } else {
    // End-aligned and middle masks retain a visible source prefix. The incoming
    // mask follows it and points either to a suffix or the original successor.
    StripOfSequence prefix = original;
    prefix.length = offset;
    prefix.next_strip_start = masked_strip.this_strip_start;

    masked_strip.mask = 1;
    masked_strip.footage_position = original.footage_position + offset;
    masked_strip.previous_strip_start = original.this_strip_start;
    masked_strip.next_strip_start =
        suffix_length == 0 ? original.next_strip_start : suffix_start;

    sequence->index.set(prefix.this_strip_start, prefix);
    sequence->index.set(masked_strip.this_strip_start, masked_strip);

    if (suffix_length != 0) {
      // Middle mask: preserve the unmasked tail as a separately indexed strip.
      StripOfSequence suffix = *containing_strip;
      suffix.length = suffix_length;
      suffix.footage_position += mask_end;
      suffix.this_strip_start = suffix_start;
      suffix.previous_strip_start = masked_strip.this_strip_start;
      sequence->index.set(suffix_start, suffix);
    }
  }

  // Reconnect the replacement chain to the original successor. If the source
  // was last, publish the replacement tail as the new last-strip anchor.
  const PointInSequence tail_start =
      suffix_length != 0 ? suffix_start : masked_strip.this_strip_start;
  const bool has_next =
      next_start.unix_lower_bits != max_uint32 ||
      next_start.counter_bits != max_uint32 ||
      next_start.random_bits != max_uint32;

  if (has_next) {
    StripOfSequence next = sequence->index.get(next_start);
    next.previous_strip_start = tail_start;
    sequence->index.set(next.this_strip_start, next);
  } else {
    sequence->last_strip_start = tail_start;
  }
}
