/**
 * @file
 * @brief Moves a Projector Gate one dense position left.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Move the Gate to the Strip immediately left of its current Strip.
 *
 * The dense `left` vector resolves the preceding stable position directly.
 * Its visible Frame count is then subtracted from the Gate's Projection index.
 * Masks move the dense Gate without changing its Projection position.
 *
 * @param projector Projector whose Gate is moved left.
 * @return Strip at the resulting dense Gate position.
 * @pre `projector` is non-null and the Gate has a leftward dense link.
 * @post `gate_strip_index` and `gate_projection_frame_index` describe the
 * returned Strip.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline const Strip &
run_projector_left(Projector *projector) noexcept {
  projector->gate_strip_index =
      projector->left[projector->gate_strip_index];
  const Strip &strip = projector->strips[projector->gate_strip_index];
  if (strip.is_masked == 0)
    projector->gate_projection_frame_index -= strip.frame_count;
  return strip;
}
