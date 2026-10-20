/**
 * @file
 * Repairs jump distances after a local insertion or mask changes Structural Order.
 */
#include "linkJumps.hpp"
#include <algorithm>

namespace sequencer {
void Projection::patch_jumps(std::int32_t frame_diff, Word strip_diff, Index incoming) {
  const auto predecessor = strips.left[incoming];
  // Competition can place the edit beyond the anchor's indexed endpoint.
  // Resolve that gap directly instead of leaving its old spanning jump unchanged.
  if (!strips.left_jump[predecessor] && !strips.right_jump[predecessor]) {
    position_of(incoming, frame_diff, false);
    return;
  }
  const auto right_jump = strips.right_jump[predecessor];
  const auto left_frames = Word(std::max(0, strips.fragment_diff[predecessor]));
  // The old spanning jump now crosses the edit; subtract the predecessor's
  // visible contribution when its left endpoint moves to the incoming Strip.
  if (right_jump)
    link_jumps(*this, incoming, right_jump,
               strips.right_jump_frames[predecessor] + frame_diff - left_frames,
               strips.right_jump_strips[predecessor] + strip_diff - 1);
  const auto left_jump = strips.left_jump[predecessor];
  if (left_jump && !left_frames && !strips.left_jump_frames[predecessor])
    link_jumps(*this, left_jump, incoming, 0, strips.left_jump_strips[predecessor] + 1);
  else
    link_jumps(*this, predecessor, incoming, left_frames, 1);
  const auto boundary = strips.right[incoming];
  // Keep visible endpoints as explicit jump boundaries after a split or removal.
  if (boundary && (boundary == head || boundary == tail) &&
      strips.right_jump[incoming] != boundary) {
    const auto right = strips.right_jump[incoming];
    const auto frames = Word(std::max(0, strips.fragment_diff[incoming]));
    if (right)
      link_jumps(*this, boundary, right, strips.right_jump_frames[incoming] - frames,
                 strips.right_jump_strips[incoming] - 1);
    link_jumps(*this, incoming, boundary, frames, 1);
  }
  left_jump_to_patch = incoming;
  right_jump_to_patch = strips.right_jump[incoming];
}
} // namespace sequencer
