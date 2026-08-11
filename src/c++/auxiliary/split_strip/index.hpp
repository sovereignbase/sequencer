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
  suffix.frame_count -= frame_offset;
  suffix.footage_frame_index += frame_offset;
  suffix.coordinate.this_strip_start.counter_bits += frame_offset;
  suffix.coordinate.previous_strip_end = suffix.coordinate.this_strip_start;
  --suffix.coordinate.previous_strip_end.counter_bits;
  suffix.is_inverse = 0;
  suffix.checkpoint_projection_frame_index = u32_max;

  projector->strips.push_back(suffix);
  projector->left.push_back(suffix_position);
  projector->right.push_back(suffix_position);

  Strip &prefix = projector->strips[stable_position];
  prefix.frame_count = frame_offset;
  prefix.right_sibling_frames_strip_index = suffix_position;

  insert_between(projector, stable_position, suffix_position,
                 projector->right[stable_position]);
  projector->hash_table.set(prefix.coordinate.this_strip_start,
                            prefix.frame_count, stable_position);
  projector->hash_table.set(suffix.coordinate.this_strip_start,
                            suffix.frame_count, suffix_position);
  return suffix_position;
}
