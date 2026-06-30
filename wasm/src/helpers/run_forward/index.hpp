#include "../../types/type.hpp"
#include <cstdint>

void run_forward(Projector *projector) {
  Strip &previous = projector->reel[projector->gate_strip_start_position];
  if (previous.next_strip_start_position == invalid_strip_indicator)
    return;
  // Advance to the next linked strip, including masked strips.
  projector->gate_strip_start_position = previous.next_strip_start_position;
  // Only the strip walked over moves the visible target position forward.
  if (!previous.masked)
    projector->gate_position += previous.length;
  return;
}
