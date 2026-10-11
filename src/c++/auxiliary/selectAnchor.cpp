#include "../class.hpp"
#include "containsAnchor.hpp"
#include "magnitude.hpp"

namespace sequencer {
std::pair<Word, Index> Projection::select_anchor(Word position) {
  const auto removed = strips.left[gate];
  const auto right = strips.right[gate];
  const auto g = gate;
  const auto r = right;
  if (position == gate_position && gate && strips.identity[g].coordinates.diff < 0 && removed && right &&
      (position > 0 || strips.fragment_diff[r] > 0) && (strips.offset[r] || (strips.fragmented[r] && strips.fragment_diff[r] == 0)) &&
      strips.identity[removed].coordinates.session == strips.identity[g].coordinates.anchor_session &&
      strips.identity[removed].coordinates.start == strips.identity[g].coordinates.anchor_start &&
      !(strips.identity[r].coordinates.anchor_session == strips.identity[g].coordinates.anchor_session &&
        strips.identity[r].coordinates.anchor_start == strips.identity[g].coordinates.anchor_start &&
        strips.identity[r].coordinates.anchor_diff == strips.identity[g].coordinates.anchor_diff - strips.identity[g].coordinates.diff) &&
      (strips.fragment_start[r] == 0 ||
       contains_anchor(strips.identity[r].coordinates, strips.identity[removed].coordinates, strips.fragment_start[r], strips.fragment_start[r])))
    return {strips.fragment_start[g] - strips.fragment_diff[g], gate};
  if (position == frame_count) {
    left_jump_to_patch = tail;
    right_jump_to_patch = strips.right_jump[tail];
    return {strips.fragment_start[tail] + magnitude(strips.fragment_diff[tail]), tail};
  }
  const auto point = find_frame(position, true);
  return {point, gate};
}
} // namespace sequencer
