#pragma once

#include "./runtime.hpp"

namespace sequencer {

/** @brief Collect retained Mask Footage covered by supplied Realm frontiers. */
inline std::uint32_t
compact_projection(const std::uint32_t projection_id) noexcept {
  const auto frontiers = sequence_point_buffer.read_buffer();
  const Projector &projector = *projectors[projection_id];
  std::uint32_t projection_index = 0;
  for (auto strip = projector.head_strip_index; strip != u32_max;
       strip = projector.right_strip_index_of[strip]) {
    const auto length = projector.strip_length_of[strip];
    if (projector.strip_type_of[strip] == 2 && length != 0 &&
        projector.footage_frame_index_of[strip] != u32_max) {
      const auto point = projector.strip_start_of[strip];
      for (std::size_t frontier = 0; frontier + 2 < frontiers.size(); frontier += 3) {
        if (frontiers[frontier] == point.crypto_random_bits &&
            frontiers[frontier + 1] == point.unix_lower_bits &&
            static_cast<std::uint64_t>(point.counter_bits) + length <
                frontiers[frontier + 2]) {
          footage_span_buffer.write_span(
              projection_index, projector.footage_frame_index_of[strip], length, 1);
          break;
        }
      }
    }
    projection_index += projector.get_projected_strip_length(strip);
  }
  return footage_span_buffer.get_span_count();
}

}
