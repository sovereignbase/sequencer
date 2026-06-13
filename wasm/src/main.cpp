#pragma once

// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>

// Range, key, and state contracts for the virtual list engine.
#include "./types/type.hpp"

// Cursor walking, range splicing, key ordering, and state registry helpers.
#include "./helpers/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#include <emscripten/emscripten.h>

static std::vector<Instance *> instances;

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
/**
 * @name CREATE
 * Functions that allocate an instance.
 */
/// @{
/**
 * @brief Allocate an empty range engine state for one replicated list instance.
 *
 * The instance id is supplied as four uint32 lanes. The wasm core keeps only
 * virtual range metadata; JavaScript owns the actual values and later addresses
 * them through consumer references returned by read operations.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t add_instance() {
  const std::uint32_t id = instances.size();

  instances.push_back(new Instance{
      {},      // all frames
      {},      // pending ranges waiting for their previous range
      {},      // ranges addressable by start id
      0,       // current target index
      0,       // non-deleted length
      nullptr, // first projected range
      nullptr, // cursor range
      nullptr  // last projected range
  });

  return id;
}
/// @}

/**
 * @name READ
 * Functions that resolve information for a consumer consumer references.
 */
/// @{
/**
 * @brief Return the number of non-tombstoned entries in an instance.
 *

 * @return Current target-indexable entry count.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t size_of(std::uint32_t instance_id) {
  // Resolve the state and return the visible, non-tombstoned size.
  Instance *instance = instances[instance_id];
  return instance->size;
}

/**
 * @brief Resolve a target index to the JavaScript-owned consumer reference.
 *
 * The target index addresses the non-tombstoned projection. The returned
 * value is the consumer reference for the concrete entry at that index.
 * JavaScript uses the returned uint32 as its own array/index/reference value.
 *
 * @param target_index Zero-based target index in the current projection.
 * @return JavaScript-owned consumer reference for the target entry.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t index_of(std::uint32_t instance_id, std::uint32_t target_index) {
  // Resolve the instance to read from.
  Instance *instance = instances[instance_id];
  // Move the cursor to the range containing target_index.
  find_target_frame(target_index, instance);
  // Return the range's consumer reference plus the offset inside the range.
  return instance->current->items_index +
         absolute_distance(instance->index, target_index);
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t timestamp_lane_of(std::uint32_t instance_id,
                                std::uint32_t target_index,
                                std::uint32_t lane_index) {
  // Resolve the instance to read from.
  Instance *instance = instances[instance_id];
  // Move the cursor to the range containing target_index.
  find_target_frame(target_index, instance);
  // Return the range's consumer reference plus the offset inside the range.
  return instance->current->this_timestamp[lane_index];
}
/// @}

// APPLY
/**
 * @brief Apply one frame into the linked projection.
 *
 * Remote frames carry their CRDT anchor as previous_id. Root-anchored ranges
 * are inserted among root siblings. Non-root ranges are inserted after the
 * range containing previous_id; if that anchor is not present yet, UINT32_MAX
 * is returned so JavaScript can replay the range later.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t virtualizeFrame(std::uint32_t instance_id,
                              std::uint32_t items_index,
                              std::uint32_t deleted_flag,
                              std::uint32_t frame_length,
                              std::uint32_t frame_timestamp_first_32bits,
                              std::uint32_t frame_timestamp_second_32bits,
                              std::uint32_t frame_timestamp_third_32bits,
                              std::uint32_t frame_timestamp_fourth_32bits,
                              std::uint32_t previous_timestamp_first_32bits,
                              std::uint32_t previous_timestamp_second_32bits,
                              std::uint32_t previous_timestamp_third_32bits,
                              std::uint32_t previous_timestamp_fourth_32bits) {
  // Resolve the state that receives this remote range.
  State *state = instances[instance_id];

  // Allocate range metadata from the uint32 ABI values.
  Range *patch_range = create_range(
      range_length, consumer_reference, deleted_flag,
      frame_timestamp_first_32bits, frame_timestamp_second_32bits,
      frame_timestamp_third_32bits, frame_timestamp_fourth_32bits,
      previous_timestamp_first_32bits, previous_timestamp_second_32bits,
      previous_timestamp_third_32bits, previous_timestamp_fourth_32bits);

  auto existing_range = state->ranges.find(patch_range->this_id);
  if (!patch_range->deleted && existing_range != state->ranges.end() &&
      existing_range->second->this_id == patch_range->this_id) {
    std::uint32_t index = visible_index_of_range(state, existing_range->second);
    delete patch_range;
    return index;
  }
  if (patch_range->deleted && existing_range != state->ranges.end() &&
      existing_range->second->this_id == patch_range->this_id &&
      existing_range->second->deleted) {
    std::uint32_t index = visible_index_of_range(state, existing_range->second);
    delete patch_range;
    return index;
  }
  if (patch_range->deleted && existing_range != state->ranges.end()) {
    state->current = existing_range->second;
    state->index = visible_index_of_range(state, state->current);
    splice_range_at_current(state->index, patch_range, state, true);
    normalize_state_order(state);
    return state->index;
  }

  // Tombstones target the deleted virtual id itself, not the predecessor slot.
  if (patch_range->deleted) {
    // Tombstone lookup starts from the projection head.
    state->index = 0;
    // Keep the shared cursor aligned with the search.
    state->current = state->first;
    // Walk until the range containing this tombstone id is found.
    while (state->current) {
      // Measure whether range_id falls inside the current projected range.
      std::uint32_t offset =
          key_distance(state->current->this_id, patch_range->this_id);
      // A contained id gives the exact visible target index for the tombstone.
      if (offset < state->current->range_length) {
        // Duplicate tombstones over already-deleted ranges are no-ops.
        if (state->current->deleted) {
          delete patch_range;
          return state->index;
        }
        // Make the linked tombstone addressable by its virtual id.
        state->ranges.insert({patch_range->this_id, patch_range});
        // Replace the target id span with the tombstone range.
        splice_range_at_current(state->index + offset, patch_range, state,
                                true);
        normalize_state_order(state);
        // Return the visible index where the tombstone was applied.
        return state->index;
      }
      // Only live ranges advance visible index coordinates.
      if (!state->current->deleted)
        state->index += state->current->range_length;
      // Move to the next projected range, tombstones included.
      state->current = state->current->next_range;
    }
    // Missing target: let JavaScript keep and replay this range later.
    return UINT32_MAX;
  }

  // Root ranges do not need an existing predecessor anchor.
  if (key_is_root(patch_range->previous_id)) {
    // Make the linked range addressable by its first virtual id.
    state->ranges.insert({patch_range->this_id, patch_range});
    // Insert among root siblings using deterministic root ordering.
    insert_root_range(patch_range, state);
    // Live root inserts increase visible length.
    if (!patch_range->deleted)
      state->size += patch_range->range_length;
  } else {
    // Locate the projected range that contains previous_id by walking from the
    // current cursor in id order first, then falling back to the other side.
    if (!find_range_containing_key(state, patch_range->previous_id))
      return UINT32_MAX;

    // Make the linked range addressable by its first virtual id only after the
    // anchor is known locally.
    state->ranges.insert({patch_range->this_id, patch_range});

    std::uint32_t offset =
        key_distance(state->current->this_id, patch_range->previous_id);
    if (offset + 1 < state->current->range_length) {
      // previous_id is inside a larger range, so split at that item.
      splice_range_at_current(state->index + offset + 1, patch_range, state,
                              false);
    } else {
      // previous_id is the last id in this range, so insert among siblings.
      insert_regular_range_from_current_anchor(patch_range, state);
    }
  }

  // Rewind cursor to compute the first visible index touched by patch_range.
  normalize_state_order(state);
  state->index = 0;
  // Start the index scan at the projection head.
  state->current = state->first;
  // Walk until the inserted range is reached.
  while (state->current != patch_range) {
    // Only live ranges contribute to visible index.
    if (!state->current->deleted)
      state->index += state->current->range_length;
    // Continue through the linked projection.
    state->current = state->current->next_range;
  }
  // Return the visible index where the remote patch starts.
  return state->index;
}

// ACKNOWLEDGE
EMSCRIPTEN_KEEPALIVE
std::uint32_t has_deleted_range(std::uint32_t instance_id_a,
                                std::uint32_t instance_id_b,
                                std::uint32_t instance_id_c,
                                std::uint32_t instance_id_d) {
  return state_has_deleted_range(find_state_by_instance_id(
             instance_id_a, instance_id_b, instance_id_c, instance_id_d))
             ? 1
             : 0;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_deleted_frontier(std::uint32_t lane,
                                   std::uint32_t instance_id_a,
                                   std::uint32_t instance_id_b,
                                   std::uint32_t instance_id_c,
                                   std::uint32_t instance_id_d) {
  Key frontier = deleted_frontier(find_state_by_instance_id(
      instance_id_a, instance_id_b, instance_id_c, instance_id_d));
  return key_lane(frontier, lane);
}

// GARBAGE COLLECT
EMSCRIPTEN_KEEPALIVE
void collect_deleted_until(
    std::uint32_t frontier_id_a, std::uint32_t frontier_id_b,
    std::uint32_t frontier_id_c, std::uint32_t frontier_id_d,
    std::uint32_t instance_id_a, std::uint32_t instance_id_b,
    std::uint32_t instance_id_c, std::uint32_t instance_id_d) {
  collect_deleted_until_key(
      find_state_by_instance_id(instance_id_a, instance_id_b, instance_id_c,
                                instance_id_d),
      Key{frontier_id_a, frontier_id_b, frontier_id_c, frontier_id_d});
}

// SNAPSHOT

/**
 * @brief Return the amount of projected ranges for an instance.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_amount(std::uint32_t instance_id_a,
                               std::uint32_t instance_id_b,
                               std::uint32_t instance_id_c,
                               std::uint32_t instance_id_d) {
  // Resolve the state by its four uint32 instance id lanes.
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
  // Count linked ranges, including tombstones.
  std::uint32_t amount = 0;
  // Walk from head to tail without materializing any JS-visible objects.
  for (Range *range = state ? state->first : nullptr; range;
       range = range->next_range)
    // Each linked node is one projected range.
    amount++;
  // Return the scalar count to JavaScript.
  return amount;
}

/**
 * @brief Return one id lane from a projected range.
 *
 * previous_flag selects this_id when zero and previous_id otherwise.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_id(std::uint32_t range_index,
                           std::uint32_t previous_flag, std::uint32_t lane,
                           std::uint32_t instance_id_a,
                           std::uint32_t instance_id_b,
                           std::uint32_t instance_id_c,
                           std::uint32_t instance_id_d) {
  // Resolve the projected range by linked-list index.
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  // Out-of-bounds reads return zero lanes.
  if (!range)
    return 0;
  // Return either the range id or its predecessor id lane.
  return key_lane(previous_flag ? range->previous_id : range->this_id, lane);
}

/**
 * @brief Return the length of a projected range.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_length(std::uint32_t range_index,
                               std::uint32_t instance_id_a,
                               std::uint32_t instance_id_b,
                               std::uint32_t instance_id_c,
                               std::uint32_t instance_id_d) {
  // Resolve the projected range by linked-list index.
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  // Missing ranges have zero length at the scalar boundary.
  return range ? range->range_length : 0;
}

/**
 * @brief Return the JavaScript value reference for a projected range.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_consumer_reference(std::uint32_t range_index,
                                           std::uint32_t instance_id_a,
                                           std::uint32_t instance_id_b,
                                           std::uint32_t instance_id_c,
                                           std::uint32_t instance_id_d) {
  // Resolve the projected range by linked-list index.
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  // Missing ranges point at zero so the ABI stays scalar-only.
  return range ? range->consumer_reference : 0;
}

/**
 * @brief Return whether a projected range is tombstoned.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_deleted(std::uint32_t range_index,
                                std::uint32_t instance_id_a,
                                std::uint32_t instance_id_b,
                                std::uint32_t instance_id_c,
                                std::uint32_t instance_id_d) {
  // Resolve the projected range by linked-list index.
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  // Return uint32 boolean: one for tombstone, zero for live or missing.
  return range && range->deleted ? 1 : 0;
}
}
