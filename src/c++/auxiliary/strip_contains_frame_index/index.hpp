#pragma once
#include "../../types/strip.hpp"
#include <cstdint>

/**
 * @brief Test whether frame_index falls inside a visible strip.
 *
 * @param strip Strip to inspect.
 * @param strip_frame_index Visible frame position where the strip starts.
 * @param frame_index Zero-based visible frame position.
 * @return True when frame_index is inside strip.
 */
inline bool strip_contains_frame_index(
    const StripOfSequence *strip, const std::uint32_t strip_frame_index,
    const std::uint32_t frame_index) noexcept {

  // Masked strips stay linked but never contain visible target positions.
  if (strip->mask != 0)
    return false;

  return frame_index >= strip_frame_index &&
         frame_index - strip_frame_index < strip->length;
}
