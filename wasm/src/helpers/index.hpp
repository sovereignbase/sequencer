#pragma once

#include <algorithm>
#include <cstdint>
#include <unordered_map>
#include <vector>

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
 * @brief Return one uint32 lane from a four-lane key.
 */
std::uint32_t key_lane(Key key, std::uint32_t lane) {
  // Lane zero is the first/highest uint32 segment.
  if (lane == 0)
    return key.a;
  // Lane one is the second uint32 segment.
  if (lane == 1)
    return key.b;
  // Lane two is the third uint32 segment.
  if (lane == 2)
    return key.c;
  // Lane three is the fourth/lowest uint32 segment.
  if (lane == 3)
    return key.d;
  // Invalid lanes return zero instead of crossing the ABI boundary with error
  // state.
  return 0;
}

Range *last_live_before(Range *range) {
  while (range && range->deleted)
    range = range->previous_range;
  return range;
}

Range *physical_tail(State *state) {
  Range *range = state ? state->first : nullptr;
  while (range && range->next_range)
    range = range->next_range;
  return range;
}

std::uint32_t visible_index_of_range(State *state, Range *target) {
  std::uint32_t index = 0;
  for (Range *range = state->first; range; range = range->next_range) {
    if (range == target)
      return index;
    if (!range->deleted)
      index += range->range_length;
  }
  return UINT32_MAX;
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
  erase_range_indexes(state, source);
  erase_range_indexes(state, patch_range);
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
  // Link right side or keep the visible tail on the nearest live range.
  if (right) {
    right->previous_range = patch_range;
    if (!right->next_range)
      state->last = last_live_before(right);
  } else {
    state->last = tombstone_patch ? last_live_before(left) : patch_range;
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

  if (left)
    state->ranges.insert({left->this_id, left});
  state->ranges.insert({patch_range->this_id, patch_range});
  if (right)
    state->ranges.insert({right->this_id, right});
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

bool range_contains_key(Range *range, Key key) {
  return key_distance(range->this_id, key) < range->range_length;
}

bool range_starts_immediately_after_key(Range *range, Key key) {
  return range->this_id == key_offset(key, 1);
}

bool range_is_right_split(Range *range) {
  if (key_is_root(range->previous_id))
    return false;
  return range_starts_immediately_after_key(range, range->previous_id) ||
         key_is_before(range->this_id, range->previous_id);
}

bool previous_id_is_inside_any_range(Key previous_id,
                                     const std::vector<Range *> &ranges) {
  for (Range *range : ranges)
    if (range_contains_key(range, previous_id))
      return true;
  return false;
}

/**
 * @brief Insert a root-anchored range among root siblings.
 *
 * Root siblings are ordered from largest id to smallest id.
 */
void insert_root_range(Range *range, State *state) {
  Range *right = state->first;
  range->previous_range = nullptr;
  std::vector<Range *> skipped_ranges;
  while (right) {
    if (key_is_root(right->previous_id)) {
      if (!key_is_before(range->this_id, right->this_id))
        break;
      skipped_ranges.push_back(right);
      range->previous_range = right;
      right = right->next_range;
      continue;
    }

    if (!previous_id_is_inside_any_range(right->previous_id, skipped_ranges))
      break;

    skipped_ranges.push_back(right);
    range->previous_range = right;
    right = right->next_range;
  }
  range->next_range = right;
  if (range->previous_range)
    range->previous_range->next_range = range;
  else
    state->first = range;
  if (right) {
    right->previous_range = range;
    if (right->deleted && right->next_range &&
        right->next_range->previous_id == right->this_id &&
        range_is_right_split(right->next_range))
      right->next_range->previous_id = range->this_id;
  } else if (!range->deleted)
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
  std::vector<Range *> skipped_ranges;
  while (right) {
    if (right->previous_id == range->previous_id) {
      if (range_is_right_split(right))
        break;
      if (!key_is_before(right->this_id, range->this_id))
        break;
      skipped_ranges.push_back(right);
      range->previous_range = right;
      right = right->next_range;
      continue;
    }

    if (!previous_id_is_inside_any_range(right->previous_id, skipped_ranges))
      break;

    skipped_ranges.push_back(right);
    range->previous_range = right;
    right = right->next_range;
  }
  range->next_range = right;
  range->previous_range->next_range = range;
  if (right) {
    if (right->previous_id == range->previous_id && range_is_right_split(right))
      right->previous_id = range->this_id;
    right->previous_range = range;
  } else if (!range->deleted)
    state->last = range;
}

bool current_range_contains_key(State *state, Key key) {
  return key_distance(state->current->this_id, key) <
         state->current->range_length;
}

bool walk_right_to_key(State *state, Key key) {
  while (state->current->next_range) {
    Range *previous = state->current;
    state->current = state->current->next_range;
    if (!previous->deleted)
      state->index += previous->range_length;
    if (current_range_contains_key(state, key))
      return true;
  }
  return false;
}

bool walk_left_to_key(State *state, Key key) {
  while (state->current->previous_range) {
    state->current = state->current->previous_range;
    if (!state->current->deleted)
      state->index -= state->current->range_length;
    if (current_range_contains_key(state, key))
      return true;
  }
  return false;
}

bool scan_from_head_to_key(State *state, Key key) {
  state->current = state->first;
  state->index = 0;
  while (state->current) {
    if (current_range_contains_key(state, key))
      return true;
    Range *previous = state->current;
    state->current = state->current->next_range;
    if (!previous->deleted)
      state->index += previous->range_length;
  }
  state->current = state->first;
  state->index = 0;
  return false;
}

bool find_range_containing_key(State *state, Key key) {
  if (!state || !state->first)
    return false;
  return scan_from_head_to_key(state, key);
}

void insert_regular_range_from_current_anchor(Range *range, State *state) {
  Range *left = state->current;
  Range *right = left->next_range;
  std::uint32_t index = state->index + (left->deleted ? 0 : left->range_length);
  std::vector<Range *> skipped_ranges;
  while (right) {
    if (right->previous_id == range->previous_id) {
      if (range_is_right_split(right))
        break;
      if (!key_is_before(right->this_id, range->this_id))
        break;
      skipped_ranges.push_back(right);
      left = right;
      if (!right->deleted)
        index += right->range_length;
      right = right->next_range;
      continue;
    }

    if (!previous_id_is_inside_any_range(right->previous_id, skipped_ranges))
      break;

    skipped_ranges.push_back(right);
    left = right;
    if (!right->deleted)
      index += right->range_length;
    right = right->next_range;
  }

  range->previous_range = left;
  range->next_range = right;
  left->next_range = range;
  if (right) {
    if (right->previous_id == range->previous_id && range_is_right_split(right))
      right->previous_id = range->this_id;
    right->previous_range = range;
  } else if (!range->deleted)
    state->last = range;

  state->current = range;
  state->index = index;
  state->size += range->range_length;
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

/**
 * @brief Return right's uint32 offset from left, or UINT32_MAX if unrelated.
 */
std::uint32_t key_distance(Key left, Key right) {
  std::uint32_t offset = right.d - left.d;
  return key_offset(left, offset) == right ? offset : std::uint32_t(-1);
}

bool key_is_at_or_before(Key left, Key right) {
  return left == right || key_is_before(left, right);
}

Key range_end(Range *range) {
  return key_offset(range->this_id, range->range_length - 1);
}

void reset_cursor(State *state) {
  state->current = state->first;
  state->index = 0;
  state->last = nullptr;
  for (Range *range = state->first; range; range = range->next_range)
    if (!range->deleted)
      state->last = range;
}

void erase_range_indexes(State *state, Range *range) {
  for (auto iterator = state->ranges.begin();
       iterator != state->ranges.end();) {
    if (iterator->second == range)
      iterator = state->ranges.erase(iterator);
    else
      ++iterator;
  }
}

bool state_has_deleted_range(State *state) {
  for (Range *range = state ? state->first : nullptr; range;
       range = range->next_range)
    if (range->deleted)
      return true;
  return false;
}

Key deleted_frontier(State *state) {
  Key frontier{0, 0, 0, 0};
  for (Range *range = state ? state->first : nullptr; range;
       range = range->next_range) {
    if (!range->deleted)
      continue;
    Key end = range_end(range);
    if (key_is_before(frontier, end))
      frontier = end;
  }
  return frontier;
}

void unlink_deleted_range(State *state, Range *range) {
  Range *left = range->previous_range;
  Range *right = range->next_range;
  if (left)
    left->next_range = right;
  else
    state->first = right;
  if (right)
    right->previous_range = left;
  erase_range_indexes(state, range);
  delete range;
}

void collect_deleted_until_key(State *state, Key frontier) {
  if (!state)
    return;

  for (Range *range = state->first; range;) {
    Range *next = range->next_range;
    if (!range->deleted) {
      range = next;
      continue;
    }

    Key end = range_end(range);
    if (key_is_at_or_before(end, frontier)) {
      unlink_deleted_range(state, range);
      range = next;
      continue;
    }

    if (key_is_at_or_before(range->this_id, frontier)) {
      std::uint32_t removed = key_distance(range->this_id, frontier) + 1;
      if (removed >= range->range_length) {
        unlink_deleted_range(state, range);
      } else {
        erase_range_indexes(state, range);
        range->this_id = key_offset(range->this_id, removed);
        range->range_length -= removed;
        range->consumer_reference += removed;
        state->ranges.insert({range->this_id, range});
      }
    }
    range = next;
  }

  reset_cursor(state);
}

bool range_precedes(Range *left, Range *right) {
  if (left == right)
    return false;

  if (left->previous_id == right->previous_id) {
    if (key_is_root(left->previous_id))
      return key_is_before(right->this_id, left->this_id);
    bool left_is_right_split = range_is_right_split(left);
    bool right_is_right_split = range_is_right_split(right);
    if (left_is_right_split != right_is_right_split)
      return right_is_right_split;
    return key_is_before(left->this_id, right->this_id);
  }

  if (key_is_before(left->previous_id, right->previous_id))
    return true;
  if (key_is_before(right->previous_id, left->previous_id))
    return false;
  return key_is_before(left->this_id, right->this_id);
}

void normalize_state_order(State *state) {
  if (!state || !state->first)
    return;

  std::vector<Range *> ranges;
  for (Range *range = state->first; range; range = range->next_range)
    ranges.push_back(range);
  std::stable_sort(ranges.begin(), ranges.end(), range_precedes);

  state->first = ranges.front();
  state->last = nullptr;
  state->size = 0;
  for (std::size_t index = 0; index < ranges.size(); index++) {
    Range *range = ranges[index];
    range->previous_range = index == 0 ? nullptr : ranges[index - 1];
    range->next_range = index + 1 < ranges.size() ? ranges[index + 1] : nullptr;
    if (!range->deleted) {
      state->last = range;
      state->size += range->range_length;
    }
  }
  state->current = state->first;
  state->index = 0;
}
