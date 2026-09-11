#pragma once

#include "./birth/index.hpp"
#include "./before/index.hpp"
#include "./after/index.hpp"
#include "../../find/projection_frame_index/index.hpp"
#include <algorithm>
#include <array>

/**
 * @brief Dispatch a staged Strip without duplicating placement logic.
 * @pre The incoming Strip has type 0 (before), 1 (after), or 2 (Mask).
 * When materialized state exists, the containing Strip and offset are resolved.
 * A Mask's offset is its first addressed Frame's content offset. Empty source
 * anchors are followed through larger_split without consuming Mask content.
 * The Mask remains one Strip; its affected source fragments retain their own
 * split links. Mask application updates the Gate and surrounding jumps per span.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_insert(Projector &projector, std::uint32_t containing_strip_index,
             const std::uint32_t incoming_strip_index,
             std::uint32_t offset) noexcept {
  if (projector.left_strip_index_of[incoming_strip_index] != incoming_strip_index)
    return {0, 0};
  if (projector.strip_type_of[incoming_strip_index] == 2) {
    while (containing_strip_index != u32_max &&
           offset == projector.strip_length_of[containing_strip_index] &&
           projector.larger_split_strip_index_of[containing_strip_index] != u32_max) {
      containing_strip_index =
          projector.larger_split_strip_index_of[containing_strip_index];
      offset = 0;
    }
    if (containing_strip_index == u32_max ||
        projector.left_strip_index_of[containing_strip_index] == containing_strip_index ||
        projector.strip_type_of[containing_strip_index] == 2 ||
        offset >= projector.strip_length_of[containing_strip_index])
      return {0, 0};

    const auto length = projector.strip_length_of[incoming_strip_index];
    const auto first_length = std::min(
        length, projector.strip_length_of[containing_strip_index] - offset);
    std::vector<std::array<std::uint32_t, 2>> continuations;
    auto remaining = length - first_length;
    auto source = projector.larger_split_strip_index_of[containing_strip_index];
    while (remaining != 0) {
      if (source == u32_max ||
          projector.left_strip_index_of[source] == source ||
          projector.strip_type_of[source] == 2)
        return {0, 0};
      const auto consumed = std::min(remaining, projector.strip_length_of[source]);
      if (consumed != 0) {
        continuations.push_back({source, consumed});
        remaining -= consumed;
      }
      source = projector.larger_split_strip_index_of[source];
    }

    if (!continuations.empty()) {
      std::vector<std::pair<std::uint32_t, std::uint32_t>> spans;
      spans.reserve(continuations.size() + 1);
      spans.emplace_back(projector.footage_frame_index_of[containing_strip_index] + offset,
                         first_length);
      for (const auto &continuation : continuations) {
        const auto footage = projector.footage_frame_index_of[continuation[0]];
        if (spans.back().first + spans.back().second == footage)
          spans.back().second += continuation[1];
        else
          spans.emplace_back(footage, continuation[1]);
      }
      if (spans.size() > 1)
        projector.mask_footage_spans.emplace(incoming_strip_index, std::move(spans));
    }

    auto counts = insert_after(projector, containing_strip_index, incoming_strip_index,
                               offset + first_length, first_length);
    auto position = find_projection_frame_index_of(
        projector, incoming_strip_index, counts.first, counts.second);
    projector.gate_strip_index = incoming_strip_index;
    projector.projection_frame_index = position;

    for (const auto &continuation : continuations) {
      const auto target = continuation[0];
      const auto consumed = continuation[1];
      const auto previous_count = projector.materialized_strip_count;
      if (consumed < projector.strip_length_of[target])
        static_cast<void>(split_strip(projector, target, consumed));
      projector.strip_length_of[target] = 0;
      projector.containment_table.set(projector.strip_start_of[target], 0, target);
      projector.projection_frame_count -= consumed;
      const auto strip_diff = static_cast<std::int32_t>(
          projector.materialized_strip_count - previous_count);
      position = find_projection_frame_index_of(
          projector, target, -static_cast<std::int32_t>(consumed), strip_diff);
      projector.gate_strip_index = target;
      projector.projection_frame_index = position;
      counts.first -= static_cast<std::int32_t>(consumed);
      counts.second += strip_diff;
    }
    if (!continuations.empty()) {
      position = find_projection_frame_index_of(projector, incoming_strip_index, 0, 0);
      projector.gate_strip_index = incoming_strip_index;
      projector.projection_frame_index = position;
    }
    return counts;
  }
  if (containing_strip_index == u32_max)
    return insert_birth(projector, incoming_strip_index);
  if (projector.strip_type_of[incoming_strip_index] == 0)
    return insert_before(projector, containing_strip_index, incoming_strip_index, offset);
  return insert_after(projector, containing_strip_index, incoming_strip_index, offset);
}
