/**
 * @file
 * @brief Defines stable frame identities in sequence space.
 *
 * A SequencePoint identifies a frame independently of its current projection
 * index and independently of the strip that currently contains it. The three
 * fixed-width components also form the point representation transferred across
 * the WebAssembly application binary interface.
 */
#pragma once

#include <cstdint>
#include <limits>

/**
 * @brief Immutable identity of one frame in sequence space.
 *
 * Points issued by one realm share `unix_lower_bits` and `random_bits`.
 * Consecutive frames within that realm advance `counter_bits`. Ordering uses
 * the Unix component first, the counter second, and the random component only
 * as the final deterministic tie-break.
 */
struct SequencePoint {
  /// Lower 32 bits of the issuing realm's Unix-time component.
  std::uint32_t unix_lower_bits;

  /// Counter locating the frame within the realm's issued lineage.
  std::uint32_t counter_bits;

  /// Realm discriminator and final deterministic ordering component.
  std::uint32_t random_bits;

  [[nodiscard]] constexpr bool
  operator==(const SequencePoint &) const noexcept = default;
};

/**
 * @brief Point sentinel used when a strip has no linked structural neighbor.
 */
inline constexpr SequencePoint unlinked_strip_start{
    .unix_lower_bits = std::numeric_limits<std::uint32_t>::max(),
    .counter_bits = std::numeric_limits<std::uint32_t>::max(),
    .random_bits = std::numeric_limits<std::uint32_t>::max(),
};
