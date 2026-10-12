/**
 * @file
 * Initializes the first structural root; later roots must use sibling competition.
 */
#include "../class.hpp"

namespace sequencer {
void Projection::insert_first(Index i) {
  structural_head = head = gate = tail = i;
  structural_count = 1;
  frame_count += strips.fragment_diff[i];
  gate_position = 0;
  left_jump_to_patch = right_jump_to_patch = none;
}
} // namespace sequencer
