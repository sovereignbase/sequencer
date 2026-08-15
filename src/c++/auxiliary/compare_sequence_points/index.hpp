/**
 * @file
 * @brief Defines deterministic total ordering for Sequence Points.
 *
 * Ordering compares the crypto-random component first, the Unix component
 * second, and the counter component last.
 */
#pragma once

#include "../../declarations/sequence_point/index.hpp"
#include <cstdint>

/**
 * @brief Compare two Sequence Points in deterministic total order.
 *
 * @param left_sequence_point Left comparison operand.
 * @param right_sequence_point Right comparison operand.
 * @return `-1` when left is smaller than right, `0` when left is the same as
 * right, and `1` when left is larger than right.
 * @pre Both pointers are non-null.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline std::int8_t
compare_sequence_points(const SequencePoint *left_sequence_point,
                        const SequencePoint *right_sequence_point) noexcept {
  if (left_sequence_point->crypto_random_bits !=
      right_sequence_point->crypto_random_bits)
    return left_sequence_point->crypto_random_bits <
                   right_sequence_point->crypto_random_bits
               ? -1
               : 1;

  if (left_sequence_point->unix_lower_bits !=
      right_sequence_point->unix_lower_bits)
    return left_sequence_point->unix_lower_bits <
                   right_sequence_point->unix_lower_bits
               ? -1
               : 1;

  if (left_sequence_point->counter_bits != right_sequence_point->counter_bits)
    return left_sequence_point->counter_bits <
                   right_sequence_point->counter_bits
               ? -1
               : 1;

  return 0;
}