/**
 * @file
 * @brief Tests containment on the stable sequence-point axis.
 *
 * Unlike Projection containment, this test includes Masks: masking excludes a
 * Frame Span from the Projection without removing it from retained Sequence
 * order.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <cstdint>

/**
 * @brief Locate a Sequence Point within a Strip's Frame Span.
 *
 * Containment requires the same Realm components as the Strip start and a
 * counter in the half-open interval beginning at that start and extending for
 * `strip->frame_count` Frames.
 *
 * @param strip Strip whose half-open Sequence Point span is tested.
 * @param sequence_point Stable sequence point to test.
 * @return Zero-based frame offset from the strip start when contained;
 * `sequence_point_outside_strip` otherwise.
 * @pre Both pointers are non-null.
 * @note An offset of zero means that the point equals `this_strip_start`.
 * @note For an incoming Mask, testing its `this_strip_start` against the Strip
 * indexed by its `previous_strip_start` yields the first masked Frame offset;
 * both points already exist in the retained Sequence.
 * @complexity O(1) time and O(1) space.
 */
[[nodiscard]] inline std::uint32_t
strip_contains_sequence_point(const Strip *strip,
                              const SequencePoint *sequence_point) noexcept {
  // Establish the first point of the candidate Frame Span.
  const SequencePoint &strip_start = strip->coordinate.this_strip_start;

  // Reject another Realm or a point preceding the Strip start.
  if (sequence_point->random_bits != strip_start.random_bits ||
      sequence_point->unix_lower_bits != strip_start.unix_lower_bits ||
      sequence_point->counter_bits < strip_start.counter_bits)
    return sequence_point_outside_strip;

  // Resolve the Realm-local zero-based Frame offset.
  const std::uint32_t strip_frame_offset =
      sequence_point->counter_bits - strip_start.counter_bits;

  // Accept only offsets inside the Strip's half-open Frame Span.
  return strip_frame_offset < strip->frame_count ? strip_frame_offset
                                                 : sequence_point_outside_strip;
}
