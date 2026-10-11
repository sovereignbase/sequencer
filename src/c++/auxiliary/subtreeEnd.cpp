#include "../class.hpp"
#include "containsAnchor.hpp"
#include "linkJumps.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Index Projection::subtree_end(Index root) {
  std::vector<Index> ancestors;
  auto previous = root;
  auto jump_start = strips[root].right_jump ? root : none;
  Word jump_frames = 0, jump_steps = 0;
  const auto finish = [&]() {
    // Competition can move an edit inside an existing traversal span. Split
    // that span at the resolved boundary using the walk already performed.
    if (jump_start && previous != jump_start) {
      const auto right = strips[jump_start].right_jump;
      const auto frames = strips[jump_start].right_jump_frames;
      const auto steps = strips[jump_start].right_jump_strips;
      link_jumps(*this, previous, right, frames - jump_frames, steps - jump_steps);
      link_jumps(*this, jump_start, previous, jump_frames, jump_steps);
      left_jump_to_patch = previous;
      right_jump_to_patch = right;
    }
    return previous;
  };
  if (strips[root].right_jump) {
    left_jump_to_patch = root;
    right_jump_to_patch = strips[root].right_jump;
  }
  for (auto next = strips[previous].right; next; next = strips[previous].right) {
    auto ancestor = previous;
    while (strips[ancestor].fragment != next &&
           !contains_anchor(strips[ancestor], strips[next], 0, magnitude(strips[ancestor].coordinates.diff))) {
      if (ancestors.empty()) return finish();
      ancestor = ancestors.back();
      ancestors.pop_back();
    }
    ancestors.push_back(ancestor);
    if (jump_start) {
      jump_frames += Word(std::max(0, strips[previous].effect()));
      ++jump_steps;
    }
    previous = next;
    if (strips[previous].right_jump) {
      jump_start = previous;
      jump_frames = jump_steps = 0;
      left_jump_to_patch = previous;
      right_jump_to_patch = strips[previous].right_jump;
    } else if (previous == right_jump_to_patch) {
      jump_start = none;
      left_jump_to_patch = right_jump_to_patch = none;
    }
  }
  return finish();
}
}
