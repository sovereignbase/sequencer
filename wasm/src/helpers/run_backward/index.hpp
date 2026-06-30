#include "../../types/type.hpp"
#include <cstdint>

void run_backward(Projector *projector) {
  Strip &current = projector->reel[projector->gate_strip_start_position];
  if (current.previous_strip_start_position == invalid_strip_indicator)
    return;

  // Move to the previous linked strip, including masked strips.
  projector->gate_strip_start_position = current.previous_strip_start_position;
  // Only visible strips move the target position backward.
  Strip &previous = projector->reel[projector->gate_strip_start_position];
  if (!previous.masked)
    projector->gate_position -= previous.length;
  return;
}
