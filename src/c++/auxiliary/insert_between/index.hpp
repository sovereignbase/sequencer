/**
 * @file
 * @brief Links one Stable Position between two structural neighbours.
 */
#pragma once

#include "../compare_sequence_points/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Sibling-sort and link one Strip into the dense circular chain.
 *
 * A visible unsplit Strip scans only adjacent siblings whose
 * `previous_strip_end` exactly matches its own. Forward placement advances
 * across smaller original source starts; inverse placement advances in the
 * opposite dense direction across larger starts. Split fragments bypass this
 * sort because their source position has already been established.
 *
 * The final four assignments update both directions of both affected edges.
 *
 * @param projector Owning Projector.
 * @param left Initial Stable Position on the insertion's left.
 * @param middle Stable Position being inserted.
 * @param right Initial Stable Position on the insertion's right.
 * @param sort_siblings Whether to apply deterministic sibling ordering.
 * @return Projection Frame displacement caused by sibling ordering.
 * @pre All positions index `strips`, `left`, and `right`.
 * @post `middle` has mutually consistent dense neighbours and the surrounding
 * chain remains bidirectional.
 * @complexity O(s) for s adjacent competing siblings; O(1) without sorting.
 */
inline std::int64_t insert_between(Projector *projector, std::uint32_t left,
                                  const std::uint32_t middle,
                                  std::uint32_t right,
                                  const bool sort_siblings = true) noexcept {
  const Strip &inserted_strip = projector->strips[middle];
  const SequencePoint &previous_strip_end =
      inserted_strip.coordinate.previous_strip_end;
  std::int64_t projection_frame_offset = 0;

  if (sort_siblings && inserted_strip.is_masked == 0) {
    if (inserted_strip.is_inverse == 0) {
      const std::uint32_t first_candidate = right;
      while (projector->strips[right].coordinate.previous_strip_end ==
             previous_strip_end) {
        const Strip &sibling = projector->strips[right];
        SequencePoint sibling_start = sibling.coordinate.this_strip_start;
        if (compare_sequence_points(
                &sibling_start,
                &inserted_strip.coordinate.this_strip_start) >= 0)
          break;
        projection_frame_offset += sibling.is_masked == 0
                                       ? sibling.frame_count
                                       : 0;
        left = right;
        right = projector->right[right];
        if (right == first_candidate)
          break;
      }
    } else {
      const std::uint32_t first_candidate = left;
      while (projector->strips[left].coordinate.previous_strip_end ==
             previous_strip_end) {
        const Strip &sibling = projector->strips[left];
        SequencePoint sibling_start = sibling.coordinate.this_strip_start;
        if (compare_sequence_points(
                &sibling_start,
                &inserted_strip.coordinate.this_strip_start) >= 0)
          break;
        projection_frame_offset -= sibling.is_masked == 0
                                       ? sibling.frame_count
                                       : 0;
        right = left;
        left = projector->left[left];
        if (left == first_candidate)
          break;
      }
    }
  }

  projector->right[left] = middle;
  projector->left[middle] = left;
  projector->right[middle] = right;
  projector->left[right] = middle;
  return projection_frame_offset;
}
