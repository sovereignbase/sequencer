#pragma once

#include "./runtime.hpp"
#include "../find/containing_strip_index/index.hpp"
#include <algorithm>

namespace sequencer {

inline std::uint32_t write_recovery_footage_spans_to_buffer(
    const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];
  std::uint32_t projection_index = 0;
  for (auto strip_index = projector.head_strip_index; strip_index != u32_max;
       strip_index = projector.right_strip_index_of[strip_index]) {
    const auto frame_count = projector.strip_length_of[strip_index];
    const bool masked = projector.strip_type_of[strip_index] == 2;
    if (frame_count != 0)
      projector.for_each_footage_span(strip_index, [&](const auto footage, const auto length) {
        footage_span_buffer.write_span(projection_index, footage, length, masked);
      });
    if (!masked)
      projection_index += frame_count;
  }
  return footage_span_buffer.get_span_count();
}

inline std::uint32_t
get_projection_frame_count(const std::uint32_t projection_id) noexcept {
  // Read the materialized Projection length directly.
  return projectors[projection_id]->projection_frame_count;
}

inline std::uint32_t
get_footage_frame_index(const std::uint32_t projection_id,
                        const std::uint32_t projection_frame_index) noexcept {
  // Position the Gate at the visible containing Strip.
  Projector &projector = *projectors[projection_id];
  find_strip_index_of(projector, projection_frame_index);

  // Translate the Projection offset through the Strip's Footage mapping.
  return projector.footage_frame_index_of[projector.gate_strip_index] +
         projection_frame_index - projector.projection_frame_index;
}

inline std::uint32_t write_projection_footage_spans_to_buffer(
    const std::uint32_t projection_id, const std::uint32_t start_index,
    const std::uint32_t end_index) noexcept {
  Projector &projector = *projectors[projection_id];
  if (start_index >= end_index || end_index > projector.projection_frame_count)
    return 0;

  find_strip_index_of(projector, start_index);
  auto strip_index = projector.gate_strip_index;
  auto offset = start_index - projector.projection_frame_index;
  auto projection_index = start_index;
  while (projection_index < end_index) {
    const auto frame_count = std::min(
        projector.get_projected_strip_length(strip_index) - offset,
        end_index - projection_index);
    if (frame_count != 0) {
      footage_span_buffer.write_span(
          projection_index, projector.footage_frame_index_of[strip_index] + offset,
          frame_count, 0);
      projection_index += frame_count;
    }
    strip_index = projector.right_strip_index_of[strip_index];
    offset = 0;
  }
  return footage_span_buffer.get_span_count();
}

}
