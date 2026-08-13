/**
 * @file
 * @brief Resolves one Sequence Point through four Projection walkers.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>
#include <utility>

/**
 * @brief Find the materialized Strip containing one Sequence Point.
 * @param sequence_point Sequence Point to locate.
 * @param projector Projector whose Gate is moved.
 * @return Projection Frame Index and Strip Index, or two `u32_max` values.
 */
[[nodiscard]] inline std::pair<std::uint32_t, std::uint32_t>
run_projector_to_strip(const SequencePoint *sequence_point,
                       Projector *projector) noexcept {
  std::uint32_t gate_left_strip_index = projector->gate_strip_index;
  std::uint32_t gate_left_projection_frame_index =
      projector->gate_projection_frame_index;
  std::uint32_t gate_right_strip_index = gate_left_strip_index;
  std::uint32_t gate_right_projection_frame_index =
      gate_left_projection_frame_index;
  std::uint32_t head_strip_index = projector->head_strip_index;
  std::uint32_t head_projection_frame_index = 0;
  const std::uint32_t first_head_strip_index = head_strip_index;
  std::uint32_t tail_strip_index = projector->tail_strip_index;
  std::uint32_t tail_projection_frame_index =
      projector->projection_frame_count - projector->length[tail_strip_index];

  const auto find = [projector, sequence_point](
                        const std::uint32_t strip_index,
                        const std::uint32_t strip_projection_frame_index) {
    const SequencePoint &strip_start =
        projector->strips[strip_index].coordinate.this_strip_start;
    if (sequence_point->crypto_random_bits != strip_start.crypto_random_bits ||
        sequence_point->unix_lower_bits != strip_start.unix_lower_bits ||
        sequence_point->counter_bits < strip_start.counter_bits)
      return std::pair{u32_max, u32_max};

    const std::uint32_t offset =
        sequence_point->counter_bits - strip_start.counter_bits;
    if (offset >= projector->length[strip_index])
      return std::pair{u32_max, u32_max};

    projector->gate_strip_index = strip_index;
    projector->gate_projection_frame_index = strip_projection_frame_index;
    return std::pair{strip_projection_frame_index + offset, strip_index};
  };

  do {
    auto result =
        find(gate_left_strip_index, gate_left_projection_frame_index);
    if (result.first != u32_max)
      return result;
    result = find(gate_right_strip_index, gate_right_projection_frame_index);
    if (result.first != u32_max)
      return result;
    result = find(head_strip_index, head_projection_frame_index);
    if (result.first != u32_max)
      return result;
    result = find(tail_strip_index, tail_projection_frame_index);
    if (result.first != u32_max)
      return result;

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
  } while (head_strip_index != first_head_strip_index);

  return {u32_max, u32_max};
}
