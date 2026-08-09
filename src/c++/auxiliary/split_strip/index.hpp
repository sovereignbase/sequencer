#pragma once

#include "../insert_between/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

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
  suffix.left_siblings_frames += frame_offset;

  projector->strips.push_back(suffix);
  projector->left.push_back(suffix_position);
  projector->right.push_back(suffix_position);

  Strip &prefix = projector->strips[stable_position];
  prefix.frame_count = frame_offset;
  prefix.right_sibling_frames += suffix.frame_count;

  insert_between(projector, stable_position, suffix_position,
                 projector->right[stable_position]);
  projector->hash_table.set(prefix.coordinate.this_strip_start,
                            prefix.frame_count, stable_position);
  projector->hash_table.set(suffix.coordinate.this_strip_start,
                            suffix.frame_count, suffix_position);
  return suffix_position;
}
