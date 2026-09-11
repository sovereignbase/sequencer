#pragma once

#include "./birth/index.hpp"
#include "./before/index.hpp"
#include "./after/index.hpp"
#include "../../find/projection_frame_index/index.hpp"
#include <array>

/**
 * @brief Apply an instruction to source fragments, keeping its identity intact.
 * @pre The incoming Strip is staged and its dependency is resolved.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_insert(Projector &projector, const std::uint32_t containing_strip_index,
             const std::uint32_t incoming_strip_index,
             const std::uint32_t offset) noexcept {
  if (projector.left_strip_index_of[incoming_strip_index] != incoming_strip_index)
    return {0, 0};
  if (projector.strip_type_of[incoming_strip_index] == 2) {
    std::vector<std::array<std::uint32_t, 3>> targets;
    if (!projector.for_each_mask_target(incoming_strip_index,
          [&](const auto source, const auto start, const auto length) {
            targets.push_back({source, start, length});
          }) || targets.empty())
      return {0, 0};
    std::pair<std::int32_t, std::int32_t> counts{0, 0};
    bool first = true;
    for (const auto &target : targets) {
      auto source = target[0];
      const auto previous_count = projector.materialized_strip_count;
      if (target[1] != 0)
        source = split_strip(projector, source, target[1], false);
      if (target[2] < projector.strip_length_of[source])
        static_cast<void>(split_strip(projector, source, target[2], false));
      const auto visible = projector.get_projected_strip_length(source);
      projector.strip_type_of[source] = static_cast<std::uint8_t>(
          6 + (projector.strip_type_of[source] & 1) +
          (projector.strip_type_of[source] & 16));
      const auto owner = projector.mask_owner_of.find(source);
      if (owner == projector.mask_owner_of.end() ||
          projector.strip_start_of[owner->second] < projector.strip_start_of[incoming_strip_index])
        projector.mask_owner_of[source] = incoming_strip_index;
      if (first) {
        insert_between(projector, projector.left_strip_index_of[source],
                       incoming_strip_index, source);
        first = false;
      }
      projector.projection_frame_count -= visible;
      const auto frame_diff = -static_cast<std::int32_t>(visible);
      const auto strip_diff = static_cast<std::int32_t>(
          projector.materialized_strip_count - previous_count);
      const auto position = find_projection_frame_index_of(projector, source, frame_diff, strip_diff);
      projector.gate_strip_index = source;
      projector.projection_frame_index = position;
      counts.first += frame_diff;
      counts.second += strip_diff;
    }
    const auto position = find_projection_frame_index_of(projector, incoming_strip_index, 0, 0);
    projector.gate_strip_index = incoming_strip_index;
    projector.projection_frame_index = position;
    return counts;
  }
  if (containing_strip_index == u32_max)
    return insert_birth(projector, incoming_strip_index);
  if (projector.strip_type_of[containing_strip_index] >= 6) {
    auto source = containing_strip_index;
    const auto previous_count = projector.materialized_strip_count;
    auto boundary = offset;
    if (projector.strip_type_of[incoming_strip_index] == 0 && boundary != 0)
      --boundary;
    if (boundary != 0 && boundary < projector.strip_length_of[source]) {
      source = split_strip(projector, source, boundary, false);
      boundary = 0;
    }
    const auto left = boundary == projector.strip_length_of[source]
        ? source : projector.left_strip_index_of[source];
    const auto right = left == source ? projector.right_strip_index_of[source] : source;
    insert_between(projector, left, incoming_strip_index, right);
    projector.projection_frame_count += projector.get_projected_strip_length(incoming_strip_index);
    return {static_cast<std::int32_t>(projector.get_projected_strip_length(incoming_strip_index)),
            static_cast<std::int32_t>(projector.materialized_strip_count - previous_count)};
  }
  if (projector.strip_type_of[incoming_strip_index] == 0)
    return insert_before(projector, containing_strip_index, incoming_strip_index, offset);
  return insert_after(projector, containing_strip_index, incoming_strip_index, offset);
}
