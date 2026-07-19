#pragma once

#include "../../types/type.hpp"
#include <cstdint>

/// Determines whether a sequence point is contained within a strip and, if so,
/// returns its offset from the start of that strip.
///
/// The supplied sequence point is compared against the sequence point marking
/// the start of the supplied strip.
///
/// A sequence point is considered contained when:
///
/// - It is not before `strip->this_strip_start`.
/// - Its offset from the strip start is less than `strip->length`.
///
/// @param strip
///     Strip against which the sequence point is evaluated.
///
/// @param sequence_point
///     Sequence point to evaluate against the strip.
///
/// @return
///     The zero-based offset of `sequence_point` from the start of the strip
///     when contained.
///
///     Returns `max_uint32` when the sequence point falls outside the strip.
///
/// @note
///     An offset of `0` indicates that `sequence_point` is exactly equal to
///     the sequence point marking the start of the strip.
std::uint32_t
strip_contains_sequence_point(const SequenceStrip *strip,
                              const SequencePoint *sequence_point) noexcept {

  // Resolve the sequence point marking the start of the strip.
  const SequencePoint strip_start = strip->this_strip_start;

  // A sequence point before the start of the strip cannot be contained within
  // it.
  if (*sequence_point < strip_start) {
    return max_uint32;
  }

  // Calculate the 128-bit offset from the start of the strip.
  const unsigned __int128 offset = *sequence_point - strip_start;

  // A sequence point whose offset reaches or exceeds the strip length falls
  // outside the strip.
  if (offset >= strip->length) {
    return max_uint32;
  }

  // The offset is guaranteed to fit within uint32_t because it is smaller than
  // the uint32_t strip length.
  return static_cast<std::uint32_t>(offset);
}