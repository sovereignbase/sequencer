/**
 * @file
 * @brief Resolves one materialized Strip through four Projection walkers.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Position the Gate at a known materialized Strip.
 *
 * Walkers advance from the Gate in both directions, from Head to the right,
 * and from Tail to the left while retaining each exact Projection start.
 * @param stable_index Stable Position to locate.
 * @param projector Projector whose Gate is moved.
 * @return Projection Frame Index of `stable_index`.
 */
[[nodiscard]] inline std::uint32_t
run_projector_to_strip(const std::uint32_t stable_index,
                       Projector *projector) noexcept {
  std::uint32_t gate_left_strip_index = projector->gate_strip_index;
  std::uint32_t gate_left_projection_frame_index =
      projector->gate_projection_frame_index;
  std::uint32_t gate_right_strip_index = gate_left_strip_index;
  std::uint32_t gate_right_projection_frame_index =
      gate_left_projection_frame_index;
  std::uint32_t head_strip_index = projector->head_strip_index;
  std::uint32_t head_projection_frame_index = 0;
  std::uint32_t tail_strip_index = projector->tail_strip_index;
  std::uint32_t tail_projection_frame_index =
      projector->projection_frame_count - projector->length[tail_strip_index];

  while (true) {
    if (gate_left_strip_index == stable_index) {
      projector->gate_strip_index = stable_index;
      projector->gate_projection_frame_index =
          gate_left_projection_frame_index;
      return gate_left_projection_frame_index;
    }
    if (gate_right_strip_index == stable_index) {
      projector->gate_strip_index = stable_index;
      projector->gate_projection_frame_index =
          gate_right_projection_frame_index;
      return gate_right_projection_frame_index;
    }
    if (head_strip_index == stable_index) {
      projector->gate_strip_index = stable_index;
      projector->gate_projection_frame_index = head_projection_frame_index;
      return head_projection_frame_index;
    }
    if (tail_strip_index == stable_index) {
      projector->gate_strip_index = stable_index;
      projector->gate_projection_frame_index = tail_projection_frame_index;
      return tail_projection_frame_index;
    }

    gate_left_strip_index = projector->left[gate_left_strip_index];
    if (projector->strips[gate_left_strip_index].is_masked == 0)
      gate_left_projection_frame_index -=
          projector->length[gate_left_strip_index];

    if (projector->strips[gate_right_strip_index].is_masked == 0)
      gate_right_projection_frame_index +=
          projector->length[gate_right_strip_index];
    gate_right_strip_index = projector->right[gate_right_strip_index];

    if (projector->strips[head_strip_index].is_masked == 0)
      head_projection_frame_index += projector->length[head_strip_index];
    head_strip_index = projector->right[head_strip_index];

    tail_strip_index = projector->left[tail_strip_index];
    if (projector->strips[tail_strip_index].is_masked == 0)
      tail_projection_frame_index -= projector->length[tail_strip_index];
  }
}
