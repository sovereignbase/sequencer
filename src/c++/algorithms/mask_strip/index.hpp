/**
 * @file
 * @brief Excludes one logical Frame Span from the Projection.
 *
 * A Mask names its first existing Sequence Point and spans consecutive points
 * in that Realm. Material splitting and concurrent insertions do not change
 * that axis: the algorithm advances by counters and resolves each continuation
 * directly through StripIndex, thereby skipping structurally inserted Strips.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <algorithm>
#include <cstdint>

/**
 * @brief Materialize a Mask across its logical Frame Span.
 *
 * Visible fragments are split only at the Mask boundaries. Existing masked
 * fragments are retained and counted toward the requested logical span without
 * reducing the Projection again. Every new material fragment uses an existing
 * Sequence Point and records its logical preceding Frame in its immutable
 * coordinate; mutable retained order is maintained exclusively through
 * `previous_structural_strip_start` and `next_strip_start`.
 *
 * @param projector Projector containing the first masked Frame.
 * @param containing_strip Material fragment containing
 * `mask.coordinate.this_strip_start`.
 * @param mask_frame_offset Zero-based offset of the first masked Frame in
 * `containing_strip`.
 * @param mask Mask whose start is the first logical Frame to exclude and whose
 * Frame count is the complete logical span length.
 * @pre All pointers are non-null.
 * @pre The complete Mask span is materialized as consecutive points in the
 * Mask start Realm, possibly across split or already masked fragments.
 * @pre Counter advancement across the Mask span does not overflow.
 * @post Exactly the previously visible Frames in the Mask span are removed
 * from the Projection.
 * @post Coordinates of existing material fragments remain unchanged.
 * @post Structural predecessor and successor links remain bidirectional.
 * @complexity O(f log n) time and O(1) space for f intersected fragments and
 * n Strips in their Realm.
 */
inline void mask_strip(Projector *projector, const Strip *containing_strip,
                       const std::uint32_t mask_frame_offset,
                       const Strip &mask) noexcept {
  // Follow the immutable logical axis rather than mutable structural links.
  SequencePoint logical_frame_start = mask.coordinate.this_strip_start;
  std::uint32_t remaining_frame_count = mask.frame_count;
  const Strip *current_strip = containing_strip;
  std::uint32_t current_frame_offset = mask_frame_offset;

  while (remaining_frame_count != 0) {
    // Preserve the fragment before any index write can invalidate its pointer.
    const Strip source_strip = *current_strip;
    const std::uint32_t masked_frame_count =
        std::min(remaining_frame_count,
                 source_strip.frame_count - current_frame_offset);

    // Exclude only Frames that are not already represented by a Mask.
    if (source_strip.is_masked == 0) {
      const std::uint32_t mask_end_frame_offset =
          current_frame_offset + masked_frame_count;
      const std::uint32_t suffix_frame_count =
          source_strip.frame_count - mask_end_frame_offset;
      const SequencePoint source_strip_start =
          source_strip.coordinate.this_strip_start;
      const SequencePoint original_next_strip_start =
          source_strip.next_strip_start;

      // Retain an optional visible prefix at the source's indexed start.
      if (current_frame_offset != 0) {
        Strip prefix_strip = source_strip;
        prefix_strip.frame_count = current_frame_offset;
        prefix_strip.next_strip_start = logical_frame_start;
        projector->strip_index.set(source_strip_start, prefix_strip);
      }

      // Reuse a start-aligned fragment or materialize an interior Mask.
      Strip masked_strip = source_strip;
      masked_strip.is_masked =
          masked_strip_state |
          (suffix_frame_count != 0 ? mask_has_source_successor : 0) |
          (current_frame_offset != 0 ? mask_is_source_continuation : 0);
      masked_strip.frame_count = masked_frame_count;
      masked_strip.footage_frame_index += current_frame_offset;
      masked_strip.next_strip_start = original_next_strip_start;

      if (current_frame_offset != 0) {
        masked_strip.coordinate = {
            .this_strip_start = logical_frame_start,
            .previous_strip_start = mask.coordinate.previous_strip_start,
        };
        masked_strip.previous_structural_strip_start = source_strip_start;
      }

      // Append an optional visible suffix after the materialized Mask.
      SequencePoint replacement_tail_strip_start = logical_frame_start;
      if (suffix_frame_count != 0) {
        SequencePoint suffix_strip_start = source_strip_start;
        suffix_strip_start.counter_bits += mask_end_frame_offset;
        SequencePoint suffix_previous_frame = suffix_strip_start;
        --suffix_previous_frame.counter_bits;

        Strip suffix_strip = source_strip;
        suffix_strip.frame_count = suffix_frame_count;
        suffix_strip.footage_frame_index += mask_end_frame_offset;
        suffix_strip.coordinate = {
            .this_strip_start = suffix_strip_start,
            .previous_strip_start = suffix_previous_frame,
        };
        suffix_strip.previous_structural_strip_start = logical_frame_start;

        masked_strip.next_strip_start = suffix_strip_start;
        replacement_tail_strip_start = suffix_strip_start;
        projector->strip_index.set(logical_frame_start, masked_strip);
        projector->strip_index.set(suffix_strip_start, suffix_strip);
      } else {
        projector->strip_index.set(logical_frame_start, masked_strip);
      }

      // Reconnect the original successor or publish the new retained tail.
      if (!(original_next_strip_start == unlinked_strip_start)) {
        Strip next_strip =
            *projector->strip_index.get(original_next_strip_start);
        next_strip.previous_structural_strip_start =
            replacement_tail_strip_start;
        projector->strip_index.set(original_next_strip_start, next_strip);
      } else {
        projector->last_strip_start = replacement_tail_strip_start;
      }

      projector->projection_frame_count -= masked_frame_count;
    }

    // Resolve the next original fragment directly, skipping inserted Strips.
    logical_frame_start.counter_bits += masked_frame_count;
    remaining_frame_count -= masked_frame_count;
    if (remaining_frame_count == 0)
      return;

    current_strip = projector->strip_index.get(logical_frame_start);
    current_frame_offset = 0;
  }
}
