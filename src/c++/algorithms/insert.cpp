/**
 * @file
 * Authors stable positive Insertions from local visible boundaries.
 */
#include "../auxiliary/containsAnchor.hpp"
#include "../class.hpp"

namespace sequencer {
Gossip Projection::insert_batch(Word count, Word content, Word at, bool text) {
  if (!tuple || count == 1)
    return {Entry::insert(insert(count, content, at, text))};
  Gossip output;
  output.reserve(count);
  // Reserve the same geometric capacity once instead of copying intermediate pools.
  auto capacity = std::max(std::size_t(1), tuple->versions.capacity());
  while (capacity < tuple->versions.size() + count)
    capacity *= 2;
  tuple->versions.reserve(capacity);
  containment.reserve(containment.size() + count);
  if (count > 1)
    tuple->share(content, count);
  frame_count = std::max(frame_count, at + count);
  for (Word offset = 0; offset < count; ++offset) {
    Insertion insertion{
        {0, 0, at + offset, increase_clock[0], increase_clock[1], 1}, content, offset};
    increase_clock[1] += 2;
    const auto index = tuple->add(insertion, count > 1);
    if (text) [[unlikely]]
      tuple->versions[index - 1].string_content = true;
    containment.set(insertion.coordinates, index);
    output.push_back(Entry::insert(insertion));
  }
  return output;
}
Insertion Projection::insert(Word count, Word content, Word at, bool text) {
  Coordinates c{0, 0, 0, increase_clock[0], increase_clock[1], std::int32_t(count)};
  if (tuple) {
    c.anchor_diff = at;
    const auto index = tuple->add({c, content});
    if (text) [[unlikely]]
      tuple->versions[index - 1].string_content = true;
    containment.set(c, index);
    frame_count = std::max(frame_count, at + 1);
  } else if (frame_count == 0) {
    const auto incoming = allocate({c, content});
    if (text) [[unlikely]]
      strips.identity[incoming].string_content = true;
    if (!structural_count)
      insert_first(incoming);
    else {
      // Empty visible content can still have anchors held by disconnected peers.
      anchor_strip(incoming, none, 0);
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
    if (count && anchor == last_insert && !strips.identity[anchor].fragmented &&
        parent.session == c.session && parent.diff > 0 && point == Word(parent.diff) &&
        c.start == parent.start + point + 1 &&
        (!right || !contains_anchor(parent, strips.identity[right].coordinates, 0, point))) {
      // The suffix starts at the old endpoint itself, identifying extension on replay.
      --c.start;
      extend(anchor, count, content, 0, text);
      increase_clock[1] += count;
      return {c, content};
    }
    const auto incoming = allocate({c, content});
    if (text) [[unlikely]]
      strips.identity[incoming].string_content = true;
    anchor_strip(incoming, anchor, point);
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
