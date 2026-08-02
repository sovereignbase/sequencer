/**
 * @file
 * @brief Runs a projector gate backward by one linked strip.
 */
#pragma once

#include "../../declarations/projector/index.hpp"

/**
 * @brief Move the gate from its current strip to the previous structural strip.
 *
 * The previous strip is entered before its visible frame count is subtracted.
 * A masked previous strip therefore changes the structural gate without
 * changing the gate's projection frame index.
 *
 * @param projector Projector whose gate is moved backward.
 * @param current_strip Strip currently held at the gate.
 * @return Previous linked strip, which is also the final gate strip.
 * @pre Both pointers are non-null and `current_strip` has an indexed predecessor.
 */
[[nodiscard]] inline const Strip &
run_projector_backward(Projector *projector,
                       const Strip *current_strip) noexcept {
  projector->gate_strip_start =
      current_strip->coordinate.previous_strip_start;

  const Strip &previous_strip =
      *projector->strip_index.get(projector->gate_strip_start);
  if (previous_strip.is_masked == 0)
    projector->gate_projection_frame_index -= previous_strip.frame_count;

  return previous_strip;
}
