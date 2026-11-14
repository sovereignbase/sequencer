/** @file Resolves linked boundaries without changing the retained local gate. */
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
Word Projection::position_of(Index target, std::int32_t gate_diff) {
  if (target == head)
    return 0;
  if (target == tail)
    return frame_count - Word(std::max(0, strips.fragment_diff[target]));
  if (target == gate)
    return gate_position;
  if (gate && strips.left[target] == gate)
    return gate_position + Word(std::max(0, strips.fragment_diff[gate]));
  if (gate && strips.right[target] == gate)
    return gate_position + gate_diff - Word(std::max(0, strips.fragment_diff[target]));
  traversal.prepare(strips, structural_head, structural_count);
  return traversal.position(strips, structural_head, target, frame_count);
}
} // namespace sequencer
