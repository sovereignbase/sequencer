#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline std::uint32_t
acknowledge_projection(const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];

  projector.containment_table.for_each_realm(
      [&](SequencePoint frontier, const auto entries) noexcept {
        for (const auto &entry : entries) {
          if (projector.strip_type_of[entry.strip_index] != 2 ||
              entry.counter_bits != frontier.counter_bits ||
              entry.frame_count >= u32_max - frontier.counter_bits)
            return;
          frontier.counter_bits += entry.frame_count + 1;
        }
        sequence_point_buffer.write_sequence_point(frontier);
      });
  return sequence_point_buffer.get_sequence_point_count();
}

}
