#include "../auxiliary/linkJumps.hpp"
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
Result Projection::apply(std::span<const Entry> gossip) {
  Result result;
  for (const auto &entry : gossip) {
    if (entry.acknowledgement) {
      frontier.observe(entry.frontier);
      continue;
    }
    std::vector<Insertion> queue;
    bool first = true;
    while (first || !queue.empty()) {
      auto insertion = first ? entry.insertion : queue.back();
      last_insert = none;
      if (first)
        first = false;
      else
        queue.pop_back();
      const auto c = insertion.coordinates;
      if (c.diff < 0) {
        if (insertion.content) {
          released.push_back({insertion.content, 0, 0});
          insertion.content = 0;
        }
        Acknowledgement a{actor, c.session, c.start - c.diff};
        frontier.observe(a);
        result.gossip.push_back(Entry::acknowledge(std::move(a)));
      }
      const auto extension = c.extension();
      const auto existing = extension ? none : containment.get(c.session, c.start);
      const auto origin = c.birth() ? none : containment.get(c.anchor_session, c.anchor_start);
      const auto growing = existing && c.diff > 0 &&
                           strips.identity[existing].coordinates.diff > 0 &&
                           c.diff > strips.identity[existing].coordinates.diff;
      if (extension || growing) {
        const auto parent = growing ? existing : origin;
        if (!parent ||
            (!growing && c.anchor_diff > Word(strips.identity[parent].coordinates.diff))) {
          pending.set(insertion);
          continue;
        }
        const auto known = Word(strips.identity[parent].coordinates.diff);
        const auto end = growing ? Word(c.diff) : c.anchor_diff + Word(c.diff);
        if (end > known && (growing || c.anchor_diff == known)) {
          const auto source_start = growing ? known : known - c.anchor_diff;
          const auto at = extend(parent, end - known, insertion.content,
                                 insertion.content_start + source_start);
          result.changes.push_back(
              {at, at, {{insertion.content, insertion.content_start + source_start, end - known}}});
          auto released_pending = pending.take(strips.identity[parent].coordinates);
          for (auto it = released_pending.rbegin(); it != released_pending.rend(); ++it)
            queue.push_back(*it);
        } else if (insertion.content)
          released.push_back({insertion.content, 0, 0});
        continue;
      }
      if (existing) {
        if (insertion.content)
          released.push_back({insertion.content, 0, 0});
        continue;
      }
      // Stage before allocating so repeated out-of-order delivery cannot leak
      // unlinked arena nodes. A dependent retains numeric metadata only.
      if (!c.birth() &&
          (!origin || (strips.identity[origin].coordinates.diff > 0 &&
                       std::uint64_t(c.anchor_diff) + (c.diff < 0 ? -std::int64_t(c.diff) : 0) >
                           Word(strips.identity[origin].coordinates.diff)))) {
        pending.set(insertion);
        continue;
      }
      const auto incoming = allocate(insertion);
      Word start = 0;
      auto diff = c.diff;
      if (c.birth() && !structural_count)
        insert_first(incoming);
      else {
        Word point = 0;
        Index anchor = none;
        if (!c.birth()) {
          const auto resolved = find_containing_fragment(origin, incoming);
          point = resolved.first;
          anchor = resolved.second;
        }
        if (!frame_count) {
          gate = none;
          gate_position = 0;
        } else if (gate && strips.fragment_diff[gate] <= 0)
          find_frame(std::min(gate_position, frame_count - 1));
        diff = anchor_strip(incoming, anchor, point);
        auto gate_diff = diff;
        if (diff < 0 && strips.fragment[incoming] && gate) {
          auto parent = gate;
          while (parent &&
                 !(strips.identity[parent].coordinates.session == c.anchor_session &&
                   strips.identity[parent].coordinates.start == c.anchor_start) &&
                 !(strips.identity[parent].coordinates.anchor_session == c.anchor_session &&
                   strips.identity[parent].coordinates.anchor_start == c.anchor_start))
            parent = containment.get(strips.identity[parent].coordinates.anchor_session,
                                     strips.identity[parent].coordinates.anchor_start);
          if (parent) {
            const auto boundary =
                strips.identity[parent].coordinates.session == c.anchor_session &&
                        strips.identity[parent].coordinates.start == c.anchor_start
                    ? strips.fragment_start[parent]
                    : strips.identity[parent].coordinates.anchor_diff;
            gate_diff = 0;
            for (auto mask = incoming; mask && strips.identity[mask].coordinates.anchor_diff +
                                                       strips.fragment_start[mask] <
                                                   boundary;
                 mask = strips.fragment[mask])
              gate_diff -=
                  std::min(-strips.fragment_diff[mask],
                           std::max(0, std::int32_t(boundary -
                                                    strips.identity[mask].coordinates.anchor_diff -
                                                    strips.fragment_start[mask])));
          }
        }
        start = position_of(incoming, gate_diff);
        if (start <= gate_position)
          gate_position =
              Word(std::max<std::int64_t>(start, std::int64_t(gate_position) + gate_diff));
        if (diff > 0 && gate && strips.fragmented[gate] && !strips.fragment_diff[gate]) {
          gate = strips.fragment[gate];
          const auto right = strips.right_jump[incoming];
          if (right && right != gate)
            link_jumps(*this, gate, right, strips.right_jump_frames[incoming] - diff,
                       strips.right_jump_strips[incoming] - 1);
          link_jumps(*this, incoming, gate, Word(diff), 1);
        }
      }
      containment.set(c, incoming);
      if (diff > 0) {
        if (!start)
          head = incoming;
        if (start + Word(diff) == frame_count)
          tail = incoming;
        result.changes.push_back(
            {start, start, {{insertion.content, insertion.content_start, Word(c.diff)}}});
      } else if (diff < 0) {
        auto position = start;
        for (auto mask = incoming; mask; mask = strips.fragment[mask]) {
          if (strips.fragment_diff[mask] < 0)
            result.changes.push_back({position, position - strips.fragment_diff[mask], {}});
          const auto next = strips.fragment[mask];
          if (next)
            for (auto i = strips.right[mask]; i && i != next; i = strips.right[i])
              position += std::max(0, strips.fragment_diff[i]);
        }
      }
      if (!frame_count) {
        gate = none;
        gate_position = 0;
      } else if (!gate) {
        gate = head;
        gate_position = 0;
      } else if (strips.fragment_diff[gate] <= 0)
        find_frame(std::min(gate_position, frame_count - 1));
      if (gate && strips.right_jump[gate]) {
        left_jump_to_patch = gate;
        right_jump_to_patch = strips.right_jump[gate];
      }
      auto released_pending = pending.take(c);
      for (auto it = released_pending.rbegin(); it != released_pending.rend(); ++it)
        queue.push_back(*it);
    }
  }
  return result;
}
} // namespace sequencer
