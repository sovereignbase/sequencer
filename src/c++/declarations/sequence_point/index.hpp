/**
 * @file
 * @brief Defines stable Frame identities in Sequence space.
 *
 * A SequencePoint identifies one Frame independently of its current Projection
 * index, Footage index, Stable Position, and containing Strip. The value is
 * composed of three unsigned 32-bit lanes and crosses the WebAssembly boundary
 * without allocation.
 *
 * Ordinary points belong to a Realm. Points issued by the same Realm share
 * their crypto-random and Unix components, while counters identify consecutive
 * Frames in that Realm's lineage.
 */
#pragma once

#include <cstdint>

/**
 * @brief Stable identity value for one Frame in Sequence space.
 *
 * The three components form a value: equality requires all components to be
 * equal. Deterministic comparison considers `crypto_random_bits` first,
 * `unix_lower_bits` second, and `counter_bits` last. Within one Realm, only the
 * counter varies.
 *
 * @note Stability describes the identified sequence position. The aggregate is
 * intentionally writable while a point is being constructed or advanced to a
 * derived frame boundary.
 */
struct SequencePoint {
  // Realm identity and lineage lanes.

  /**
   * @brief Random component of the Realm identity.
   *
   * This component is the primary deterministic comparison component.
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
   * @brief Zero-based counter locating the frame in its Realm's issued lineage.
   *
   * Adding a frame offset within one Strip advances this component only.
   */
  std::uint32_t counter_bits;

  /**
   * @brief Compare all three components for exact point identity.
   *
   * @param other Point to compare with this value.
   * @return `true` exactly when every component is equal.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] constexpr bool
  operator==(const SequencePoint &other) const noexcept = default;
};

