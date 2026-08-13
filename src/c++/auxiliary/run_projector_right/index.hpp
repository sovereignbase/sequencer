/**
 * @file
 * @brief Moves a Projector Gate one dense position right.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Move the Gate to the Strip immediately right of its current Strip.
 *
 * The current visible Strip contributes its Frame count before the dense
 * `right` vector resolves the succeeding stable position. A Mask moves the
 * dense Gate without changing its Projection position.
 *
 * @param projector Projector whose Gate is moved right.
 * @return Strip at the resulting dense Gate position.
 * @pre `projector` is non-null and the Gate has a rightward dense link.
 * @post `gate_strip_index` and `gate_projection_frame_index` describe the
 * returned Strip.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline const Strip &
run_projector_right(Projector *projector) noexcept {
  const Strip &strip = projector->strips[projector->gate_strip_index];
  if (strip.is_masked == 0)
    projector->gate_projection_frame_index +=
        projector->length[projector->gate_strip_index];
  projector->gate_strip_index =
      projector->right[projector->gate_strip_index];
  return projector->strips[projector->gate_strip_index];
}
