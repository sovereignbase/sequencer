#pragma once
#include <ankerl/unordered_dense.h>
#include <cstddef>
#include <cstdint>
#include <limits>
#include <vector>

constexpr std::uint32_t max_uint32 = std::numeric_limits<std::uint32_t>::max();

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

struct SequenceStrip {
  std::uint32_t length;

  bool masked;

  std::uint32_t footage_position;

  SequencePoint this_strip_start;

  SequencePoint previous_strip_start;

  std::uint32_t next_strip_start_position;

  std::uint32_t previous_strip_start_position;
};

struct ProjectorState {
  /// All strips stored next to each other in memory.
  std::vector<SequenceStrip> reel;

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
