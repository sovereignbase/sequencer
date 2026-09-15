#pragma once

#include "./runtime.hpp"

namespace sequencer {

/** Encodes snapshot frontiers as `[wordCount, ...words]` records. */
inline std::uint32_t snapshot_frontiers(
    const std::uint32_t projection_id) noexcept {
  frontier_buffer.clear();
  projectors[projection_id]->frontier_table.for_each_acknowledgement(
      [](const auto word_count) { frontier_buffer.push(word_count); },
      [](const auto word) { frontier_buffer.push(word); });
  return frontier_buffer.size();
}

} // namespace sequencer
