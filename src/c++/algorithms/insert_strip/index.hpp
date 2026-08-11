/**
 * @file
 * @brief Materializes one staged visible Strip in Structural Order.
 */
#pragma once

#include "../../auxiliary/insert_between/index.hpp"
#include "../../auxiliary/run_projector_to_strip/index.hpp"
#include "../../auxiliary/split_strip/index.hpp"
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
 * @param containing_strip_index Stable Position containing
 * `strip_index`'s `previous_strip_end`.
 * @param strip_index Self-linked Stable Position of the visible Strip to
 * materialize.
 * @param offset Frame offset of `previous_strip_end` in the containing Strip.
 * @param projection_frame_index Visible start of the containing Strip, or
 * `u32_max` when it must be resolved from the LengthTable.
 * @return Visible Projection Index at which the inserted Strip begins.
 * @pre All positions are valid in the Projector's dense storage.
 * @pre The inserted Strip is visible and its referenced Frame is contained by
 * `containing_position`.
 * @post The inserted Strip belongs to Structural Order and contributes its
 * complete Frame Span to the Projection. The Gate describes the inserted
 * Strip at its resulting Projection index.
 * @complexity Bounded LengthTable adjustment plus sibling traversal and at
 * most one Strip split.
 */
[[nodiscard]] inline std::uint32_t
insert_strip(Projector *projector, const std::uint32_t containing_strip_index,
             const std::uint32_t incoming_strip_index,
             std::uint32_t offset = u32_max,
             std::uint32_t projection_frame_index = u32_max) noexcept {
  const Strip containing_strip = projector->strips[containing_strip_index];
  const Strip inserted_strip = projector->strips[incoming_strip_index];

  if (offset == u32_max)
    offset = inserted_strip.coordinate.previous_strip_end.counter_bits -
             containing_strip.coordinate.this_strip_start.counter_bits;

  const std::uint32_t split_frame_offset =
      offset + static_cast<std::uint32_t>(inserted_strip.is_inverse == 0);

  if (projection_frame_index == u32_max) {
    run_projector_to_strip(containing_strip_index, containing_strip, projector);
    projection_frame_index =
        projector->gate_projection_frame_index + split_frame_offset;
  }

  std::uint32_t left_position;
  std::uint32_t right_position;
  if (split_frame_offset == 0) {
    left_position = projector->left[containing_strip_index];
    right_position = containing_strip_index;
  } else if (split_frame_offset == containing_strip.frame_count) {
    left_position = containing_strip_index;
    right_position = projector->right[containing_strip_index];
  } else {
    left_position = containing_strip_index;
    right_position =
        split_strip(projector, containing_strip_index, split_frame_offset);
  }

  insert_between(projector, left_position, incoming_strip_index,
                 right_position);
  projector->length_table.adjust_checkpoints(projector, projection_frame_index,
                                             inserted_strip.frame_count, false);
  projector->projection_frame_count += inserted_strip.frame_count;
  projector->gate_strip_index = incoming_strip_index;
  projector->gate_projection_frame_index = projection_frame_index;
  return projection_frame_index;
}
