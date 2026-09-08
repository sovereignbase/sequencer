/**
 * @file
 * @brief Links one Strip between two Structural Order neighbours.
 */
#pragma once

#include "../../.declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Link one Strip into Structural Order.
 *
 * If the Strip has a larger competing sibling, it is placed immediately before
 * that competitor. Otherwise the left neighbour is advanced through any larger
 * split fragments before linking.
 *
 * @param projector Owning Projector.
 * @param left_strip_index Initial Strip on the insertion's left.
 * @param middle_strip_index Strip being inserted.
 * @param right_strip_index Initial Strip on the insertion's right.
 * @complexity O(s) for traversed split fragments, otherwise O(1).
 */
inline void insert_between(Projector &projector, std::uint32_t left_strip_index,
                           const std::uint32_t middle_strip_index,
                           std::uint32_t right_strip_index) noexcept {
  const std::uint32_t larger_competitor_strip_index =
      projector.larger_competitor_strip_index_of[middle_strip_index];

  if (larger_competitor_strip_index != u32_max) {
    right_strip_index = larger_competitor_strip_index;
    left_strip_index = projector.left_strip_index_of[right_strip_index];
  } else {
    while (projector.larger_split_strip_index_of[left_strip_index] != u32_max)
      left_strip_index =
          projector.larger_split_strip_index_of[left_strip_index];

    right_strip_index = projector.right_strip_index_of[left_strip_index];
  }

  projector.right_strip_index_of[left_strip_index] = middle_strip_index;
  projector.left_strip_index_of[middle_strip_index] = left_strip_index;
  projector.right_strip_index_of[middle_strip_index] = right_strip_index;
  projector.left_strip_index_of[right_strip_index] = middle_strip_index;

  ++projector.materialized_strip_count;
}