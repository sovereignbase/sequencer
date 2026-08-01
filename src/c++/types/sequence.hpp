#pragma once

#include "../StripIndex/index.hpp"
#include "./strip.hpp"
#include <cstdint>
#include <limits>

constexpr std::uint32_t max_uint32 = std::numeric_limits<std::uint32_t>::max();

struct SequenceState {
  /// Strips indexed by their point in the sequence.
  StripIndex index;

  /// Number of visible positions in the projected reel.
  std::uint32_t length{0};

  /// Current visible position at the projector gate. Updated when walking
  /// linked projection.
  std::uint32_t gate_position{0};

  /// Start point of the first strip in the sequence.
  PointInSequence first_strip_start{};

  /// Start position of the strip currently at the projector gate.
  PointInSequence gate_strip_start{};

  // Start point of the last strip in the sequence.
  PointInSequence last_strip_start{};

  StripIndex pending_masks;
  StripIndex pending_inserts;
};
