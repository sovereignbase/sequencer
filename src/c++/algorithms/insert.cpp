/**
 * @file
 * Authors stable positive Insertions from local visible boundaries.
 */
#include "../auxiliary/containsAnchor.hpp"
#include "../class.hpp"

namespace sequencer {
Insertion Projection::insert(Word count, Word content, Word at) {
  Coordinates c{0, 0, 0, increase_clock[0], increase_clock[1], std::int32_t(count)};
  if (frame_count == 0) {
    const auto incoming = allocate({c, content});
    if (!structural_count)
      insert_first(incoming);
    else {
      // Empty visible content can still have anchors held by disconnected peers.
      anchor_strip(incoming, none, 0);
      position_of(incoming);
      gate = incoming;
      gate_position = 0;
    }
    containment.set(c, incoming);
    last_insert = incoming;
  } else {
    const auto [point, anchor] = select_anchor(at);
    c.anchor_session = strips.identity[anchor].coordinates.session;
    c.anchor_start = strips.identity[anchor].coordinates.start;
    c.anchor_diff = point;
    const auto &parent = strips.identity[anchor].coordinates;
    const auto right = strips.right[anchor];
    // Only consecutive local edits at an intact same-Session endpoint may omit
    // the new zero reservation. Existing descendants must keep their attachment order.
    if (count && anchor == last_insert && !strips.fragmented[anchor] &&
        parent.session == c.session && parent.diff > 0 && point == Word(parent.diff) &&
        c.start == parent.start + point + 1 &&
        (!right || !contains_anchor(parent, strips.identity[right].coordinates, 0, point))) {
      // The suffix starts at the old endpoint itself, identifying extension on replay.
      --c.start;
      extend(anchor, count, content);
      increase_clock[1] += count;
      return {c, content};
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
  // A new canonical root reserves its zero boundary plus the authored Frame extent.
  increase_clock[1] += count + 1;
  return {c, content};
}
} // namespace sequencer
