#pragma once

#include "../mask_strip/index.hpp"
#include "../types/sequence.hpp"
#include <cstdint>

/**
 * @brief Insert a visible strip after a frame in an existing strip.
 *
 * Appending after the existing strip creates one new linked entry. Inserting
 * between its frames retains the existing start key as a prefix and creates a
 * suffix after the inserted strip. Pending masks and inserts keyed by each
 * inserted strip's start are consumed immediately; pending inserts form an
 * iterative append chain.
 *
 * @param sequence Sequence receiving the strip.
 * @param previous_strip Strip containing the frame after which insertion occurs.
 * @param previous_strip_offset Zero-based offset of that frame.
 * @param strip Visible strip to insert.
 *
 * @pre previous_strip_offset is less than previous_strip->length.
 * @pre strip.mask is zero.
 */
inline void insert_strip(SequenceState *sequence,
                         const StripOfSequence *previous_strip,
                         std::uint32_t previous_strip_offset,
                         StripOfSequence strip) noexcept {
  while (true) {
    const StripOfSequence original = *previous_strip;
    const std::uint32_t split_position = previous_strip_offset + 1;
    const PointInSequence inserted_start = strip.this_strip_start;
    const PointInSequence next_start = original.next_strip_start;
    const bool has_next =
        next_start.unix_lower_bits != max_uint32 ||
        next_start.counter_bits != max_uint32 ||
        next_start.random_bits != max_uint32;

    StripOfSequence prefix = original;
    prefix.length = split_position;
    prefix.next_strip_start = inserted_start;

    strip.previous_strip_start = prefix.this_strip_start;
    sequence->length += strip.length;

    PointInSequence tail_start = inserted_start;
    if (split_position == original.length) {
      strip.next_strip_start = next_start;
      sequence->index.set(prefix.this_strip_start, prefix);
      sequence->index.set(inserted_start, strip);
    } else {
      PointInSequence suffix_start = original.this_strip_start;
      suffix_start.counter_bits += split_position;

      StripOfSequence suffix = original;
      suffix.length -= split_position;
      suffix.footage_position += split_position;
      suffix.this_strip_start = suffix_start;
      suffix.previous_strip_start = inserted_start;

      strip.next_strip_start = suffix_start;
      tail_start = suffix_start;

      sequence->index.set(prefix.this_strip_start, prefix);
      sequence->index.set(inserted_start, strip);
      sequence->index.set(suffix_start, suffix);
    }

    if (has_next) {
      StripOfSequence next = *sequence->index.get(next_start);
      next.previous_strip_start = tail_start;
      sequence->index.set(next.this_strip_start, next);
    } else {
      sequence->last_strip_start = tail_start;
    }

    PointInSequence append_after_start = inserted_start;
    const StripOfSequence *pending_mask =
        sequence->pending_masks.get(inserted_start);
    if (pending_mask != nullptr) {
      const StripOfSequence masked_strip = *pending_mask;
      sequence->pending_masks.remove(inserted_start);

      const StripOfSequence *inserted_strip = sequence->index.get(inserted_start);
      if (masked_strip.length <= inserted_strip->length) {
        if (masked_strip.length < inserted_strip->length)
          append_after_start.counter_bits += masked_strip.length;
        mask_strip(sequence, inserted_strip, 0, masked_strip);
      }
    }

    const StripOfSequence *pending_insert =
        sequence->pending_inserts.get(inserted_start);
    if (pending_insert == nullptr)
      return;

    strip = *pending_insert;
    sequence->pending_inserts.remove(inserted_start);
    previous_strip = sequence->index.get(append_after_start);
    previous_strip_offset = previous_strip->length - 1;
  }
}
