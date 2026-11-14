#pragma once
#include <algorithm>
#include <bit>
#include <cstddef>
#include <cstdint>

namespace sequencer {
/** Directory layout appended to the Strip arena's word lanes. */
struct TraversalLayout {
  static constexpr std::uint32_t header = 4;
  static constexpr std::uint32_t columns = 6;
  /** Bounds local walks while limiting directory movement in larger histories. */
  static constexpr std::uint32_t width(std::uint32_t count) {
    return count > 4096 ? 64 : count > 1024 ? 32 : count > 256 ? 16 : 8;
  }
  /** Reserves room for half-full blocks after splitting. */
  static constexpr std::uint32_t capacity(std::uint32_t nodes) {
    return nodes <= 8
               ? 0
               : std::bit_ceil(std::max(
                     4u,
                     std::uint32_t((std::uint64_t(nodes) * 2 + width(nodes) - 1) / width(nodes))));
  }
  static constexpr std::uint32_t supers(std::uint32_t capacity) { return (capacity + 15) / 16; }
  static constexpr std::uint32_t tops(std::uint32_t capacity) { return (capacity + 255) / 256; }
  static constexpr std::size_t words(std::uint32_t capacity) {
    return capacity ? header + std::size_t(columns) * capacity + supers(capacity) + tops(capacity)
                    : 0;
  }
};
} // namespace sequencer
