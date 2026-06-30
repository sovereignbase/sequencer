#pragma once
#include "../../types/type.hpp"
#include "../index.hpp"
#include <cstdint>

/**
 * @brief Move the projector gate to the strip containing target_position.
 *
 * The target position is counted through visible strips only. Masked strips
 * stay linked but do not advance projector->gate_position while walking.
 *
 * @param target_position Zero-based visible target position.
 * @param projector Projector whose gate strip and position are updated.
 */
void find_strip_by_position(const std::uint32_t target_position,
                            Projector *projector) {

  // If the reel is empty or selected gate strip already contains target, no
  // walk is needed.
  if (projector->reel.empty() ||
      current_strip_contains_target_position(projector, target_position))
    return;

  // Start with the distance from the gate to the target.
  std::uint32_t distance =
      absolute_distance(projector->gate_position, target_position);

  // Distance from the projection head is the target position itself.
  const std::uint32_t head_distance = target_position;

  // If the head is closer than current, start the walk at first.
  if (head_distance < distance) {
    projector->gate_position = 0;
    projector->gate_strip_start_position =
        projector->first_strip_start_position;
    distance = head_distance;
  }

  // If the selected gate strip already contains target, no walk is needed.
  if (current_strip_contains_target_position(projector, target_position))
    return;

  // Run forward when the gate is positioned before the target.
  if (projector->gate_position < target_position) {
    // Stop as soon as the gate strip contains the target.
    while (!current_strip_contains_target_position(projector, target_position))
      run_forward(projector);
    return;
  }

  // Walk left when the gate starts after the target.
  while (!current_strip_contains_target_position(projector, target_position))
    run_backward(projector);
  return;
}
