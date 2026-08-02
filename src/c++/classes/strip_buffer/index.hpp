/**
 * @file
 * @brief Defines the fixed-width WebAssembly transfer buffer for one Strip.
 *
 * StripBuffer is the translation boundary between the C++ Strip model and its
 * nine-word WebAssembly memory contract. It owns exactly nine `std::uint32_t`
 * values, performs no dynamic allocation, and never owns Footage.
 *
 * The memory layout is stable:
 *
 * @code
 * 0  is_masked
 * 1  frame_count
 * 2  footage_frame_index
 * 3  this_strip_start.random_bits
 * 4  this_strip_start.unix_lower_bits
 * 5  this_strip_start.counter_bits
 * 6  previous_strip_start.random_bits
 * 7  previous_strip_start.unix_lower_bits
 * 8  previous_strip_start.counter_bits
 * @endcode
 *
 * Both structural links are Projector-owned runtime state and intentionally
 * absent from the transfer representation.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Fixed-size readable and writable transfer representation of one Strip.
 *
 * The buffer owns its word storage for its complete lifetime. Its address is
 * stable because no operation reallocates the fixed array, but every write may
 * replace its contents. The exported runtime shares one instance, so a host
 * must finish each read or write before invoking another operation that uses
 * the same buffer.
 *
 * @invariant The transfer representation contains exactly nine contiguous
 * unsigned 32-bit words in the documented order.
 * @note The class validates neither word values nor Strip invariants at the ABI
 * boundary; callers supply a valid transferable Strip representation.
 */
class StripBuffer {
private:
  // Fixed owned ABI storage.

  /** @brief Owned contiguous storage for the stable nine-word ABI layout. */
  std::uint32_t words[9]{};

public:
  // Strip encoding and decoding.

  /**
   * @brief Encode a strip into the stable nine-word memory layout.
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
    words[1] = strip.frame_count;
    words[2] = strip.footage_frame_index;

    // Encode the Strip's own stable Sequence Point.
    words[3] = strip.coordinate.this_strip_start.random_bits;
    words[4] = strip.coordinate.this_strip_start.unix_lower_bits;
    words[5] = strip.coordinate.this_strip_start.counter_bits;

    // Encode the transfer placement dependency.
    words[6] = strip.coordinate.previous_strip_start.random_bits;
    words[7] = strip.coordinate.previous_strip_start.unix_lower_bits;
    words[8] = strip.coordinate.previous_strip_start.counter_bits;
  }

  /**
   * @brief Decode the current nine words into an unlinked strip.
   *
   * @return Strip containing the transferred fields and
   * the Root and `unlinked_strip_start` as its initial runtime links.
   * @pre The nine words contain a valid transferable Strip representation.
   * @post The buffer contents are unchanged.
   * @complexity O(1) time and O(1) auxiliary space.
   */
  [[nodiscard]] inline Strip read_strip() const noexcept {
    // Decode transferable fields and restore absent runtime linkage.
    return Strip{
        .is_masked = words[0],
        .frame_count = words[1],
        .footage_frame_index = words[2],
        .coordinate{
            .this_strip_start{
                .unix_lower_bits = words[4],
                .counter_bits = words[5],
                .random_bits = words[3],
            },
            .previous_strip_start{
                .unix_lower_bits = words[7],
                .counter_bits = words[8],
                .random_bits = words[6],
            },
        },
        .previous_structural_strip_start{},
        .next_strip_start = unlinked_strip_start,
    };
  }

  // Host memory access.

  /**
   * @brief Return the first word of the contiguous transfer memory.
   *
   * @return Mutable pointer to exactly nine contiguous words.
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
