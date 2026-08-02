/**
 * @file
 * @brief Moves a Projector Gate forward through retained strip order.
 */
#pragma once

#include "../../declarations/projector/index.hpp"

/**
 * @brief Move the Gate to the succeeding retained Strip.
 *
 * The current strip contributes its frame count only when it is visible. A
 * Mask therefore advances the Gate in retained sequence order without
 * changing its Projection position.
 *
 * @param projector Projector whose gate is advanced.
 * @param current_strip Strip currently held at the gate.
 * @return Succeeding linked strip, which is also the resulting Gate strip.
 * @pre Both pointers are non-null and `current_strip` has an indexed successor.
 * @post `projector->gate_strip_start` identifies the returned strip.
 * @post `projector->gate_projection_frame_index` is the Projection frame index
 * at which the returned strip begins.
 * @complexity One StripIndex lookup and O(1) additional work and space.
 */
[[nodiscard]] inline const Strip &
run_projector_forward(Projector *projector,
                      const Strip *current_strip) noexcept {
  // Move the Gate key to the current Strip's successor.
  projector->gate_strip_start = current_strip->next_strip_start;

  // Add only Frames represented in the Projection.
  if (current_strip->is_masked == 0)
    projector->gate_projection_frame_index += current_strip->frame_count;

  // Resolve and return the Strip now represented by the Gate.
  return *projector->strip_index.get(projector->gate_strip_start);
}
