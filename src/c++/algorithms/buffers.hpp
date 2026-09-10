#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline std::uint32_t *get_projection_buffer_pointer() noexcept {
  return projection_buffer.get_memory_pointer();
}

inline std::uint32_t get_projection_buffer_word_count() noexcept {
  return static_cast<std::uint32_t>(projection_buffer.get_word_count());
}

inline std::uint32_t get_footage_span_buffer_count() noexcept {
  return footage_span_buffer.get_span_count();
}

inline std::uint32_t *
get_acknowledgement_sequence_point_buffer_pointer() noexcept {
  // Expose the current shared Frontier transfer storage.
  return sequence_point_buffer.get_memory_pointer();
}

inline std::uint32_t *prepare_compaction_sequence_point_buffer(
    const std::uint32_t frontier_count) noexcept {
  // Allocate the exact writable Frontier transfer span.
  sequence_point_buffer.resize(frontier_count);
  return sequence_point_buffer.get_memory_pointer();
}

inline std::uint32_t *get_footage_span_buffer_pointer() noexcept {
  // Expose Footage spans written by the most recent operation.
  return footage_span_buffer.get_memory_pointer();
}

inline std::uint32_t *get_strip_buffer_pointer() noexcept {
  // Expose the fixed shared Strip transfer storage.
  return projection_buffer.get_memory_pointer();
}

}
