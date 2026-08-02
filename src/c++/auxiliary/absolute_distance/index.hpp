/**
 * @file
 * @brief Provides absolute distance on an unsigned frame-index axis.
 *
 * Projection and footage positions are represented by unsigned frame indexes.
 * Subtracting the smaller index from the larger keeps their distance in the
 * same representation without signed conversion or overflow.
 */
#pragma once

#include <cstdint>

/**
 * @brief Return the absolute distance between two frame indexes.
 *
 * @param left_frame_index First frame index.
 * @param right_frame_index Second frame index.
 * @return Non-negative distance between the two indexes.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline std::uint32_t
absolute_distance(const std::uint32_t left_frame_index,
                  const std::uint32_t right_frame_index) noexcept {
  // Subtract in descending operand order to preserve unsigned distance.
  return left_frame_index > right_frame_index
             ? left_frame_index - right_frame_index
             : right_frame_index - left_frame_index;
}
