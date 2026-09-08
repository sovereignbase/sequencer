/**
 * @file
 * @brief Positions a Projector Gate through Strip-local Projection jumps.
 */
#pragma once

#include "../../.auxiliary/absolute_distance/index.hpp"
#include "../../.declarations/projector/index.hpp"
#include <cmath>
#include <cstdint>

inline void
find_strip_index_of(Projector &projector,
                    const std::uint32_t &projection_frame_index) noexcept {
  // Calculate distances to the requested index.
  const std::uint32_t tail_projection_frame_index =
      projector.projection_frame_count -
      projector.strip_length_of[projector.tail_strip_index];
  const std::uint32_t gate_distance = absolute_distance(
      projector.projection_frame_index, projection_frame_index);
  const std::uint32_t head_distance = projection_frame_index;
  const std::uint32_t tail_distance =
      absolute_distance(tail_projection_frame_index, projection_frame_index);

  // Choose a strip with the shortest distance to requested index to start the
  // walk.
  std::uint32_t cursor_strip_index = projector.gate_strip_index;
  std::uint32_t cursor_projection_frame_index =
      projector.projection_frame_index;

  if (head_distance < gate_distance && head_distance <= tail_distance) {
    cursor_strip_index = projector.head_strip_index;
    cursor_projection_frame_index = 0;
  } else if (tail_distance < gate_distance) {
    cursor_strip_index = projector.tail_strip_index;
    cursor_projection_frame_index = tail_projection_frame_index;
  }

  // Calculate ideal jump distance.
  const std::uint32_t optimal_jump_distance = static_cast<std::uint32_t>(
      std::sqrt(projector.materialized_strip_count) + 0.5);

  // UPDATE AS YOU WALK
  while (true) {
    const std::uint32_t strip_length =
        projector.strip_length_of[cursor_strip_index];

    if (cursor_projection_frame_index <= projection_frame_index &&
        projection_frame_index < cursor_projection_frame_index + strip_length)
      break;

    const std::uint32_t current_distance = absolute_distance(
        cursor_projection_frame_index, projection_frame_index);

    if (cursor_projection_frame_index < projection_frame_index) {
      // WALK RIGHT
      const std::uint32_t walk_strip_index =
          projector.right_strip_index_of[cursor_strip_index];
      const std::uint32_t walk_projection_frame_index =
          cursor_projection_frame_index + strip_length;
      const std::uint32_t walk_distance = absolute_distance(
          walk_projection_frame_index, projection_frame_index);

      // USE RIGHT JUMP IF AVAILABLE
      std::uint32_t right_jump_strip_index =
          projector.right_jump_strip_index_of[cursor_strip_index];

      if (right_jump_strip_index != u32_max) {
        std::uint32_t right_jump_length =
            projector.right_jump_length_of[cursor_strip_index];
        std::uint32_t right_jump_strip_count =
            projector.right_jump_strip_count_of[cursor_strip_index];

        // REMOVE A JUMP INDEX FROM BETWEEN TO INCREASE DISTANCE TOWARDS OPTIMAL
        if (right_jump_strip_count < optimal_jump_distance &&
            right_jump_strip_index != projector.tail_strip_index) {
          const std::uint32_t next_right_jump_strip_index =
              projector.right_jump_strip_index_of[right_jump_strip_index];

          if (next_right_jump_strip_index != u32_max) {
            right_jump_length +=
                projector.right_jump_length_of[right_jump_strip_index];
            right_jump_strip_count +=
                projector.right_jump_strip_count_of[right_jump_strip_index];

            projector.right_jump_strip_index_of[cursor_strip_index] =
                next_right_jump_strip_index;
            projector.right_jump_length_of[cursor_strip_index] =
                right_jump_length;
            projector.right_jump_strip_count_of[cursor_strip_index] =
                right_jump_strip_count;

            projector.left_jump_strip_index_of[next_right_jump_strip_index] =
                cursor_strip_index;
            projector.left_jump_length_of[next_right_jump_strip_index] =
                right_jump_length;
            projector.left_jump_strip_count_of[next_right_jump_strip_index] =
                right_jump_strip_count;

            projector.left_jump_strip_index_of[right_jump_strip_index] =
                u32_max;
            projector.right_jump_strip_index_of[right_jump_strip_index] =
                u32_max;

            right_jump_strip_index = next_right_jump_strip_index;
          }
        }

        const std::uint32_t jump_projection_frame_index =
            cursor_projection_frame_index + right_jump_length;
        const std::uint32_t jump_distance = absolute_distance(
            jump_projection_frame_index, projection_frame_index);

        if (jump_distance < current_distance && jump_distance < walk_distance) {
          cursor_strip_index = right_jump_strip_index;
          cursor_projection_frame_index = jump_projection_frame_index;
          continue;
        }
      }

      cursor_strip_index = walk_strip_index;
      cursor_projection_frame_index = walk_projection_frame_index;

    } else {
      // WALK LEFT
      const std::uint32_t walk_strip_index =
          projector.left_strip_index_of[cursor_strip_index];
      const std::uint32_t walk_projection_frame_index =
          cursor_projection_frame_index -
          projector.strip_length_of[walk_strip_index];
      const std::uint32_t walk_distance = absolute_distance(
          walk_projection_frame_index, projection_frame_index);

      // USE LEFT JUMP IF AVAILABLE
      std::uint32_t left_jump_strip_index =
          projector.left_jump_strip_index_of[cursor_strip_index];

      if (left_jump_strip_index != u32_max) {
        std::uint32_t left_jump_length =
            projector.left_jump_length_of[cursor_strip_index];
        std::uint32_t left_jump_strip_count =
            projector.left_jump_strip_count_of[cursor_strip_index];

        // REMOVE A JUMP INDEX FROM BETWEEN TO INCREASE DISTANCE TOWARDS OPTIMAL
        if (left_jump_strip_count < optimal_jump_distance &&
            left_jump_strip_index != projector.head_strip_index) {
          const std::uint32_t next_left_jump_strip_index =
              projector.left_jump_strip_index_of[left_jump_strip_index];

          if (next_left_jump_strip_index != u32_max) {
            left_jump_length +=
                projector.left_jump_length_of[left_jump_strip_index];
            left_jump_strip_count +=
                projector.left_jump_strip_count_of[left_jump_strip_index];

            projector.left_jump_strip_index_of[cursor_strip_index] =
                next_left_jump_strip_index;
            projector.left_jump_length_of[cursor_strip_index] =
                left_jump_length;
            projector.left_jump_strip_count_of[cursor_strip_index] =
                left_jump_strip_count;

            projector.right_jump_strip_index_of[next_left_jump_strip_index] =
                cursor_strip_index;
            projector.right_jump_length_of[next_left_jump_strip_index] =
                left_jump_length;
            projector.right_jump_strip_count_of[next_left_jump_strip_index] =
                left_jump_strip_count;

            projector.left_jump_strip_index_of[left_jump_strip_index] = u32_max;
            projector.right_jump_strip_index_of[left_jump_strip_index] =
                u32_max;

            left_jump_strip_index = next_left_jump_strip_index;
          }
        }

        const std::uint32_t jump_projection_frame_index =
            cursor_projection_frame_index - left_jump_length;
        const std::uint32_t jump_distance = absolute_distance(
            jump_projection_frame_index, projection_frame_index);

        if (jump_distance < current_distance && jump_distance < walk_distance) {
          cursor_strip_index = left_jump_strip_index;
          cursor_projection_frame_index = jump_projection_frame_index;
          continue;
        }
      }

      cursor_strip_index = walk_strip_index;
      cursor_projection_frame_index = walk_projection_frame_index;
    }
  }

  projector.gate_strip_index = cursor_strip_index;
  projector.projection_frame_index = cursor_projection_frame_index;
}