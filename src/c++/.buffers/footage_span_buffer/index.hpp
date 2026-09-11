/**
 * @file
 * @brief Defines the WebAssembly transfer buffer for Footage ranges.
 *
 * FootageSpanBuffer transfers contiguous regions of consumer-owned Footage for
 * visible range reads, recovery, and compaction. Only indexes and
 * counts cross the WebAssembly boundary; payload values are never copied or
 * owned by C++. Capacity is retained between writes.
 *
 * Every range uses four consecutive words:
 *
 * @code
 * 0  projection_frame_index
 * 1  footage_frame_index
 * 2  frame_count
 * 3  masked
 * @endcode
 *
 * Snapshot spans include soft-masked content in structural order followed by
 * pending insert content. Pending spans use UINT32_MAX as their Projection
 * index. Empty Strips and pending Mask commands contribute no span.
 *
 * Merge emits visible changed-suffix spans followed, when needed, by a tail
 * removal span with footage_frame_index UINT32_MAX and masked = 1.
 */
#pragma once

#include <cstddef>
#include <cstdint>
#include <vector>

/**
 * @brief Owned contiguous transfer representation of Footage ranges.
 *
 * Entries describe independent half-open ranges
 * `[footage_frame_index, footage_frame_index + frame_count)`. Their order is
 * the order chosen by the operation that most recently populated the buffer.
 *
 * @invariant `words.size()` is a multiple of `words_per_span`.
 * @note One instance is shared by the exported runtime. Any mutating operation
 * may invalidate a previously returned pointer or replace its contents.
 * @warning Allocation failure in a mutating `noexcept` operation terminates the
 * program rather than propagating an exception across the ABI.
 */
class FootageSpanBuffer {
private:
  // Variable-width owned ABI storage.

  /** @brief Number of unsigned 32-bit words in one Footage Span entry. */
  static constexpr std::size_t words_per_span = 4;

  /** @brief Owned storage containing zero or more complete Footage Spans. */
  std::vector<std::uint32_t> words;

public:
  // Result lifecycle and range encoding.

  /**
   * @brief Remove every range while retaining allocated capacity.
   *
   * @post `get_span_count()` returns zero.
   * @note Previously returned pointers must no longer be dereferenced.
   * @complexity Linear in the current word count as specified for
   * `std::vector::clear`.
   */
  inline void clear() noexcept {
    // Discard ranges while retaining their allocation for reuse.
    words.clear();
  }

  /**
   * @brief Append one contiguous Footage range.
   *
   * @param projection_frame_index First affected Projection index.
   * @param footage_frame_index First consumer-owned Footage index in the range.
   * @param frame_count Number of consecutive Footage entries in the range.
   * @param masked Whether the record describes masked rather than visible content.
   * @post The range count increases by one and prior entry order is preserved.
   * @note Appending may invalidate every previously returned pointer.
   * @complexity Amortized O(1) time and O(1) auxiliary space.
   */
  inline void write_span(const std::uint32_t projection_frame_index,
                         const std::uint32_t footage_frame_index,
                         const std::uint32_t frame_count,
                         const std::uint32_t masked) noexcept {
    // Append one Footage range in stable ABI order.
    words.push_back(projection_frame_index);
    words.push_back(footage_frame_index);
    words.push_back(frame_count);
    words.push_back(masked);
  }

  /**
   * @brief Return the number of complete Footage ranges.
   *
   * @return `words.size() / words_per_span`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t get_span_count() const noexcept {
    // Convert the complete word count to a released-range count.
    return static_cast<std::uint32_t>(words.size() / words_per_span);
  }

  // Host memory access.

  /**
   * @brief Return the first word of the contiguous transfer memory.
   *
   * @return Mutable pointer to the first word, or `nullptr` when empty.
   * @note The pointer remains valid only until the next mutating operation or
   * destruction of this FootageSpanBuffer. The host reads exactly
   * `get_span_count() * words_per_span` words in the documented layout.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t *get_memory_pointer() noexcept {
    // Expose only a live, non-empty contiguous word range.
    return words.empty() ? nullptr : words.data();
  }
};
