/**
 * @file
 * @brief Materializes a Mask over existing Sequence Frames.
 */
#pragma once

#include "../../auxiliary/split_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <algorithm>
#include <cstdint>

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
 * @param containing_position Stable Position containing the Mask's first Frame.
 * @param incoming_mask_position Stable Position of the staged Mask command.
 * @return Projection Index formerly occupied by the first newly addressed
 * Frame, derived from the nearest surviving LengthTable checkpoint.
 * @pre The Mask names a valid retained Frame Span.
 * @post Every addressed visible fragment is masked and Structural Order is
 * preserved.
 * @complexity Linear in crossed material fragments plus bounded checkpoint
 * adjustment.
 */
[[nodiscard]] inline std::uint32_t
mask_strip(Projector *projector, const std::uint32_t containing_position,
           const std::uint32_t incoming_mask_position) noexcept {
  const Strip incoming_mask = projector->strips[incoming_mask_position];
  SequencePoint masked_frame_start = incoming_mask.coordinate.this_strip_start;
  std::uint32_t remaining_frame_count = incoming_mask.frame_count;
  std::uint32_t current_position = containing_position;
  std::uint32_t removed_frame_count = 0;

  const Strip &containing_strip = projector->strips[containing_position];
  const std::uint32_t first_frame_offset =
      masked_frame_start.counter_bits -
      containing_strip.coordinate.this_strip_start.counter_bits;
  const std::uint32_t mask_projection_frame_index =
      projector->length_table.projection_frame_index(containing_position,
                                                     projector) +
      (containing_strip.is_masked == 0 ? first_frame_offset : 0);

  while (remaining_frame_count != 0) {
    const Strip &source = projector->strips[current_position];
    const std::uint32_t frame_offset =
        masked_frame_start.counter_bits -
        source.coordinate.this_strip_start.counter_bits;
    const std::uint32_t masked_frame_count =
        std::min(remaining_frame_count, source.frame_count - frame_offset);

    if (source.is_masked == 0) {
      if (frame_offset != 0)
        current_position =
            split_strip(projector, current_position, frame_offset);
      if (masked_frame_count != projector->strips[current_position].frame_count)
        static_cast<void>(
            split_strip(projector, current_position, masked_frame_count));

      Strip &materialized_mask = projector->strips[current_position];
      materialized_mask.is_masked = incoming_mask.is_masked;
      projector->hash_table.set(materialized_mask.coordinate.this_strip_start,
                                materialized_mask.frame_count,
                                current_position);
      removed_frame_count += masked_frame_count;
    }

    masked_frame_start.counter_bits += masked_frame_count;
    remaining_frame_count -= masked_frame_count;
    if (remaining_frame_count != 0)
      current_position = projector->hash_table.get(masked_frame_start);
  }

  projector->length_table.adjust_chekpoints(
      projector, mask_projection_frame_index, removed_frame_count, true);
  projector->projection_frame_count -= removed_frame_count;
  const std::uint32_t materialized_position =
      projector->hash_table.get(incoming_mask.coordinate.this_strip_start);
  if (incoming_mask_position != materialized_position) {
    projector->left[incoming_mask_position] = materialized_position;
    projector->right[incoming_mask_position] = materialized_position;
  }
  if (projector->projection_frame_count == 0)
    return mask_projection_frame_index;
  return projector->length_table.projection_frame_index(materialized_position,
                                                        projector);
}
