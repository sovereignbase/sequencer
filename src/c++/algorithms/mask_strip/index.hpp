/**
 * @file
 * @brief Materializes a Mask over existing Sequence Frames.
 */
#pragma once

#include "../../auxiliary/run_projector_to_strip/index.hpp"
#include "../../auxiliary/split_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <algorithm>
#include <cstdint>
#include <wasm_simd128.h>

/**
 * @brief Convert the requested existing Frame Span into materialized Masks.
 *
 * Source Strips are split at the Mask boundaries when necessary. Already
 * masked fragments remain unchanged; only newly hidden Frames reduce the
 * Projection count. HashTable containment is refreshed for every converted
 * fragment, and the detached incoming Mask command is associated with the
 * materialized fragment through its dense links.
 *
 * @param projector Owning Projector.
 * @param containing_strip_index Stable Position containing the Mask's first
 * Frame.
 * @param incoming_index_index Stable Position of the staged Mask command.
 * @param offset Frame offset within the containing Strip.
 * @param projection_frame_index Projection index of the first masked Frame.
 * @return Projection Index formerly occupied by the first newly addressed
 * Frame, derived from the nearest surviving LengthTable checkpoint.
 * @pre The Mask names a valid retained Frame Span.
 * @post Every addressed visible fragment is masked and Structural Order is
 * preserved.
 * @complexity Linear in crossed material fragments plus bounded checkpoint
 * adjustment.
 */
[[nodiscard]] inline std::uint32_t
mask_strip(Projector *projector, std::uint32_t containing_strip_index,
           const std::uint32_t incoming_index_index,
           std::uint32_t offset = u32_max,
           std::uint32_t projection_frame_index = u32_max) noexcept {
  const Strip incoming_strip = projector->strips[incoming_index_index];
  if (offset == u32_max)
    offset = incoming_strip.coordinate.previous_strip_end.counter_bits -
             projector->strips[containing_strip_index]
                 .coordinate.this_strip_start.counter_bits;

  if (projection_frame_index == u32_max) {
    run_projector_to_strip(containing_strip_index,
                           projector->strips[containing_strip_index],
                           projector);
    projection_frame_index = projector->gate_projection_frame_index + offset;
  }
  std::uint32_t remaining_frame_count = incoming_strip.frame_count;
  std::uint32_t removed_frame_count = 0;

  while (remaining_frame_count != 0) {
    const Strip &source = projector->strips[containing_strip_index];
    const std::uint32_t masked_frame_count =
        std::min(remaining_frame_count, source.frame_count - offset);

    if (source.is_masked == 0) {
      if (offset != 0)
        containing_strip_index =
            split_strip(projector, containing_strip_index, offset);
      if (masked_frame_count !=
          projector->strips[containing_strip_index].frame_count)
        static_cast<void>(
            split_strip(projector, containing_strip_index, masked_frame_count));

      projector->strips[containing_strip_index].is_masked =
          incoming_strip.is_masked;
      removed_frame_count += masked_frame_count;
    }

    remaining_frame_count -= masked_frame_count;
    if (remaining_frame_count != 0) {
      containing_strip_index = projector->strips[containing_strip_index]
                                   .right_sibling_frames_strip_index;
      offset = 0;
    }
  }

  projector->length_table.adjust_checkpoints<Projector>(
      projector, projection_frame_index, removed_frame_count, true);
  if (projection_frame_index == 0 &&
      removed_frame_count != projector->projection_frame_count) {
    projector->strips[projector->length_table.nearest_checkpoint(0).first]
        .checkpoint_projection_frame_index = u32_max;
    std::uint32_t first_strip_index = projector->right[containing_strip_index];
    while (projector->strips[first_strip_index].is_masked != 0)
      first_strip_index = projector->right[first_strip_index];
    projector->length_table.set_first(first_strip_index);
    projector->strips[first_strip_index].checkpoint_projection_frame_index = 0;
  }
  projector->projection_frame_count -= removed_frame_count;

  return projection_frame_index;
}
