#pragma once

#include "../compare_sequence_points/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

inline void insert_between(Projector *projector, std::uint32_t left,
                           const std::uint32_t middle,
                           std::uint32_t right) noexcept {
  const Strip &inserted_strip = projector->strips[middle];
  const SequencePoint &previous_strip_end =
      inserted_strip.coordinate.previous_strip_end;

  if (inserted_strip.is_masked == 0 &&
      inserted_strip.left_siblings_frames == 0 &&
      inserted_strip.right_sibling_frames == 0) {
    if (inserted_strip.is_inverse == 0) {
      while (projector->strips[right].coordinate.previous_strip_end ==
             previous_strip_end) {
        const Strip &sibling = projector->strips[right];
        SequencePoint sibling_start = sibling.coordinate.this_strip_start;
        sibling_start.counter_bits -= sibling.left_siblings_frames;
        if (compare_sequence_points(
                &sibling_start,
                &inserted_strip.coordinate.this_strip_start) >= 0)
          break;
        left = right;
        right = projector->right[right];
      }
    } else {
      while (projector->strips[left].coordinate.previous_strip_end ==
             previous_strip_end) {
        const Strip &sibling = projector->strips[left];
        SequencePoint sibling_start = sibling.coordinate.this_strip_start;
        sibling_start.counter_bits -= sibling.left_siblings_frames;
        if (compare_sequence_points(
                &sibling_start,
                &inserted_strip.coordinate.this_strip_start) <= 0)
          break;
        right = left;
        left = projector->left[left];
      }
    }
  }

  projector->right[left] = middle;
  projector->left[middle] = left;
  projector->right[middle] = right;
  projector->left[right] = middle;
}
