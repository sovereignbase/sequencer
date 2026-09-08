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
 * Strips sharing the same `previous_strip_end` are ordered by `strip_start`,
 * with larger Sequence Points placed farther right.
 *
 * Split fragments remain attached to their original Strip before sibling
 * ordering continues.
 *
 * @param projector Owning Projector.
 * @param left_strip_index Initial Strip on the insertion's left.
 * @param middle_strip_index Strip being inserted.
 * @param right_strip_index Initial Strip on the insertion's right.
 * @complexity O(s) for competing siblings and split fragments.
 */
inline void insert_between(Projector &projector, std::uint32_t left_strip_index,
                           const std::uint32_t middle_strip_index,
                           std::uint32_t right_strip_index) noexcept {
  const SequencePoint &previous_strip_end =
      projector.previous_strip_end_of[middle_strip_index];
  const SequencePoint &strip_start =
      projector.strip_start_of[middle_strip_index];

  while (projector.previous_strip_end_of[right_strip_index] ==
             previous_strip_end &&
         projector.strip_start_of[right_strip_index] < strip_start) {
    left_strip_index = right_strip_index;

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