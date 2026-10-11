#include "../class.hpp"
#include "../auxiliary/linkJumps.hpp"
#include <algorithm>

namespace sequencer {
Result Projection::apply(const Gossip& gossip) {
  Result result;
  for (const auto& entry : gossip) {
    if (entry.acknowledgement) { frontier.observe(entry.frontier); continue; }
    std::vector<Insertion> queue{entry.insertion};
    while (!queue.empty()) {
      const auto insertion = queue.back();
      queue.pop_back();
      const auto c = insertion.coordinates;
      if (c.diff < 0) {
        Acknowledgement a{actor, c.session, c.start - c.diff};
        frontier.observe(a);
        result.gossip.push_back(Entry::acknowledge(std::move(a)));
      }
      if (containment.has(c)) continue;
      // Stage before allocating so repeated out-of-order delivery cannot leak
      // unlinked arena nodes. A dependent retains numeric metadata only.
      const auto origin = c.birth() ? none : containment.get(c.anchor_session, c.anchor_start);
      if (!c.birth() && !origin) { pending.set(insertion); continue; }
      const auto incoming = allocate(insertion);
      Word start = 0;
      auto diff = c.diff;
      if (c.birth() && !structural_count) insert_first(incoming);
      else {
        Word point = 0;
        Index anchor = none;
        if (!c.birth()) {
          const auto resolved = find_containing_fragment(origin, incoming);
          point = resolved.first;
          anchor = resolved.second;
        }
        if (!frame_count) { gate = none; gate_position = 0; }
        else if (gate && strips[gate].effect() <= 0) find_frame(std::min(gate_position, frame_count - 1));
        diff = anchor_strip(incoming, anchor, point);
        auto gate_diff = diff;
        if (diff < 0 && strips[incoming].fragment && gate) {
          auto parent = gate;
          while (parent &&
                 !(strips[parent].coordinates.session == c.anchor_session && strips[parent].coordinates.start == c.anchor_start) &&
                 !(strips[parent].coordinates.anchor_session == c.anchor_session && strips[parent].coordinates.anchor_start == c.anchor_start))
            parent = containment.get(strips[parent].coordinates.anchor_session, strips[parent].coordinates.anchor_start);
          if (parent) {
            const auto boundary = strips[parent].coordinates.session == c.anchor_session && strips[parent].coordinates.start == c.anchor_start
              ? strips[parent].fragment_start : strips[parent].coordinates.anchor_diff;
            gate_diff = 0;
            for (auto mask = incoming; mask && strips[mask].coordinates.anchor_diff + strips[mask].fragment_start < boundary;
                 mask = strips[mask].fragment)
              gate_diff -= std::min(-strips[mask].fragment_diff,
                std::max(0, std::int32_t(boundary - strips[mask].coordinates.anchor_diff - strips[mask].fragment_start)));
          }
        }
        start = position_of(incoming, gate_diff);
        if (start <= gate_position) gate_position = Word(std::max<std::int64_t>(start, std::int64_t(gate_position) + gate_diff));
        if (diff > 0 && gate && strips[gate].fragmented && !strips[gate].fragment_diff) {
          gate = strips[gate].fragment;
          const auto right = strips[incoming].right_jump;
          if (right && right != gate)
            link_jumps(*this, gate, right, strips[incoming].right_jump_frames - diff, strips[incoming].right_jump_strips - 1);
          link_jumps(*this, incoming, gate, Word(diff), 1);
        }
      }
      containment.set(c, incoming);
      if (diff > 0) {
        if (!start) head = incoming;
        if (start + Word(diff) == frame_count) tail = incoming;
        result.changes.push_back({start, start, {{insertion.content, 0, Word(c.diff)}}});
      } else if (diff < 0) {
        auto position = start;
        for (auto mask = incoming; mask; mask = strips[mask].fragment) {
          if (strips[mask].fragment_diff < 0)
            result.changes.push_back({position, position - strips[mask].fragment_diff, {}});
          const auto next = strips[mask].fragment;
          if (next)
            for (auto i = strips[mask].right; i && i != next; i = strips[i].right)
              position += std::max(0, strips[i].effect());
        }
      }
      if (!frame_count) { gate = none; gate_position = 0; }
      else if (!gate) { gate = head; gate_position = 0; }
      else if (strips[gate].effect() <= 0) find_frame(std::min(gate_position, frame_count - 1));
      if (gate && strips[gate].right_jump) {
        left_jump_to_patch = gate;
        right_jump_to_patch = strips[gate].right_jump;
      }
      auto released_pending = pending.take(c);
      for (auto it = released_pending.rbegin(); it != released_pending.rend(); ++it) queue.push_back(*it);
    }
  }
  return result;
}
}
