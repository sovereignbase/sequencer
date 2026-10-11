#include "linkJumps.hpp"

namespace sequencer {
void link_jumps(Projection &p, Index left, Index right, Word frames, Word strips) {
  auto a = p.strips[left];
  auto b = p.strips[right];
  if (a.right_jump && a.right_jump != right)
    p.strips[a.right_jump].left_jump = none;
  if (b.left_jump && b.left_jump != left)
    p.strips[b.left_jump].right_jump = none;
  a.right_jump = right;
  b.left_jump = left;
  a.right_jump_frames = b.left_jump_frames = frames;
  a.right_jump_strips = b.left_jump_strips = strips;
}
} // namespace sequencer
