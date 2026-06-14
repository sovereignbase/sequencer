#pragma once
#include "../../types/type.hpp"
#include "../absolute_distance/index.hpp"
#include "../current_strip_contains_target/index.hpp"
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

  // If the selected gate strip already contains target, no walk is needed.
  if (projector->reel.empty() ||
      current_strip_contains_target(projector, target_position))
    return;

  // Start with the distance from the current gate to the target.
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
  if (current_strip_contains_target(projector, target_position))
    return;

  // Walk right when the gate starts before the target or sits on a masked
  // strip.
  if (projector->gate_position < target_position ||
      projector->reel[projector->gate_strip_start_position].masked) {
    // Stop as soon as the gate strip contains the target.
    while (!current_strip_contains_target(projector, target_position)) {
      Strip &previous = projector->reel[projector->gate_strip_start_position];
      if (previous.next_strip_start_position == invalid_strip_indicator)
        return;

      // Advance to the next linked strip, including masked strips.
      projector->gate_strip_start_position =
          previous.next_strip_start_position;
      // Only the strip walked over moves the visible target position forward.
      if (!previous.masked)
        projector->gate_position += previous.length;
    }
    return;
  }

  // Walk left when the gate starts after the target.
  while (!current_strip_contains_target(projector, target_position)) {
    Strip &current = projector->reel[projector->gate_strip_start_position];
    if (current.previous_strip_start_position == invalid_strip_indicator)
      return;

    // Move to the previous linked strip, including masked strips.
    projector->gate_strip_start_position =
        current.previous_strip_start_position;
    // Only visible strips move the target position backward.
    Strip &previous = projector->reel[projector->gate_strip_start_position];
    if (!previous.masked)
      projector->gate_position -= previous.length;
  }
}
