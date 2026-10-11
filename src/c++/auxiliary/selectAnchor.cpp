#include "../class.hpp"
#include "containsAnchor.hpp"
#include "magnitude.hpp"

namespace sequencer {
std::pair<Word, Index> Projection::select_anchor(Word position) {
  const auto removed = strips[gate].left;
  const auto right = strips[gate].right;
  const auto& g = strips[gate];
  const auto& r = strips[right];
  if (position == gate_position && gate && g.coordinates.diff < 0 && removed && right &&
      (position > 0 || r.effect() > 0) && (r.offset || (r.fragmented && r.fragment_diff == 0)) &&
      strips[removed].coordinates.session == g.coordinates.anchor_session && strips[removed].coordinates.start == g.coordinates.anchor_start &&
      !(r.coordinates.anchor_session == g.coordinates.anchor_session && r.coordinates.anchor_start == g.coordinates.anchor_start &&
        r.coordinates.anchor_diff == g.coordinates.anchor_diff - g.coordinates.diff) &&
      (r.fragment_start == 0 || contains_anchor(r, strips[removed], r.fragment_start, r.fragment_start)))
    return {g.fragment_start - g.fragment_diff, gate};
  if (position == frame_count) {
    left_jump_to_patch = tail;
    right_jump_to_patch = strips[tail].right_jump;
    return {strips[tail].fragment_start + magnitude(strips[tail].effect()), tail};
  }
  const auto point = find_frame(position, true);
  return {point, gate};
}
}
