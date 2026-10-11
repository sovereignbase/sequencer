#include "linkJumps.hpp"
#include <algorithm>

namespace sequencer {
void Projection::patch_jumps(std::int32_t frame_diff, Word strip_diff, Index incoming) {
  const auto predecessor = strips[incoming].left;
  const auto right_jump = strips[predecessor].right_jump;
  const auto left_frames = Word(std::max(0, strips[predecessor].effect()));
  if (right_jump)
    link_jumps(*this, incoming, right_jump,
               strips[predecessor].right_jump_frames + frame_diff - left_frames,
               strips[predecessor].right_jump_strips + strip_diff - 1);
  const auto left_jump = strips[predecessor].left_jump;
  if (left_jump && !left_frames && !strips[predecessor].left_jump_frames)
    link_jumps(*this, left_jump, incoming, 0, strips[predecessor].left_jump_strips + 1);
  else
    link_jumps(*this, predecessor, incoming, left_frames, 1);
  const auto boundary = strips[incoming].right;
  if (boundary && (boundary == head || boundary == tail) &&
      strips[incoming].right_jump != boundary) {
    const auto right = strips[incoming].right_jump;
    const auto frames = Word(std::max(0, strips[incoming].effect()));
    if (right)
      link_jumps(*this, boundary, right, strips[incoming].right_jump_frames - frames,
                 strips[incoming].right_jump_strips - 1);
    link_jumps(*this, incoming, boundary, frames, 1);
  }
  left_jump_to_patch = incoming;
  right_jump_to_patch = strips[incoming].right_jump;
}
} // namespace sequencer
