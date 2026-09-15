#pragma once

#include "./garbage_collect.hpp"
#include "./ingest.hpp"
#include "./lifecycle.hpp"

namespace sequencer {

/** Consumes snapshot frontiers and Deltas, compacting before returning. */
inline std::uint32_t create_projection(
    const std::uint32_t actor_id,
    const std::uint32_t footage_length) noexcept {
  const auto projection_id = initialize_projection(actor_id);
  auto &projector = *projectors[projection_id];
  const auto encoded_frontiers = frontier_buffer.read();
  for (std::size_t offset = 0; offset < encoded_frontiers.size();) {
    const auto word_count = encoded_frontiers[offset++];
    if (word_count == 0 || word_count > encoded_frontiers.size() - offset)
      break;
    projector.frontier_table.observe_actor(encoded_frontiers[offset]);
    offset += word_count;
  }
  static_cast<void>(
      ingest_projection(projection_id, 0, footage_length, true, false));
  for (std::size_t offset = 0; offset < encoded_frontiers.size();) {
    const auto word_count = encoded_frontiers[offset++];
    if (word_count > encoded_frontiers.size() - offset)
      break;
    projector.frontier_table.observe_acknowledgement(
        encoded_frontiers.subspan(offset, word_count));
    offset += word_count;
  }
  finalize_projection(projection_id);
  return projection_id;
}

} // namespace sequencer
