/**
 * @file
 * @brief Defines the variable-width transfer buffer for realm frontiers.
 *
 * FrontierBuffer is the translation boundary between a C++ collection of
 * realm-specific SequencePoints and WebAssembly memory. It owns one contiguous
 * vector of words and retains its capacity between acknowledgement writes.
 *
 * Every frontier uses three consecutive words:
 *
 * @code
 * 0  unix_lower_bits
 * 1  counter_bits
 * 2  random_bits
 * @endcode
 */
#pragma once

#include "../../declarations/sequence_point/index.hpp"
#include <cstddef>
#include <cstdint>
#include <vector>

/**
 * @brief Contiguous WebAssembly transfer representation of realm frontiers.
 *
 * @note One instance is shared by the exported interface. Its pointer remains
 * valid only until another acknowledgement or collection prepares the buffer.
 */
class FrontierBuffer {
private:
  static constexpr std::size_t words_per_frontier = 3;
  std::vector<std::uint32_t> words;

public:
  /** @brief Remove every frontier while retaining allocated capacity. */
  inline void clear() noexcept { words.clear(); }

  /**
   * @brief Prepare writable transfer memory for an exact frontier count.
   *
   * Existing capacity is reused whenever possible. The WebAssembly host must
   * write every prepared entry before the buffer is read by native code.
   *
   * @param frontier_count Number of three-word frontiers to receive.
   */
  inline void resize(const std::uint32_t frontier_count) noexcept {
    words.resize(static_cast<std::size_t>(frontier_count) *
                 words_per_frontier);
  }

  /**
   * @brief Reserve transfer memory for a known maximum frontier count.
   *
   * @param frontier_capacity Maximum number of realm frontiers to be written.
   */
  inline void reserve(const std::uint32_t frontier_capacity) noexcept {
    words.reserve(static_cast<std::size_t>(frontier_capacity) *
                  words_per_frontier);
  }

  /**
   * @brief Append one realm frontier in the stable three-word layout.
   *
   * @param frontier Greatest locally observed indexed point in one realm.
   */
  inline void write_frontier(const SequencePoint &frontier) noexcept {
    words.push_back(frontier.unix_lower_bits);
    words.push_back(frontier.counter_bits);
    words.push_back(frontier.random_bits);
  }

  /** @brief Return the number of complete realm frontiers in the buffer. */
  [[nodiscard]] inline std::uint32_t get_frontier_count() const noexcept {
    return static_cast<std::uint32_t>(words.size() / words_per_frontier);
  }

  /**
   * @brief Decode one frontier from the stable three-word layout.
   *
   * @param frontier_index Zero-based frontier entry index.
   * @return Realm frontier stored at `frontier_index`.
   * @pre `frontier_index < get_frontier_count()`.
   */
  [[nodiscard]] inline SequencePoint
  read_frontier(const std::uint32_t frontier_index) const noexcept {
    const std::size_t word_index =
        static_cast<std::size_t>(frontier_index) * words_per_frontier;
    return SequencePoint{
        .unix_lower_bits = words[word_index],
        .counter_bits = words[word_index + 1],
        .random_bits = words[word_index + 2],
    };
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
