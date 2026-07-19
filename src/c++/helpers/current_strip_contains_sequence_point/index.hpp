#pragma once

#include "../../types/type.hpp"
#include <cstdint>

/// Determines whether a sequence point is contained within the current gate
/// strip and, if so, returns its offset from the start of the strip.
///
/// The gate strip is resolved from the projector's reel using
/// `gate_strip_start_position`. The supplied sequence point is then compared
/// against the sequence point marking the start of the gate strip.
///
/// A sequence point is considered contained when:
///
/// - It is not before `gate_strip->this_strip_start`.
/// - Its offset from the strip start is less than `gate_strip->length`.
///
/// @param projector
///     Projector state containing the reel and the position of the current
///     gate strip.
///
/// @param sequence_point
///     Sequence point to evaluate against the current gate strip.
///
/// @return
///     The zero-based offset of `sequence_point` from the start of the gate
///     strip when contained.
///
///     Returns `max_uint32` when the sequence point falls outside the gate
///     strip.
///
/// @note
///     An offset of `0` indicates that `sequence_point` is exactly equal to
///     the sequence point marking the start of the gate strip.
std::uint32_t
gate_strip_contains_sequence_point(ProjectorState *projector,
                                   const SequencePoint *sequence_point) {

  SequenceStrip *gate_strip =
      &projector->reel[projector->gate_strip_start_position];

  std::uint32_t offset = 0;

  // Compare the sequence point against the start of the gate strip,
  // beginning with the most significant lane.
  for (std::uint32_t i = 0; i < 4; ++i) {
    const std::uint32_t evaluated_lane = (*sequence_point)[i];
    const std::uint32_t gate_lane = (*gate_strip->this_strip_start)[i];

    // A sequence point before the start of the gate strip cannot be
    // contained within it.
    if (evaluated_lane < gate_lane) {
      return max_uint32;
    }

    // When the evaluated sequence point is after the strip start, calculate
    // its offset and verify that it still falls within the strip's length.
    if (evaluated_lane > gate_lane) {
      offset = evaluated_lane - gate_lane;

      if (offset >= gate_strip->length) {
        return max_uint32;
      }

      return offset
    }
  }

  // Return the position of the sequence point relative to the beginning
  // of the gate strip.
  return offset;
}