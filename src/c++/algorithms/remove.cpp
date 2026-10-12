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
  while (remaining > 0) {
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
    const auto previous_count = structural_count;
    anchor_strip(incoming, anchor, point);
    patch_jumps(c.diff, structural_count - previous_count, incoming);
    containment.set(c, incoming);
    if (start == gate_position)
      gate = incoming;
    output.push_back(Entry::insert({c, 0}));
    decrease_clock[1] += count + 1;
    remaining -= count;
  }
  // The reported frontier is the mask endpoint, excluding the next reserved zero.
  Acknowledgement a{actor, decrease_clock[0], decrease_clock[1] - 1};
  frontier.observe(a);
  output.push_back(Entry::acknowledge(std::move(a)));
  return output;
}
} // namespace sequencer
