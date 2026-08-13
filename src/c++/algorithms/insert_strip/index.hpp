/**
 * @file
 * @brief Materializes one staged Strip in deterministic Structural Order.
 */
#pragma once

#include "../../auxiliary/insert_between/index.hpp"
#include "../../auxiliary/split_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Materialize one fully resolved visible Strip.
 * @param projector Owning Projector.
 * @param containing_strip_index Stable Position containing the dependency.
 * @param incoming_strip_index Stable Position of the staged Strip.
 * @param offset Dependency Frame offset in the containing Strip.
 * @param projection_frame_index Known insertion Projection position.
 * @return Materialized Projection position.
 */
[[nodiscard]] inline std::uint32_t insert_strip(
    Projector *projector, const std::uint32_t containing_strip_index,
    const std::uint32_t incoming_strip_index, const std::uint32_t offset,
    std::uint32_t projection_frame_index) noexcept {
  const Strip inserted_strip = projector->strips[incoming_strip_index];
  const std::uint32_t containing_frame_count =
      projector->length[containing_strip_index];
  const std::uint32_t split_frame_offset =
      offset + static_cast<std::uint32_t>(inserted_strip.is_inverse == 0);

  std::uint32_t left_position;
  std::uint32_t right_position;
  std::uint32_t parent_strip_index = containing_strip_index;
  if (split_frame_offset == 0) {
    left_position = projector->left[containing_strip_index];
    right_position = containing_strip_index;
  } else if (split_frame_offset == containing_frame_count) {
    left_position = containing_strip_index;
    right_position = projector->right[containing_strip_index];
  } else {
    left_position = containing_strip_index;
    right_position =
        split_strip(projector, containing_strip_index, split_frame_offset);
    if (inserted_strip.is_inverse != 0)
      parent_strip_index = right_position;
  }

  const std::int64_t sibling_frame_offset =
      insert_between(projector, left_position, incoming_strip_index,
                     right_position, true, parent_strip_index);
  projector->strips[parent_strip_index].child_strip_indices.push_back(
      incoming_strip_index);
  projection_frame_index = static_cast<std::uint32_t>(
      projection_frame_index + sibling_frame_offset);
  const std::uint32_t inserted_frame_count =
      projector->length[incoming_strip_index];
  const std::uint32_t previous_projection_frame_count =
      projector->projection_frame_count;

  ++projector->projection_generation;
  projector->projection_frame_count += inserted_frame_count;
  if (previous_projection_frame_count == 0) {
    projector->head_strip_index = incoming_strip_index;
    projector->tail_strip_index = incoming_strip_index;
  } else {
    std::uint32_t next_visible_strip_index = incoming_strip_index;
    do
      next_visible_strip_index = projector->right[next_visible_strip_index];
    while (projector->strips[next_visible_strip_index].is_masked != 0);
    std::uint32_t previous_visible_strip_index = incoming_strip_index;
    do
      previous_visible_strip_index =
          projector->left[previous_visible_strip_index];
    while (projector->strips[previous_visible_strip_index].is_masked != 0);
    if (inserted_strip.is_inverse != 0 &&
        next_visible_strip_index == projector->head_strip_index) {
      projector->head_strip_index = incoming_strip_index;
      projection_frame_index = 0;
    } else if (inserted_strip.is_inverse == 0 &&
               previous_visible_strip_index == projector->tail_strip_index) {
      projector->tail_strip_index = incoming_strip_index;
      projection_frame_index = previous_projection_frame_count;
    }
  }
  projector->gate_strip_index = incoming_strip_index;
  projector->gate_projection_frame_index = projection_frame_index;
  return projection_frame_index;
}
