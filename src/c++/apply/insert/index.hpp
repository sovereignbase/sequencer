#pragma once

#include "./birth/index.hpp"
#include "./before/index.hpp"
#include "./after/index.hpp"
#include "../../find/projection_frame_index/index.hpp"
#include <algorithm>

/**
 * @brief Apply an instruction to source fragments, keeping its identity intact.
 * @pre The incoming Strip is staged and its dependency is resolved.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_insert(Projector &projector, const std::uint32_t containing_strip_index,
             const std::uint32_t incoming_strip_index,
             const std::uint32_t offset,
             std::uint32_t *const first_change = nullptr) noexcept {
  if (projector.left_strip_index_of[incoming_strip_index] != incoming_strip_index)
    return {0, 0};
  if (projector.strip_type_of[incoming_strip_index] == 2) {
    auto remaining = projector.initial_length_of[incoming_strip_index];
    if (remaining == 0 || containing_strip_index == u32_max ||
        projector.strip_type_of[containing_strip_index] == 2)
      return {0, 0};
    if (remaining > projector.fragment_length_of[containing_strip_index] - offset) {
      auto source = containing_strip_index;
      auto start = offset;
      auto pending = remaining;
      auto expected = projector.dependency_prefix_of[incoming_strip_index];
      while (pending != 0) {
        if (source == u32_max || projector.left_strip_index_of[source] == source ||
            projector.strip_type_of[source] == 2 ||
            projector.fragment_offset(source) + start != expected)
          return {0, 0};
        const auto length = std::min(pending, projector.fragment_length_of[source] - start);
        pending -= length;
        expected += length;
        source = projector.larger_split_strip_index_of[source];
        start = 0;
      }
    }
    std::pair<std::int32_t, std::int32_t> counts{0, 0};
    auto source = containing_strip_index;
    auto start = offset;
    while (remaining != 0) {
      const auto length = std::min(remaining, projector.fragment_length_of[source] - start);
      if (length == 0) {
        source = projector.larger_split_strip_index_of[source];
        start = 0;
        continue;
      }
      const auto previous_count = projector.materialized_strip_count;
      if (start != 0 || !projector.is_fragment(source))
        source = split_strip(projector, source, start);
      if (length < projector.fragment_length_of[source])
        static_cast<void>(split_strip(projector, source, length));
      const auto visible = projector.get_projected_strip_length(source);
      projector.strip_type_of[source] = static_cast<std::uint8_t>(
          6 + (projector.strip_type_of[source] & 1) +
          (projector.strip_type_of[source] & 16));
      projector.projection_frame_count -= visible;
      const auto frame_diff = -static_cast<std::int32_t>(visible);
      const auto strip_diff = static_cast<std::int32_t>(
          projector.materialized_strip_count - previous_count);
      const auto position = find_projection_frame_index_of(projector, source, frame_diff, strip_diff);
      if (first_change != nullptr && visible != 0)
        *first_change = std::min(*first_change, position);
      projector.gate_strip_index = source;
      projector.projection_frame_index = position;
      counts.first += frame_diff;
      counts.second += strip_diff;
      remaining -= length;
      source = projector.larger_split_strip_index_of[source];
      start = 0;
    }
    insert_between(projector, containing_strip_index, incoming_strip_index,
                   projector.right_strip_index_of[containing_strip_index]);
    ++counts.second;
    const auto position = find_projection_frame_index_of(projector, incoming_strip_index, 0, 1);
    projector.gate_strip_index = incoming_strip_index;
    projector.projection_frame_index = position;
    return counts;
  }
  if (containing_strip_index == u32_max)
    return insert_birth(projector, incoming_strip_index);
  if ((projector.strip_type_of[incoming_strip_index] & 1) == 0)
    return insert_before(projector, containing_strip_index, incoming_strip_index, offset);
  return insert_after(projector, containing_strip_index, incoming_strip_index, offset);
}
