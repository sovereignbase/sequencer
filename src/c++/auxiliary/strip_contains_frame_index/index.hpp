/**
 * @file
 * @brief Tests Strip containment on the Projection frame-index axis.
 *
 * A Mask remains in retained sequence order but occupies no Projection frame
 * indexes. Containment on this axis therefore applies only to visible Strips.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Test whether a Projection frame index belongs to a visible Strip.
 *
 * The visible Strip occupies the half-open interval beginning at
 * `strip_projection_frame_index` and extending for `strip->frame_count`
 * Frames. Subtraction occurs only after the lower bound succeeds, avoiding
 * unsigned underflow.
 *
 * @param strip Strip whose Projection Frame Span is tested.
 * @param strip_projection_frame_index Projection frame index at which the
 * strip begins.
 * @param projection_frame_index Projection frame index to test.
 * @param frame_count Length of the Strip.
 * @return `true` when the strip is visible and contains the frame index.
 * @pre `strip` is non-null.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline bool strip_contains_frame_index(
    const Strip *strip, const std::uint32_t strip_projection_frame_index,
    const std::uint32_t projection_frame_index,
    const std::uint32_t frame_count) noexcept {
  // Exclude Masks, which occupy no Projection Frame indexes.
  if (strip->is_masked != 0)
    return false;

  // Test the visible Strip's half-open Projection interval.
  return projection_frame_index >= strip_projection_frame_index &&
         projection_frame_index - strip_projection_frame_index <
             frame_count;
}
