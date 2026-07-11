#pragma once
#include <ankerl/unordered_dense.h>
#include <cstddef>
#include <cstdint>
#include <limits>
#include <vector>

/// Sentinel used when no strip position is available.
constexpr std::uint32_t max_uint32 = std::numeric_limits<std::uint32_t>::max();

/// Stable CRSequence timecode encoded as four uint32 lanes.
/// lanes[0] = highest 32 bits
/// lanes[3] = lowest 32 bits
struct SequencePoint {
  std::uint32_t lanes[4];

  std::uint32_t operator[](std::uint32_t index) const { return lanes[index]; }

  bool operator==(const SequencePoint &other) const {
    return lanes[0] == other.lanes[0] && lanes[1] == other.lanes[1] &&
           lanes[2] == other.lanes[2] && lanes[3] == other.lanes[3];
  }
  bool add(std::uint32_t value) {
    std::uint32_t carry = value;

    for (std::uint8_t i = 3; i >= 0 && carry != 0; --i) {
      std::uint64_t sum = static_cast<std::uint64_t>(lanes[i]) + carry;

      lanes[i] = static_cast<std::uint32_t>(sum);

      carry = sum >> 32;
    }

    return carry == 0;
  }
};

/// Hash function for SequencePoint map keys.
struct SequencePointHash {
  std::size_t operator()(const SequencePoint &k) const {
    std::uint64_t x =
        (std::uint64_t(k.lanes[0]) << 32) | std::uint64_t(k.lanes[1]);

    std::uint64_t y =
        (std::uint64_t(k.lanes[2]) << 32) | std::uint64_t(k.lanes[3]);

    x ^= y + 0x9e3779b97f4a7c15ULL + (x << 6) + (x >> 2);

    return std::size_t(x);
  }
};

/**
 * @brief One contiguous strip in the linked projection.
 *
 * A strip carries one or more virtual positions. Strips are never physically
 * removed from the projection. Hidden content is modeled by setting
 * masked=true, so later operations can patch the existing order.
 */
struct Strip {
  /// Visibility marker. Masked strips stay linked and keep their timecodes.
  bool masked;

  /// Number of virtual positions carried by this strip.
  std::uint32_t length;

  /// First timecode carried by this strip.
  SequencePoint this_strip_start;

  /**
   * @brief JavaScript-owned footage code for this strip's first value.
   *
   * Later values are resolved by adding their offset inside the strip.
   */
  std::uint32_t footage_code;

  /// Start position of the next strip in the linked projection.
  std::uint32_t next_strip_start_position;

  /// Start position of the previous strip in the linked projection.
  std::uint32_t previous_strip_start_position;

  /// Timecode this strip was recorded after.
  SequencePoint previous_strip_start;
};

/**
 * @brief Wasm projector state for one CRSequence instance.
 *
 * The projector stores strip metadata, projection links, loose strips, and gate
 * position. JavaScript owns the footage and talks to wasm through uint32
 * values.
 */
struct Projector {
  /// All strips stored next to each other in memory.
  std::vector<Strip> reel;

  /// Number of visible positions in the projected reel.
  std::uint32_t reel_length;

  /// Current visible position at the projector gate.
  std::uint32_t gate_position;

  /// Start position of the first strip in the linked projection.
  std::uint32_t first_strip_start_position;

  /// Start position of the strip currently at the projector gate.
  std::uint32_t gate_strip_start_position;

  /// Start position of the last strip in the linked projection.
  std::uint32_t last_strip_start_position;

  /// Loose strips waiting for their previous timecode before projection.
  ankerl::unordered_dense::map<SequencePoint, std::uint32_t, SequencePointHash>
      loose_strip_start_by_previous_strip_start;
};