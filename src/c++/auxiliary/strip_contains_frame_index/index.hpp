#pragma once
#include "../../types/type.hpp"
#include <cstdint>

/**
 * @brief Test whether frame_index falls inside the gate strip.
 *
 * @param sequence Sequence whose gate strip and gate position are checked.
 * @param frame_index Zero-based visible frame position.
 * @return True when frame_index is inside sequence->gate_strip_start.
 */
bool strip_contains_frame_index(const SequenceState *sequence,
                                const std::uint32_t frame_index) noexcept {
  const StripOfSequence &strip =
      sequence->index.get(sequence->gate_strip_start);

  // Masked strips stay linked but never contain visible target positions.
  if (strip.mask != 0)
    return false;

  // The strip starts at projector->gate_position and covers visible positions.
  return frame_index >= sequence->gate_position &&
         frame_index - sequence->gate_position < strip.length;
}
