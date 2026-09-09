#pragma once

#include "./runtime.hpp"
#include "../find/containing_strip_index/index.hpp"

namespace sequencer {

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

}
