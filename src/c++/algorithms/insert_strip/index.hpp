/**
 * @file
 * @brief Materializes one staged visible Strip in Structural Order.
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
 * @brief Insert one visible Strip at its coordinate-defined Frame boundary.
 *
 * `is_inverse` selects the boundary before or after the referenced Frame. An
 * interior boundary splits the containing Strip, after which `insert_between`
 * performs sibling ordering and dense-link updates. The LengthTable and visible
 * Projection count are adjusted exactly once.
 *
 * @param projector Owning Projector.
 * @param incoming_strip_index Self-linked Stable Position to materialize.
 * @param pending_footage_spans Optional output for pending Strips materialized
 * while resolving the incoming Strip's dependency chain.
 * @return Visible Projection Index at which the inserted Strip begins.
 * @pre All positions are valid in the Projector's dense storage.
 * @pre The inserted Strip is visible.
 * @post The inserted Strip belongs to Structural Order and contributes its
 * complete Frame Span to the Projection. The Gate describes the inserted
 * Strip at its resulting Projection index.
 * @complexity Bounded LengthTable adjustment plus sibling traversal and at
 * most one Strip split.
 */
[[nodiscard]] inline std::uint32_t
insert_strip(Projector *projector, const std::uint32_t incoming_strip_index,
             FootageSpanBuffer *pending_footage_spans = nullptr) noexcept {
  const auto is_linked = [projector](const std::uint32_t strip_index) {
    return projector->strips[strip_index].checkpoint_projection_frame_index ==
               0 ||
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

  if (inserted_strip.is_masked != 0)
    return mask_strip(projector, resolved_containing_strip_index,
                      incoming_strip_index, offset);

  const Strip containing_strip =
      projector->strips[resolved_containing_strip_index];
  const std::uint32_t split_frame_offset =
      offset + static_cast<std::uint32_t>(inserted_strip.is_inverse == 0);
  run_projector_to_strip(resolved_containing_strip_index, containing_strip,
                         projector);
  const std::uint32_t boundary_projection_frame_index =
      projector->gate_projection_frame_index + split_frame_offset;

  std::uint32_t left_position;
  std::uint32_t right_position;
  if (split_frame_offset == 0) {
    left_position = projector->left[resolved_containing_strip_index];
    right_position = resolved_containing_strip_index;
  } else if (split_frame_offset == containing_strip.frame_count) {
    left_position = resolved_containing_strip_index;
    right_position = projector->right[resolved_containing_strip_index];
  } else {
    left_position = resolved_containing_strip_index;
    right_position = split_strip(projector, resolved_containing_strip_index,
                                 split_frame_offset);
  }

  const std::int64_t sibling_frame_offset = insert_between(
      projector, left_position, incoming_strip_index, right_position);
  const std::uint32_t projection_frame_index = static_cast<std::uint32_t>(
      boundary_projection_frame_index + sibling_frame_offset);
  projector->length_table.adjust_checkpoints(projector, projection_frame_index,
                                             inserted_strip.frame_count, false);
  if (projection_frame_index == 0) {
    projector->strips[projector->length_table.nearest_checkpoint(0).first]
        .checkpoint_projection_frame_index = u32_max;
    projector->length_table.set_first(incoming_strip_index);
    projector->strips[incoming_strip_index]
        .checkpoint_projection_frame_index = 0;
  }
  projector->projection_frame_count += inserted_strip.frame_count;
  projector->gate_strip_index = incoming_strip_index;
  projector->gate_projection_frame_index = projection_frame_index;
  if (pending_footage_spans != nullptr)
    pending_footage_spans->write_span(inserted_strip.footage_frame_index,
                                     inserted_strip.frame_count);
  return projection_frame_index;
}
