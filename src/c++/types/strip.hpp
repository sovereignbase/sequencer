#pragma once

#include <cstdint>

struct PointInSequence {
  std::uint32_t unix_lower_bits;
  std::uint32_t counter_bits;
  std::uint32_t random_bits;
};

struct StripOfSequence {
  std::uint32_t mask;
  std::uint32_t length;
  std::uint32_t footage_position;
  PointInSequence this_strip_start;
  PointInSequence next_strip_start;
  PointInSequence previous_strip_start;
  bool loose;
};
