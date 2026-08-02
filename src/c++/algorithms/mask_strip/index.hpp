/**
 * @file
 * @brief Applies a Mask contained within one materialized Strip.
 *
 * A Mask excludes a Frame Span from the Projection while retaining it in
 * Sequence order until garbage collection. Depending on its offset and Frame
 * count, one source Strip becomes one, two, or three linked Strips while its
 * indexed start is always retained. A transferable Mask reuses existing
 * Sequence Points: its previous point is the containing indexed Strip start and
 * its own start is the first masked Frame point.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Mask a Frame Span contained entirely within one visible Strip.
 *
 * @par Result shapes
 *
 * | Mask extent | Retained Strip order |
 * | --- | --- |
 * | Entire source | `[ mask ]` |
 * | Source start | `[ mask ][ suffix ]` |
 * | Source end | `[ prefix ][ mask ]` |
 * | Source interior | `[ prefix ][ mask ][ suffix ]` |
 *
 * @par Invariants
 *
 * The source start remains indexed in every shape. A start-aligned Mask reuses
 * that entry; otherwise it becomes the visible prefix. A suffix begins at the
 * source Sequence Point advanced by the Mask's ending offset and at the
 * correspondingly advanced Footage frame index. Every resulting Strip retains
 * the source's original Footage mapping. The incoming Mask coordinate names
 * only existing points: `previous_strip_start` is exactly the indexed start of
 * `containing_strip`, and `this_strip_start` is exactly the first masked Frame
 * point within that Strip. Only visible updates issue Sequence Points; masking
 * never does.
 *
 * @par Processing
 *
 * The source is preserved, the selected shape is materialized, and its tail is
 * reconnected to the original successor. StripIndex writes may invalidate
 * stored pointers, so every replacement is derived from the preserved value
 * rather than from `containing_strip` after the first write. Once materialized,
 * `previous_strip_start` also serves as the mutable backward structural link;
 * this runtime role does not alter the stable first masked Frame identified by
 * `this_strip_start`.
 *
 * @param projector Projector containing the materialized source Strip.
 * @param containing_strip Visible Strip containing the complete Mask span.
 * @param mask_frame_offset Zero-based Frame offset of the Mask within the
 * containing Strip.
 * @param mask Incoming Mask Strip whose previous point identifies
 * `containing_strip` and whose own start identifies the first masked Frame. Its
 * runtime links and Footage frame index are normalized during materialization.
 * @pre Both pointers are non-null.
 * @pre `mask_frame_offset + mask.frame_count` does not exceed
 * `containing_strip->frame_count`.
 * @pre The containing strip is visible and `mask.is_masked` is nonzero.
 * @pre `mask.coordinate.previous_strip_start` equals
 * `containing_strip->coordinate.this_strip_start` and
 * `mask.coordinate.this_strip_start` equals that point advanced by
 * `mask_frame_offset` Frames.
 * @pre Advancing the containing start counter by the mask end does not
 * overflow.
 * @post Projection frame count is reduced by exactly `mask.frame_count`
 * Frames.
 * @post The projector gate key remains valid and the replacement tail is linked
 * to the original successor or published as the last retained Strip.
 * @complexity A constant number of StripIndex operations and O(1) local space.
 */
inline void mask_strip(Projector *projector, const Strip *containing_strip,
                       const std::uint32_t mask_frame_offset,
                       Strip mask) noexcept {
  // Preserve the source before an index write can invalidate its pointer.
  Strip original_strip = *containing_strip;
  const SequencePoint original_next_strip_start =
      original_strip.next_strip_start;

  // Replace the entire visible Strip with a Mask at the same start.
  if (mask_frame_offset == 0 &&
      mask.frame_count == original_strip.frame_count) {
    original_strip.is_masked = 1;
    projector->projection_frame_count -= original_strip.frame_count;
    projector->strip_index.set(original_strip.coordinate.this_strip_start,
                               original_strip);
    return;
  }

  // Resolve the optional suffix shared by every partial-Mask shape.
  const std::uint32_t mask_end_frame_offset =
      mask_frame_offset + mask.frame_count;
  const std::uint32_t suffix_frame_count =
      original_strip.frame_count - mask_end_frame_offset;
  SequencePoint suffix_strip_start = original_strip.coordinate.this_strip_start;
  suffix_strip_start.counter_bits += mask_end_frame_offset;

  // Remove the Mask's Frame Span from the Projection.
  projector->projection_frame_count -= mask.frame_count;

  // Materialize the partial Mask according to its source offset.
  if (mask_frame_offset == 0) {
    // Reuse the source entry for a start-aligned Mask.
    Strip suffix_strip = original_strip;
    suffix_strip.frame_count = suffix_frame_count;
    suffix_strip.footage_frame_index += mask_end_frame_offset;
    suffix_strip.coordinate.this_strip_start = suffix_strip_start;
    suffix_strip.coordinate.previous_strip_start =
        original_strip.coordinate.this_strip_start;

    original_strip.is_masked = 1;
    original_strip.frame_count = mask.frame_count;
    original_strip.next_strip_start = suffix_strip_start;

    projector->strip_index.set(original_strip.coordinate.this_strip_start,
                               original_strip);
    projector->strip_index.set(suffix_strip_start, suffix_strip);
  } else {
    // Retain the source entry as the visible prefix.
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

    projector->strip_index.set(prefix_strip.coordinate.this_strip_start,
                               prefix_strip);
    projector->strip_index.set(mask.coordinate.this_strip_start, mask);

    // Materialize visible Frames following an interior Mask when present.
    if (suffix_frame_count != 0) {
      Strip suffix_strip = original_strip;
      suffix_strip.frame_count = suffix_frame_count;
      suffix_strip.footage_frame_index += mask_end_frame_offset;
      suffix_strip.coordinate.this_strip_start = suffix_strip_start;
      suffix_strip.coordinate.previous_strip_start =
          mask.coordinate.this_strip_start;
      projector->strip_index.set(suffix_strip_start, suffix_strip);
    }
  }

  // Reconnect the replacement tail in retained Strip order.
  const SequencePoint replacement_tail_strip_start =
      suffix_frame_count != 0 ? suffix_strip_start
                              : mask.coordinate.this_strip_start;

  // Relink the following Strip or publish the new retained tail.
  if (!(original_next_strip_start == unlinked_strip_start)) {
    Strip next_strip = *projector->strip_index.get(original_next_strip_start);
    next_strip.coordinate.previous_strip_start = replacement_tail_strip_start;
    projector->strip_index.set(next_strip.coordinate.this_strip_start,
                               next_strip);
  } else {
    projector->last_strip_start = replacement_tail_strip_start;
  }
}
