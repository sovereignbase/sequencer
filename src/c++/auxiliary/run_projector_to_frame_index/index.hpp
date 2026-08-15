/**
 * @file
 * @brief Positions a Projector Gate through Strip-local Projection jumps.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include "../absolute_distance/index.hpp"
#include "../run_projector_left/index.hpp"
#include "../run_projector_right/index.hpp"
#include "../strip_contains_frame_index/index.hpp"
#include <cmath>
#include <cstdint>

/**
 * @brief Move the Gate to the visible Strip containing one Projection Frame.
 * @param projector Projector whose Gate is moved.
 * @param projection_frame_index Projection Frame to locate.
 */
inline void run_projector_to_frame_index(
    Projector &projector,
    const std::uint32_t &projection_frame_index) noexcept {
  // Calculate distances to the requested index.
  const std::uint32_t tail_projection_frame_index =
      projector.projection_frame_count -
      projector.strip_length_of[projector.tail_strip_index];
  const std::uint32_t gate_distance = absolute_distance(
      projector.projection_frame_count, projection_frame_index);
  const std::uint32_t head_distance = projection_frame_index;
  const std::uint32_t tail_distance =
      absolute_distance(tail_projection_frame_index, projection_frame_index);

  // Choose a strip with the shortest distance to requested index to start the
  // walk.
  std::uint32_t distance_to_walk = gate_distance;
  if (head_distance < gate_distance && head_distance <= tail_distance) {
    projector.gate_strip_index = projector.head_strip_index;
    projector.projection_frame_index = 0;
    distance_to_walk = head_distance;
  } else if (tail_distance < gate_distance) {
    projector.gate_strip_index = projector.tail_strip_index;
    projector.projection_frame_index = tail_projection_frame_index;
    distance_to_walk = tail_distance;
  }

  // Prepare jump cursors
  std::uint32_t distance_walked;
  // Calculate ideal jump distance.
  const std::uint32_t optimal_jump_distance = static_cast<std::uint32_t>(
      std::sqrt(projector.projection_frame_count) + 0.5);
  //
  std::uint32_t cursor_strip_index = projector.gate_strip_index;
  std::uint32_t cursor_projection_frame_index =
      projector.projection_frame_index;

  while (distance_to_walk > projector.strip_length_of[cursor_strip_index]) {
    if (cursor_projection_frame_index <= projection_frame_index) {
      while () {
      }
    } else {
      while () {
      }
    }
  }
}
