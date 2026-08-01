#pragma once

#include "../../types/sequence.hpp"
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
inline std::uint32_t
strip_contains_sequence_point(const StripOfSequence *strip,
                              const PointInSequence *sequence_point) noexcept {
  const PointInSequence &strip_start = strip->this_strip_start;

  if (sequence_point->random_bits != strip_start.random_bits ||
      sequence_point->unix_lower_bits != strip_start.unix_lower_bits ||
      sequence_point->counter_bits < strip_start.counter_bits) {
    return max_uint32;
  }

  const std::uint32_t offset =
      sequence_point->counter_bits - strip_start.counter_bits;

  // A sequence point whose offset reaches or exceeds the strip length falls
  // outside the strip.
  if (offset >= strip->length) {
    return max_uint32;
  }

  return offset;
}
