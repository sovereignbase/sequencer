/**
 * @file
 * @brief Positions a projector gate at a requested projection frame index.
 *
 * The search begins at the current Gate when the target is fewer than 64
 * Projection positions away. Longer searches begin at the nearest LengthTable
 * checkpoint. Traversal proceeds from either start in the target direction.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include "../absolute_distance/index.hpp"
#include "../strip_contains_frame_index/index.hpp"
#include <cstdint>

/**
 * @brief Move the Gate to the Strip containing a Projection frame index.
 *
 * Masks remain part of retained strip order but contribute no Frames to the
 * Projection. On success, `gate_strip_index` identifies the containing Strip
 * and `gate_projection_frame_index` is the Projection frame index at which
 * that Strip begins.
 *
 * @param projector Projector whose gate is repositioned.
 * @param projection_frame_index Zero-based visible frame index to locate.
 * @pre `projector` is non-null.
 * @pre For a non-empty Projection, `projection_frame_index` is less than
 * `projector->projection_frame_count` and every retained Strip link resolves.
 * @post For a non-empty Projection, the Gate describes the unique visible
 * Strip containing `projection_frame_index`.
 * @note An empty Projection leaves the Gate unchanged.
 * @complexity O(s) time and O(1) space, where s is the number of linked Strips
 * traversed from the selected starting position.
 */
inline void run_projector_to_frame_index(
    Projector *projector, const std::uint32_t projection_frame_index) noexcept {
  // Leave an empty Projection Gate unchanged.
  if (projector->projection_frame_count == 0)
    return;

  // Test the current dense Gate before traversing.
  std::uint32_t &gate_strip_index = projector->gate_strip_index;
  const Strip *gate_strip = &projector->strips[gate_strip_index];

  if (strip_contains_frame_index(gate_strip,
                                 projector->gate_projection_frame_index,
                                 projection_frame_index))
    return;

  const std::uint32_t gate_distance = absolute_distance(
      projector->gate_projection_frame_index, projection_frame_index);

  // Replace a distant Gate with the nearest bounded LengthTable checkpoint.
  if (gate_distance >= 64u) {
    const auto [checkpoint, checkpoint_projection_frame_index] =
        projector->length_table.nearest_chekpoint(projection_frame_index);
    projector->gate_projection_frame_index =
        checkpoint_projection_frame_index;
    gate_strip_index = checkpoint;
    gate_strip = &projector->strips[gate_strip_index];
  }

  // Accept the selected starting Strip when it contains the Frame.
  if (strip_contains_frame_index(gate_strip,
                                 projector->gate_projection_frame_index,
                                 projection_frame_index))
    return;

  // Traverse right by complete Strip spans.
  if (projector->gate_projection_frame_index <= projection_frame_index) {
    do {
      if (gate_strip->is_masked == 0)
        projector->gate_projection_frame_index += gate_strip->frame_count;
      gate_strip_index = projector->right[gate_strip_index];
      gate_strip = &projector->strips[gate_strip_index];
    } while (!strip_contains_frame_index(gate_strip,
                                         projector->gate_projection_frame_index,
                                         projection_frame_index));
    return;
  }

  // Traverse left by complete Strip spans.
  do {
    gate_strip_index = projector->left[gate_strip_index];
    gate_strip = &projector->strips[gate_strip_index];
    if (gate_strip->is_masked == 0)
      projector->gate_projection_frame_index -= gate_strip->frame_count;
  } while (!strip_contains_frame_index(gate_strip,
                                       projector->gate_projection_frame_index,
                                       projection_frame_index));
}
