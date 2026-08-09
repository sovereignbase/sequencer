/**
 * @file
 * @brief Materializes one staged visible Strip in Structural Order.
 */
#pragma once

#include "../../auxiliary/insert_between/index.hpp"
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
 * @param containing_position Stable Position containing
 * `inserted_position`'s `previous_strip_end`.
 * @param inserted_position Self-linked Stable Position of the visible Strip to
 * materialize.
 * @return Visible Projection Index at which the inserted Strip begins.
 * @pre All positions are valid in the Projector's dense storage.
 * @pre The inserted Strip is visible and its referenced Frame is contained by
 * `containing_position`.
 * @post The inserted Strip belongs to Structural Order and contributes its
 * complete Frame Span to the Projection.
 * @complexity Bounded LengthTable adjustment plus sibling traversal and at
 * most one Strip split.
 */
[[nodiscard]] inline std::uint32_t
insert_strip(Projector *projector, const std::uint32_t containing_position,
             const std::uint32_t inserted_position) noexcept {
  const Strip containing_strip = projector->strips[containing_position];
  const Strip inserted_strip = projector->strips[inserted_position];
  const std::uint32_t containing_frame_offset =
      inserted_strip.coordinate.previous_strip_end.counter_bits -
      containing_strip.coordinate.this_strip_start.counter_bits;
  const std::uint32_t split_frame_offset =
      containing_frame_offset + static_cast<std::uint32_t>(
                                    inserted_strip.is_inverse == 0);
  std::uint32_t left_position;
  std::uint32_t right_position;
  if (split_frame_offset == 0) {
    left_position = projector->left[containing_position];
    right_position = containing_position;
  } else if (split_frame_offset == containing_strip.frame_count) {
    left_position = containing_position;
    right_position = projector->right[containing_position];
  } else {
    left_position = containing_position;
    right_position =
        split_strip(projector, containing_position, split_frame_offset);
  }

  insert_between(projector, left_position, inserted_position, right_position);
  const std::uint32_t insertion_projection_frame_index =
      projector->length_table.projection_frame_index(inserted_position,
                                                     projector) +
      inserted_strip.frame_count;
  projector->length_table.adjust_chekpoints(
      false, insertion_projection_frame_index, inserted_strip.frame_count,
      projector);
  projector->projection_frame_count += inserted_strip.frame_count;
  return projector->length_table.projection_frame_index(inserted_position,
                                                        projector);
}
