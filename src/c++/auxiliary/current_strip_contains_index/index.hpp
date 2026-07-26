#pragma once
#include "../../types/type.hpp"
#include <cstdint>

/**
 * @brief Test whether target_position falls inside the gate strip.
 *
 * @param projector Projector whose gate strip and gate position are checked.
 * @param target_position Zero-based visible target position.
 * @return True when target_position is inside
 * projector->gate_strip_start_position.
 */
bool current_strip_contains_index(ProjectorState *projector,
                                  const std::uint32_t target_position) {
  if (projector->gate_strip_start_position == max_uint32)
    return false;

  const SequenceStrip &current =
      projector->reel[projector->gate_strip_start_position];

  // Masked strips stay linked but never contain visible target positions.
  if (current.masked)
    return false;
  // The strip starts at projector->gate_position and covers visible positions.
  return (target_position >= projector->gate_position &&
          target_position < (projector->gate_position + current.length));
}
