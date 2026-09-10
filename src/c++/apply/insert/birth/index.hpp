#pragma once

#include "../../../.auxiliary/insert_between/index.hpp"
#include <cstdint>
#include <utility>

/**
 * @brief Materialize the first visible Strip without invoking Find.
 * @pre No materialized Strips exist. The incoming insert is staged and nonempty.
 * Detached pending Strips may already occupy storage and remain detached.
 * @return Projection Frame count and materialized Strip count differences.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
insert_birth(Projector &projector, const std::uint32_t incoming_strip_index) noexcept {
  insert_between(projector, u32_max, incoming_strip_index, u32_max);
  const auto frame_count = projector.strip_length_of[incoming_strip_index];
  projector.projection_frame_count += frame_count;
  projector.gate_strip_index = incoming_strip_index;
  projector.projection_frame_index = 0;
  return {static_cast<std::int32_t>(frame_count), 1};
}
