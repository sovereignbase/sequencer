#pragma once

#include "../types/type.hpp"

inline std::uint32_t strip_buffer[9];

inline void write_to_strip_buffer(const StripOfSequence &strip) noexcept {
  strip_buffer[0] = strip.mask;
  strip_buffer[1] = strip.length;
  strip_buffer[2] = strip.footage_position;

  strip_buffer[3] = strip.this_strip_start.random;
  strip_buffer[4] = strip.this_strip_start.unix_low_ms;
  strip_buffer[5] = strip.this_strip_start.counter;

  strip_buffer[6] = strip.previous_strip_start.random;
  strip_buffer[7] = strip.previous_strip_start.unix_low_ms;
  strip_buffer[8] = strip.previous_strip_start.counter;
}

[[nodiscard]] inline StripOfSequence read_from_strip_buffer() noexcept {
  return StripOfSequence{.mask = strip_buffer[0],
                         .length = strip_buffer[1],
                         .footage_position = strip_buffer[2],
                         .this_strip_start{
                             .random = strip_buffer[3],
                             .unix_low_ms = strip_buffer[4],
                             .counter = strip_buffer[5],
                         },
                         .previous_strip_start{
                             .random = strip_buffer[6],
                             .unix_low_ms = strip_buffer[7],
                             .counter = strip_buffer[8],
                         },
                         .next_strip_start{
                             .random = max_uint32,
                             .unix_low_ms = max_uint32,
                             .counter = max_uint32,
                         }};
}