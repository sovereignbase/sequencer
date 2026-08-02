/**
 * @file
 * @brief Tests containment on the stable sequence-point axis.
 *
 * Unlike projection containment, this test includes masked strips because a
 * mask changes visibility without removing sequence points from structural
 * history.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Test whether a sequence point belongs to a strip's frame span.
 *
 * @param strip Strip whose half-open sequence-point span is tested.
 * @param sequence_point Stable sequence point to test.
 * @return Zero-based frame offset from the strip start when contained;
 * `sequence_point_outside_strip` otherwise.
 * @pre Both pointers are non-null.
 * @note An offset of zero means that the point equals `this_strip_start`.
 */
[[nodiscard]] inline std::uint32_t strip_contains_sequence_point(
    const Strip *strip, const SequencePoint *sequence_point) noexcept {
  const SequencePoint &strip_start = strip->coordinate.this_strip_start;

  if (sequence_point->random_bits != strip_start.random_bits ||
      sequence_point->unix_lower_bits != strip_start.unix_lower_bits ||
      sequence_point->counter_bits < strip_start.counter_bits)
    return sequence_point_outside_strip;

  const std::uint32_t strip_frame_offset =
      sequence_point->counter_bits - strip_start.counter_bits;

  return strip_frame_offset < strip->frame_count
             ? strip_frame_offset
             : sequence_point_outside_strip;
}
