#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline std::uint32_t *cached_acknowledgement_pointer(
    const std::uint32_t projection_id) noexcept {
  auto &cache = projectors[projection_id]->acknowledgement_cache;
  return cache.empty() ? nullptr : cache.data();
}

inline std::uint32_t cached_acknowledgement_word_count(
    const std::uint32_t projection_id) noexcept {
  return static_cast<std::uint32_t>(
      projectors[projection_id]->acknowledgement_cache.size());
}

inline void consume_cached_acknowledgement(
    const std::uint32_t projection_id) noexcept {
  projectors[projection_id]->consume_acknowledgement();
}

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
