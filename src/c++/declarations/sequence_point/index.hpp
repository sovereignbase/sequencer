/**
 * @file
 * @brief Defines stable identities for the root and frames in sequence space.
 *
 * A SequencePoint identifies either the Root or one Frame independently of the
 * frame's current Projection index and containing Strip. The value is composed
 * of three unsigned 32-bit lanes and crosses the WebAssembly application binary
 * interface without an owning allocation.
 *
 * Ordinary points belong to a Realm. Points issued by the same Realm share
 * their Unix and random components, while their counters identify consecutive
 * frames in that Realm's lineage. The all-zero value is the Root defined by the
 * vocabulary; it identifies no frame and belongs to no Realm.
 */
#pragma once

#include <cstdint>
#include <limits>

/**
 * @brief Stable identity value for the Root or one frame in sequence space.
 *
 * The three components form a value: equality requires all components to be
 * equal. Deterministic cross-Realm comparison considers the Unix component,
 * then the counter, and finally the random component. Within one Realm, only
 * the counter varies.
 *
 * @invariant An ordinary point issued by a Realm is distinct from the Root and
 * `unlinked_strip_start` sentinels.
 * @note Stability describes the identified sequence position. The aggregate is
 * intentionally writable while a point is being constructed or advanced to a
 * derived frame boundary.
 */
struct SequencePoint {
  // Realm identity and lineage lanes.

  /**
   * @brief Random component of the Realm identity.
   *
   * This component is the final deterministic cross-Realm tie-break, never the
   * primary ordering component.
   */
  std::uint32_t crypto_random_bits;

  /**
   * @brief Lower 32 bits of the issuing Realm's Unix-time component.
   *
   * Together with `random_bits`, this identifies the Realm to which an ordinary
   * point belongs. The value is not a complete timestamp.
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

// Structural-link sentinel outside sequence space.

/**
 * @brief Internal point sentinel denoting no structural successor.
 *
 * This value is distinct from the Root: the Root is a valid sequence context,
 * whereas this sentinel belongs to no Sequence and identifies no frame. It is
 * stored only in `Strip::next_strip_start` and is omitted from StripBuffer's
 * transfer representation.
 *
 * @invariant No issued SequencePoint may equal this value.
 */
inline constexpr SequencePoint unlinked_strip_start{
    .crypto_random_bits = std::numeric_limits<std::uint32_t>::max(),
    .unix_lower_bits = std::numeric_limits<std::uint32_t>::max(),
    .counter_bits = std::numeric_limits<std::uint32_t>::max(),
};
