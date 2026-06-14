#pragma once
#include "../../types/type.hpp"
#include "../absolute_distance/index.hpp"
#include "../current_frame_contains_target/index.hpp"
#include <cstdint>

/**
 * @brief Move the instance cursor to the range containing target_index.
 *
 * The target index is counted through non-tombstoned ranges only. Tombstoned
 * ranges stay linked but do not advance instance->index while walking.
 *
 * @param target_index Zero-based non-deleted target index.
 * @param instance State whose current range and index are updated.
 */
void find_frame_by_index(const std::uint32_t target_index, Instance *instance) {

  // If the selected cursor already contains target, no walk is needed.
  if (instance->frames.empty() ||
      current_frame_contains_target(instance, target_index))
    return;

  // Start with the distance from the current cursor to the target.
  std::uint32_t distance = absolute_distance(instance->index, target_index);

  // Distance from the projection head is the target index itself.
  const std::uint32_t head_distance = target_index;

  // If the head is closer than current, start the walk at first.
  if (head_distance < distance) {
    instance->index = 0;
    instance->current_frame_by_index = instance->first_frame_by_index;
    distance = head_distance;
  }

  // If the selected cursor already contains target, no walk is needed.
  if (current_frame_contains_target(instance, target_index))
    return;

  // Walk right when the cursor starts before the target or sits on a
  // tombstone.
  if (instance->index < target_index ||
      instance->frames[instance->current_frame_by_index].deleted) {
    // Stop as soon as the cursor range contains the target.
    while (!current_frame_contains_target(instance, target_index)) {
      Frame &previous = instance->frames[instance->current_frame_by_index];
      if (previous.next_index == invalid_frame_index)
        return;

      // Advance to the next linked range, including tombstones.
      instance->current_frame_by_index = previous.next_index;
      // Only the range walked over moves the visible target index forward.
      if (!previous.deleted)
        instance->index += previous.frame_length;
    }
    return;
  }

  // Walk left when the cursor starts after the target.
  while (!current_frame_contains_target(instance, target_index)) {
    Frame &current = instance->frames[instance->current_frame_by_index];
    if (current.previous_index == invalid_frame_index)
      return;

    // Move to the previous linked range, including tombstones.
    instance->current_frame_by_index = current.previous_index;
    // Only non-deleted ranges move the visible target index backward.
    Frame &previous = instance->frames[instance->current_frame_by_index];
    if (!previous.deleted)
      instance->index -= previous.frame_length;
  }
}
