#pragma once

#include "../SequenceStripIndex/index.hpp"
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
  std::uint32_t mask;

  std::uint32_t length;

  std::uint32_t footage_position;

  SequencePoint this_strip_start;

  SequencePoint next_strip_start;

  SequencePoint previous_strip_start;
};

struct ProjectorState {
  /// All strips stored next to each other in memory.
  SequenceStripIndex index;

  /// Number of visible positions in the projected reel.
  std::uint32_t reel_length;

  /// Current visible position at the projector gate. Updated when walsking
  /// linked projection.
  std::uint32_t gate_position;

  /// Start position of the strip currently at the projector gate.
  std::uint32_t gate_strip_start_position;
};