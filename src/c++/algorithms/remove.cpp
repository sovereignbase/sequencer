/**
 * @file
 * Translates visible removal ranges into masks over original Insertion Frames.
 */
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
Gossip Projection::remove(Word start, std::int64_t end) {
  last_insert = none;
  Gossip output;
  auto remaining = std::int64_t(end) - start + 1;
  // The next target remains at start as preceding Frames disappear. Each mask
  // stops at the current original fragment so concurrent Insertions are never implied targets.
  if (tuple && end >= start) {
    for (const auto at : tuple->occupied(start, Word(end))) {
      auto index = tuple->slot(at).head;
      tuple->slot(at).winner = Tuple::no_version;
      while (index != Tuple::no_version) {
        const auto next = tuple->versions[index].next;
        const auto target = tuple->versions[index].coordinates;
        Insertion mask{
            {target.session, target.start, at, decrease_clock[0], decrease_clock[1], -1}};
        decrease_clock[1] += 2;
        const auto incoming = tuple->add(mask);
        containment.set(mask.coordinates, incoming);
        tuple->erase(index + 1, released, copied);
        output.push_back(Entry::insert(mask));
        index = next;
      }
    }
  }
  while (!tuple && remaining > 0) {
    const auto point = find_frame(start);
    const auto anchor = gate;
    const auto count =
        Word(std::min<std::int64_t>(remaining, std::int64_t(strips.fragment_start[anchor]) +
                                                   strips.fragment_diff[anchor] - point));
    Coordinates c{strips.identity[anchor].coordinates.session,
                  strips.identity[anchor].coordinates.start,
                  point,
                  decrease_clock[0],
                  decrease_clock[1],
                  -std::int32_t(count)};
    const auto incoming = allocate({c, 0});
    anchor_strip(incoming, anchor, point);
    containment.set(c, incoming);
    if (start == gate_position)
      gate = incoming;
    output.push_back(Entry::insert({c, 0}));
    decrease_clock[1] += count + 1;
    remaining -= count;
  }
  // The reported frontier is the mask endpoint, excluding the next reserved zero.
  const std::array a{actor, decrease_clock[0], decrease_clock[1] - 1};
  const Word count = tuple && !decrease_clock[1] ? 1 : 3;
  frontier.observe(std::span(a).first(count));
  output.push_back(Entry::acknowledge(a, count));
  return output;
}
} // namespace sequencer
