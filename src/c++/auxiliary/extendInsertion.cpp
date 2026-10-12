#include "../class.hpp"
#include "containsAnchor.hpp"
#include <algorithm>

namespace sequencer {
Word Projection::extend(Index origin, Word count, Word content, Word source_start) {
  const auto original = strips.identity[origin];
  const auto end = Word(original.coordinates.diff);
  auto last = origin;
  while (strips.fragment[last])
    last = strips.fragment[last];
  appended.push_back({original.content, content, source_start, count, end});
  if (content)
    released.push_back({content, 0, 0});
  const auto next = strips.right[last];
  if ((last == tail || (!strips.fragmented[origin] &&
                        (!next || !contains_anchor(original.coordinates,
                                                   strips.identity[next].coordinates, 0, end)))) &&
      strips.fragment_diff[last] > 0 &&
      strips.fragment_start[last] + Word(strips.fragment_diff[last]) == end) {
    const auto at =
        last == tail ? frame_count : position_of(last) + Word(strips.fragment_diff[last]);
    gate = last;
    gate_position = at - Word(strips.fragment_diff[last]);
    left_jump_to_patch = last;
    right_jump_to_patch = strips.right_jump[last];
    strips.fragment_diff[last] += std::int32_t(count);
    frame_count += count;
    const auto right = strips.right_jump[last];
    if (right) {
      strips.right_jump_frames[last] += count;
      strips.left_jump_frames[right] += count;
    }
    for (auto fragment = origin; fragment; fragment = strips.fragment[fragment])
      strips.identity[fragment].coordinates.diff += std::int32_t(count);
    return at;
  }

  const Coordinates suffix{
      original.coordinates.session, original.coordinates.start,       end,
      original.coordinates.session, original.coordinates.start + end, std::int32_t(count)};
  const auto incoming = allocate({suffix, original.content});
  const auto [point, anchor] = find_containing_fragment(origin, incoming);
  auto grown = original;
  grown.coordinates.diff += std::int32_t(count);
  strips.identity[incoming] = grown;
  strips.fragment_start[incoming] = end;
  strips.fragment_diff[incoming] = std::int32_t(count);
  strips.offset[incoming] = strips.fragmented[incoming] = true;
  const auto previous_count = structural_count;
  anchor_strip(incoming, anchor, point, true);
  for (auto fragment = origin; fragment; fragment = strips.fragment[fragment]) {
    strips.identity[fragment].coordinates.diff = grown.coordinates.diff;
    strips.fragmented[fragment] = true;
  }
  strips.fragment[last] = incoming;
  patch_jumps(std::int32_t(count), structural_count - previous_count, incoming);
  const auto at = position_of(incoming, std::int32_t(count));
  if (gate && at <= gate_position)
    gate_position += count;
  if (at == 0)
    head = incoming;
  if (at + count == frame_count)
    tail = incoming;
  gate = incoming;
  gate_position = at;
  left_jump_to_patch = incoming;
  right_jump_to_patch = strips.right_jump[incoming];
  return at;
}
} // namespace sequencer
