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
void find_target_frame(std::uint32_t target_index, Instance *instance) {
  // If the selected cursor already contains target, no walk is needed.
  if (current_frame_contains_target(instance, target_index))
    return;

  // Start with the distance from the current cursor to the target.
  std::uint32_t distance = absolute_distance(instance->index, target_index);

  // Distance from the projection head is the target index itself.
  const std::uint32_t head_distance = target_index;

  // If the head is closer than current, start the walk at first.
  if (head_distance < distance) {
    instance->index = 0;
    instance->current = instance->first;
    distance = head_distance;
  }

  // Tail cursor index is the start of the last visible range.
  const std::uint32_t tail_index =
      instance->size - instance->last->range_length;
  // Compute distance from the visible tail to the target.
  const std::uint32_t tail_distance =
      absolute_distance(tail_index, target_index);

  // If tail is closest, start the walk at last.
  if (tail_distance < distance) {
    instance->index = tail_index;
    instance->current = instance->last;
  }

  // If the selected cursor already contains target, no walk is needed.
  if (current_frame_contains_target(instance, target_index))
    return;

  // Walk right when the cursor starts before the target or sits on a
  // tombstone.
  if (instance->index < target_index || instance->current->deleted) {
    // Stop as soon as the cursor range contains the target.
    while (!current_frame_contains_target(instance, target_index)) {
      Frame *previous = instance->current;
      // Advance to the next linked range, including tombstones.
      instance->current = instance->frames[instance->current->next_index];
      // Only the range walked over moves the visible target index forward.
      if (!previous->deleted)
        instance->index += previous->range_length;
    }
    return;
  }

  // Walk left when the cursor starts after the target.
  while (!current_frame_contains_target(instance, target_index)) {
    // Move to the previous linked range, including tombstones.
    instance->current = instance->frames[instance->current->previous_index];
    // Only non-deleted ranges move the visible target index backward.
    if (!instance->current->deleted)
      instance->index -= instance->current->range_length;
  }
}