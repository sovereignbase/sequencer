/**
 * @file
 * @brief Owns dense ten-word Strips in caller-supplied projection order.
 *
 * Each Strip occupies ten consecutive unsigned 32-bit words:
 * 0 is_masked, 1 is_inverse, 2 frame_count,
 * 3..5 this_strip_start, 6..8 previous_strip_end, 9 footage_frame_index.
 * Each Sequence Point uses crypto_random_bits, unix_lower_bits, counter_bits.
 */
#pragma once

#include <array>
#include <cstddef>
#include <cstdint>
#include <vector>

/**
 * @brief Dynamically sized, contiguous projection transfer storage.
 *
 * The producer supplies Strips in resolved projection order. This class only
 * stores their words; it neither resolves order nor interprets their contents.
 * Reallocation invalidates previously returned memory pointers. After Wasm
 * memory grows, the host must also reacquire its view of that memory.
 */
class ProjectionBuffer {
private:
  static constexpr std::size_t words_per_strip = 10;
  static_assert(sizeof(std::array<std::uint32_t, words_per_strip>) ==
                words_per_strip * sizeof(std::uint32_t));

  std::vector<std::array<std::uint32_t, words_per_strip>> strips;

public:
  /** @brief Create writable storage for the given number of zeroed Strips. */
  explicit ProjectionBuffer(const std::size_t strip_count = 0)
      : strips(strip_count) {}

  /**
   * @brief Set the Strip count, preserving the prefix and zeroing new Strips.
   * @note Growing storage may allocate and invalidate memory pointers.
   */
  void resize(const std::size_t strip_count) { strips.resize(strip_count); }

  /** @brief Append the next ten-word Strip in projection order. */
  void write_projection(
      const std::array<std::uint32_t, words_per_strip> &strip_words) {
    strips.push_back(strip_words);
  }

  /** @brief Return the number of complete Strips in the buffer. */
  [[nodiscard]] std::size_t get_strip_count() const noexcept {
    return strips.size();
  }

  /** @brief Return the total number of words available for host transfer. */
  [[nodiscard]] std::size_t get_word_count() const noexcept {
    return strips.size() * words_per_strip;
  }

  /**
   * @brief Expose dense storage for host writes, or nullptr when empty.
   * @note The host transfer spans get_word_count() words from this address.
   */
  [[nodiscard]] std::uint32_t *get_memory_pointer() noexcept {
    return strips.empty() ? nullptr : strips.front().data();
  }

  /** @brief Expose dense storage for host reads, or nullptr when empty. */
  [[nodiscard]] const std::uint32_t *get_memory_pointer() const noexcept {
    return strips.empty() ? nullptr : strips.front().data();
  }
};
