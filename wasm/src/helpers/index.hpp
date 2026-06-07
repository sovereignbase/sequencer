#pragma once

#include <cstdint>
#include <unordered_map>

#include "../types/type.hpp"

/**
 * @brief All wasm states keyed by their four-lane instance id.
 *
 * This is the only process-local registry for wasm instances. Each state owns a
 * linked range projection; deletes only mark tombstones.
 */
static std::unordered_map<Key, State, KeyHash> states_by_instance_id;

/**
 * @brief Find the mutable state for one four-lane instance id.
 *
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 * @return Pointer to the state, or nullptr when the instance is unknown.
 */
State *find_state_by_instance_id(std::uint32_t instance_id_a,
                                 std::uint32_t instance_id_b,
                                 std::uint32_t instance_id_c,
                                 std::uint32_t instance_id_d) {
  // Build the lookup key directly from the uint32 ABI lanes.
  auto iterator = states_by_instance_id.find(
      Key{instance_id_a, instance_id_b, instance_id_c, instance_id_d});

  // Unknown instances return nullptr instead of allocating implicit state.
  if (iterator == states_by_instance_id.end()) {
    return nullptr;
  }

  // unordered_map owns the State object; callers mutate it through the pointer.
  return &iterator->second;
}

/**
 * @brief Return the absolute distance between two uint32 indexes.
 *
 * @param left First index.
 * @param right Second index.
 * @return Absolute difference between left and right.
 */
std::uint32_t absolute_distance(std::uint32_t left, std::uint32_t right) {
  // Avoid signed arithmetic; all wasm ABI values are uint32.
  return left > right ? left - right : right - left;
}

/**
 * @brief Test whether target_index falls inside the cursor range.
 *
 * @param state State whose current range and cursor index are checked.
 * @param target_index Zero-based non-deleted target index.
 * @return True when target_index is inside state->current.
 */
bool current_range_contains_target(State *state, std::uint32_t target_index) {
  // The range starts at state->index and covers range_length visible slots.
  return (target_index >= state->index &&
          target_index < (state->index + state->current->range_length));
}

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

  // Tail index is the last visible index in the current projection.
  const std::uint32_t tail_index = state->size - 1;
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

  // Walk right when the cursor starts before the target.
  if (state->index < target_index) {
    // Stop as soon as the cursor range contains the target.
    while (!current_range_contains_target(state, target_index)) {
      // Advance to the next linked range, including tombstones.
      state->current = state->current->next_range;
      // Only non-deleted ranges move the visible target index forward.
      if (!state->current->deleted)
        state->index += state->current->range_length;
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

/**
 * @brief Split the cursor range and splice one patch range at target_index.
 *
 * Insert mode places patch_range between the left split and right split.
 * Tombstone mode also skips the deleted span when creating the right split.
 * Existing ranges are shortened or split; no existing range is physically
 * removed from the linked projection.
 *
 * @param target_index Inclusive target index where the patch starts.
 * @param patch_range Range object representing inserted or tombstoned entries.
 * @param state State whose current range contains target_index.
 * @param tombstone_patch True when patch_range represents a delete.
 */
void splice_range_at_current(std::uint32_t target_index, Range *patch_range,
                             State *state, bool tombstone_patch) {
  // The cursor range becomes the left split.
  Range *left_range = state->current;
  // Offset from the left range start to the patch start.
  std::uint32_t split_offset = absolute_distance(state->index, target_index);
  // Delete patches consume source entries before the right split starts.
  std::uint32_t right_offset =
      split_offset + (tombstone_patch ? patch_range->range_length : 0);
  // Insert patches shift the consumer reference of the right split rightward.
  std::uint32_t right_consumer_reference =
      left_range->consumer_reference + split_offset +
      (tombstone_patch ? 0 : patch_range->range_length);

  // Allocate the right split that remains after the patch range.
  Range *right_range =
      new Range{.this_id =
                    {
                        // The right split keeps the left range id prefix.
                        .a = left_range->this_id.a,
                        .b = left_range->this_id.b,
                        .c = left_range->this_id.c,
                        // Its start id is offset inside the original range.
                        .d = left_range->this_id.d + right_offset,
                    },
                // The right split is anchored after the patch range.
                .previous_id = patch_range->this_id,
                // Preserve the old successor behind the right split.
                .next_range = left_range->next_range,
                // Link the right split back to the patch range.
                .previous_range = patch_range,
                // Keep only the remaining entries after right_offset.
                .range_length = left_range->range_length - right_offset,
                // Point at the first consumer value represented on the right.
                .consumer_reference = right_consumer_reference,
                // The right split inherits the old range tombstone state.
                .deleted = left_range->deleted};

  // Patch range tombstone state follows the operation mode.
  patch_range->deleted = tombstone_patch;
  // Patch range is linked after the left split.
  patch_range->previous_range = left_range;
  // Patch range is linked before the right split.
  patch_range->next_range = right_range;

  // Repair the old successor's back link when the right split is not tail.
  if (right_range->next_range)
    right_range->next_range->previous_range = right_range;
  // Otherwise the right split becomes the projection tail.
  else
    state->last = right_range;

  // Shorten the left split so it ends before target_index.
  left_range->range_length = split_offset;
  // Link the left split to the patch range.
  left_range->next_range = patch_range;

  // Leave the cursor on the newly spliced patch range.
  state->current = patch_range;
  // The patch starts at target_index in visible coordinates.
  state->index = target_index;
  // Delete patches reduce visible size; insert patches increase it.
  if (tombstone_patch)
    state->size -= patch_range->range_length;
  else
    state->size += patch_range->range_length;
}

/**
 * @brief Compare two four-lane ids in lexicographic order.
 *
 * @param left Candidate left id.
 * @param right Candidate right id.
 * @return True when left sorts before right.
 */
bool key_is_before(Key left, Key right) {
  // Compare lane a first.
  if (left.a != right.a)
    return left.a < right.a;
  // Compare lane b only when lane a is equal.
  if (left.b != right.b)
    return left.b < right.b;
  // Compare lane c only when lanes a and b are equal.
  if (left.c != right.c)
    return left.c < right.c;
  // Lane d decides when all higher lanes are equal.
  return left.d < right.d;
}

/**
 * @brief Test whether a key is the root anchor.
 *
 * @param key Key to test.
 * @return True when all lanes are zero.
 */
bool key_is_root(Key key) {
  // Root is represented by the zero id in every lane.
  return key.a == 0 && key.b == 0 && key.c == 0 && key.d == 0;
}

/**
 * @brief Return the virtual item id at offset within a contiguous range.
 *
 * @param key First id in the range.
 * @param offset Offset inside the range.
 * @return Id at key + offset with carry across uint32 lanes.
 */
Key key_offset(Key key, std::uint32_t offset) {
  // Add offset to the lowest lane.
  std::uint64_t next = std::uint64_t(key.d) + offset;
  // Store the low 32 bits in lane d.
  key.d = std::uint32_t(next);
  // Carry overflow from d into lane c.
  next = std::uint64_t(key.c) + (next >> 32);
  // Store the low 32 bits in lane c.
  key.c = std::uint32_t(next);
  // Carry overflow from c into lane b.
  next = std::uint64_t(key.b) + (next >> 32);
  // Store the low 32 bits in lane b.
  key.b = std::uint32_t(next);
  // Carry overflow from b into lane a.
  key.a = std::uint32_t(std::uint64_t(key.a) + (next >> 32));
  // Return the offset id.
  return key;
}
