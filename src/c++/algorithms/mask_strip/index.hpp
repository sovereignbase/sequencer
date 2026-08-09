#pragma once

#include "../../auxiliary/split_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <algorithm>
#include <cstdint>

[[nodiscard]] inline std::uint32_t
mask_strip(Projector *projector, const std::uint32_t containing_position,
           const std::uint32_t incoming_mask_position) noexcept {
  const Strip incoming_mask = projector->strips[incoming_mask_position];
  SequencePoint masked_frame_start =
      incoming_mask.coordinate.this_strip_start;
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
      true, mask_projection_frame_index, removed_frame_count, projector);
  projector->projection_frame_count -= removed_frame_count;
  const std::uint32_t materialized_position =
      projector->hash_table.get(incoming_mask.coordinate.this_strip_start);
  if (incoming_mask_position != materialized_position) {
    projector->left[incoming_mask_position] = materialized_position;
    projector->right[incoming_mask_position] = materialized_position;
  }
  return projector->length_table.projection_frame_index(materialized_position,
                                                        projector);
}
