#include "linkJumps.hpp"

namespace sequencer {
void link_jumps(Projection &p, Index left, Index right, Word frames, Word strips) {
  const auto a = left;
  const auto b = right;
  if (p.strips.right_jump[a] && p.strips.right_jump[a] != right)
    p.strips.left_jump[p.strips.right_jump[a]] = none;
  if (p.strips.left_jump[b] && p.strips.left_jump[b] != left)
    p.strips.right_jump[p.strips.left_jump[b]] = none;
  p.strips.right_jump[a] = right;
  p.strips.left_jump[b] = left;
  p.strips.right_jump_frames[a] = p.strips.left_jump_frames[b] = frames;
  p.strips.right_jump_strips.identity[a].coordinates = p.strips.left_jump_strips.identity[b].coordinates = strips;
}
} // namespace sequencer
