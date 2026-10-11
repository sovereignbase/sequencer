#include "../class.hpp"
#include "containsAnchor.hpp"
#include "linkJumps.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Index Projection::subtree_end(Index root) {
  std::vector<Index> ancestors;
  auto previous = root;
  auto jump_start = strips.right_jump[root] ? root : none;
  Word jump_frames = 0, jump_steps = 0;
  const auto finish = [&]() {
    // Competition can move an edit inside an existing traversal span. Split
    // that span at the resolved boundary using the walk already performed.
    if (jump_start && previous != jump_start) {
      const auto right = strips.right_jump[jump_start];
      const auto frames = strips.right_jump_frames[jump_start];
      const auto steps = strips.right_jump_strips.identity[jump_start].coordinates;
      link_jumps(*this, previous, right, frames - jump_frames, steps - jump_steps);
      link_jumps(*this, jump_start, previous, jump_frames, jump_steps);
      left_jump_to_patch = previous;
      right_jump_to_patch = right;
    }
    return previous;
  };
  if (strips.right_jump[root]) {
    left_jump_to_patch = root;
    right_jump_to_patch = strips.right_jump[root];
  }
  for (auto next = strips.right[previous]; next; next = strips.right[previous]) {
    auto ancestor = previous;
    while (strips.fragment[ancestor] != next &&
           !contains_anchor(strips.identity[ancestor].coordinates, strips.identity[next].coordinates, 0,
                            magnitude(strips.identity[ancestor].coordinates.diff))) {
      if (ancestors.empty())
        return finish();
      ancestor = ancestors.back();
      ancestors.pop_back();
    }
    ancestors.push_back(ancestor);
    if (jump_start) {
      jump_frames += Word(std::max(0, strips.fragment_diff[previous]));
      ++jump_steps;
    }
    previous = next;
    if (strips.right_jump[previous]) {
      jump_start = previous;
      jump_frames = jump_steps = 0;
      left_jump_to_patch = previous;
      right_jump_to_patch = strips.right_jump[previous];
    } else if (previous == right_jump_to_patch) {
      jump_start = none;
      left_jump_to_patch = right_jump_to_patch = none;
    }
  }
  return finish();
}
} // namespace sequencer
