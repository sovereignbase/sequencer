#pragma once

#include <ankerl/unordered_dense.h>
#include <cstddef>
#include <cstdint>
#include <limits>
#include <vector>

constexpr std::uint32_t max_uint32 = std::numeric_limits<std::uint32_t>::max();

using SequencePoint = unsigned __int128;

struct Uint128Hash {
  std::size_t operator()(SequencePoint value) const noexcept {
    const std::uint64_t high = static_cast<std::uint64_t>(value >> 64);
    const std::uint64_t low = static_cast<std::uint64_t>(value);

    return static_cast<std::size_t>(high ^ low);
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

using SequenceReel = std::vector<SequenceStrip>;

struct ProjectorState {
  /// All strips stored next to each other in memory.
  SequenceReel reel;

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
  ankerl::unordered_dense::map<SequencePoint, std::uint32_t, Uint128Hash>
      loose_strip_start_by_previous_strip_start;
};