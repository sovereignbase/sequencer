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
 * @brief Allocate one range metadata node from raw uint32 ABI values.
 */
Range *create_range(std::uint32_t range_length,
                    std::uint32_t consumer_reference,
                    std::uint32_t deleted_flag, std::uint32_t range_id_a,
                    std::uint32_t range_id_b, std::uint32_t range_id_c,
                    std::uint32_t range_id_d, std::uint32_t previous_id_a,
                    std::uint32_t previous_id_b, std::uint32_t previous_id_c,
                    std::uint32_t previous_id_d) {
  return new Range{.this_id = {.a = range_id_a,
                               .b = range_id_b,
                               .c = range_id_c,
                               .d = range_id_d},
                   .previous_id = {.a = previous_id_a,
                                   .b = previous_id_b,
                                   .c = previous_id_c,
                                   .d = previous_id_d},
                   .next_range = nullptr,
                   .previous_range = nullptr,
                   .range_length = range_length,
                   .consumer_reference = consumer_reference,
                   .deleted = deleted_flag > 0};
}

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

Key key_offset(Key key, std::uint32_t offset);

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

  // Walk right when the cursor starts before the target.
  if (state->index < target_index) {
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
  // Source is the range currently containing target_index.
  Range *source = state->current;
  // Start with source's old neighbors; empty sides are skipped below.
  Range *left = source->previous_range;
  Range *right = source->next_range;
  // Non-empty left side keeps source as the left range.
  std::uint32_t left_length = absolute_distance(state->index, target_index);
  // Delete patches consume entries before the right side starts.
  std::uint32_t right_offset =
      left_length + (tombstone_patch ? patch_range->range_length : 0);
  // Non-empty right side starts at right_offset inside source.
  std::uint32_t right_length = source->range_length - right_offset;

  // Keep source as the left range only when the left side has entries.
  if (left_length) {
    source->range_length = left_length;
    left = source;
    // Create a right split only when entries remain after the patch.
    if (right_length) {
      Key right_id = key_offset(source->this_id, right_offset);
      right = create_range(
          right_length, source->consumer_reference + right_offset,
          source->deleted ? 1 : 0, right_id.a, right_id.b, right_id.c,
          right_id.d, patch_range->this_id.a, patch_range->this_id.b,
          patch_range->this_id.c, patch_range->this_id.d);
      right->next_range = source->next_range;
    }
    // If left side is empty, reuse source as the right range when possible.
  } else if (right_length) {
    source->this_id = key_offset(source->this_id, right_offset);
    source->previous_id = patch_range->this_id;
    source->range_length = right_length;
    source->consumer_reference += right_offset;
    right = source;
  }

  // Patch range tombstone state follows the operation mode.
  patch_range->deleted = tombstone_patch;
  // Patch links between the nearest non-empty left and right ranges.
  patch_range->previous_range = left;
  patch_range->next_range = right;

  // Link left side or make patch the head.
  if (left)
    left->next_range = patch_range;
  else
    state->first = patch_range;
  // Link right side or make patch the tail.
  if (right) {
    right->previous_range = patch_range;
    if (!right->next_range)
      state->last = right;
  } else {
    state->last = patch_range;
  }
  if (right && right->next_range)
    right->next_range->previous_range = right;

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
 * @brief Insert a root-anchored range among root siblings.
 *
 * Root siblings are ordered from largest id to smallest id.
 */
void insert_root_range(Range *range, State *state) {
  Range *right = state->first;
  range->previous_range = nullptr;
  while (right && key_is_root(right->previous_id) &&
         key_is_before(range->this_id, right->this_id))
    range->previous_range = right, right = right->next_range;
  range->next_range = right;
  if (range->previous_range)
    range->previous_range->next_range = range;
  else
    state->first = range;
  if (right)
    right->previous_range = range;
  else
    state->last = range;
}

/**
 * @brief Insert a non-root range after its previous_id anchor.
 *
 * Normal siblings are ordered from smallest id to largest id.
 */
void insert_regular_range(Range *range, State *state) {
  range->previous_range = state->ranges.find(range->previous_id)->second;
  Range *right = range->previous_range->next_range;
  while (right && right->previous_id == range->previous_id &&
         key_is_before(right->this_id, range->this_id))
    range->previous_range = right, right = right->next_range;
  range->next_range = right;
  range->previous_range->next_range = range;
  if (right)
    right->previous_range = range;
  else
    state->last = range;
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
