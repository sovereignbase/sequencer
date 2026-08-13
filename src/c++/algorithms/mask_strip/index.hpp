/**
 * @file
 * @brief Materializes a Mask over retained Sequence Frames.
 */
#pragma once

#include "../../auxiliary/split_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <algorithm>
#include <cstdint>

/**
 * @brief Convert the addressed retained Frame Span into materialized Masks.
 * @param projector Owning Projector.
 * @param containing_strip_index Stable Position containing the first Frame.
 * @param incoming_index_index Stable Position of the Mask command.
 * @param offset First masked Frame offset in the containing Strip.
 * @param projection_frame_index Known local Projection position.
 * @return Projection position occupied by the first masked Frame.
 */
[[nodiscard]] inline std::uint32_t
mask_strip(Projector *projector, std::uint32_t containing_strip_index,
           const std::uint32_t incoming_index_index, std::uint32_t offset,
           const std::uint32_t projection_frame_index) noexcept {
  const Strip incoming_strip = projector->strips[incoming_index_index];

  std::uint32_t remaining_frame_count =
      projector->length[incoming_index_index];
  std::uint32_t removed_frame_count = 0;

  while (remaining_frame_count != 0) {
    const std::uint32_t source_frame_count =
        projector->length[containing_strip_index];
    const std::uint32_t masked_frame_count =
        std::min(remaining_frame_count, source_frame_count - offset);

    if (projector->strips[containing_strip_index].is_masked == 0) {
      if (offset != 0)
        containing_strip_index =
            split_strip(projector, containing_strip_index, offset);
      if (masked_frame_count != projector->length[containing_strip_index])
        static_cast<void>(
            split_strip(projector, containing_strip_index, masked_frame_count));

      projector->strips[containing_strip_index].is_masked =
          incoming_strip.is_masked;
      removed_frame_count += masked_frame_count;
    }

    remaining_frame_count -= masked_frame_count;
    if (remaining_frame_count != 0) {
      containing_strip_index = projector->strips[containing_strip_index]
                                   .larger_sibling_frames_strip_index;
      offset = 0;
    }
  }

  if (removed_frame_count != 0) {
    ++projector->projection_generation;
    projector->projection_frame_count -= removed_frame_count;
    if (projector->projection_frame_count == 0) {
      projector->head_strip_index = u32_max;
      projector->tail_strip_index = u32_max;
      projector->gate_strip_index = projector->structural_root_strip_index;
      projector->gate_projection_frame_index = 0;
    } else {
      if (projector->strips[projector->head_strip_index].is_masked != 0) {
        std::uint32_t head_strip_index = projector->head_strip_index;
        do
          head_strip_index = projector->right[head_strip_index];
        while (projector->strips[head_strip_index].is_masked != 0);
        projector->head_strip_index = head_strip_index;
      }
      if (projector->strips[projector->tail_strip_index].is_masked != 0) {
        std::uint32_t tail_strip_index = projector->tail_strip_index;
        do
          tail_strip_index = projector->left[tail_strip_index];
        while (projector->strips[tail_strip_index].is_masked != 0);
        projector->tail_strip_index = tail_strip_index;
      }
      projector->gate_strip_index = projector->head_strip_index;
      projector->gate_projection_frame_index = 0;
    }
  }

  return projection_frame_index;
}
