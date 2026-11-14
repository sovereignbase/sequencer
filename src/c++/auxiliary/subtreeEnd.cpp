/**
 * @file
 * Keeps each exact-anchor competitor together with its entire causal subtree.
 */
#include "../class.hpp"
#include "containsAnchor.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Index Projection::subtree_end(Index root) {
  const auto positive = strips.identity[root].coordinates.diff > 0;
  const auto finish = [&](Index end) {
    if (positive)
      strips.subtree_tail[root] = end;
    return end;
  };
  auto previous = positive && strips.subtree_tail[root] ? strips.subtree_tail[root] : root;
  std::vector<Index> ancestors;
  // Positive subtrees only extend in live Structural Order; masks retain the full walk.
  if (previous != root && strips.right[previous])
    ancestors.push_back(root);
  for (auto next = strips.right[previous]; next; next = strips.right[previous]) {
    auto ancestor = previous;
    // Every fragment retains its canonical identity. Intervening masks can
    // separate nonadjacent fragments without ending their parent's subtree.
    while (
        (strips.identity[ancestor].coordinates.session !=
             strips.identity[next].coordinates.session ||
         strips.identity[ancestor].coordinates.start != strips.identity[next].coordinates.start) &&
        !contains_anchor(strips.identity[ancestor].coordinates, strips.identity[next].coordinates,
                         0, magnitude(strips.identity[ancestor].coordinates.diff))) {
      if (ancestors.empty()) {
        // Overlapping masks can give a child a different materialized owner.
        // The stack is only a traversal cache; canonical ancestry decides membership.
        const auto r = strips.identity[root].coordinates;
        const auto n = strips.identity[next].coordinates;
        if (n.anchor_session == r.anchor_session && n.anchor_start == r.anchor_start)
          return finish(previous);
        auto parent = containment.get(n.anchor_session, n.anchor_start);
        while (parent && (strips.identity[parent].coordinates.session != r.session ||
                          strips.identity[parent].coordinates.start != r.start)) {
          const auto c = strips.identity[parent].coordinates;
          if (c.session == r.anchor_session && c.start == r.anchor_start)
            return finish(previous);
          parent = containment.get(c.anchor_session, c.anchor_start);
        }
        if (!parent)
          return finish(previous);
        ancestor = root;
        break;
      }
      ancestor = ancestors.back();
      ancestors.pop_back();
    }
    ancestors.push_back(ancestor);
    previous = next;
  }
  return finish(previous);
}
} // namespace sequencer
