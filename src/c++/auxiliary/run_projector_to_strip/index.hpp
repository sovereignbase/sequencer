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
#include "../../declarations/sentinels/index.hpp"
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
  if (strip.checkpoint_projection_frame_index != u32_max) {
    projector->gate_strip_index = stable_index;
    projector->gate_projection_frame_index =
        strip.checkpoint_projection_frame_index;
    return;
  }

  const std::uint32_t gate_strip_index = stable_index;
  std::uint32_t offset = 0;
  do {
    stable_index = projector->left[stable_index];
    const Strip &left_strip = projector->strips[stable_index];
    if (left_strip.is_masked == 0)
      offset += left_strip.frame_count;
  } while (projector->strips[stable_index]
               .checkpoint_projection_frame_index == u32_max);

  projector->gate_strip_index = gate_strip_index;
  projector->gate_projection_frame_index =
      projector->strips[stable_index].checkpoint_projection_frame_index +
      offset;
}
