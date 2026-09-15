#pragma once

#include "../../.declarations/projector/index.hpp"
#include <cstdint>

[[nodiscard]] inline std::uint32_t
stage_strip(Projector &projector, const std::uint8_t strip_type,
            const std::uint32_t strip_length, const Clock anchor_clock,
            const Clock insert_clock, const std::uint32_t offset_length,
            const std::uint32_t footage_frame_index = u32_max,
            const std::uint32_t dependency_prefix = 0,
            const std::uint32_t fragment_length = u32_max) noexcept {
  const auto strip_index =
      projector.append_strip();
  projector.strip_type_of[strip_index] = strip_type;
  projector.masked_of[strip_index] = 0;
  projector.initial_length_of[strip_index] = strip_length;
  projector.fragment_length_of[strip_index] = fragment_length == u32_max
      ? (strip_type == 2 ? 0 : strip_length) : fragment_length;
  projector.dependency_prefix_of[strip_index] = dependency_prefix;
  projector.offset_length_of[strip_index] = offset_length;
  projector.fragment_offset_of[strip_index] = 0;
  projector.anchor_clock_of[strip_index] = anchor_clock;
  projector.insert_clock_of[strip_index] = insert_clock;
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
  projector.containment_table.set(insert_clock, strip_index);
  return strip_index;
}
