#pragma once

#include "../../.declarations/projector/index.hpp"
#include <cstdint>

[[nodiscard]] inline std::uint32_t
stage_strip(Projector &projector, const std::uint8_t strip_type,
            const std::uint32_t strip_length, const SequencePoint strip_start,
            const SequencePoint previous_strip_end,
            const std::uint32_t footage_frame_index = u32_max,
            const std::uint32_t dependency_prefix = 0,
            const std::uint32_t fragment_length = u32_max) noexcept {
  const auto strip_index =
      projector.append_strip();
  projector.strip_type_of[strip_index] = strip_type;
  projector.initial_length_of[strip_index] = strip_length;
  projector.fragment_length_of[strip_index] = fragment_length == u32_max
      ? (strip_type == 2 ? 0 : strip_length) : fragment_length;
  projector.dependency_prefix_of[strip_index] = dependency_prefix;
  projector.strip_start_of[strip_index] = strip_start;
  projector.previous_strip_end_of[strip_index] = previous_strip_end;
  projector.smaller_competitor_strip_index_of[strip_index] = u32_max;
  projector.larger_split_strip_index_of[strip_index] = u32_max;
  projector.right_strip_index_of[strip_index] = strip_index;
  projector.left_strip_index_of[strip_index] = strip_index;
  projector.left_jump_strip_index_of[strip_index] = u32_max;
  projector.left_jump_strip_count_of[strip_index] = 0;
  projector.left_jump_length_of[strip_index] = 0;
  projector.right_jump_strip_index_of[strip_index] = u32_max;
  projector.right_jump_strip_count_of[strip_index] = 0;
  projector.right_jump_length_of[strip_index] = 0;
  projector.footage_frame_index_of[strip_index] =
      strip_type == 2 ? u32_max : footage_frame_index;
  if (strip_start.counter_bits != u32_max)
    projector.containment_table.set(strip_start, strip_length, strip_index);
  return strip_index;
}
