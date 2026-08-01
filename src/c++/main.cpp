// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>
#include <vector>

// Strip, timecode, and projector contracts for the virtual list engine.
#include "./types/sequence.hpp"

// Gate walking, strip splicing, key ordering, and projector registry helpers.
#include "./auxiliary/index.hpp"

#include "./strip_buffer/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

// Stores all instances of a sequences.
static std::vector<SequenceState> sequences;

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
EMSCRIPTEN_KEEPALIVE
std::uint32_t initialize_new_sequence() {
  const std::uint32_t sequence_id =
      static_cast<std::uint32_t>(sequences.size());
  sequences.emplace_back();

  return sequence_id;
}

EMSCRIPTEN_KEEPALIVE
void clear_sequence_by_id(std::uint32_t sequence_id){
    delete sequences[sequence_id]}

EMSCRIPTEN_KEEPALIVE std::uint32_t
    get_length_of(std::uint32_t sequence_id) noexcept {
  return sequences[sequence_id].length;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_footage_position_of(std::uint32_t sequence_id,
                                      std::uint32_t frame_index) {
  SequenceState *sequence = &sequences[sequence_id];
  find_strip_by_frame_index(frame_index, sequence);
  const StripOfSequence &strip =
      sequence->index.get(sequence->gate_strip_start);
  return strip.footage_position + frame_index - sequence->gate_position;
}

EMSCRIPTEN_KEEPALIVE
void get_sequence_strip_of(std::uint32_t sequence_id,
                           std::uint32_t frame_index) {
  SequenceState *sequence = &sequences[sequence_id];
  find_strip_by_frame_index(frame_index, sequence);
  write_to_strip_buffer(sequence->index.get(sequence->gate_strip_start));
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t *get_strip_buffer_pointer() noexcept { return strip_buffer; }

EMSCRIPTEN_KEEPALIVE
void merge_strip_to(std::uint32_t sequence_id) {
  SequenceState *sequence = &sequences[sequence_id];
  StripOfSequence strip = read_from_strip_buffer();
  //
  const auto previous_strip_result =
      find_strip_by_sequence_point(sequence, &strip.previous_strip_start);
  if (std::holds_alternative<bool>(previous_strip_result)) {
    strip.loose = true;
    return;
  }
  [[maybe_unused]] const auto [previous_strip, previous_strip_offset] =
      std::get<0>(previous_strip_result);
  //

  if (is_masked_strip) {
  }
  //
  sequence->index.set(strip.this_strip_start, strip);

  const bool is_first_strip = sequence->index.size() == 0;
  if (is_first_strip) {
    sequence->first_strip_start = strip.this_strip_start;
    sequence->gate_strip_start = strip.this_strip_start;
  }
  //
  if (false) {
  }
}
}
