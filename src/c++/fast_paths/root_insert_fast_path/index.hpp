#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../auxiliary/strip_contains_sequence_point/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

[[nodiscard]] inline bool
root_insert_fast_path(Projector *projector, Strip *incoming_strip,
                      std::uint32_t projection_frame_index) noexcept {
  if (gate_contains_incoming_strip_previous_strip_end()) {
    if (!sequence_point_offset_equals_gate_strip_length)
      return false;
  }
}
