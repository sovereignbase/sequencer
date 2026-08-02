/**
 * @file
 * @brief Provides unsigned distance between two frame indexes.
 *
 * The helper keeps frame-index distance arithmetic unsigned and branch-only,
 * avoiding signed conversion and overflow at the limits of std::uint32_t.
 */
#pragma once

#include <cstdint>

/**
 * @brief Return the absolute distance between two unsigned frame indexes.
 *
 * @param left_frame_index First frame index.
 * @param right_frame_index Second frame index.
 * @return Non-negative distance between the two indexes.
 */
[[nodiscard]] inline std::uint32_t
absolute_distance(const std::uint32_t left_frame_index,
                  const std::uint32_t right_frame_index) noexcept {
  return left_frame_index > right_frame_index
             ? left_frame_index - right_frame_index
             : right_frame_index - left_frame_index;
}
