#include "../../types/type.hpp"
#include "../absolute_distance/index.hpp"
#include <cstdint>

/**
 * @brief Move the state cursor to the range containing target_index.
 *
 * The target index is counted through non-tombstoned ranges only. Tombstoned
 * ranges stay linked but do not advance state->index while walking.
 *
 * @param target_index Zero-based non-deleted target index.
 * @param state State whose current range and index are updated.
 */
void find_target_range(std::uint32_t target_index, State *state) {

  // Unknown state has no cursor to move.
  if (state == nullptr) {
    return;
  }

  // Start with the distance from the current cursor to the target.
  std::uint32_t distance = absolute_distance(state->index, target_index);

  // Distance from the projection head is the target index itself.
  const std::uint32_t head_distance = target_index;

  // If the head is closer than current, start the walk at first.
  if (head_distance < distance) {
    state->index = 0;
    state->current = state->first;
    distance = head_distance;
  }

  // Tail cursor index is the start of the last visible range.
  const std::uint32_t tail_index = state->size - state->last->range_length;
  // Compute distance from the visible tail to the target.
  const std::uint32_t tail_distance =
      absolute_distance(tail_index, target_index);

  // If tail is closest, start the walk at last.
  if (tail_distance < distance) {
    state->index = tail_index;
    state->current = state->last;
  }

  // If the selected cursor already contains target, no walk is needed.
  if (current_range_contains_target(state, target_index)) {
    return;
  }

  // Walk right when the cursor starts before the target or sits on a tombstone.
  if (state->index < target_index || state->current->deleted) {
    // Stop as soon as the cursor range contains the target.
    while (!current_range_contains_target(state, target_index)) {
      Range *previous = state->current;
      // Advance to the next linked range, including tombstones.
      state->current = state->current->next_range;
      // Only the range walked over moves the visible target index forward.
      if (!previous->deleted)
        state->index += previous->range_length;
    }
    return;
  }

  // Walk left when the cursor starts after the target.
  while (!current_range_contains_target(state, target_index)) {
    // Move to the previous linked range, including tombstones.
    state->current = state->current->previous_range;
    // Only non-deleted ranges move the visible target index backward.
    if (!state->current->deleted)
      state->index -= state->current->range_length;
  }
}