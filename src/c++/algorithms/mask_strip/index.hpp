/**
 * @file
 * @brief Applies a mask contained within one materialized strip.
 *
 * A mask changes projection visibility without removing frames from structural
 * sequence history. Depending on its offset and frame count, one source strip
 * becomes one, two, or three linked strips while always retaining the source
 * strip's indexed start.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Mask a frame span contained entirely within one visible strip.
 *
 * @code
 * Entire strip: [ source ] -> [ mask ]
 * At start:     [ source ] -> [ mask ][ suffix ]
 * At end:       [ source ] -> [ prefix ][ mask ]
 * In middle:    [ source ] -> [ prefix ][ mask ][ suffix ]
 * @endcode
 *
 * The original start key always remains indexed. A start-aligned mask reuses
 * that entry; otherwise the original entry becomes the visible prefix. Any
 * suffix begins at the source point advanced by the mask's ending offset and
 * at the corresponding footage frame index.
 *
 * Processing is divided into three phases:
 *
 * 1. Preserve the source strip and resolve the replacement boundaries.
 * 2. Materialize the applicable shape shown above.
 * 3. Connect the replacement tail to the original successor.
 *
 * StripIndex writes may invalidate stored pointers, so every replacement is
 * derived from the preserved source value rather than from `containing_strip`
 * after the first write.
 *
 * @param projector Projector containing the materialized source strip.
 * @param containing_strip Visible strip containing the complete mask span.
 * @param mask_frame_offset Zero-based frame offset of the mask within the
 * containing strip.
 * @param mask Incoming mask strip. Its runtime links and footage frame index
 * are normalized when it becomes a distinct structural strip.
 * @pre Both pointers are non-null.
 * @pre `mask_frame_offset + mask.frame_count` does not exceed
 * `containing_strip->frame_count`.
 * @pre The containing strip is visible and `mask.is_masked` is nonzero.
 * @pre Advancing the containing start counter by the mask end does not overflow.
 * @post Projection frame count is reduced by exactly `mask.frame_count`.
 * @post The projector gate key remains valid and the replacement tail is linked
 * to the original successor or published as the last strip.
 * @complexity A constant number of StripIndex operations and O(1) local space.
 */
inline void mask_strip(Projector *projector, const Strip *containing_strip,
                       const std::uint32_t mask_frame_offset,
                       Strip mask) noexcept {
  // Preserve everything needed after StripIndex starts replacing entries.
  Strip original_strip = *containing_strip;
  const SequencePoint original_next_strip_start =
      original_strip.next_strip_start;

  // Entire strip: retain its start and links, changing only visibility.
  if (mask_frame_offset == 0 &&
      mask.frame_count == original_strip.frame_count) {
    original_strip.is_masked = 1;
    projector->projection_frame_count -= original_strip.frame_count;
    projector->strip_index.set(
        original_strip.coordinate.this_strip_start, original_strip);
    return;
  }

  // Resolve the optional suffix once for every partial-mask shape.
  const std::uint32_t mask_end_frame_offset =
      mask_frame_offset + mask.frame_count;
  const std::uint32_t suffix_frame_count =
      original_strip.frame_count - mask_end_frame_offset;
  SequencePoint suffix_strip_start =
      original_strip.coordinate.this_strip_start;
  suffix_strip_start.counter_bits += mask_end_frame_offset;

  projector->projection_frame_count -= mask.frame_count;

  if (mask_frame_offset == 0) {
    // At start: the source entry becomes the mask and points to a new suffix.
    Strip suffix_strip = original_strip;
    suffix_strip.frame_count = suffix_frame_count;
    suffix_strip.footage_frame_index += mask_end_frame_offset;
    suffix_strip.coordinate.this_strip_start = suffix_strip_start;
    suffix_strip.coordinate.previous_strip_start =
        original_strip.coordinate.this_strip_start;

    original_strip.is_masked = 1;
    original_strip.frame_count = mask.frame_count;
    original_strip.next_strip_start = suffix_strip_start;

    projector->strip_index.set(
        original_strip.coordinate.this_strip_start, original_strip);
    projector->strip_index.set(suffix_strip_start, suffix_strip);
  } else {
    // At end or in middle: retain the source entry as the visible prefix.
    Strip prefix_strip = original_strip;
    prefix_strip.frame_count = mask_frame_offset;
    prefix_strip.next_strip_start = mask.coordinate.this_strip_start;

    mask.is_masked = 1;
    mask.footage_frame_index =
        original_strip.footage_frame_index + mask_frame_offset;
    mask.coordinate.previous_strip_start =
        original_strip.coordinate.this_strip_start;
    mask.next_strip_start = suffix_frame_count == 0
                                ? original_strip.next_strip_start
                                : suffix_strip_start;

    projector->strip_index.set(
        prefix_strip.coordinate.this_strip_start, prefix_strip);
    projector->strip_index.set(mask.coordinate.this_strip_start, mask);

    if (suffix_frame_count != 0) {
      // In middle only: materialize the visible frames following the mask.
      Strip suffix_strip = original_strip;
      suffix_strip.frame_count = suffix_frame_count;
      suffix_strip.footage_frame_index += mask_end_frame_offset;
      suffix_strip.coordinate.this_strip_start = suffix_strip_start;
      suffix_strip.coordinate.previous_strip_start =
          mask.coordinate.this_strip_start;
      projector->strip_index.set(suffix_strip_start, suffix_strip);
    }
  }

  // Publish the replacement tail in the surrounding structural chain.
  const SequencePoint replacement_tail_strip_start =
      suffix_frame_count != 0 ? suffix_strip_start
                              : mask.coordinate.this_strip_start;

  if (!(original_next_strip_start == unlinked_strip_start)) {
    Strip next_strip =
        *projector->strip_index.get(original_next_strip_start);
    next_strip.coordinate.previous_strip_start =
        replacement_tail_strip_start;
    projector->strip_index.set(next_strip.coordinate.this_strip_start,
                               next_strip);
  } else {
    projector->last_strip_start = replacement_tail_strip_start;
  }
}
