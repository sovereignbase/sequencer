#include "../auxiliary/linkJumps.hpp"
#include "../class.hpp"
#include <algorithm>
#include <unordered_map>

namespace sequencer {
void Projection::hydrate(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers) {
  for (const auto &a : frontiers)
    frontier.observe(a);
  const auto spacing = Word(std::max(1.0, std::round(std::sqrt(insertions.size()))));
  std::unordered_map<Index, Index> fragments;
  Index jump_start = none, cursor = none, tail_jump_start = none;
  Index visible_head = none, visible_tail = none;
  Word jump_frames = 0, jump_strips = 0;
  for (std::size_t n = 0; n < insertions.size(); ++n) {
    const auto insertion = insertions[n].insertion;
    const auto c = insertion.coordinates;
    const auto incoming = allocate(insertion);
    if (c.birth() && !structural_count)
      insert_first(incoming);
    else {
      Index anchor = none;
      Word point = 0;
      if (!c.birth()) {
        const auto origin = containment.get(c.anchor_session, c.anchor_start);
        const auto known = fragments.find(origin);
        const auto fragment =
            strips.fragment[origin] && known != fragments.end() ? known->second : origin;
        const auto resolved = find_containing_fragment(
            c.anchor_diff > strips.fragment_start[fragment] ? fragment : origin, incoming);
        point = resolved.first;
        anchor = resolved.second;
        if (strips.fragment[origin] &&
            strips.identity[anchor].coordinates.session == strips.identity[origin].coordinates.session &&
            strips.identity[anchor].coordinates.start == strips.identity[origin].coordinates.start)
          fragments[origin] = anchor;
      }
      anchor_strip(incoming, anchor, point);
    }
    containment.set(c, incoming);
    if (c.diff < 0)
      frontier.observe({actor, c.session, c.start - c.diff});
    if (!cursor)
      jump_start = cursor = structural_head;
    const auto stop = n + 1 < insertions.size() ? incoming : none;
    while (cursor && cursor != stop) {
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
  }
  head = visible_head;
  tail = visible_tail;
  if (tail_jump_start && tail_jump_start != tail && strips.right_jump[tail_jump_start]) {
    strips.left_jump[strips.right_jump[tail_jump_start]] = none;
    strips.right_jump[tail_jump_start] = none;
  }
  gate = head;
  gate_position = 0;
}
} // namespace sequencer
