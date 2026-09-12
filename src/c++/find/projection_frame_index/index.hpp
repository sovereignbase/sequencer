#pragma once
#include "../../.declarations/projector/index.hpp"
#include <cmath>
#include <cstdint>

[[nodiscard]] inline std::uint32_t
find_projection_frame_index_of(Projector &projector,
                               const std::uint32_t &strip_index,
                               const std::int32_t frame_count_diff,
                               const std::int32_t strip_count_diff,
                               const std::uint32_t local_position = u32_max) noexcept {
  // CACHE
  const std::uint32_t projection_frame_count = projector.projection_frame_count;

  // ITER
  std::uint32_t left_cursor = strip_index;
  std::uint32_t right_cursor = strip_index;
  std::uint32_t left_distance = 0;
  std::uint32_t right_distance = 0;
  std::uint32_t left_strip_distance = 0;
  std::uint32_t right_strip_distance = 0;
  std::uint32_t left_split = u32_max;
  std::uint32_t right_split = u32_max;
  std::uint32_t left_split_distance = 0;
  std::uint32_t right_split_distance = 0;
  std::uint32_t known_position = strip_index == projector.gate_strip_index
      ? projector.projection_frame_index : u32_max;

  // OPTIMIZER
  const std::uint32_t optimal_jump_distance = static_cast<std::uint32_t>(
      std::sqrt(projector.materialized_strip_count) + 0.5);

  // FIND NEAREST LEFT AND RIGHT JUMPS
  const bool jump_anchor = projector.left_jump_strip_index_of[strip_index] != u32_max ||
                           projector.right_jump_strip_index_of[strip_index] != u32_max;
  bool left_jump_found = jump_anchor || left_cursor == projector.head_strip_index;
  bool right_jump_found = jump_anchor || right_cursor == projector.tail_strip_index;

  while (!left_jump_found || !right_jump_found) {
    if (!left_jump_found) {
      left_cursor = projector.left_strip_index_of[left_cursor];
      left_distance += projector.get_projected_strip_length(left_cursor);
      ++left_strip_distance;
      if (left_cursor == projector.gate_strip_index)
        known_position = projector.projection_frame_index + left_distance;
      if (left_strip_distance == optimal_jump_distance) {
        left_split = left_cursor;
        left_split_distance = left_distance;
      }

      left_jump_found =
          left_cursor == projector.head_strip_index ||
          projector.right_jump_strip_index_of[left_cursor] != u32_max ||
          projector.left_jump_strip_index_of[left_cursor] != u32_max;
    }

    if (!right_jump_found) {
      right_distance += projector.get_projected_strip_length(right_cursor);
      right_cursor = projector.right_strip_index_of[right_cursor];
      ++right_strip_distance;
      if (right_cursor == projector.gate_strip_index)
        known_position = static_cast<std::uint32_t>(
            static_cast<std::int64_t>(projector.projection_frame_index) +
            frame_count_diff - right_distance);
      if (right_strip_distance == optimal_jump_distance) {
        right_split = right_cursor;
        right_split_distance = right_distance;
      }

      right_jump_found =
          right_cursor == projector.tail_strip_index ||
          projector.left_jump_strip_index_of[right_cursor] != u32_max ||
          projector.right_jump_strip_index_of[right_cursor] != u32_max;
    }
  }

  // UPDATE NEAREST LEFT JUMP
  if (projector.right_jump_strip_index_of[left_cursor] != u32_max) {
    projector.right_jump_length_of[left_cursor] = static_cast<std::uint32_t>(
        static_cast<std::int64_t>(projector.right_jump_length_of[left_cursor]) +
        frame_count_diff);

    projector.right_jump_strip_count_of[left_cursor] =
        static_cast<std::uint32_t>(
            static_cast<std::int64_t>(
                projector.right_jump_strip_count_of[left_cursor]) +
            strip_count_diff);
  }

  // UPDATE NEAREST RIGHT JUMP
  if (jump_anchor) {
    const auto right_jump = projector.right_jump_strip_index_of[strip_index];
    if (right_jump != u32_max) {
      projector.left_jump_length_of[right_jump] = projector.right_jump_length_of[strip_index];
      projector.left_jump_strip_count_of[right_jump] = projector.right_jump_strip_count_of[strip_index];
    }
  } else if (projector.left_jump_strip_index_of[right_cursor] != u32_max) {
    projector.left_jump_length_of[right_cursor] = static_cast<std::uint32_t>(
        static_cast<std::int64_t>(projector.left_jump_length_of[right_cursor]) +
        frame_count_diff);

    projector.left_jump_strip_count_of[right_cursor] =
        static_cast<std::uint32_t>(
            static_cast<std::int64_t>(
                projector.left_jump_strip_count_of[right_cursor]) +
            strip_count_diff);
  }

  if (projector.left_jump_strip_index_of[strip_index] == u32_max &&
      projector.right_jump_strip_index_of[strip_index] == u32_max &&
      (left_strip_distance >= optimal_jump_distance ||
       right_strip_distance >= optimal_jump_distance)) {
    const auto link = [&](const auto left, const auto right, const auto frames,
                          const auto strips) {
      projector.right_jump_strip_index_of[left] = right;
      projector.right_jump_length_of[left] = frames;
      projector.right_jump_strip_count_of[left] = strips;
      projector.left_jump_strip_index_of[right] = left;
      projector.left_jump_length_of[right] = frames;
      projector.left_jump_strip_count_of[right] = strips;
    };
    if (left_cursor != strip_index) {
      if (left_strip_distance >= optimal_jump_distance * 2) {
        link(left_cursor, left_split, left_distance - left_split_distance,
             left_strip_distance - optimal_jump_distance);
        link(left_split, strip_index, left_split_distance, optimal_jump_distance);
      } else {
        link(left_cursor, strip_index, left_distance, left_strip_distance);
      }
    }
    if (right_cursor != strip_index) {
      if (right_strip_distance >= optimal_jump_distance * 2) {
        link(strip_index, right_split, right_split_distance, optimal_jump_distance);
        link(right_split, right_cursor, right_distance - right_split_distance,
             right_strip_distance - optimal_jump_distance);
      } else {
        link(strip_index, right_cursor, right_distance, right_strip_distance);
      }
    }
  }

  if (local_position != u32_max)
    return local_position;
  if (known_position != u32_max)
    return known_position;

  // RUN
  while (true) {
    // CHECK IF LEFT IS AT HEAD
    if (left_cursor == projector.head_strip_index)
      return left_distance;

    // CHECK IF RIGHT IS AT TAIL
    if (right_cursor == projector.tail_strip_index)
      return projection_frame_count -
             projector.get_projected_strip_length(right_cursor) - right_distance;

    // USE LEFT JUMP IF AVAILABLE
    const std::uint32_t left_jump_strip_index =
        projector.left_jump_strip_index_of[left_cursor];

    if (left_jump_strip_index != u32_max) {
      std::uint32_t left_jump_length =
          projector.left_jump_length_of[left_cursor];
      std::uint32_t left_jump_strip_count =
          projector.left_jump_strip_count_of[left_cursor];

      // REMOVE A JUMP INDEX FROM BETWEEN TO INCREASE DISTANCE TOWARDS OPTIMAL
      if (left_jump_strip_count < optimal_jump_distance &&
          left_jump_strip_index != projector.head_strip_index) {
        const std::uint32_t next_left_jump_strip_index =
            projector.left_jump_strip_index_of[left_jump_strip_index];

        if (next_left_jump_strip_index != u32_max &&
            projector.left_jump_strip_count_of[left_jump_strip_index] <=
                optimal_jump_distance - left_jump_strip_count) {
          left_jump_length +=
              projector.left_jump_length_of[left_jump_strip_index];
          left_jump_strip_count +=
              projector.left_jump_strip_count_of[left_jump_strip_index];

          projector.left_jump_strip_index_of[left_cursor] =
              next_left_jump_strip_index;
          projector.left_jump_length_of[left_cursor] = left_jump_length;
          projector.left_jump_strip_count_of[left_cursor] =
              left_jump_strip_count;

          projector.right_jump_strip_index_of[next_left_jump_strip_index] =
              left_cursor;
          projector.right_jump_length_of[next_left_jump_strip_index] =
              left_jump_length;
          projector.right_jump_strip_count_of[next_left_jump_strip_index] =
              left_jump_strip_count;

          projector.left_jump_strip_index_of[left_jump_strip_index] = u32_max;
          projector.right_jump_strip_index_of[left_jump_strip_index] = u32_max;

          left_cursor = next_left_jump_strip_index;
        } else {
          left_cursor = left_jump_strip_index;
        }
      } else {
        left_cursor = left_jump_strip_index;
      }

      left_distance += left_jump_length;
    } else {
      left_cursor = projector.left_strip_index_of[left_cursor];
      left_distance += projector.get_projected_strip_length(left_cursor);
    }

    // USE RIGHT JUMP IF AVAILABLE
    const std::uint32_t right_jump_strip_index =
        projector.right_jump_strip_index_of[right_cursor];

    if (right_jump_strip_index != u32_max) {
      std::uint32_t right_jump_length =
          projector.right_jump_length_of[right_cursor];
      std::uint32_t right_jump_strip_count =
          projector.right_jump_strip_count_of[right_cursor];

      // REMOVE A JUMP INDEX FROM BETWEEN TO INCREASE DISTANCE TOWARDS OPTIMAL
      if (right_jump_strip_count < optimal_jump_distance &&
          right_jump_strip_index != projector.tail_strip_index) {
        const std::uint32_t next_right_jump_strip_index =
            projector.right_jump_strip_index_of[right_jump_strip_index];

        if (next_right_jump_strip_index != u32_max &&
            projector.right_jump_strip_count_of[right_jump_strip_index] <=
                optimal_jump_distance - right_jump_strip_count) {
          right_jump_length +=
              projector.right_jump_length_of[right_jump_strip_index];
          right_jump_strip_count +=
              projector.right_jump_strip_count_of[right_jump_strip_index];

          projector.right_jump_strip_index_of[right_cursor] =
              next_right_jump_strip_index;
          projector.right_jump_length_of[right_cursor] = right_jump_length;
          projector.right_jump_strip_count_of[right_cursor] =
              right_jump_strip_count;

          projector.left_jump_strip_index_of[next_right_jump_strip_index] =
              right_cursor;
          projector.left_jump_length_of[next_right_jump_strip_index] =
              right_jump_length;
          projector.left_jump_strip_count_of[next_right_jump_strip_index] =
              right_jump_strip_count;

          projector.left_jump_strip_index_of[right_jump_strip_index] = u32_max;
          projector.right_jump_strip_index_of[right_jump_strip_index] = u32_max;

          right_cursor = next_right_jump_strip_index;
        } else {
          right_cursor = right_jump_strip_index;
        }
      } else {
        right_cursor = right_jump_strip_index;
      }

      right_distance += right_jump_length;
    } else {
      right_distance += projector.get_projected_strip_length(right_cursor);
      right_cursor = projector.right_strip_index_of[right_cursor];
    }
  }
}
