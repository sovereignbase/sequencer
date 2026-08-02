/**
 * @file
 * @brief Defines the variable-width transfer buffer for footage spans.
 *
 * FootageSpanBuffer transfers the JavaScript-owned ranges released by native
 * garbage collection without copying payloads across the WebAssembly boundary.
 * Capacity is retained between collections.
 *
 * Every span uses two consecutive words:
 *
 * @code
 * 0  footage_frame_index
 * 1  frame_count
 * @endcode
 */
#pragma once

#include <cstddef>
#include <cstdint>
#include <vector>

/**
 * @brief Contiguous WebAssembly transfer representation of footage spans.
 *
 * @note One instance is shared by the exported interface. Its pointer remains
 * valid only until another garbage collection rewrites the buffer.
 */
class FootageSpanBuffer {
private:
  static constexpr std::size_t words_per_span = 2;
  std::vector<std::uint32_t> words;

public:
  /** @brief Remove every span while retaining allocated capacity. */
  inline void clear() noexcept { words.clear(); }

  /**
   * @brief Append one released footage span.
   *
   * @param footage_frame_index First JavaScript footage index in the span.
   * @param frame_count Number of consecutive footage entries in the span.
   */
  inline void write_span(const std::uint32_t footage_frame_index,
                         const std::uint32_t frame_count) noexcept {
    words.push_back(footage_frame_index);
    words.push_back(frame_count);
  }

  /** @brief Return the number of complete footage spans in the buffer. */
  [[nodiscard]] inline std::uint32_t get_span_count() const noexcept {
    return static_cast<std::uint32_t>(words.size() / words_per_span);
  }

  /**
   * @brief Return the first word of the contiguous transfer memory.
   *
   * @return Mutable pointer exported to the WebAssembly host, or `nullptr`
   * when the buffer is empty.
   */
  [[nodiscard]] inline std::uint32_t *get_memory_pointer() noexcept {
    return words.empty() ? nullptr : words.data();
  }
};
