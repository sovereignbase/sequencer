/**
 * @file
 * @brief Links one Strip between two Structural Order neighbours.
 */
#pragma once

#include "../../.declarations/projector/index.hpp"
#include "../subtree_end/index.hpp"
#include <cstdint>

/**
 * @brief Insert among siblings ordered by decreasing Strip start.
 * @pre The right neighbour is the largest existing sibling at this boundary,
 * or the first non-competing Strip after the insertion point.
 * @note A smaller sibling follows all descendants of the preceding sibling.
 * Realm changes alone do not delimit a causal subtree.
 * A direct split continuation is not a competing insertion operation.
 * @complexity O(s + d) for s traversed siblings and d descendants visited
 * when inserting after the currently smallest sibling.
 */
inline void insert_between(Projector &projector, std::uint32_t left_strip_index,
                           const std::uint32_t middle_strip_index,
                           std::uint32_t right_strip_index) noexcept {
  while (right_strip_index != u32_max &&
         projector.strip_type_of[right_strip_index] == 2) {
    left_strip_index = right_strip_index;
    right_strip_index = projector.right_strip_index_of[right_strip_index];
  }
  if (right_strip_index != u32_max &&
      (left_strip_index == u32_max ||
       projector.strip_type_of[left_strip_index] == 2 ||
       projector.larger_split_strip_index_of[left_strip_index] !=
           right_strip_index) &&
      !projector.is_fragment(right_strip_index) &&
      projector.previous_strip_end_of[right_strip_index] ==
          projector.previous_strip_end_of[middle_strip_index]) {
    std::uint32_t larger_sibling = u32_max;
    std::uint32_t smaller_sibling = right_strip_index;
    while (smaller_sibling != u32_max &&
           projector.strip_start_of[middle_strip_index] <
               projector.strip_start_of[smaller_sibling]) {
      larger_sibling = smaller_sibling;
      smaller_sibling =
          projector.smaller_competitor_strip_index_of[smaller_sibling];
    }

    projector.smaller_competitor_strip_index_of[middle_strip_index] =
        smaller_sibling;
    if (larger_sibling != u32_max)
      projector.smaller_competitor_strip_index_of[larger_sibling] =
          middle_strip_index;

    if (smaller_sibling != u32_max) {
      right_strip_index = smaller_sibling;
      left_strip_index = projector.left_strip_index_of[right_strip_index];
    } else {
      left_strip_index = subtree_end(projector, larger_sibling);
      right_strip_index = projector.right_strip_index_of[left_strip_index];
    }
  }

  if (left_strip_index == u32_max)
    projector.head_strip_index = middle_strip_index;
  else
    projector.right_strip_index_of[left_strip_index] = middle_strip_index;
  projector.left_strip_index_of[middle_strip_index] = left_strip_index;
  projector.right_strip_index_of[middle_strip_index] = right_strip_index;
  if (right_strip_index == u32_max)
    projector.tail_strip_index = middle_strip_index;
  else
    projector.left_strip_index_of[right_strip_index] = middle_strip_index;

  ++projector.materialized_strip_count;
}
