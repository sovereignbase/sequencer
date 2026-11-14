/**
 * @file
 * Hydrates canonical history and builds its initial visible traversal index.
 */
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
void Projection::hydrate(std::span<const Insertion> insertions,
                         const std::vector<Acknowledgement> &frontiers) {
  for (const auto &a : frontiers)
    frontier.observe(a);
  if (insertions.empty())
    return;
  if (tuple) {
    // Leave one slot for the next authored Version after hydration.
    tuple->versions.reserve(tuple->versions.size() + insertions.size() + 1);
    containment.reserve(Word(insertions.size()));
    Result result;
    for (const auto &insertion : insertions)
      apply(insertion, result);
    // Keep retained claims after Acknowledgements emitted during reconstruction.
    for (const auto &a : frontiers)
      frontier.observe(a);
    return;
  }
  const auto &first = insertions.front();
  if (insertions.size() == 1 && first.coordinates.birth() && first.coordinates.diff > 0) {
    // One positive root has no dependencies or fragments to reconstruct.
    const auto root = allocate(first);
    insert_first(root);
    containment.set(first.coordinates, root);
    return;
  }
  strips.reserve(Word(insertions.size()) + 1);
  traversal.grow(strips);
  containment.reserve(Word(insertions.size()));
  // The directory is built after hydration. Its unused block lane retains
  // each root's last resolved fragment during reconstruction.
  std::vector<Insertion> ready;
  for (std::size_t n = 0; n < insertions.size() || !ready.empty();) {
    const auto queued = !ready.empty();
    const auto insertion = queued ? ready.back() : insertions[n++];
    if (queued)
      ready.pop_back();
    const auto c = insertion.coordinates;
    const auto origin = c.birth() ? none : containment.get(c.anchor_session, c.anchor_start);
    // Structural Order can place a mask's child before its zero-effect parent.
    // Materialization follows canonical dependencies, as it does for Gossip.
    if (!c.birth() && !origin) {
      pending.set(insertion);
      continue;
    }
    const auto incoming = allocate(insertion);
    if (c.birth() && !structural_count)
      insert_first(incoming);
    else if (c.diff > 0 && origin && !strips.right[origin] && strips.fragment_diff[origin] > 0 &&
             c.anchor_diff == strips.fragment_start[origin] + Word(strips.fragment_diff[origin])) {
      // An unoccupied positive endpoint has no siblings to compare or Frames to
      // split. The completed traversal index is built once after hydration.
      strips.left[incoming] = origin;
      strips.right[origin] = incoming;
      tail = incoming;
      ++structural_count;
      frame_count += Word(c.diff);
    } else {
      Index anchor = none;
      Word point = 0;
      if (!c.birth()) {
        // Structural Order often visits increasing boundaries of one parent;
        // reuse its last resolved fragment only when the new boundary lies to its right.
        const auto fragment = strips.fragment[origin] && strips.block_root[origin]
                                  ? strips.block_root[origin]
                                  : origin;
        const auto resolved = find_containing_fragment(
            c.anchor_diff > strips.fragment_start[fragment] ? fragment : origin, c, incoming);
        point = resolved.first;
        anchor = resolved.second;
        if (strips.fragment[origin] &&
            strips.identity[anchor].coordinates.session ==
                strips.identity[origin].coordinates.session &&
            strips.identity[anchor].coordinates.start == strips.identity[origin].coordinates.start)
          strips.block_root[origin] = anchor;
      }
      anchor_strip(incoming, anchor, point, false);
    }
    containment.set(c, incoming);
    // Hydration also records this Actor's Acknowledgement of retained reducing Insertions.
    if (c.diff < 0)
      frontier.observe(std::array{actor, c.session, c.start - c.diff});
    if (pending.size()) {
      auto released = pending.take(c);
      ready.insert(ready.end(), released.rbegin(), released.rend());
    }
  }
  const auto endpoints = traversal.build(strips, structural_head, structural_count);
  head = endpoints.first;
  tail = endpoints.second;
  gate = head;
  gate_position = 0;
}
} // namespace sequencer
