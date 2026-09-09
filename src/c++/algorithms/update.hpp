#pragma once

#include "./runtime.hpp"
#include "./issue.hpp"
#include "../apply/insert/before/index.hpp"
#include "../apply/insert/after/index.hpp"
#include "../apply/mask/index.hpp"
#include "../find/containing_strip_index/index.hpp"
#include <tuple>

namespace sequencer {

inline std::uint32_t update_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint8_t operation_type, const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index = u32_max) noexcept {
  Projector &projector = *projectors[projection_id];
  find_strip_index_of(projector, operation_index);
  const std::uint32_t containing_strip_index = projector.gate_strip_index;
  const std::uint32_t offset =
      operation_index - projector.projection_frame_index;

  SequencePoint previous_strip_end =
      projector.strip_start_of[containing_strip_index];
  previous_strip_end.counter_bits += offset;
  const auto incoming_strip_index =
      issue_strip(projector, operation_type, operation_length,
                  previous_strip_end, footage_frame_index);
  if (incoming_strip_index == u32_max)
    return u32_max;
  const auto strip_start = projector.strip_start_of[incoming_strip_index];

  if (operation_type == 0) {
    projection_buffer.resize(1);
    projection_buffer.write_projection(
        0, {projector.strip_type_of[incoming_strip_index],
            projector.strip_length_of[incoming_strip_index],
            strip_start.crypto_random_bits, strip_start.unix_lower_bits,
            strip_start.counter_bits, previous_strip_end.crypto_random_bits,
            previous_strip_end.unix_lower_bits, previous_strip_end.counter_bits,
            0, 0});
    return apply_root(projector, incoming_strip_index);
  }

  std::int32_t frame_count_diff;
  std::int32_t strip_count_diff;
  if (operation_type == 1)
    std::tie(frame_count_diff, strip_count_diff) = apply_insert(
        projector, containing_strip_index, incoming_strip_index, offset);
  else if (operation_type == 2)
    std::tie(frame_count_diff, strip_count_diff) = apply_mask(
        projector, containing_strip_index, incoming_strip_index, offset);
  else
    return u32_max;
  // FIND NEAREST LEFT AND RIGHT JUMPS
  std::uint32_t left_cursor = incoming_strip_index;
  std::uint32_t right_cursor = incoming_strip_index;

  bool left_jump_found = false;
  bool right_jump_found = false;

  while (!left_jump_found || !right_jump_found) {
    if (!left_jump_found) {
      left_cursor = projector.left_strip_index_of[left_cursor];
      left_jump_found =
          left_cursor == projector.head_strip_index ||
          projector.right_jump_strip_index_of[left_cursor] != u32_max;
    }

    if (!right_jump_found) {
      right_cursor = projector.right_strip_index_of[right_cursor];
      right_jump_found =
          right_cursor == projector.tail_strip_index ||
          projector.left_jump_strip_index_of[right_cursor] != u32_max;
    }
  }

  // UPDATE NEAREST LEFT JUMP
  if (projector.right_jump_strip_index_of[left_cursor] != u32_max) {
    projector.right_jump_length_of[left_cursor] += frame_count_diff;
    projector.right_jump_strip_count_of[left_cursor] += strip_count_diff;
  }

  // UPDATE NEAREST RIGHT JUMP
  if (projector.left_jump_strip_index_of[right_cursor] != u32_max) {
    projector.left_jump_length_of[right_cursor] += frame_count_diff;
    projector.left_jump_strip_count_of[right_cursor] += strip_count_diff;
  }

  projection_buffer.resize(1);
  projection_buffer.write_projection(
      0, {projector.strip_type_of[incoming_strip_index],
          projector.strip_length_of[incoming_strip_index],
          strip_start.crypto_random_bits, strip_start.unix_lower_bits,
          strip_start.counter_bits, previous_strip_end.crypto_random_bits,
          previous_strip_end.unix_lower_bits, previous_strip_end.counter_bits,
          0, 0});
  return operation_index;
}

}
