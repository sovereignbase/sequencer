#pragma once

#include "../../types/sequence.hpp"
#include "../strip_contains_sequence_point/index.hpp"
#include <cstdint>
#include <utility>
#include <variant>

/**
 * @brief Find the strip containing a sequence point.
 *
 * The search favors locations where new strips are expected most often. It
 * checks the current gate, the last strip, and the first strip before walking
 * outward from the gate in both directions. Forward and backward cursors keep
 * their own visible frame positions, allowing the sequence gate to be moved
 * directly to the matching strip without a second walk.
 *
 * Masked strips participate in the linked walk and sequence-point lookup, but
 * do not advance visible frame positions. The current gate, first strip, and
 * last strip are checked before the walk and are therefore not checked again.
 * Every remaining linked strip is checked at most once.
 *
 * @param sequence Sequence whose linked strips are searched. When a strip is
 * found, its start point and visible frame position become the new gate.
 * @param sequence_point Point that must fall within the returned strip's
 * half-open sequence-point range.
 * @return A pair containing a pointer to the matching strip and its zero-based
 * offset within that strip, or `false` when the sequence is empty or no linked
 * strip contains the point.
 *
 * @pre `sequence` and `sequence_point` are non-null.
 * @pre A non-empty sequence has valid first, last, and gate strip keys, and its
 * next/previous links form one bounded bidirectional chain.
 * @note The returned pointer remains valid only while the strip index is not
 * modified.
 * @complexity O(n) worst case and O(1) auxiliary space, where n is the number
 * of linked strips.
 */
[[nodiscard]] inline std::variant<
    std::pair<const StripOfSequence *, std::uint32_t>, bool>
find_strip_by_sequence_point(SequenceState *sequence,
                             const PointInSequence *sequence_point) noexcept {
  // No anchor keys are valid before the first strip has been indexed.
  if (sequence->index.size() == 0)
    return false;

  // Resolve the three high-probability anchors once. The index is not mutated
  // during the search, so these pointers remain stable for the entire walk.
  const StripOfSequence *gate =
      &sequence->index.get(sequence->gate_strip_start);
  const StripOfSequence *first =
      &sequence->index.get(sequence->first_strip_start);
  const StripOfSequence *last =
      &sequence->index.get(sequence->last_strip_start);
  std::uint32_t offset;

  // Consecutive operations are most likely to target the current gate.
  if ((offset = strip_contains_sequence_point(gate, sequence_point)) !=
      max_uint32)
    return std::pair{gate, offset};

  // A visible last strip begins one strip length before the sequence end. A
  // masked last strip consumes no visible frames and therefore begins at it.
  const std::uint32_t last_position =
      sequence->length - (last->mask == 0 ? last->length : 0);
  if (last != gate &&
      (offset = strip_contains_sequence_point(last, sequence_point)) !=
          max_uint32) {
    sequence->gate_strip_start = last->this_strip_start;
    sequence->gate_position = last_position;
    return std::pair{last, offset};
  }

  if (first != gate && first != last &&
      (offset = strip_contains_sequence_point(first, sequence_point)) !=
          max_uint32) {
    sequence->gate_strip_start = first->this_strip_start;
    sequence->gate_position = 0;
    return std::pair{first, offset};
  }

  // Search both sides of the gate alternately. Each cursor carries the visible
  // frame position of its current strip so a match can update the gate directly.
  const StripOfSequence *forward = gate;
  const StripOfSequence *backward = gate;
  std::uint32_t forward_position = sequence->gate_position;
  std::uint32_t backward_position = sequence->gate_position;

  while (forward != last || backward != first) {
    if (forward != last) {
      // Moving forward advances past the current strip only when it is visible.
      if (forward->mask == 0)
        forward_position += forward->length;
      forward = &sequence->index.get(forward->next_strip_start);

      // `last` was already checked before the walk.
      if (forward != last &&
          (offset = strip_contains_sequence_point(forward, sequence_point)) !=
              max_uint32) {
        sequence->gate_strip_start = forward->this_strip_start;
        sequence->gate_position = forward_position;
        return std::pair{forward, offset};
      }
    }

    if (backward != first) {
      backward = &sequence->index.get(backward->previous_strip_start);
      // Moving backward subtracts the newly entered strip when it is visible.
      if (backward->mask == 0)
        backward_position -= backward->length;

      // `first` was already checked before the walk.
      if (backward != first &&
          (offset = strip_contains_sequence_point(backward, sequence_point)) !=
              max_uint32) {
        sequence->gate_strip_start = backward->this_strip_start;
        sequence->gate_position = backward_position;
        return std::pair{backward, offset};
      }
    }
  }

  // Both cursors reached their respective ends without a match.
  return false;
}
