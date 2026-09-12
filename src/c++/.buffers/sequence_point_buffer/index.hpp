/**
 * @file
 * @brief Defines the WebAssembly transfer buffer for one sequence_point.
 *
 * A sequence_point is a Replica's Realm-indexed acknowledgement boundary. Each
 * Realm represented in that sequence_point contributes one Sequence Point, and
 * SequencePointBuffer stores those entries in one owned contiguous vector.
 * Clearing and consuming reads retain capacity. A consuming read returns a
 * borrowed view valid until the next write or resize, leaving the buffer empty.
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

#include "../../.declarations/sequence_point/index.hpp"
#include <cstddef>
#include <algorithm>
#include <cstdint>
#include <span>
#include <vector>

/**
 * @brief Owned contiguous WebAssembly representation of one sequence_point.
 *
 * Entry order carries no Realm priority and need not match structural Sequence
 * order; the crypto-random and Unix components identify each entry's Realm.
 * The class transfers boundary metadata only and owns no Replica, Sequence, or
 * Strip.
 *
 * @invariant `words.size()` is a multiple of `words_per_sequence_point_entry`.
 * @note One instance is shared by the exported runtime. Any mutating operation
 * may invalidate a previously returned pointer or replace its contents.
 * @warning Allocation failure in a mutating `noexcept` operation terminates the
 * program rather than propagating an exception across the ABI.
 */
class SequencePointBuffer {
private:
  // Variable-width owned ABI storage.

  /** @brief Number of unsigned 32-bit words in one Realm boundary entry. */
  static constexpr std::size_t words_per_sequence_point_entry = 3;

  /** @brief Owned storage containing zero or more complete Realm entries. */
  std::vector<std::uint32_t> words;
  std::size_t word_count = 0;

public:
  /** @brief Consume the words, leaving this transfer buffer empty. */
  [[nodiscard]] std::span<const std::uint32_t> read_buffer() noexcept {
    const std::span<const std::uint32_t> result{words.data(), word_count};
    word_count = 0;
    return result;
  }

  // Buffer lifecycle and capacity preparation.

  /**
   * @brief Remove every Realm entry while retaining allocated capacity.
   *
   * @post `get_sequence_point_count()` returns zero.
   * @note Previously returned pointers must no longer be dereferenced.
   * @complexity O(1); only the logical word count changes.
   */
  inline void clear() noexcept {
    // Discard entries while retaining their allocation for reuse.
    word_count = 0;
  }

  /**
   * @brief Prepare writable transfer memory for an exact Realm entry count.
   *
   * Existing capacity is reused whenever possible. The WebAssembly host must
   * write every prepared entry before the buffer is read by native code.
   *
   * @param sequence_point_count Number of three-word Realm entries to receive.
   * @post The buffer contains exactly `sequence_point_count` value-initialized
   * entries available for host writes.
   * @note Reallocation invalidates every previously returned pointer.
   * @complexity Linear in the number of words initialized or destroyed, plus
   * allocation when existing capacity is insufficient.
   */
  inline void resize(const std::uint32_t sequence_point_count) noexcept {
    // Materialize the exact writable word range requested by the host.
    const auto count = static_cast<std::size_t>(sequence_point_count) *
                       words_per_sequence_point_entry;
    const auto reused_count = std::min(count, words.size());
    if (count > words.size())
      words.resize(count);
    if (reused_count > word_count)
      std::fill(words.begin() + word_count, words.begin() + reused_count, 0);
    word_count = count;
  }

  /**
   * @brief Reserve transfer memory for a known maximum Realm entry count.
   *
   * @param sequence_point_capacity Maximum number of Realm entries to be
   * written.
   * @post Capacity is sufficient for `sequence_point_capacity` entries and the
   * current entry count is unchanged.
   * @note A growing reservation invalidates every previously returned pointer.
   * @complexity O(n) when reallocation moves n existing words; O(1) otherwise.
   */
  inline void reserve(const std::uint32_t sequence_point_capacity) noexcept {
    // Reserve complete Realm entries without changing the current
    // sequence_point.
    words.reserve(static_cast<std::size_t>(sequence_point_capacity) *
                  words_per_sequence_point_entry);
  }

  // sequence_point entry encoding and inspection.

  /**
   * @brief Append one Realm boundary point in the stable three-word layout.
   *
   * @param sequence_point Exclusive final counter of a complete Mask Realm.
   * @post The Realm entry count increases by one and prior entry order is
   * preserved.
   * @note The buffer does not enforce one entry per Realm; the producer defines
   * a valid sequence_point.
   * @complexity Amortized O(1) time and O(1) auxiliary space.
   */
  inline void
  write_sequence_point(const SequencePoint &sequence_point) noexcept {
    // Append one Realm boundary in stable ABI lane order.
    if (word_count + words_per_sequence_point_entry > words.size())
      words.resize(word_count + words_per_sequence_point_entry);
    words[word_count++] = sequence_point.crypto_random_bits;
    words[word_count++] = sequence_point.unix_lower_bits;
    words[word_count++] = sequence_point.counter_bits;
  }

  /**
   * @brief Return the number of complete Realm entries in the sequence_point.
   *
   * @return `word_count / words_per_sequence_point_entry`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t get_sequence_point_count() const noexcept {
    // Convert the complete word count to a Realm entry count.
    return static_cast<std::uint32_t>(word_count /
                                      words_per_sequence_point_entry);
  }

  /**
   * @brief Decode one Realm boundary point from the stable three-word layout.
   *
   * @param sequence_point_index Zero-based Realm entry index.
   * @return Boundary Sequence Point stored at `sequence_point_index`.
   * @pre `sequence_point_index < get_sequence_point_count()`.
   * @post The buffer contents are unchanged.
   * @complexity O(1) time and O(1) auxiliary space.
   */
  [[nodiscard]] inline SequencePoint
  read_sequence_point(const std::uint32_t sequence_point_index) const noexcept {
    // Locate and decode one complete Realm boundary entry.
    const std::size_t word_index =
        static_cast<std::size_t>(sequence_point_index) *
        words_per_sequence_point_entry;
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
   * destruction of this SequencePointBuffer. A host may write only within the
   * size established by `resize` and must preserve the documented entry layout.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t *get_memory_pointer() noexcept {
    // Expose only a live, non-empty contiguous word range.
    return word_count == 0 ? nullptr : words.data();
  }
};
