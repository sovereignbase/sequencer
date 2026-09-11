#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline std::uint32_t
acknowledge_projection(const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];
  std::vector<bool> represented(projector.collected_frontiers.size());

  projector.containment_table.for_each_realm(
      [&](SequencePoint frontier, const auto entries) noexcept {
        frontier.counter_bits = projector.collected_counter(frontier);
        for (std::size_t index = 0; index < projector.collected_frontiers.size(); ++index)
          if (projector.collected_frontiers[index].crypto_random_bits == frontier.crypto_random_bits &&
              projector.collected_frontiers[index].unix_lower_bits == frontier.unix_lower_bits)
            represented[index] = true;
        for (const auto &entry : entries) {
          if (projector.strip_type_of[entry.strip_index] != 2 ||
              entry.counter_bits != frontier.counter_bits ||
              entry.frame_count >= u32_max - frontier.counter_bits)
            return;
          frontier.counter_bits += entry.frame_count + 1;
        }
        sequence_point_buffer.write_sequence_point(frontier);
      });
  for (std::size_t index = 0; index < projector.collected_frontiers.size(); ++index)
    if (!represented[index])
      sequence_point_buffer.write_sequence_point(projector.collected_frontiers[index]);
  return sequence_point_buffer.get_sequence_point_count();
}

}
