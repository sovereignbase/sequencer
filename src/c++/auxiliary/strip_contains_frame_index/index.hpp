/**
 * @file
 * @brief Tests visible containment on the projection frame axis.
 *
 * Structural containment and projection containment differ for masked strips:
 * a masked strip remains in the structural chain but occupies no projection
 * frame indexes.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Test whether a projection frame index falls within a visible strip.
 *
 * @param strip Strip whose projected frame span is tested.
 * @param strip_projection_frame_index Projection frame index at which the
 * strip begins.
 * @param projection_frame_index Projection frame index to test.
 * @return `true` when the strip is visible and contains the frame index.
 * @pre `strip` is non-null.
 */
[[nodiscard]] inline bool strip_contains_frame_index(
    const Strip *strip,
    const std::uint32_t strip_projection_frame_index,
    const std::uint32_t projection_frame_index) noexcept {
  if (strip->is_masked != 0)
    return false;

  return projection_frame_index >= strip_projection_frame_index &&
         projection_frame_index - strip_projection_frame_index <
             strip->frame_count;
}
