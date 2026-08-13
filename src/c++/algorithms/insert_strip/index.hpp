/**
 * @file
 * @brief Materializes one staged Strip in deterministic Structural Order.
 */
#pragma once

#include "../mask_strip/index.hpp"
#include "../../auxiliary/insert_between/index.hpp"
#include "../../auxiliary/run_projector_to_strip/index.hpp"
#include "../../auxiliary/split_strip/index.hpp"
#include "../../classes/footage_span_buffer/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Materialize one staged visible Strip or Mask command.
 * @param projector Owning Projector.
 * @param incoming_strip_index Stable Position of the staged Strip.
 * @param pending_footage_spans Optional resolved Footage result buffer.
 * @param supplied_projection_frame_index Known local Projection position.
 * @return Materialized Projection position, or `u32_max` while Pending.
 */
[[nodiscard]] inline std::uint32_t insert_strip(
    Projector *projector, const std::uint32_t incoming_strip_index,
    FootageSpanBuffer *pending_footage_spans = nullptr,
    const std::uint32_t supplied_projection_frame_index = u32_max) noexcept {
  const auto is_linked = [projector](const std::uint32_t strip_index) {
    return projector->strips[strip_index].is_resolved != 0 ||
           strip_index == projector->structural_root_strip_index ||
           projector->left[strip_index] != strip_index ||
           projector->right[strip_index] != strip_index;
  };
  if (is_linked(incoming_strip_index))
    return u32_max;

  const Strip inserted_strip = projector->strips[incoming_strip_index];
  auto [resolved_containing_strip_index, offset] = projector->hash_table.get(
      inserted_strip.coordinate.previous_strip_end);
  if (resolved_containing_strip_index == u32_max)
    return u32_max;
  if (!is_linked(resolved_containing_strip_index)) {
    static_cast<void>(insert_strip(projector, resolved_containing_strip_index,
                                   pending_footage_spans));
    if (!is_linked(resolved_containing_strip_index))
      return u32_max;
    const auto resolved = projector->hash_table.get(
        inserted_strip.coordinate.previous_strip_end);
    resolved_containing_strip_index = resolved.first;
    offset = resolved.second;
  }

  if (inserted_strip.is_masked != 0) {
    const std::uint32_t projection_frame_index = mask_strip(
        projector, resolved_containing_strip_index, incoming_strip_index,
        offset, supplied_projection_frame_index);
    projector->strips[incoming_strip_index].is_resolved = 1;
    return projection_frame_index;
  }

  const Strip containing_strip =
      projector->strips[resolved_containing_strip_index];
  const std::uint32_t containing_frame_count =
      projector->length[resolved_containing_strip_index];
  const std::uint32_t split_frame_offset =
      offset + static_cast<std::uint32_t>(inserted_strip.is_inverse == 0);
  std::uint32_t boundary_projection_frame_index =
      supplied_projection_frame_index;
  if (boundary_projection_frame_index == u32_max) {
    run_projector_to_strip(resolved_containing_strip_index, projector);
    boundary_projection_frame_index = projector->gate_projection_frame_index;
    if (containing_strip.is_masked == 0)
      boundary_projection_frame_index += split_frame_offset;
  }

  std::uint32_t left_position;
  std::uint32_t right_position;
  if (split_frame_offset == 0) {
    left_position = projector->left[resolved_containing_strip_index];
    right_position = resolved_containing_strip_index;
  } else if (split_frame_offset == containing_frame_count) {
    left_position = resolved_containing_strip_index;
    right_position = projector->right[resolved_containing_strip_index];
  } else {
    left_position = resolved_containing_strip_index;
    right_position = split_strip(projector, resolved_containing_strip_index,
                                 split_frame_offset);
  }

  const std::uint32_t parent_strip_index =
      projector->hash_table.get(inserted_strip.coordinate.previous_strip_end)
          .first;
  const std::int64_t sibling_frame_offset =
      insert_between(projector, left_position, incoming_strip_index,
                     right_position, true, parent_strip_index);
  projector->strips[parent_strip_index].child_strip_indices.push_back(
      incoming_strip_index);
  std::uint32_t projection_frame_index =
      supplied_projection_frame_index != u32_max
          ? supplied_projection_frame_index
          : static_cast<std::uint32_t>(boundary_projection_frame_index +
                                       sibling_frame_offset);
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
  if (pending_footage_spans != nullptr)
    pending_footage_spans->write_span(inserted_strip.footage_frame_index,
                                     inserted_frame_count);
  return projection_frame_index;
}
