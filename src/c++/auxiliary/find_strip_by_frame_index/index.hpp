#pragma once

#include "../../types/sequence.hpp"
#include "../absolute_distance/index.hpp"
#include "../jump_to_next_strip/index.hpp"
#include "../jump_to_previous_strip/index.hpp"
#include "../strip_contains_frame_index/index.hpp"
#include <cstdint>

/**
 * @brief Move the sequence gate to the strip containing frame_index.
 *
 * The target position is counted through visible strips only. Masked strips
 * stay linked but do not advance sequence->gate_position while walking.
 *
 * @param frame_index Zero-based visible frame position.
 * @param sequence Sequence whose gate strip and position are updated.
 */
inline void find_strip_by_frame_index(const std::uint32_t frame_index,
                                      SequenceState *sequence) noexcept {

  if (sequence->length == 0)
    return;

  const StripOfSequence *strip =
      &sequence->index.get(sequence->gate_strip_start);

  if (strip_contains_frame_index(strip, sequence->gate_position, frame_index))
    return;

  // Start with the distance from the gate to the target.
  const std::uint32_t distance =
      absolute_distance(sequence->gate_position, frame_index);

  // Distance from the projection head is the target position itself.
  const std::uint32_t head_distance = frame_index;

  // If the head is closer than current, start the walk at first.
  if (head_distance < distance) {
    sequence->gate_position = 0;
    sequence->gate_strip_start = sequence->first_strip_start;
    strip = &sequence->index.get(sequence->gate_strip_start);
  }

  // If the selected gate strip already contains target, no walk is needed.
  if (strip_contains_frame_index(strip, sequence->gate_position, frame_index))
    return;

  // Run forward when the gate is positioned before the target.
  if (sequence->gate_position <= frame_index) {
    // Stop as soon as the gate strip contains the target.
    do {
      strip = &jump_to_next_strip(sequence, strip);
    } while (!strip_contains_frame_index(strip, sequence->gate_position,
                                         frame_index));
    return;
  }

  // Walk backward when the gate starts after the target.
  do {
    strip = &jump_to_previous_strip(sequence, strip);
  } while (
      !strip_contains_frame_index(strip, sequence->gate_position, frame_index));
}
