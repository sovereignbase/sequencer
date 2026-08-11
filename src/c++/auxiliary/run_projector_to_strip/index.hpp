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
#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Move the Gate to the Strip containing a Projection frame index.
 *
 * Masks remain part of retained strip order but contribute no Frames to the
 * Projection. On success, `gate_strip_index` identifies the containing Strip
 * and `gate_projection_frame_index` is the Projection frame index at which
 * that Strip begins.
 *
 * @param stable_index Stable dense index from which checkpoint resolution
 * begins.
 * @param strip Strip at `stable_index`.
 * @param projector Projector whose gate is repositioned.
 * @pre `projector` contains valid bidirectional links for every traversed
 * Strip.
 * @post The Gate describes the nearest checkpoint Strip and its visible
 * Projection frame index.
 * @complexity O(s) time and O(1) space, where s is the number of linked Strips
 * traversed to the nearest checkpoint.
 */
inline void run_projector_to_strip(std::uint32_t stable_index,
                                   const Strip &strip,
                                   Projector *projector) noexcept {
  if (strip.checkpoint_projection_frame_index !=
      no_checkpoint_projection_frame_index) {
    projector->gate_strip_index = stable_index;
    projector->gate_projection_frame_index =
        strip.checkpoint_projection_frame_index;
    return;
  }

  std::uint32_t left_index = stable_index;
  std::uint32_t right_index = stable_index;
  std::uint32_t offset = 0;

  while (true) {
    ++offset;

    left_index = projector->left[left_index];
    right_index = projector->right[right_index];

    const std::uint32_t left_projection_frame_index =
        projector->strips[left_index].checkpoint_projection_frame_index;

    const std::uint32_t right_projection_frame_index =
        projector->strips[right_index].checkpoint_projection_frame_index;

    if (left_projection_frame_index != no_checkpoint_projection_frame_index) {
      projector->gate_strip_index = left_index;
      projector->gate_projection_frame_index =
          left_projection_frame_index + offset;
      return;
    }

    if (right_projection_frame_index != no_checkpoint_projection_frame_index) {
      projector->gate_strip_index = right_index;
      projector->gate_projection_frame_index =
          right_projection_frame_index - offset;
      return;
    }
  }
}