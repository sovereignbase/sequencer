#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline std::uint32_t
compact_projection(const std::uint32_t projection_id) noexcept {
  const auto frontiers = sequence_point_buffer.read_buffer();
  const Projector &projector = *projectors[projection_id];
  if (projector.structural_root_strip_index == u32_max)
    return 0;

  const std::uint32_t first_position = projector.structural_root_strip_index;
  std::uint32_t position = first_position;
  do {
    const Strip &strip = projector.strips[position];
    if (strip.is_masked != 0) {
      const SequencePoint &point = strip.coordinate.this_strip_start;
      for (std::uint32_t frontier_index = 0;
           frontier_index < frontiers.size() / 3;
           ++frontier_index) {
        const SequencePoint frontier{frontiers[frontier_index * 3],
                                     frontiers[frontier_index * 3 + 1],
                                     frontiers[frontier_index * 3 + 2]};
        if (frontier.crypto_random_bits == point.crypto_random_bits &&
            frontier.unix_lower_bits == point.unix_lower_bits &&
            frontier.counter_bits >= point.counter_bits) {
          footage_span_buffer.write_span(strip.footage_frame_index,
                                         projector.length[position]);
          break;
        }
      }
    }
    position = projector.right[position];
  } while (position != first_position);
  return footage_span_buffer.get_span_count();
}

}
