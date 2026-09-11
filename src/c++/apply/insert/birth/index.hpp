#pragma once

#include "../../../.auxiliary/insert_between/index.hpp"
#include <cstdint>
#include <utility>

/**
 * @brief Materialize an insert with no parent, ordered among root siblings.
 * @pre The incoming insert is staged and nonempty.
 * Detached pending Strips may already occupy storage and remain detached.
 * @return Projection Frame count and materialized Strip count differences.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
insert_birth(Projector &projector, const std::uint32_t incoming_strip_index) noexcept {
  const bool empty = projector.materialized_strip_count == 0;
  insert_between(projector, u32_max, incoming_strip_index, projector.head_strip_index);
  const auto frame_count = projector.strip_length_of[incoming_strip_index];
  projector.projection_frame_count += frame_count;
  if (empty) {
    projector.gate_strip_index = incoming_strip_index;
    projector.projection_frame_index = 0;
  }
  return {static_cast<std::int32_t>(frame_count), 1};
}
