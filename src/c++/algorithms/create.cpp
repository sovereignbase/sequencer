/**
 * @file
 * Hydrates canonical history and builds its initial visible traversal index.
 */
#include "../auxiliary/linkJumps.hpp"
#include "../class.hpp"
#include <algorithm>
#include <unordered_map>

namespace sequencer {
void Projection::hydrate(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers) {
  for (const auto &a : frontiers)
    frontier.observe(a);
  if (insertions.empty())
    return;
  const auto &first = insertions.front().insertion;
  if (insertions.size() == 1 && first.coordinates.birth() && first.coordinates.diff > 0) {
    // One positive root has no dependencies, fragments or jumps to reconstruct.
    const auto root = allocate(first);
    insert_first(root);
    containment.set(first.coordinates, root);
    return;
  }
  strips.reserve(Word(insertions.size()) + 1);
  containment.reserve(Word(insertions.size()));
  std::unordered_map<Index, Index> fragments;
  std::vector<Insertion> ready;
  for (std::size_t n = 0; n < insertions.size() || !ready.empty();) {
    const auto queued = !ready.empty();
    const auto insertion = queued ? ready.back() : insertions[n++].insertion;
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
        const auto known = fragments.find(origin);
        const auto fragment =
            strips.fragment[origin] && known != fragments.end() ? known->second : origin;
        const auto resolved = find_containing_fragment(
            c.anchor_diff > strips.fragment_start[fragment] ? fragment : origin, c, incoming);
        point = resolved.first;
        anchor = resolved.second;
        if (strips.fragment[origin] &&
            strips.identity[anchor].coordinates.session ==
                strips.identity[origin].coordinates.session &&
            strips.identity[anchor].coordinates.start == strips.identity[origin].coordinates.start)
          fragments[origin] = anchor;
      }
      anchor_strip(incoming, anchor, point, false);
    }
    containment.set(c, incoming);
    // Hydration also records this Actor's Acknowledgement of retained reducing Insertions.
    if (c.diff < 0)
      frontier.observe({actor, c.session, c.start - c.diff});
    if (pending.size()) {
      auto released = pending.take(c);
      ready.insert(ready.end(), released.rbegin(), released.rend());
    }
  }
  // Later masks can still split an earlier prefix. Index only the completed
  // Structural Order so endpoints and distances describe the final fragments.
  const auto spacing = traversal_spacing();
  Index jump_start = structural_head, tail_jump_start = none;
  Index visible_head = none, visible_tail = none;
  Word jump_frames = 0, jump_strips = 0;
  for (auto cursor = structural_head; cursor;) {
    const auto diff = strips.fragment_diff[cursor];
    if (diff > 0) {
      if (!visible_head) {
        visible_head = jump_start = cursor;
        jump_frames = jump_strips = 0;
      }
      visible_tail = cursor;
      tail_jump_start = jump_start;
    }
    jump_frames += std::max(0, diff);
    ++jump_strips;
    cursor = strips.right[cursor];
    if (jump_strips == spacing && cursor) {
      link_jumps(*this, jump_start, cursor, jump_frames, jump_strips);
      jump_start = cursor;
      jump_frames = jump_strips = 0;
    }
  }
  head = visible_head;
  tail = visible_tail;
  // A final jump past the last visible Frame cannot accelerate visible-position lookup.
  if (tail_jump_start && tail_jump_start != tail && strips.right_jump[tail_jump_start]) {
    strips.left_jump[strips.right_jump[tail_jump_start]] = none;
    strips.right_jump[tail_jump_start] = none;
  }
  gate = head;
  gate_position = 0;
}
} // namespace sequencer
