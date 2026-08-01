#pragma once
#include "../../types/strip.hpp"
#include <cstdint>

inline std::int8_t
compare_sequence_point(const PointInSequence *left,
                       const PointInSequence *right) noexcept {

  if (left->unix_lower_bits != right->unix_lower_bits)
    return left->unix_lower_bits < right->unix_lower_bits ? -1 : 1;

  if (left->counter_bits != right->counter_bits)
    return left->counter_bits < right->counter_bits ? -1 : 1;

  if (left->random_bits != right->random_bits)
    return left->random_bits < right->random_bits ? -1 : 1;

  return 0;
}
