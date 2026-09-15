#pragma once

#include "./issue.hpp"
#include "./runtime.hpp"
#include "../apply/insert/index.hpp"
#include "../find/containing_strip_index/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

namespace sequencer {

/** Issues one local Insert or hard Mask at a visible boundary. */
inline std::uint32_t update_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint8_t operation_type, const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index = u32_max) noexcept {
  auto &projector = *projectors[projection_id];
  if ((operation_type != 1 && operation_type != 2) || operation_length == 0 ||
      operation_index > projector.projection_frame_count ||
      (operation_type == 2 && operation_index == projector.projection_frame_count))
    return u32_max;

  std::uint32_t containing = u32_max;
  std::uint32_t physical_offset = 0;
  std::uint32_t logical_offset = 0;
  Clock anchor{0, 0};
  if (projector.projection_frame_count != 0) {
    const auto lookup_index = operation_index == projector.projection_frame_count
        ? operation_index - 1
        : operation_index;
    find_strip_index_of(projector, lookup_index);
    containing = projector.gate_strip_index;
    physical_offset = operation_index - projector.projection_frame_index;
    logical_offset = projector.fragment_offset_of[containing] + physical_offset;
    anchor = projector.insert_clock_of[containing];
  }

  const auto issued_length = operation_type == 2
      ? std::min(operation_length,
                 projector.fragment_length_of[containing] - physical_offset)
      : operation_length;
  const auto masked_footage = operation_type == 2
      ? projector.footage_frame_index_of[containing] + physical_offset
      : u32_max;
  const auto incoming = issue_strip(projector, operation_type, issued_length,
                                    anchor, logical_offset, footage_frame_index);
  if (incoming == u32_max)
    return u32_max;

  const auto [frame_diff, strip_diff] = apply_insert(
      projector, containing, incoming, physical_offset);
  const auto local_position = containing == u32_max ? 0 : operation_index;
  const auto position = operation_type == 2
      ? operation_index
      : find_projection_frame_index_of(projector, incoming, frame_diff,
                                       strip_diff, local_position);
  projector.gate_strip_index = incoming;
  projector.projection_frame_index = position;

  const auto inserted = projector.insert_clock_of[incoming];
  projection_buffer.write_strip({
      projector.strip_type_of[incoming],
      projector.dependency_prefix_of[incoming],
      projector.initial_length_of[incoming],
      projector.offset_length_of[incoming],
      anchor.actor,
      anchor.time,
      inserted.actor,
      inserted.time,
  });
  if (operation_type == 2)
    footage_span_buffer.write_span(operation_index, masked_footage,
                                   issued_length, 1);
  if (operation_type == 2)
    projector.frontier_table.observe_mask(
        inserted.actor, projector.dependency_prefix_of[incoming], inserted.time);
  return position;
}

} // namespace sequencer
