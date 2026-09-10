#pragma once

#include "../../.declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Propagate a local Strip edit to its enclosing jump interval.
 * @pre The edit changes content and adds splits after the containing Strip's
 * start, without removing or moving any existing jump endpoint.
 * @note A jump beginning at the containing Strip includes the edit; a jump
 * ending there does not. The containing Strip's Projection start is unchanged.
 */
inline void update_following_jump(
    Projector &projector, std::uint32_t containing_strip_index,
    const std::int32_t frame_count_diff,
    const std::int32_t strip_count_diff) noexcept {
  while (projector.right_jump_strip_index_of[containing_strip_index] == u32_max &&
         containing_strip_index != projector.head_strip_index) {
    if (projector.left_jump_strip_index_of[containing_strip_index] != u32_max)
      return;
    containing_strip_index = projector.left_strip_index_of[containing_strip_index];
  }
  const auto right = projector.right_jump_strip_index_of[containing_strip_index];
  if (right == u32_max)
    return;
  const auto length = static_cast<std::uint32_t>(
      static_cast<std::int64_t>(projector.right_jump_length_of[containing_strip_index]) +
      frame_count_diff);
  const auto count = static_cast<std::uint32_t>(
      static_cast<std::int64_t>(projector.right_jump_strip_count_of[containing_strip_index]) +
      strip_count_diff);
  projector.right_jump_length_of[containing_strip_index] = length;
  projector.right_jump_strip_count_of[containing_strip_index] = count;
  projector.left_jump_length_of[right] = length;
  projector.left_jump_strip_count_of[right] = count;
}
