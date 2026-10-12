#include "../auxiliary/containsAnchor.hpp"
#include "../class.hpp"

namespace sequencer {
Gossip Projection::insert(Word count, Word content, Word at) {
  Coordinates c{0, 0, 0, increase_clock[0], increase_clock[1], std::int32_t(count)};
  if (frame_count == 0) {
    const auto incoming = allocate({c, content});
    insert_first(incoming);
    containment.set(c, incoming);
    last_insert = incoming;
  } else {
    const auto [point, anchor] = select_anchor(at);
    c.anchor_session = strips.identity[anchor].coordinates.session;
    c.anchor_start = strips.identity[anchor].coordinates.start;
    c.anchor_diff = point;
    const auto &parent = strips.identity[anchor].coordinates;
    const auto right = strips.right[anchor];
    if (count && anchor == last_insert && !strips.fragmented[anchor] &&
        parent.session == c.session && parent.diff > 0 && point == Word(parent.diff) &&
        c.start == parent.start + point + 1 &&
        (!right || !contains_anchor(parent, strips.identity[right].coordinates, 0, point))) {
      --c.start;
      extend(containment.get(parent.session, parent.start), count, content);
      increase_clock[1] += count;
      return {Entry::insert({c, content})};
    }
    const auto incoming = allocate({c, content});
    const auto previous_count = structural_count;
    anchor_strip(incoming, anchor, point);
    patch_jumps(c.diff, structural_count - previous_count, incoming);
    containment.set(c, incoming);
    last_insert = incoming;
    if (count && !at)
      head = incoming;
    if (count && at + count == frame_count)
      tail = incoming;
    gate = incoming;
    gate_position = at;
  }
  increase_clock[1] += count + 1;
  return {Entry::insert({c, content})};
}
} // namespace sequencer
