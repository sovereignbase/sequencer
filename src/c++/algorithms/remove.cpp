#include "../class.hpp"
#include <algorithm>

namespace sequencer {
Gossip Projection::remove(Word start, std::int64_t end) {
  Gossip output;
  auto remaining = std::int64_t(end) - start + 1;
  while (remaining > 0) {
    const auto point = find_frame(start);
    const auto anchor = gate;
    const auto count = Word(std::min<std::int64_t>(remaining, std::int64_t(strips[anchor].fragment_start) + strips[anchor].effect() - point));
    Coordinates c{strips[anchor].coordinates.session, strips[anchor].coordinates.start, point,
      decrease_clock[0], decrease_clock[1], -std::int32_t(count)};
    const auto incoming = allocate({c, 0});
    const auto previous_count = structural_count;
    anchor_strip(incoming, anchor, point);
    patch_jumps(c.diff, structural_count - previous_count, incoming);
    containment.set(c, incoming);
    if (start == gate_position) gate = incoming;
    output.push_back(Entry::insert({c, 0}));
    decrease_clock[1] += count + 1;
    remaining -= count;
  }
  Acknowledgement a{actor, decrease_clock[0], decrease_clock[1] - 1};
  frontier.observe(a);
  output.push_back(Entry::acknowledge(std::move(a)));
  return output;
}
}
