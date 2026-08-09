/**
 * @file
 * @brief Defines the WebAssembly transfer buffer for one Frontier.
 *
 * A Frontier is a Replica's Realm-indexed acknowledgement boundary. Each Realm
 * represented in that Frontier contributes one Sequence Point, and
 * FrontierBuffer stores those entries in one owned contiguous vector. Capacity
 * is retained across acknowledgement and garbage-collection cycles.
 *
 * Every Realm entry uses three consecutive words:
 *
 * @code
 * 0  crypto_random_bits
 * 1  unix_lower_bits
 * 2  counter_bits
 * @endcode
 */
#pragma once

#include "../../declarations/sequence_point/index.hpp"
#include <cstddef>
#include <cstdint>
#include <vector>

/**
 * @brief Owned contiguous WebAssembly representation of one Frontier.
 *
 * Entry order carries no Realm priority and need not match structural Sequence
 * order; the crypto-random and Unix components identify each entry's Realm.
 * The class transfers boundary metadata only and owns no Replica, Sequence, or
 * Strip.
 *
 * @invariant `words.size()` is a multiple of `words_per_frontier_entry`.
 * @note One instance is shared by the exported runtime. Any mutating operation
 * may invalidate a previously returned pointer or replace its contents.
 * @warning Allocation failure in a mutating `noexcept` operation terminates the
 * program rather than propagating an exception across the ABI.
 */
class FrontierBuffer {
private:
  // Variable-width owned ABI storage.

  /** @brief Number of unsigned 32-bit words in one Realm boundary entry. */
  static constexpr std::size_t words_per_frontier_entry = 3;

  /** @brief Owned storage containing zero or more complete Realm entries. */
  std::vector<std::uint32_t> words;

public:
  // Buffer lifecycle and capacity preparation.

  /**
   * @brief Remove every Realm entry while retaining allocated capacity.
   *
   * @post `get_frontier_count()` returns zero.
   * @note Previously returned pointers must no longer be dereferenced.
   * @complexity Linear in the current word count as specified for
   * `std::vector::clear`.
   */
  inline void clear() noexcept {
    // Discard entries while retaining their allocation for reuse.
    words.clear();
  }

  /**
   * @brief Prepare writable transfer memory for an exact Realm entry count.
   *
   * Existing capacity is reused whenever possible. The WebAssembly host must
   * write every prepared entry before the buffer is read by native code.
   *
   * @param frontier_count Number of three-word Realm entries to receive.
   * @post The buffer contains exactly `frontier_count` value-initialized
   * entries available for host writes.
   * @note Reallocation invalidates every previously returned pointer.
   * @complexity Linear in the number of words initialized or destroyed, plus
   * allocation when existing capacity is insufficient.
   */
  inline void resize(const std::uint32_t frontier_count) noexcept {
    // Materialize the exact writable word range requested by the host.
    words.resize(static_cast<std::size_t>(frontier_count) *
                 words_per_frontier_entry);
  }

  /**
   * @brief Reserve transfer memory for a known maximum Realm entry count.
   *
   * @param frontier_capacity Maximum number of Realm entries to be written.
   * @post Capacity is sufficient for `frontier_capacity` entries and the
   * current entry count is unchanged.
   * @note A growing reservation invalidates every previously returned pointer.
   * @complexity O(n) when reallocation moves n existing words; O(1) otherwise.
   */
  inline void reserve(const std::uint32_t frontier_capacity) noexcept {
    // Reserve complete Realm entries without changing the current Frontier.
    words.reserve(static_cast<std::size_t>(frontier_capacity) *
                  words_per_frontier_entry);
  }

  // Frontier entry encoding and inspection.

  /**
   * @brief Append one Realm boundary point in the stable three-word layout.
   *
   * @param frontier Greatest locally observed materialized Strip start in one
   * Realm.
   * @post The Realm entry count increases by one and prior entry order is
   * preserved.
   * @note The buffer does not enforce one entry per Realm; the producer defines
   * a valid Frontier.
   * @complexity Amortized O(1) time and O(1) auxiliary space.
   */
  inline void write_frontier(const SequencePoint &frontier) noexcept {
    // Append one Realm boundary in stable ABI lane order.
    words.push_back(frontier.crypto_random_bits);
    words.push_back(frontier.unix_lower_bits);
    words.push_back(frontier.counter_bits);
  }

  /**
   * @brief Return the number of complete Realm entries in the Frontier.
   *
   * @return `words.size() / words_per_frontier_entry`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t get_frontier_count() const noexcept {
    // Convert the complete word count to a Realm entry count.
    return static_cast<std::uint32_t>(words.size() / words_per_frontier_entry);
  }

  /**
   * @brief Decode one Realm boundary point from the stable three-word layout.
   *
   * @param frontier_index Zero-based Realm entry index.
   * @return Boundary Sequence Point stored at `frontier_index`.
   * @pre `frontier_index < get_frontier_count()`.
   * @post The buffer contents are unchanged.
   * @complexity O(1) time and O(1) auxiliary space.
   */
  [[nodiscard]] inline SequencePoint
  read_frontier(const std::uint32_t frontier_index) const noexcept {
    // Locate and decode one complete Realm boundary entry.
    const std::size_t word_index =
        static_cast<std::size_t>(frontier_index) * words_per_frontier_entry;
    return SequencePoint{
        .crypto_random_bits = words[word_index],
        .unix_lower_bits = words[word_index + 1],
        .counter_bits = words[word_index + 2],
    };
  }

  // Host memory access.

  /**
   * @brief Return the first word of the contiguous transfer memory.
   *
   * @return Mutable pointer to the first word, or `nullptr` when empty.
   * @note The pointer remains valid only until the next mutating operation or
   * destruction of this FrontierBuffer. A host may write only within the size
   * established by `resize` and must preserve the documented entry layout.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t *get_memory_pointer() noexcept {
    // Expose only a live, non-empty contiguous word range.
    return words.empty() ? nullptr : words.data();
  }
};
