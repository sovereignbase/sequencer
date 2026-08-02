/**
 * @file
 * @brief Defines deterministic total ordering for sequence points.
 *
 * Ordering compares the Unix component first, the realm counter second, and
 * the random realm discriminator only as the final tie-break. Randomness never
 * takes priority over either ordered component of a point. Visible insertion
 * uses this order ascending after a non-Root point and descending after Root,
 * without retaining an ordering direction.
 */
#pragma once

#include "../../declarations/sequence_point/index.hpp"
#include <cstdint>

/**
 * @brief Compare two sequence points in deterministic total order.
 *
 * @param left_sequence_point Left comparison operand.
 * @param right_sequence_point Right comparison operand.
 * @return `-1` when left precedes right, `1` when right precedes left, and `0`
 * when both points are equal.
 * @pre Both pointers are non-null.
 * @note Root-specific reversal belongs to `insert_strip`; this comparator
 * carries no mutable or retained placement state.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline std::int8_t
compare_sequence_points(const SequencePoint *left_sequence_point,
                        const SequencePoint *right_sequence_point) noexcept {
  // Order first by the Realm's Unix component.
  if (left_sequence_point->unix_lower_bits !=
      right_sequence_point->unix_lower_bits)
    return left_sequence_point->unix_lower_bits <
                   right_sequence_point->unix_lower_bits
               ? -1
               : 1;

  // Order next by the lineage counter.
  if (left_sequence_point->counter_bits != right_sequence_point->counter_bits)
    return left_sequence_point->counter_bits <
                   right_sequence_point->counter_bits
               ? -1
               : 1;

  // Use the random Realm discriminator only as the final tie-break.
  if (left_sequence_point->random_bits != right_sequence_point->random_bits)
    return left_sequence_point->random_bits < right_sequence_point->random_bits
               ? -1
               : 1;

  // Report exact component equality.
  return 0;
}
