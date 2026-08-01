// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>

// Strip, timecode, and projector contracts for the virtual list engine.
#include "./types/type.hpp"

// Gate walking, strip splicing, key ordering, and projector registry helpers.
#include "./auxiliary/index.hpp"

#include "./strip_buffer/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#include <emscripten/emscripten.h>

// Stores all instances of a sequences.
static std::vector<SequenceState> sequences;

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
EMSCRIPTEN_KEEPALIVE
std::uint32_t initialize_new_sequence() {
  const std::uint32_t sequence_id = sequences.size();
  sequences.emplace_back();

  return sequence_id;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_length_of(std::uint32_t sequence_id) {
  return sequences[sequence_id].length;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_footage_position_of(std::uint32_t sequence_id,
                                      std::uint32_t frame_index) {
  SequenceState *sequence = &sequences[sequence_id];
  find_strip_by_frame_index(frame_index, sequence);
  const StripOfSequence &strip =
      sequence->index.get(sequence->gate_strip_start);
  return strip.footage_position +
         absolute_distance(sequence->gate_position, frame_index);
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_sequence_strip_of(std::uint32_t sequence_id,
                                    std::uint32_t frame_index) {
  SequenceState *sequence = &sequences[sequence_id];
  find_strip_by_frame_index(frame_index, sequence);
  const StripOfSequence &strip =
      sequence->index.get(sequence->gate_strip_start);
  return strip.footage_position +
         absolute_distance(sequence->gate_position, frame_index);
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t *get_strip_buffer_pointer() { return strip_buffer; }

/// @{
EMSCRIPTEN_KEEPALIVE
void apply_strip_to(std::uint32_t sequence_id) {
  // Resolve the projector state that receives this strip.
  Sequencestate &projector = Sequences[sequence_id];

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
}
}
