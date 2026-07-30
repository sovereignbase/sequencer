#pragma once

#include <ankerl/unordered_dense.h>
#include <cstddef>
#include <cstdint>
#include <limits>
#include <vector>

constexpr std::uint32_t max_uint32 = std::numeric_limits<std::uint32_t>::max();

struct SequencePoint {
  std::uint32_t random;
  std::uint32_t unix_low_ms;
  std::uint32_t counter;

}

struct SequenceStrip {
  std::uint32_t length;

  bool masked;

  std::uint32_t footage_position;

  Uint128 this_strip_start;

  Uint128 previous_strip_start;

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

  // All strips indexed
  ankerl::unordered_dense::map<Uint128, std::uint32_t, Uint128Hash>
      sequence_point_index;
};