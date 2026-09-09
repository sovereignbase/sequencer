/**
 * @file
 * @brief Links one Strip between two Structural Order neighbours.
 */
#pragma once

#include "../../.declarations/projector/index.hpp"
#include "../strip_contains_previous_strip_end/index.hpp"
#include <cstdint>

/**
 * @brief Link one Strip into Structural Order.
 *
 * Strips sharing the same `previous_strip_end` are ordered by `strip_start`,
 * with larger Sequence Points placed farther right.
 *
 * Competing siblings are traversed through `larger_competitor_strip_index_of`.
 * When the incoming Strip is larger than the last known sibling, its insertion
 * point advances past that sibling's causal continuation before linking.
 *
 * @param projector Owning Projector.
 * @param left_strip_index Initial Strip on the insertion's left.
 * @param middle_strip_index Strip being inserted.
 * @param right_strip_index Initial Strip on the insertion's right.
 * @complexity O(s + d), where `s` is traversed competitors and `d` is the
 * causal continuation traversed after the last smaller competitor.
 */
inline void insert_between(Projector &projector, std::uint32_t left_strip_index,
                           const std::uint32_t middle_strip_index,
                           std::uint32_t right_strip_index) noexcept {
  const SequencePoint &strip_start =
      projector.strip_start_of[middle_strip_index];

  std::uint32_t competitor_strip_index = right_strip_index;

  while (projector.previous_strip_end_of[competitor_strip_index] ==
             projector.previous_strip_end_of[middle_strip_index] &&
         projector.strip_start_of[competitor_strip_index] < strip_start) {
    left_strip_index = competitor_strip_index;

    const std::uint32_t larger_competitor_strip_index =
        projector.larger_competitor_strip_index_of[competitor_strip_index];

    if (larger_competitor_strip_index == u32_max) {
      projector.larger_competitor_strip_index_of[competitor_strip_index] =
          middle_strip_index;

      while (projector.larger_split_strip_index_of[left_strip_index] != u32_max)
        left_strip_index =
            projector.larger_split_strip_index_of[left_strip_index];

      right_strip_index = projector.right_strip_index_of[left_strip_index];

      while (strip_contains_previous_strip_end(
                 projector.strip_start_of[left_strip_index],
                 projector.strip_length_of[left_strip_index],
                 projector.previous_strip_end_of[right_strip_index]) !=
             u32_max) {
        left_strip_index = right_strip_index;
        right_strip_index = projector.right_strip_index_of[right_strip_index];
      }

      break;
    }

    competitor_strip_index = larger_competitor_strip_index;
    right_strip_index = competitor_strip_index;
  }

  projector.right_strip_index_of[left_strip_index] = middle_strip_index;
  projector.left_strip_index_of[middle_strip_index] = left_strip_index;
  projector.right_strip_index_of[middle_strip_index] = right_strip_index;
  projector.left_strip_index_of[right_strip_index] = middle_strip_index;

  ++projector.materialized_strip_count;
}