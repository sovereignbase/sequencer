/**
 * @file
 * Selects stable logical anchors for local visible insertion boundaries.
 */
#include "../class.hpp"
#include "containsAnchor.hpp"
#include "magnitude.hpp"

namespace sequencer {
std::pair<Word, Index> Projection::select_anchor(Word position) {
  // The visible head already owns this boundary unless an offset fragment or
  // a hidden gate at zero requires the historical boundary resolution below.
  if (!position && !strips.identity[head].offset && (gate == head || gate_position)) {
    gate = head;
    gate_position = 0;
    return {strips.fragment_start[head], head};
  }
  const auto removed = strips.left[gate];
  const auto right = strips.right[gate];
  const auto g = gate;
  const auto r = right;
  // A removal boundary may retain a replayable mask endpoint even when the
  // visible successor belongs to a different original fragment or older mask.
  if (position == gate_position && gate && strips.identity[g].coordinates.diff < 0 && removed &&
      right && (position > 0 || strips.fragment_diff[r] > 0) &&
      (strips.identity[r].offset ||
       (strips.identity[r].fragmented && strips.fragment_diff[r] == 0) ||
       // A whole replacement can precede an older mask. Its free endpoint
       // stays at this visible boundary even when the original subtree sorts later.
       (strips.identity[r].coordinates.diff < 0 && strips.identity[removed].coordinates.diff > 0 &&
        strips.fragment_diff[removed] == 0 && strips.identity[g].coordinates.anchor_diff == 0 &&
        strips.fragment_start[g] == 0 &&
        magnitude(strips.fragment_diff[g]) == Word(strips.identity[removed].coordinates.diff))) &&
      strips.identity[removed].coordinates.session ==
          strips.identity[g].coordinates.anchor_session &&
      strips.identity[removed].coordinates.start == strips.identity[g].coordinates.anchor_start &&
      !(strips.identity[r].coordinates.anchor_session ==
            strips.identity[g].coordinates.anchor_session &&
        strips.identity[r].coordinates.anchor_start ==
            strips.identity[g].coordinates.anchor_start &&
        strips.identity[r].coordinates.anchor_diff ==
            strips.identity[g].coordinates.anchor_diff - strips.identity[g].coordinates.diff) &&
      (strips.fragment_start[r] == 0 ||
       contains_anchor(strips.identity[r].coordinates, strips.identity[removed].coordinates,
                       strips.fragment_start[r], strips.fragment_start[r])))
    return {strips.fragment_start[g] - strips.fragment_diff[g], gate};
  // Appending anchors at the last visible fragment's original logical endpoint.
  if (position == frame_count) {
    return {strips.fragment_start[tail] + magnitude(strips.fragment_diff[tail]), tail};
  }
  const auto point = find_frame(position, true);
  return {point, gate};
}
} // namespace sequencer
