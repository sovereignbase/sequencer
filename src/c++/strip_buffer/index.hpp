#pragma once

#include "../types/sequence.hpp"

inline std::uint32_t strip_buffer[9];

inline void write_to_strip_buffer(const StripOfSequence &strip) noexcept {
  strip_buffer[0] = strip.mask;
  strip_buffer[1] = strip.length;
  strip_buffer[2] = strip.footage_position;

  strip_buffer[3] = strip.this_strip_start.random_bits;
  strip_buffer[4] = strip.this_strip_start.unix_lower_bits;
  strip_buffer[5] = strip.this_strip_start.counter_bits;

  strip_buffer[6] = strip.previous_strip_start.random_bits;
  strip_buffer[7] = strip.previous_strip_start.unix_lower_bits;
  strip_buffer[8] = strip.previous_strip_start.counter_bits;
}

[[nodiscard]] inline StripOfSequence read_from_strip_buffer() noexcept {
  return StripOfSequence{.mask = strip_buffer[0],
                         .length = strip_buffer[1],
                         .footage_position = strip_buffer[2],
                         .this_strip_start{
                             .unix_lower_bits = strip_buffer[4],
                             .counter_bits = strip_buffer[5],
                             .random_bits = strip_buffer[3],
                         },
                         .next_strip_start{
                             .unix_lower_bits = max_uint32,
                             .counter_bits = max_uint32,
                             .random_bits = max_uint32,
                         },
                         .previous_strip_start{
                             .unix_lower_bits = strip_buffer[7],
                             .counter_bits = strip_buffer[8],
                             .random_bits = strip_buffer[6],
                         }};
}
