#pragma once

#include <cstdint>
#include <unordered_map>

#include "../types/type.hpp"

// All wasm state is virtual and addressed by four uint32 lanes supplied by JS.
// Ranges are kept in one linked projection; deletes only mark tombstones.
static std::unordered_map<Key, State, KeyHash> states_by_instance_id;

// Returns the mutable list state for an instance id.
State *find_state_by_instance_id(std::uint32_t instance_id_a,
                                 std::uint32_t instance_id_b,
                                 std::uint32_t instance_id_c,
                                 std::uint32_t instance_id_d) {
  auto iterator = states_by_instance_id.find(
      Key{instance_id_a, instance_id_b, instance_id_c, instance_id_d});

  if (iterator == states_by_instance_id.end()) {
    return nullptr;
  }

  return &iterator->second;
}
std::uint32_t absolute_distance(std::uint32_t left, std::uint32_t right) {
  return left > right ? left - right : right - left;
}

// True when target_index falls inside the current cursor range.
bool current_range_contains_target(State *state, std::uint32_t target_index) {
  return (target_index >= state->index &&
          target_index < (state->index + state->current->range_length));
}

// Finds the range that contains target_index and stores it in state->current.
// state->index becomes that range's starting target index.
void find_target_range(std::uint32_t target_index, State *state) {

  if (state == nullptr) {
    return;
  }

  std::uint32_t distance = absolute_distance(state->index, target_index);

  const std::uint32_t head_distance = target_index;

  if (head_distance < distance) {
    state->index = 0;
    state->current = state->first;
    distance = head_distance;
  }

  const std::uint32_t tail_index = state->size - 1;
  const std::uint32_t tail_distance =
      absolute_distance(tail_index, target_index);

  if (tail_distance < distance) {
    state->index = tail_index;
    state->current = state->last;
  }

  if (current_range_contains_target(state, target_index)) {
    return;
  }

  if (state->index < target_index) {
    while (!current_range_contains_target(state, target_index)) {
      state->current = state->current->next_range;
      if (!state->current->deleted)
        state->index += state->current->range_length;
    }
    return;
  }

  while (!current_range_contains_target(state, target_index)) {
    state->current = state->current->previous_range;
    if (!state->current->deleted)
      state->index -= state->current->range_length;
  }
}

// Splits the cursor range and splices one patch range between left and right.
void splice_range_at_current(std::uint32_t target_index, Range *patch_range,
                             State *state, bool tombstone_patch) {
  Range *left_range = state->current;
  std::uint32_t split_offset = absolute_distance(state->index, target_index);
  std::uint32_t right_offset =
      split_offset + (tombstone_patch ? patch_range->range_length : 0);
  std::uint32_t right_consumer_reference =
      left_range->consumer_reference + split_offset +
      (tombstone_patch ? 0 : patch_range->range_length);

  Range *right_range =
      new Range{.this_id =
                    {
                        .a = left_range->this_id.a,
                        .b = left_range->this_id.b,
                        .c = left_range->this_id.c,
                        .d = left_range->this_id.d + right_offset,
                    },
                .previous_id = patch_range->this_id,
                .next_range = left_range->next_range,
                .previous_range = patch_range,
                .range_length = left_range->range_length - right_offset,
                .consumer_reference = right_consumer_reference,
                .deleted = left_range->deleted};

  patch_range->deleted = tombstone_patch;
  patch_range->previous_range = left_range;
  patch_range->next_range = right_range;

  if (right_range->next_range)
    right_range->next_range->previous_range = right_range;
  else
    state->last = right_range;

  left_range->range_length = split_offset;
  left_range->next_range = patch_range;

  state->current = patch_range;
  state->index = target_index;
  if (tombstone_patch)
    state->size -= patch_range->range_length;
  else
    state->size += patch_range->range_length;
}

// Lexicographic id order over the four uint32 lanes.
bool key_is_before(Key left, Key right) {
  if (left.a != right.a)
    return left.a < right.a;
  if (left.b != right.b)
    return left.b < right.b;
  if (left.c != right.c)
    return left.c < right.c;
  return left.d < right.d;
}

bool key_is_root(Key key) {
  return key.a == 0 && key.b == 0 && key.c == 0 && key.d == 0;
}

// Returns the virtual item id at offset within a contiguous range.
Key key_offset(Key key, std::uint32_t offset) {
  std::uint64_t next = std::uint64_t(key.d) + offset;
  key.d = std::uint32_t(next);
  next = std::uint64_t(key.c) + (next >> 32);
  key.c = std::uint32_t(next);
  next = std::uint64_t(key.b) + (next >> 32);
  key.b = std::uint32_t(next);
  key.a = std::uint32_t(std::uint64_t(key.a) + (next >> 32));
  return key;
}
