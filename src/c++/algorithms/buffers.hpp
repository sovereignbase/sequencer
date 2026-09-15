#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline void clear_projection_buffer() noexcept {
  projection_buffer.clear();
}

inline void clear_footage_span_buffer() noexcept {
  footage_span_buffer.clear();
}

inline void clear_frontier_buffer() noexcept {
  frontier_buffer.clear();
}

inline std::uint32_t *prepare_projection_buffer(
    const std::uint32_t strip_count) noexcept {
  projection_buffer.resize(strip_count);
  return projection_buffer.get_memory_pointer();
}

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
get_frontier_buffer_pointer() noexcept {
  return frontier_buffer.data();
}

inline std::uint32_t get_frontier_buffer_word_count() noexcept {
  return frontier_buffer.size();
}

inline std::uint32_t *prepare_frontier_buffer(
    const std::uint32_t word_count) noexcept {
  frontier_buffer.resize(word_count);
  return frontier_buffer.data();
}

inline std::uint32_t *get_footage_span_buffer_pointer() noexcept {
  // Expose Footage spans written by the most recent operation.
  return footage_span_buffer.get_memory_pointer();
}

}
