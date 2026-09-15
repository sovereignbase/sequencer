#pragma once

#include "./runtime.hpp"
#include "./update.hpp"

namespace sequencer {

/** Masks one visible range and emits all source-local Masks as one batch. */
inline std::uint32_t remove_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint32_t operation_length) noexcept {
  auto &projector = *projectors[projection_id];
  if (operation_length == 0 ||
      operation_index > projector.projection_frame_count ||
      operation_length > projector.projection_frame_count - operation_index)
    return u32_max;

  projection_buffer.begin_batch();
  footage_span_buffer.clear();
  auto remaining = operation_length;
  while (remaining != 0) {
    const auto before = projector.projection_frame_count;
    if (update_projection(projection_id, operation_index, 2, remaining,
                          u32_max, true) == u32_max)
      return u32_max;
    const auto removed = before - projector.projection_frame_count;
    if (removed == 0)
      return u32_max;
    remaining -= removed;
  }

  return operation_index;
}

/** Replaces one visible range and emits its Masks plus Insert as one batch. */
inline std::uint32_t replace_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index) noexcept {
  if (remove_projection(projection_id, operation_index, operation_length) ==
      u32_max)
    return u32_max;

  return update_projection(projection_id, operation_index, 1,
                           operation_length, footage_frame_index, true);
}

} // namespace sequencer
