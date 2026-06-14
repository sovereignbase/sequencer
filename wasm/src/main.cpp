#pragma once

// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>

// Strip, timecode, and projector contracts for the virtual list engine.
#include "./types/type.hpp"

// Gate walking, strip splicing, key ordering, and projector registry helpers.
#include "./helpers/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#include <emscripten/emscripten.h>

static std::vector<Projector> projectors;

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
/**
 * @name CREATE
 * Functions that allocate an instance.
 */
/// @{
/**
 * @brief Allocate an empty projector state for one replicated list instance.
 *
 * The instance id is supplied as four uint32 lanes. The wasm core keeps strip
 * metadata; JavaScript owns the footage and later addresses it through footage
 * codes returned by read operations.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t cue() {
  const std::uint32_t projector_index = projectors.size();

  projectors.push_back(Projector{
      {},                       // reel
      0,                        // reel length
      0,                        // gate position
      invalid_strip_indicator,  // first strip start position
      invalid_strip_indicator,  // gate strip start position
      invalid_strip_indicator,  // last strip start position
      {}                        // loose strips by previous timecode
  });

  return projector_index;
}
/// @}

/**
 * @name READ
 * Functions that resolve information for footage codes.
 */
/// @{
/**
 * @brief Return the number of visible positions in a projector.
 *

 * @return Current target-positionable reel length.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t size_of(std::uint32_t projector_index) {
  // Resolve the projector and return the visible reel length.
  Projector &projector = projectors[projector_index];
  return projector.reel_length;
}

/**
 * @brief Resolve a target position to the JavaScript-owned footage code.
 *
 * The target position addresses the visible projection. The returned value is
 * the footage code for the concrete value at that position. JavaScript uses the
 * returned uint32 as its own array/index/reference value.
 *
 * @param target_position Zero-based target position in the current projection.
 * @return JavaScript-owned footage code for the target entry.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t index_of(std::uint32_t projector_index,
                       std::uint32_t target_position) {
  // Resolve the projector to read from.
  Projector &projector = projectors[projector_index];
  // Move the gate to the strip containing target_position.
  find_strip_by_position(target_position, &projector);
  // Return the strip's footage code plus the offset inside the strip.
  return projector.reel[projector.gate_strip_start_position].footage_code +
         absolute_distance(projector.gate_position, target_position);
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t timecode_lane_of(std::uint32_t projector_index,
                               std::uint32_t target_position,
                               std::uint32_t lane_index) {
  // Resolve the projector to read from.
  Projector &projector = projectors[projector_index];
  // Move the gate to the strip containing target_position.
  find_strip_by_position(target_position, &projector);
  // Return the selected lane from the strip timecode.
  return projector.reel[projector.gate_strip_start_position]
      .timecode[lane_index];
}
/// @}

// APPLY
/**
 * @brief Apply one strip into the linked projection.
 *
 * Remote strips carry their CRDT anchor as previous timecode. Root-anchored
 * strips are inserted among root siblings. Non-root strips are inserted after
 * the strip containing previous timecode; if that anchor is not present yet,
 * UINT32_MAX is returned so JavaScript can replay the strip later.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t splice_strip(
    std::uint32_t projector_index, std::uint32_t footage_code,
    std::uint32_t masked_flag, std::uint32_t strip_length,
    std::uint32_t strip_timecode_first_32bits,
    std::uint32_t strip_timecode_second_32bits,
    std::uint32_t strip_timecode_third_32bits,
    std::uint32_t strip_timecode_fourth_32bits,
    std::uint32_t previous_strip_timecode_first_32bits,
    std::uint32_t previous_strip_timecode_second_32bits,
    std::uint32_t previous_strip_timecode_third_32bits,
    std::uint32_t previous_strip_timecode_fourth_32bits) {
  // Resolve the projector that receives this remote strip.
  Projector &projector = projectors[projector_index];

  // Allocate strip from the uint32 ABI values.
  const std::uint32_t this_strip_start_position = allocate_strip(
      &projector, footage_code, masked_flag, strip_length,
      strip_timecode_first_32bits, strip_timecode_second_32bits,
      strip_timecode_third_32bits, strip_timecode_fourth_32bits,
      previous_strip_timecode_first_32bits,
      previous_strip_timecode_second_32bits,
      previous_strip_timecode_third_32bits,
      previous_strip_timecode_fourth_32bits);

  Strip *this_strip = &projector.reel[this_strip_start_position];

  const std::uint32_t previous_strip_start_position =
      find_strip_start_position_by_timecode(
          &projector, this_strip->previous_strip_timecode);

  if (previous_strip_start_position == invalid_strip_indicator) {
    projector.loose_strip_start_positions_by_previous_timecode.insert(
        {this_strip->previous_strip_timecode, this_strip_start_position});

    return invalid_strip_indicator;
  }

  Strip *previous_strip = &projector.reel[previous_strip_start_position];
}
}
