#pragma once

#include "./runtime.hpp"

namespace sequencer {

/** Serializes retained origin operations; fragments remain a runtime detail. */
inline void snapshot_projection(const std::uint32_t projection_id) noexcept {
  const auto &projector = *projectors[projection_id];
  std::uint32_t origin_count = 0;
  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip)
    if (!projector.is_fragment(strip) && projector.strip_type_of[strip] != 255)
      ++origin_count;
  projection_buffer.resize(origin_count);

  std::uint32_t delta_index = 0;
  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip) {
    if (projector.is_fragment(strip) || projector.strip_type_of[strip] == 255)
      continue;
    const auto anchor = projector.anchor_clock_of[strip];
    const auto inserted = projector.insert_clock_of[strip];
    projection_buffer.write_projection(delta_index, {
        projector.strip_type_of[strip],
        projector.dependency_prefix_of[strip],
        projector.initial_length_of[strip],
        projector.offset_length_of[strip],
        anchor.actor,
        anchor.time,
        inserted.actor,
        inserted.time,
    });
    if (projector.strip_type_of[strip] == 1) {
      for (auto fragment = strip; fragment != u32_max;
           fragment = projector.larger_split_strip_index_of[fragment])
        if (projector.footage_frame_index_of[fragment] != u32_max &&
            projector.fragment_length_of[fragment] != 0)
          footage_span_buffer.write_span(
              delta_index, projector.footage_frame_index_of[fragment],
              projector.fragment_length_of[fragment],
              projector.fragment_offset_of[fragment]);
    }
    ++delta_index;
  }
}

} // namespace sequencer
