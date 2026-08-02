/**
 * @file
 * @brief Moves a Projector Gate backward through retained strip order.
 */
#pragma once

#include "../../declarations/projector/index.hpp"

/**
 * @brief Move the Gate to the preceding retained Strip.
 *
 * The preceding strip becomes the Gate strip before its visible frame count is
 * subtracted. A Mask therefore moves the Gate in retained sequence order
 * without changing its Projection position.
 *
 * @param projector Projector whose gate is moved backward.
 * @param current_strip Strip currently held at the gate.
 * @return Preceding linked strip, which is also the resulting Gate strip.
 * @pre Both pointers are non-null and `current_strip` has an indexed
 * predecessor.
 * @post `projector->gate_strip_start` identifies the returned strip.
 * @post `projector->gate_projection_frame_index` is the Projection frame index
 * at which the returned strip begins.
 * @complexity One StripIndex lookup and O(1) additional work and space.
 */
[[nodiscard]] inline const Strip &
run_projector_backward(Projector *projector,
                       const Strip *current_strip) noexcept {
  // Move the Gate key to the current Strip's predecessor.
  projector->gate_strip_start = current_strip->coordinate.previous_strip_start;

  // Resolve the preceding retained Strip.
  const Strip &previous_strip =
      *projector->strip_index.get(projector->gate_strip_start);

  // Subtract only Frames represented in the Projection.
  if (previous_strip.is_masked == 0)
    projector->gate_projection_frame_index -= previous_strip.frame_count;

  // Return the Strip now represented by the Gate.
  return previous_strip;
}
