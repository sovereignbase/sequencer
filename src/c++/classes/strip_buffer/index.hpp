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
 * Both structural links are Projector-owned runtime state and intentionally
 * absent from the transfer representation.
 */
#pragma once

#include "../hash_table/index.hpp"
#include "../../declarations/strip/index.hpp"
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
   * @post All transferable Strip fields are represented by `words`; runtime
   * successor linkage is omitted.
   * @note Previously obtained memory pointers remain valid but observe the new
   * contents.
   * @complexity O(1) time and O(1) auxiliary space.
   */
  inline void write_strip(const Strip &strip) noexcept {
    // Encode visibility, Frame count, and Footage mapping.
    words[0] = strip.is_masked;
    words[1] = strip.is_inverse;
    words[2] = strip.frame_count;

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
   * @brief Decode the current words directly into the Strip vector.
   *
   * @return Stable position of the existing or appended Strip.
   * @pre The words contain a valid transferable Strip representation.
   * @post The buffer contents are unchanged.
   * @complexity O(1) time and O(1) auxiliary space.
   */
  [[nodiscard]] inline std::uint32_t
  read_strip(std::vector<Strip> &strips, HashTable<> &hash_table) const
      noexcept {
    const SequencePoint this_strip_start{
        .crypto_random_bits = words[3],
        .unix_lower_bits = words[4],
        .counter_bits = words[5],
    };
    const std::uint32_t existing_stable_position =
        hash_table.get(this_strip_start);
    if (existing_stable_position != HashTable<>::no_stable_position &&
        strips[existing_stable_position]
                .coordinate.this_strip_start.counter_bits == words[5])
      return existing_stable_position;

    const std::uint32_t stable_position =
        static_cast<std::uint32_t>(strips.size());
    strips.emplace_back(
        words[0], words[1], words[2], words[9],
        SequenceCoordinate{
            .this_strip_start = this_strip_start,
            .previous_strip_end{
                .crypto_random_bits = words[6],
                .unix_lower_bits = words[7],
                .counter_bits = words[8],
            },
        },
        0, 0);
    hash_table.set(this_strip_start, words[2], stable_position);
    return stable_position;
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
