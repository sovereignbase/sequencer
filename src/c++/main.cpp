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

alignas(16) inline static SequencePoint clock_state = [] {
  SequencePoint initial{};
  std::uint8_t random_bytes[10];

  if (getentropy(random_bytes, sizeof random_bytes) != 0) {
    std::abort();
  }

  const auto unix_time_ms =
      std::chrono::duration_cast<std::chrono::milliseconds>(
          std::chrono::system_clock::now().time_since_epoch())
          .count();

  uuidv7_generate(reinterpret_cast<std::uint8_t *>(initial.lanes),
                  static_cast<std::uint64_t>(unix_time_ms), random_bytes,
                  nullptr);

  if constexpr (std::endian::native == std::endian::little) {
    initial.lanes[0] = std::byteswap(initial.lanes[0]);
    initial.lanes[1] = std::byteswap(initial.lanes[1]);
    initial.lanes[2] = std::byteswap(initial.lanes[2]);
    initial.lanes[3] = std::byteswap(initial.lanes[3]);
  }

  return initial;
}();

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
  return SequencePoint{{buffer[0], buffer[1], buffer[2], buffer[3]}};
}

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
/// @{
EMSCRIPTEN_KEEPALIVE
std::uint32_t cue_projector() {
  const std::uint32_t projector_id = projectors.size();
  projectors.push_back(ProjectorState{
      {},         // reel
      0,          // reel length
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
  ProjectorState &projector = projectors[projector_id];
  return projector.reel_length;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t footage_position_of(std::uint32_t projector_id,
                                  std::uint32_t index) {
  ProjectorState &projector = projectors[projector_id];
  find_strip_by_index(index, &projector);
  return projector.reel[projector.gate_strip_start_position].footage_position +
         absolute_distance(projector.gate_position, index);
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
void next_sequence_point() {
  if (++clock_state.lanes[3] == 0 && ++clock_state.lanes[2] == 0 &&
      ++clock_state.lanes[1] == 0) {
    ++clock_state.lanes[0];
  }
  write_to_strip_start_buffer(clock_state, this_strip_start_buffer);
}

EMSCRIPTEN_KEEPALIVE
void splice_sequence(std::uint32_t projector_id, std::uint32_t footage_code,
                     std::uint8_t masked_flag, std::uint32_t strip_length) {
  // Resolve the projector that receives this remote strip.
  ProjectorState &projector = projectors[projector_id];

  // Allocate strip from the uint32 ABI values.
  const std::uint32_t this_strip_start_position =
      allocate_strip(&projector, strip_length, masked_flag, footage_code,
                     read_from_strip_start_buffer(this_strip_start_buffer),
                     read_from_strip_start_buffer(previous_strip_start_buffer));

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

  if (offset == max_uint32 || previous_strip_start_position == max_uint32) {
    // build a loose reel and add it to the main reel in reverse.
    projector.loose_strip_start_by_previous_strip_start.insert(
        {this_strip->previous_strip_start, this_strip_start_position});
  }

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
