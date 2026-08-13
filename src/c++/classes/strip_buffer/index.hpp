/**
 * @file
 * @brief Defines the fixed-width WebAssembly transfer buffer for one Strip.
 *
 * StripBuffer is the translation boundary between the C++ Strip model and its
 * ten-word WebAssembly memory contract. It owns exactly ten `std::uint32_t`
 * values, performs no dynamic allocation, and never owns Footage.
 *
 * The memory layout is stable:
 *
 * @code
 * 0  is_masked
 * 1  is_inverse
 * 2  frame_count
 * 3  this_strip_start.crypto_random_bits
 * 4  this_strip_start.unix_lower_bits
 * 5  this_strip_start.counter_bits
 * 6  previous_strip_end.crypto_random_bits
 * 7  previous_strip_end.unix_lower_bits
 * 8  previous_strip_end.counter_bits
 * 9  footage_frame_index
 * @endcode
 *
 * Dense structural links and sibling-fragment distances are Projector-local
 * runtime state and intentionally absent from the transfer representation.
 */
#pragma once

#include "../../declarations/sentinels/index.hpp"
#include "../../declarations/strip/index.hpp"
#include "../hash_table/index.hpp"
#include <cstdint>
#include <vector>

/**
 * @brief Fixed-size readable and writable transfer representation of one Strip.
 *
 * The buffer owns its word storage for its complete lifetime. Its address is
 * stable because no operation reallocates the fixed array, but every write may
 * replace its contents. The exported runtime shares one instance, so a host
 * must finish each read or write before invoking another operation that uses
 * the same buffer.
 *
 * @invariant The transfer representation contains exactly ten contiguous
 * unsigned 32-bit words in the documented order.
 * @note The class validates neither word values nor Strip invariants at the ABI
 * boundary; callers supply a valid transferable Strip representation.
 */
class StripBuffer {
private:
  // Fixed owned ABI storage.

  /** @brief Owned contiguous storage for the stable ten-word ABI layout. */
  std::uint32_t words[10]{};

public:
  // Strip encoding and decoding.

  /**
   * @brief Encode a strip into the stable ten-word memory layout.
   *
   * @param strip Strip whose transferable fields replace the buffer contents.
   * @param frame_count Length transferred with the Strip.
   * @post All transferable Strip fields are represented by `words`; dense
   * links and sibling-fragment distances are omitted.
   * @note Previously obtained memory pointers remain valid but observe the new
   * contents.
   * @complexity O(1) time and O(1) auxiliary space.
   */
  inline void write_strip(const Strip &strip,
                          const std::uint32_t frame_count) noexcept {
    // Encode visibility, Frame count, and Footage mapping.
    words[0] = strip.is_masked;
    words[1] = strip.is_inverse;
    words[2] = frame_count;

    // Encode the Strip's own stable Sequence Point.
    words[3] = strip.coordinate.this_strip_start.crypto_random_bits;
    words[4] = strip.coordinate.this_strip_start.unix_lower_bits;
    words[5] = strip.coordinate.this_strip_start.counter_bits;

    // Encode the transfer placement dependency.
    words[6] = strip.coordinate.previous_strip_end.crypto_random_bits;
    words[7] = strip.coordinate.previous_strip_end.unix_lower_bits;
    words[8] = strip.coordinate.previous_strip_end.counter_bits;
    words[9] = strip.footage_frame_index;
  }

  /**
   * @brief Decode the current words directly into Projector-owned storage.
   *
   * A visible Strip is a duplicate when its issued start is already contained
   * by the HashTable, including inside a split sibling fragment. A Mask is a
   * duplicate only when that containing fragment already has the same masked
   * state. Otherwise one Strip is appended directly. Visible Frame containment
   * is indexed immediately; Mask commands are indexed when they materialize
   * over existing fragments.
   *
   * @param projector Projector receiving the decoded Strip.
   * @return `false` for a duplicate, otherwise the appended Stable Position.
   * @pre The words contain a valid transferable Strip representation.
   * @post The buffer contents are unchanged; a nonduplicate visible Strip is
   * indexed by its complete Frame Span.
   * @complexity Expected O(1 + log e), excluding vector append and HashTable
   * insertion, for e entries in the matching Realm.
   */
  [[nodiscard]] inline std::uint32_t
  read_strip(Projector *projector) const noexcept {
    const SequencePoint this_strip_start{
        .crypto_random_bits = words[3],
        .unix_lower_bits = words[4],
        .counter_bits = words[5],
    };
    const auto [existing_strip_index, _] =
        projector->hash_table.get(this_strip_start);
    if (existing_strip_index != u32_max)
      return u32_max;

    const std::uint32_t strip_index =
        static_cast<std::uint32_t>(projector->strips.size());
    projector->strips.push_back(Strip{
        .is_masked = words[0],
        .is_inverse = words[1],
        .footage_frame_index = words[9],
        .coordinate{
            .this_strip_start = this_strip_start,
            .previous_strip_end{
                .crypto_random_bits = words[6],
                .unix_lower_bits = words[7],
                .counter_bits = words[8],
            },
        },
    });

    projector->left.push_back(strip_index);
    projector->right.push_back(strip_index);
    projector->length.push_back(words[2]);
    projector->hash_table.set(this_strip_start, words[2], strip_index);

    return strip_index;
  }

  // Host memory access.

  /**
   * @brief Return the first word of the contiguous transfer memory.
   *
   * @return Mutable pointer to exactly ten contiguous words.
   * @note The pointer remains valid until this StripBuffer is destroyed. Its
   * contents may change whenever `write_strip` or the WebAssembly host writes
   * through the pointer.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::uint32_t *get_memory_pointer() noexcept {
    // Expose the fixed owned array without allocation or copying.
    return words;
  }
};
