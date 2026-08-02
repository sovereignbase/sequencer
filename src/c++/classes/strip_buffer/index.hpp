/**
 * @file
 * @brief Defines the fixed-width transfer buffer for one strip.
 *
 * StripBuffer is the sole translation boundary between the C++ Strip model and
 * the nine-word WebAssembly memory contract. It owns exactly nine
 * std::uint32_t values and adds no dynamic allocation.
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
 * `next_strip_start` is runtime linkage and is intentionally absent from the
 * transfer representation. A decoded strip therefore starts unlinked.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Fixed-size readable and writable transfer representation of a Strip.
 *
 * @note One instance is shared by the exported interface. Callers must finish
 * reading or writing its nine words before invoking another buffer operation.
 */
class StripBuffer {
private:
  std::uint32_t words[9]{};

public:
  /**
   * @brief Encode a strip into the stable nine-word memory layout.
   *
   * @param strip Strip whose transferable fields replace the buffer contents.
   */
  inline void write_strip(const Strip &strip) noexcept {
    words[0] = strip.is_masked;
    words[1] = strip.frame_count;
    words[2] = strip.footage_frame_index;

    words[3] = strip.coordinate.this_strip_start.random_bits;
    words[4] = strip.coordinate.this_strip_start.unix_lower_bits;
    words[5] = strip.coordinate.this_strip_start.counter_bits;

    words[6] = strip.coordinate.previous_strip_start.random_bits;
    words[7] = strip.coordinate.previous_strip_start.unix_lower_bits;
    words[8] = strip.coordinate.previous_strip_start.counter_bits;
  }

  /**
   * @brief Decode the current nine words into an unlinked strip.
   *
   * @return Strip containing the transferred fields and
   * `unlinked_strip_start` as its runtime successor.
   */
  [[nodiscard]] inline Strip read_strip() const noexcept {
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
        .next_strip_start = unlinked_strip_start,
    };
  }

  /**
   * @brief Return the first word of the contiguous transfer memory.
   *
   * @return Mutable pointer exported to the WebAssembly host.
   */
  [[nodiscard]] inline std::uint32_t *get_memory_pointer() noexcept {
    return words;
  }
};
