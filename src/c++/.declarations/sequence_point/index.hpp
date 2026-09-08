/**
 * @file
 * @brief Defines stable Frame identities and ordering in Sequence space.
 *
 * A SequencePoint identifies one Frame independently of its current Projection
 * index, Footage index, Stable Position, and containing Strip. The value is
 * composed of three unsigned 32-bit lanes and crosses the WebAssembly boundary
 * without allocation.
 *
 * Points issued by the same Realm share their crypto-random and Unix
 * components, while the counter identifies consecutive Frames in that Realm's
 * lineage.
 */
#pragma once

#include <compare>
#include <cstdint>

/**
 * @brief Stable identity value for one Frame in Sequence space.
 *
 * Equality requires all three components to be equal. Deterministic ordering is
 * lexicographic: `crypto_random_bits` is compared first, `unix_lower_bits`
 * second, and `counter_bits` last. Within one Realm, only the counter varies.
 *
 * @note Stability describes the identified Sequence position. The aggregate is
 * intentionally writable while a point is being constructed or advanced to a
 * derived Frame boundary.
 */
struct SequencePoint {
  // Realm identity and lineage lanes.

  /**
   * @brief Random component of the Realm identity.
   *
   * This is the primary deterministic ordering component.
   */
  std::uint32_t crypto_random_bits;

  /**
   * @brief Lower 32 bits of the issuing Realm's Unix-time component.
   *
   * Together with `crypto_random_bits`, this identifies the Realm. The value is
   * not a complete timestamp.
   */
  std::uint32_t unix_lower_bits;

  /**
   * @brief Zero-based counter locating the Frame in its Realm's issued lineage.
   *
   * Adding a Frame offset within one Strip advances this component only.
   */
  std::uint32_t counter_bits;

  /**
   * @brief Compare all components for exact Sequence Point identity.
   *
   * @param other Sequence Point to compare with this value.
   * @return `true` when this point is the same as `other`; `false` otherwise.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] constexpr bool
  operator==(const SequencePoint &other) const noexcept = default;

  /**
   * @brief Compare Sequence Points in deterministic lexicographic order.
   *
   * Comparison considers `crypto_random_bits` first, `unix_lower_bits` second,
   * and `counter_bits` last. The generated relational operators therefore
   * report whether this point is smaller than, the same as, or larger than
   * `other`.
   *
   * @param other Sequence Point to compare with this value.
   * @return Ordering indicating whether this point is smaller than, the same
   * as, or larger than `other`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] constexpr auto
  operator<=>(const SequencePoint &other) const noexcept = default;
};