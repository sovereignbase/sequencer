#pragma once

#include "../../types/type.hpp"

void jump_to_previous_strip(SequenceState *sequence) noexcept {
  const StripOfSequence &current =
      sequence->index.get(sequence->gate_strip_start);

  // Move to the previous linked strip, including masked strips.
  sequence->gate_strip_start = current.previous_strip_start;

  // Only visible strips move the target position backward.
  const StripOfSequence &previous =
      sequence->index.get(sequence->gate_strip_start);
  if (previous.mask == 0)
    sequence->gate_position -= previous.length;
}
