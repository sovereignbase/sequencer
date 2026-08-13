/**
 * @file
 * @brief Splits one material Strip without copying Footage.
 */
#pragma once

#include "../insert_between/index.hpp"
#include "../../declarations/projector/index.hpp"
#include "../../declarations/sentinels/index.hpp"
#include <cstdint>

/**
 * @brief Divide a Strip into prefix and suffix fragments at a Frame offset.
 *
 * The existing Stable Position becomes the prefix. A new append-only Stable
 * Position becomes the suffix with advanced Sequence and Footage starts. Source
 * sibling distances preserve the originally issued start and length. Both Hash
 * Table containment ranges and the dense Structural Order are updated.
 *
 * @param projector Owning Projector.
 * @param stable_position Stable Position of the source Strip and resulting
 * prefix.
 * @param frame_offset Positive suffix start offset within the source Strip.
 * @return Newly appended Stable Position of the suffix.
 * @pre `0 < frame_offset < source.frame_count`.
 * @post Prefix and suffix cover the exact original Frame and Footage spans with
 * no overlap or gap.
 * @complexity Amortized O(1), excluding vector reallocation.
 */
[[nodiscard]] inline std::uint32_t
split_strip(Projector *projector, const std::uint32_t stable_position,
            const std::uint32_t frame_offset) noexcept {
  const Strip source = projector->strips[stable_position];
  const std::uint32_t suffix_position =
      static_cast<std::uint32_t>(projector->strips.size());
  Strip suffix = source;
  const std::uint32_t source_frame_count =
      projector->length[stable_position];
  suffix.footage_frame_index += frame_offset;
  suffix.coordinate.this_strip_start.counter_bits += frame_offset;
  suffix.coordinate.previous_strip_end = suffix.coordinate.this_strip_start;
  --suffix.coordinate.previous_strip_end.counter_bits;
  suffix.is_inverse = 0;
  suffix.larger_sibling_frames_strip_index =
      source.larger_sibling_frames_strip_index;
  suffix.left_jump_strip_index = u32_max;
  suffix.right_jump_strip_index = u32_max;
  suffix.jump_generation = 0;

  projector->strips.push_back(suffix);
  projector->left.push_back(suffix_position);
  projector->right.push_back(suffix_position);
  projector->length.push_back(source_frame_count - frame_offset);

  Strip &prefix = projector->strips[stable_position];
  prefix.larger_sibling_frames_strip_index = suffix_position;
  projector->length[stable_position] = frame_offset;

  insert_between(projector, stable_position, suffix_position,
                 projector->right[stable_position], false);
  if (projector->tail_strip_index == stable_position)
    projector->tail_strip_index = suffix_position;
  projector->hash_table.set(prefix.coordinate.this_strip_start,
                            frame_offset, stable_position);
  projector->hash_table.set(suffix.coordinate.this_strip_start,
                            source_frame_count - frame_offset, suffix_position);
  return suffix_position;
}
