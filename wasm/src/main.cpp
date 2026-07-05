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

alignas(16) static std::uint32_t timecode_buffer[4];
void write_to_timecode_buffer(const Timecode &timecode) {
  timecode_buffer[0] = timecode.lanes[0]; // highest 32 bits
  timecode_buffer[1] = timecode.lanes[1];
  timecode_buffer[2] = timecode.lanes[2];
  timecode_buffer[3] = timecode.lanes[3]; // lowest 32 bits
}

alignas(16) static std::uint32_t previous_timecode_buffer[4];
void write_to_previous_timecode_buffer(const Timecode &timecode) {
  previous_timecode_buffer[0] = timecode.lanes[0]; // highest 32 bits
  previous_timecode_buffer[1] = timecode.lanes[1];
  previous_timecode_buffer[2] = timecode.lanes[2];
  previous_timecode_buffer[3] = timecode.lanes[3]; // lowest 32 bits
}

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
//
EMSCRIPTEN_KEEPALIVE
std::uint32_t *timecode_buffer_pointer() { return timecode_buffer; }
//
EMSCRIPTEN_KEEPALIVE
std::uint32_t *previous_timecode_buffer_pointer() {
  return previous_timecode_buffer;
}

/// @{
EMSCRIPTEN_KEEPALIVE
std::uint32_t cue() {
  const std::uint32_t projector_id = projectors.size();

  projectors.push_back(Projector{
      {},         // reel
      0,          // reel length
      0,          // gate position
      max_uint32, // first strip start position
      max_uint32, // gate strip start position
      max_uint32, // last strip start position
      {}          // loose strips by previous timecode
  });

  return projector_id;
}
/// @}

/// @{
EMSCRIPTEN_KEEPALIVE
std::uint32_t size_of(std::uint32_t projector_id) {
  // Resolve the projector and return the visible reel length.
  Projector &projector = projectors[projector_id];
  return projector.reel_length;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t footage_code_of(std::uint32_t projector_id,
                              std::uint32_t target_position) {
  // Resolve the projector to read from.
  Projector &projector = projectors[projector_id];
  // Move the gate to the strip containing target_position.
  find_strip_by_position(target_position, &projector);
  // Return the strip's footage code plus the offset inside the strip.
  return projector.reel[projector.gate_strip_start_position].footage_code +
         absolute_distance(projector.gate_position, target_position);
}

EMSCRIPTEN_KEEPALIVE
void timecodes_of(std::uint32_t projector_id, std::uint32_t target_position) {
  // Resolve the projector to read from.
  Projector projector = projectors[projector_id];
  // Move the gate to the strip containing target_position.
  find_strip_by_position(target_position, &projector);

  const Strip *strip = &projector.reel[projector.gate_strip_start_position];
  // Write the strip timecode and previous timecode for JavaScript to read.
  write_to_timecode_buffer(strip->timecode);
  write_to_previous_timecode_buffer(strip->previous_strip_timecode);
  return;
}
/// @}

/// @{
EMSCRIPTEN_KEEPALIVE
std::uint32_t splice(std::uint32_t projector_id, std::uint32_t footage_code,
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
  Projector &projector = projectors[projector_id];

  // Allocate strip from the uint32 ABI values.
  const std::uint32_t this_strip_start_position =
      allocate_strip(&projector, footage_code, masked_flag, strip_length,
                     strip_timecode_first_32bits, strip_timecode_second_32bits,
                     strip_timecode_third_32bits, strip_timecode_fourth_32bits,
                     previous_strip_timecode_first_32bits,
                     previous_strip_timecode_second_32bits,
                     previous_strip_timecode_third_32bits,
                     previous_strip_timecode_fourth_32bits);

  Strip *this_strip = &projector.reel[this_strip_start_position];

  const std::uint32_t offset = find_strip_by_timecode_and_length(
      &projector, &this_strip->previous_strip_timecode, this_strip->length);

  const std::uint32_t previous_strip_start_position =
      projector.gate_strip_start_position;

  if (offset == max_uint32 || previous_strip_start_position == max_uint32) {
    projector.loose_strip_start_positions_by_previous_timecode.insert(
        {this_strip->previous_strip_timecode, this_strip_start_position});
    return max_uint32;
  }

  clip_strip_at_offset(&projector, this_strip_start_position,
                       previous_strip_start_position, offset);

  return footage_code;
}
/// @}
}
