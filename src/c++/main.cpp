// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>

// Strip, timecode, and projector contracts for the virtual list engine.
#include "./types/type.hpp"

// Gate walking, strip splicing, key ordering, and projector registry helpers.
#include "./helpers/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#include <emscripten/emscripten.h>

#include "uuidv7.h"
#include <bit>
#include <chrono>
#include <cstdlib>
#include <sys/random.h>

static std::vector<ProjectorState> projectors;

//// @brief CLOCK
static SequencePoint clock_state = [] {
  std::uint8_t random_bytes[12];

  if (getentropy(random_bytes, sizeof random_bytes) != 0) {
    std::abort();
  }

  SequencePoint value = 0;

  for (std::uint32_t i = 0; i < 12; ++i) {
    value = (value << 8) | random_bytes[i];
  }

  return value << 32;
}();
////

alignas(16) static std::uint32_t this_strip_start_buffer[4];
alignas(16) static std::uint32_t previous_strip_start_buffer[4];

void write_to_strip_start_buffer(const SequencePoint &strip_start,
                                 std::uint32_t *buffer) {
  buffer[0] = strip_start.lanes[0];
  buffer[1] = strip_start.lanes[1];
  buffer[2] = strip_start.lanes[2];
  buffer[3] = strip_start.lanes[3];
}

SequencePoint read_from_strip_start_buffer(const std::uint32_t *buffer) {
  return (static_cast<SequencePoint>(buffer[0]) << 96) |
         (static_cast<SequencePoint>(buffer[1]) << 64) |
         (static_cast<SequencePoint>(buffer[2]) << 32) |
         static_cast<SequencePoint>(buffer[3]);
}

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
/// @{
EMSCRIPTEN_KEEPALIVE
std::uint32_t cue_projector() {
  const std::uint32_t projector_id = projectors.size();
  projectors.push_back(ProjectorState{
      {},         // reel
      0,          // sequence length
      0,          // gate position
      max_uint32, // first strip start position
      max_uint32, // gate strip start position
      max_uint32, // last strip start position
      {}          // loose strips by previous strip start SequencePoint
  });

  return projector_id;
}
/// @}

/// @{
EMSCRIPTEN_KEEPALIVE
std::uint32_t length_of(std::uint32_t projector_id) {
  ProjectorState *projector = &projectors[projector_id];
  return projector->reel_length;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t footage_position_of(std::uint32_t projector_id,
                                  std::uint32_t index) {
  ProjectorState *projector = &projectors[projector_id];
  find_strip_by_index(index, projector);
  return projector->reel[projector->gate_strip_start_position]
             .footage_position +
         absolute_distance(projector->gate_position, index);
}

EMSCRIPTEN_KEEPALIVE
void this_strip_start_of(std::uint32_t projector_id, std::uint32_t index) {
  ProjectorState *projector = &projectors[projector_id];
  find_strip_by_index(index, projector);
  const SequenceStrip *strip =
      &projector->reel[projector->gate_strip_start_position];
  write_to_strip_start_buffer(strip->this_strip_start, this_strip_start_buffer);
  return;
}

EMSCRIPTEN_KEEPALIVE
void previous_strip_start_of(std::uint32_t projector_id, std::uint32_t index) {
  // Resolve the projector to read from.
  ProjectorState projector = projectors[projector_id];
  find_strip_by_index(index, &projector);
  const SequenceStrip *strip =
      &projector.reel[projector.gate_strip_start_position];
  write_to_strip_start_buffer(strip->previous_strip_start,
                              previous_strip_start_buffer);
  return;
}
/// @}

/// @{
EMSCRIPTEN_KEEPALIVE
void next_sequence_point(std::uint32_t length) {
  clock_state += length;

  this_strip_start_buffer[0] = static_cast<std::uint32_t>(clock_state >> 96);
  this_strip_start_buffer[1] = static_cast<std::uint32_t>(clock_state >> 64);
  this_strip_start_buffer[2] = static_cast<std::uint32_t>(clock_state >> 32);
  this_strip_start_buffer[3] = static_cast<std::uint32_t>(clock_state);
}

EMSCRIPTEN_KEEPALIVE
void apply_strip(std::uint32_t projector_id, std::uint32_t footage_position,
                 std::uint8_t masked_flag, std::uint32_t strip_length) {
  // Resolve the projector state that receives this strip.
  ProjectorState &projector = projectors[projector_id];

  // Give the data a shape and allocate it to a position in a vector holding
  // this reel.
  const std::uint32_t this_strip_start_position = virtualize_sequence_strip(
      &projector, strip_length, masked_flag, footage_position,
      read_from_strip_start_buffer(this_strip_start_buffer),
      read_from_strip_start_buffer(previous_strip_start_buffer));

  // Collect a pointer to this strip in the reel vector
  const SequenceStrip *this_strip = &projector.reel[this_strip_start_position];

  const std::uint32_t previous_strip_start_position =
      find_strip_by_sequence_point(projector, this_strip->previous_strip_start)

          if (!this_strip.masked) {
    projector->reel_length += length;
  }

  if (projector.first_strip_start_position == max_uint32) {
    projector.first_strip_start_position = this_strip_start_position;
    projector.gate_strip_start_position = this_strip_start_position;
    projector.gate_position = 0;
  }

  SequenceStrip *this_strip = &projector.reel[this_strip_start_position];

  const std::uint32_t offset = find_strip_by_sequence_point(
      &projector, &this_strip->previous_strip_start, this_strip->length);

  const std::uint32_t previous_strip_start_position =
      projector.gate_strip_start_position;

  // if previous strip could not be found (not recieved yet)
  if (offset == max_uint32 || previous_strip_start_position == max_uint32) {
    // build a loose reel and add it to the main reel in reverse.
    projector.loose_strip_start_by_previous_strip_start.insert(
        {this_strip->previous_strip_start, this_strip_start_position});
    return;
  }

  // if we were able to find the previous strip start by splitting the previous
  // strip after the offset

  clip_strip_at_offset(&projector, this_strip_start_position,
                       previous_strip_start_position, offset);
}
/// @}
EMSCRIPTEN_KEEPALIVE
std::uint32_t *this_strip_start_buffer_pointer() {
  return this_strip_start_buffer;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t *previous_strip_start_buffer_pointer() {
  return previous_strip_start_buffer;
}
}
