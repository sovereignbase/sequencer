/**
 * @file
 * @brief Runs a projector gate forward by one linked strip.
 */
#pragma once

#include "../../declarations/projector/index.hpp"

/**
 * @brief Move the gate from its current strip to the next structural strip.
 *
 * The gate crosses masked strips structurally, while only a visible current
 * strip advances its projection frame index.
 *
 * @param projector Projector whose gate is advanced.
 * @param current_strip Strip currently held at the gate.
 * @return Next linked strip, which is also the final gate strip.
 * @pre Both pointers are non-null and `current_strip` has an indexed successor.
 */
[[nodiscard]] inline const Strip &
run_projector_forward(Projector *projector,
                      const Strip *current_strip) noexcept {
  projector->gate_strip_start = current_strip->next_strip_start;

  if (current_strip->is_masked == 0)
    projector->gate_projection_frame_index += current_strip->frame_count;

  return *projector->strip_index.get(projector->gate_strip_start);
}
