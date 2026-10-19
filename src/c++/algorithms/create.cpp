/**
 * @file
 * Hydrates canonical history and builds its initial visible traversal index.
 */
#include "../auxiliary/linkJumps.hpp"
#include "../class.hpp"
#include <algorithm>
#include <unordered_map>

namespace sequencer {
void Projection::hydrate(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers,
                         const std::vector<ContentRanges> &ranges) {
  strips.reserve(Word(insertions.size()) + 1);
  for (const auto &a : frontiers)
    frontier.observe(a);
  std::unordered_map<Index, Index> fragments;
  std::vector<Insertion> ready;
  const auto masked = std::any_of(insertions.begin(), insertions.end(), [](const auto &entry) {
    return entry.insertion.coordinates.diff < 0;
  });
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
    auto retained = insertion;
    // Exported Footage already contains masked slots or omits them. Hydration
    // reconstructs geometry without mutating that externally owned array.
    retained.content_owned = masked;
    const auto incoming = allocate(retained);
    if (c.birth() && !structural_count)
      insert_first(incoming);
    else {
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
  if (masked || !ranges.empty()) {
    released.clear();
    copied.clear();
    restore_content(ranges);
    for (const auto &entry : insertions)
      if (entry.insertion.coordinates.diff > 0) {
        const auto c = entry.insertion.coordinates;
        const auto root = containment.get(c.session, c.start);
        if (root)
          clear_content(root);
      }
  }
  // Later masks can still split an earlier prefix. Index only the completed
  // Structural Order so endpoints and distances describe the final fragments.
  const auto spacing = Word(std::max(1.0, std::round(std::sqrt(structural_count))));
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
