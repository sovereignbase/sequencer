#pragma once

#include "../../types/type.hpp"

[[nodiscard]] inline const StripOfSequence &
jump_to_next_strip(SequenceState *sequence,
                   const StripOfSequence *current) noexcept {
  // Advance to the next linked strip, including masked strips.
  sequence->gate_strip_start = current->next_strip_start;

  // Only the strip walked over moves the visible target position forward.
  if (current->mask == 0)
    sequence->gate_position += current->length;

  return sequence->index.get(sequence->gate_strip_start);
}
