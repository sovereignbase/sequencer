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
#include <cstdint>

/**
 * @brief Move the Gate to the visible Strip containing one Projection Frame.
 * @param projector Projector whose Gate is moved.
 * @param projection_frame_index Projection Frame to locate.
 */
inline void run_projector_to_frame_index(
    Projector *projector, const std::uint32_t projection_frame_index) noexcept {
  const std::uint32_t tail_projection_frame_index =
      projector->projection_frame_count -
      projector->length[projector->tail_strip_index];
  const std::uint32_t gate_distance = absolute_distance(
      projector->gate_projection_frame_index, projection_frame_index);
  const std::uint32_t head_distance = projection_frame_index;
  const std::uint32_t tail_distance = absolute_distance(
      tail_projection_frame_index, projection_frame_index);

  if (head_distance < gate_distance && head_distance <= tail_distance) {
    projector->gate_strip_index = projector->head_strip_index;
    projector->gate_projection_frame_index = 0;
  } else if (tail_distance < gate_distance) {
    projector->gate_strip_index = projector->tail_strip_index;
    projector->gate_projection_frame_index = tail_projection_frame_index;
  }

  const auto contains = [projector, projection_frame_index]() noexcept {
    return strip_contains_frame_index(
        &projector->strips[projector->gate_strip_index],
        projector->gate_projection_frame_index, projection_frame_index,
        projector->length[projector->gate_strip_index]);
  };
  if (contains())
    return;

  std::uint32_t jump_origin_strip_index = projector->gate_strip_index;
  std::uint32_t jump_origin_projection_frame_index =
      projector->gate_projection_frame_index;

  while (!contains()) {
    Strip &gate_strip = projector->strips[projector->gate_strip_index];
    if (gate_strip.jump_generation != projector->projection_generation) {
      gate_strip.left_jump_strip_index = u32_max;
      gate_strip.right_jump_strip_index = u32_max;
      gate_strip.jump_generation = projector->projection_generation;
    }

    if (projector->gate_projection_frame_index <= projection_frame_index) {
      if (gate_strip.right_jump_strip_index != u32_max &&
          gate_strip.right_jump_frame_offset <=
              projection_frame_index -
                  projector->gate_projection_frame_index) {
        projector->gate_projection_frame_index +=
            gate_strip.right_jump_frame_offset;
        projector->gate_strip_index = gate_strip.right_jump_strip_index;
      } else {
        static_cast<void>(run_projector_right(projector));
      }
    } else {
      if (gate_strip.left_jump_strip_index != u32_max &&
          gate_strip.left_jump_frame_offset <=
              projector->gate_projection_frame_index -
                  projection_frame_index) {
        projector->gate_projection_frame_index -=
            gate_strip.left_jump_frame_offset;
        projector->gate_strip_index = gate_strip.left_jump_strip_index;
      } else {
        static_cast<void>(run_projector_left(projector));
      }
    }

    const std::uint32_t jump_frame_offset = absolute_distance(
        jump_origin_projection_frame_index,
        projector->gate_projection_frame_index);
    if (jump_frame_offset >= 256u &&
        projector->strips[projector->gate_strip_index].is_masked == 0) {
      Strip &jump_origin =
          projector->strips[jump_origin_strip_index];
      Strip &jump_target =
          projector->strips[projector->gate_strip_index];
      if (jump_origin.jump_generation != projector->projection_generation) {
        jump_origin.left_jump_strip_index = u32_max;
        jump_origin.right_jump_strip_index = u32_max;
        jump_origin.jump_generation = projector->projection_generation;
      }
      if (jump_target.jump_generation != projector->projection_generation) {
        jump_target.left_jump_strip_index = u32_max;
        jump_target.right_jump_strip_index = u32_max;
        jump_target.jump_generation = projector->projection_generation;
      }
      if (jump_origin_projection_frame_index <
          projector->gate_projection_frame_index) {
        jump_origin.right_jump_strip_index = projector->gate_strip_index;
        jump_origin.right_jump_frame_offset = jump_frame_offset;
        jump_target.left_jump_strip_index = jump_origin_strip_index;
        jump_target.left_jump_frame_offset = jump_frame_offset;
      } else {
        jump_origin.left_jump_strip_index = projector->gate_strip_index;
        jump_origin.left_jump_frame_offset = jump_frame_offset;
        jump_target.right_jump_strip_index = jump_origin_strip_index;
        jump_target.right_jump_frame_offset = jump_frame_offset;
      }
      jump_origin_strip_index = projector->gate_strip_index;
      jump_origin_projection_frame_index =
          projector->gate_projection_frame_index;
    }
  }
}
