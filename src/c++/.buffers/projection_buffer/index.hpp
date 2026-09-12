/**
 * @file
 * @brief Owns dense twelve-word Strips in caller-supplied projection order.
 *
 * Each Strip occupies twelve consecutive unsigned 32-bit words:
 * 0 type (0 inverse/root Insert, 1 Insert, 2 Mask), 1 initial_length,
 * 2..4 this_strip_start, 5..7 previous_strip_end,
 * 8 larger_split_strip_index, 9 smaller_competitor_strip_index,
 * 10 fragment_length, 11 dependency_prefix.
 * Link targets are snapshot indices; u32_max means no target.
 * Each Sequence Point uses crypto_random_bits, unix_lower_bits, counter_bits.
 * Footage is supplied in snapshot order, including materialized Masks' retained
 * content. Mask instructions carry no Footage.
 * Indices are reconstructed during initialization.
 */
#pragma once

#include <array>
#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <span>
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
  static constexpr std::size_t words_per_strip = 12;
  static_assert(sizeof(std::array<std::uint32_t, words_per_strip>) ==
                words_per_strip * sizeof(std::uint32_t));

  std::vector<std::array<std::uint32_t, words_per_strip>> strips;
  std::array<std::uint32_t, words_per_strip> local_strip;
  std::size_t count = 0;
  bool local = false;

public:
  /** @brief Create writable storage for the given number of zeroed Strips. */
  explicit ProjectionBuffer(const std::size_t strip_count = 0)
      : strips(strip_count), count(strip_count) {}

  /**
   * @brief Set the Strip count, preserving the prefix and zeroing new Strips.
   * @note Growing storage may allocate and invalidate memory pointers.
   */
  void resize(const std::size_t strip_count) {
    const auto previous_count = local ? 0 : count;
    const auto reused_count = std::min(strip_count, strips.size());
    if (strip_count > strips.size())
      strips.resize(strip_count);
    if (reused_count > previous_count)
      std::fill(strips.begin() + previous_count, strips.begin() + reused_count,
                std::array<std::uint32_t, words_per_strip>{});
    count = strip_count;
    local = false;
  }

  void write_strip(
      const std::array<std::uint32_t, words_per_strip> &strip_words) noexcept {
    local_strip = strip_words;
    count = 1;
    local = true;
  }

  /**
   * @brief Write a twelve-word Strip at its prepared projection position.
   * @pre projection_strip_index is within the previously resized storage.
   */
  void write_projection(
      const std::size_t projection_strip_index,
      const std::array<std::uint32_t, words_per_strip> &strip_words) noexcept {
    strips[projection_strip_index] = strip_words;
  }

  /**
   * @brief Consume the projection logically while retaining its allocation.
   * @return Borrowed Strips, valid until the next write or resize.
   * A subsequent read returns an empty span.
   */
  [[nodiscard]] std::span<const std::array<std::uint32_t, words_per_strip>>
  read_buffer() noexcept {
    const std::span<const std::array<std::uint32_t, words_per_strip>> result{
        local ? &local_strip : strips.data(), count};
    count = 0;
    return result;
  }

  /** @brief Discard all Strips while retaining storage for the next producer.
   */
  void clear() noexcept {
    count = 0;
  }

  /** @brief Return the number of complete Strips in the buffer. */
  [[nodiscard]] std::size_t get_strip_count() const noexcept {
    return count;
  }

  /** @brief Return the total number of words available for host transfer. */
  [[nodiscard]] std::size_t get_word_count() const noexcept {
    return count * words_per_strip;
  }

  /**
   * @brief Expose dense storage for host writes, or nullptr when empty.
   * @note The host transfer spans get_word_count() words from this address.
   */
  [[nodiscard]] std::uint32_t *get_memory_pointer() noexcept {
    return count == 0 ? nullptr : (local ? local_strip.data() : strips.front().data());
  }

  /** @brief Expose dense storage for host reads, or nullptr when empty. */
  [[nodiscard]] const std::uint32_t *get_memory_pointer() const noexcept {
    return count == 0 ? nullptr : (local ? local_strip.data() : strips.front().data());
  }
};
