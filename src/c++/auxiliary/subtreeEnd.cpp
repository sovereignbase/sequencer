#include "../class.hpp"
#include "containsAnchor.hpp"
#include "magnitude.hpp"

namespace sequencer {
Index Projection::subtree_end(Index root) {
  std::vector<Index> ancestors;
  auto previous = root;
  if (strips[root].right_jump) {
    left_jump_to_patch = root;
    right_jump_to_patch = strips[root].right_jump;
  }
  for (auto next = strips[previous].right; next; next = strips[previous].right) {
    auto ancestor = previous;
    while (strips[ancestor].fragment != next &&
           !contains_anchor(strips[ancestor], strips[next], 0, magnitude(strips[ancestor].coordinates.diff))) {
      if (ancestors.empty()) return previous;
      ancestor = ancestors.back();
      ancestors.pop_back();
    }
    ancestors.push_back(ancestor);
    previous = next;
    if (strips[previous].right_jump) {
      left_jump_to_patch = previous;
      right_jump_to_patch = strips[previous].right_jump;
    } else if (previous == right_jump_to_patch) left_jump_to_patch = right_jump_to_patch = none;
  }
  return previous;
}
}
