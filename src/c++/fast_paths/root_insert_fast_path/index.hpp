#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../auxiliary/strip_contains_sequence_point/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

[[nodiscard]] inline bool root_insert_fast_path(
    Projector *projector, const std::uint32_t strip_index,
    std::uint32_t &projection_frame_index) noexcept {
  const Strip &inserted_strip = projector->strips[strip_index];
  if (inserted_strip.is_masked != 0 || inserted_strip.is_inverse == 0)
    return false;

  std::uint32_t right = projector->head_strip_index;
  if (projection_frame_index == u32_max) {
    right = projector->right[projector->tail_strip_index];
    projection_frame_index = 0;
    const std::uint32_t first = right;
    while (strip_contains_sequence_point(
               &projector->strips[right],
               &inserted_strip.coordinate.previous_strip_end,
               projector->length[right]) == u32_max) {
      if (projector->strips[right].is_masked == 0)
        projection_frame_index += projector->length[right];
      right = projector->right[right];
      if (right == first) {
        projection_frame_index = u32_max;
        return true;
      }
    }
  }

  std::uint32_t left = projector->left[right];
  while (projector->strips[left].is_inverse != 0 &&
         projector->strips[left].coordinate.previous_strip_end ==
             inserted_strip.coordinate.previous_strip_end &&
         compare_sequence_points(
             &projector->strips[left].coordinate.this_strip_start,
             &inserted_strip.coordinate.this_strip_start) < 0) {
    projection_frame_index -= projector->length[left];
    right = left;
    left = projector->left[left];
  }

  projector->right[left] = strip_index;
  projector->left[strip_index] = left;
  projector->right[strip_index] = right;
  projector->left[right] = strip_index;
  ++projector->projection_generation;
  projector->projection_frame_count += projector->length[strip_index];
  if (projection_frame_index == 0)
    projector->head_strip_index = strip_index;
  projector->gate_strip_index = strip_index;
  projector->gate_projection_frame_index = projection_frame_index;
  return true;
}
