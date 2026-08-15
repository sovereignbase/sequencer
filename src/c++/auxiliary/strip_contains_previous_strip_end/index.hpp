/**
 * @file
 * @brief Tests whether a previous Strip end falls within a stable Sequence
 * span.
 *
 * Sequence containment includes Masks because masking removes Frames from the
 * Projection without removing them from retained Sequence order.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Locate a previous Strip end within a Strip's Sequence span.
 *
 * The point is contained when its random components equal those of
 * `strip_start` and its counter falls within the half-open interval beginning
 * at `strip_start` and extending for `strip_length` Frames.
 *
 * @param strip_start First Sequence Point represented by the Strip.
 * @param strip_length Number of Frames represented by the Strip.
 * @param previous_strip_end Previous Strip end to locate.
 * @return Zero-based Frame offset from `strip_start` when contained; `u32_max`
 * otherwise.
 * @note An offset of zero means `previous_strip_end` equals `strip_start`.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline std::uint32_t strip_contains_previous_strip_end(
    const SequencePoint &strip_start, const std::uint32_t &strip_length,
    const SequencePoint &previous_strip_end) noexcept {

  // Reject another random domain or a point preceding the Strip start.
  if (previous_strip_end.crypto_random_bits != strip_start.crypto_random_bits ||
      previous_strip_end.unix_lower_bits != strip_start.unix_lower_bits ||
      previous_strip_end.counter_bits < strip_start.counter_bits)
    return u32_max;

  // Resolve the zero-based Frame offset from the Strip start.
  const std::uint32_t strip_frame_offset =
      previous_strip_end.counter_bits - strip_start.counter_bits;

  // Accept only offsets inside the Strip's half-open Frame Span.
  return strip_frame_offset < strip_length ? strip_frame_offset : u32_max;
}