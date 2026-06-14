#pragma once

// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>

// Range, key, and state contracts for the virtual list engine.
#include "./types/type.hpp"

// Cursor walking, range splicing, key ordering, and state registry helpers.
#include "./helpers/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#include <emscripten/emscripten.h>

static std::vector<Instance> projectors;

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
std::uint32_t add_projector() {
  const std::uint32_t id = instances.size();

  instances.push_back(Instance{
      {}, // all frames
      {}, // pending ranges waiting for their previous range
      {}, // ranges addressable by start id
      0,  // the part where one frame is held in position to be projected.
      0,  // non-deleted length
      invalid_frame_index, // first projected range
      invalid_frame_index, // cursor range
      invalid_frame_index  // last projected range
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
  Instance &instance = instances[instance_id];
  return instance.size;
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
  Instance &instance = instances[instance_id];
  // Move the cursor to the range containing target_index.
  find_target_frame(target_index, &instance);
  // Return the range's consumer reference plus the offset inside the range.
  return instance.frames[instance.current_frame_by_index].items_index +
         absolute_distance(instance.index, target_index);
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t timestamp_lane_of(std::uint32_t instance_id,
                                std::uint32_t target_index,
                                std::uint32_t lane_index) {
  // Resolve the instance to read from.
  Instance &instance = instances[instance_id];
  // Move the cursor to the range containing target_index.
  find_target_frame(target_index, &instance);
  // Return the range's consumer reference plus the offset inside the range.
  return instance.frames[instance.current_frame_by_index]
      .this_timestamp[lane_index];
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
std::uint32_t splice_frame(std::uint32_t instance_id,
                           std::uint32_t content_index,
                           std::uint32_t hidden_flag,
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
  Instance &instance = instances[instance_id];

  // Allocate range from the uint32 ABI values.
  const std::uint32_t this_frame_index = allocate_frame(
      &instance, items_index, deleted_flag, frame_length,
      frame_timestamp_first_32bits, frame_timestamp_second_32bits,
      frame_timestamp_third_32bits, frame_timestamp_fourth_32bits,
      previous_timestamp_first_32bits, previous_timestamp_second_32bits,
      previous_timestamp_third_32bits, previous_timestamp_fourth_32bits);

  Frame *this_frame = &instance.frames[this_frame_index];

  const std::uint32_t previous_frame_index =
      find_frame_index_by_timestamp(&instance, this_frame->previous_timestamp);

  if (previous_frame_index == invalid_frame_index) {
    instance.pending_frame_indices_by_their_previous_timestamp.insert(
        {this_frame->previous_timestamp, this_frame_index});

    return invalid_frame_index;
  }

  Frame *previous_frame = &instance.frames[previous_frame_index];
}
}
