#pragma once

#include "./runtime.hpp"
#include "./issue.hpp"
#include "../apply/insert/index.hpp"
#include "../find/containing_strip_index/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

namespace sequencer {

/**
 * @brief Issue and apply a local operation at a visible Frame.
 * @pre A nonempty Projection supplies a valid visible operation_index. Birth
 * uses index zero and an insert type. A local Mask is bounded to the remainder
 * of its containing Strip and returns its retained Footage span.
 */
inline std::uint32_t update_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint8_t operation_type, const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index = u32_max) noexcept {
  Projector &projector = *projectors[projection_id];
  if (operation_type > 2 || operation_length == 0 ||
      (operation_type == 2 && projector.projection_frame_count == 0))
    return u32_max;

  std::uint32_t containing_strip_index = u32_max;
  std::uint32_t offset = 0;
  std::uint32_t dependency_prefix = 0;
  SequencePoint previous_strip_end{0, 0, 0};
  if (projector.materialized_strip_count != 0) {
    if (projector.projection_frame_count != 0) {
      find_strip_index_of(projector, operation_index);
      containing_strip_index = projector.gate_strip_index;
      offset = operation_index - projector.projection_frame_index;
      if (operation_type == 1)
        ++offset;
      if (operation_type == 1 &&
          offset == projector.fragment_length_of[containing_strip_index] &&
          projector.right_strip_index_of[containing_strip_index] != u32_max) {
        containing_strip_index = projector.right_strip_index_of[containing_strip_index];
        offset = 0;
      }
    } else {
      containing_strip_index = projector.head_strip_index;
    }
    previous_strip_end = projector.fragment_start(containing_strip_index);
    previous_strip_end.counter_bits += offset;
    dependency_prefix = projector.fragment_offset(containing_strip_index) + offset;
  }

  const auto issued_length = operation_type == 2
      ? std::min(operation_length,
                 projector.fragment_length_of[containing_strip_index] - offset)
      : operation_length;
  const auto masked_footage_index = operation_type == 2
      ? projector.footage_frame_index_of[containing_strip_index] + offset
      : u32_max;
  const auto incoming_strip_index =
      issue_strip(projector, operation_type, issued_length,
                  previous_strip_end, footage_frame_index);
  if (incoming_strip_index == u32_max)
    return u32_max;
  projector.dependency_prefix_of[incoming_strip_index] = dependency_prefix;

  const auto [frame_count_diff, strip_count_diff] = apply_insert(
      projector, containing_strip_index, incoming_strip_index, offset);
  const auto position = operation_type == 2 ? projector.projection_frame_index
      : find_projection_frame_index_of(
          projector, incoming_strip_index, frame_count_diff, strip_count_diff);
  projector.gate_strip_index = incoming_strip_index;
  projector.projection_frame_index = position;

  const auto strip_start = projector.strip_start_of[incoming_strip_index];
  projection_buffer.resize(1);
  projection_buffer.write_projection(
      0, {projector.strip_type_of[incoming_strip_index],
          projector.initial_length_of[incoming_strip_index],
          strip_start.crypto_random_bits, strip_start.unix_lower_bits,
          strip_start.counter_bits, previous_strip_end.crypto_random_bits,
          previous_strip_end.unix_lower_bits, previous_strip_end.counter_bits,
          u32_max, u32_max,
          projector.fragment_length_of[incoming_strip_index], dependency_prefix});
  if (operation_type == 2)
    footage_span_buffer.write_span(operation_index, masked_footage_index,
                                  issued_length, true);
  return position;
}

}
