/**
 * @file
 * Materializes a positive Insertion suffix under its existing canonical identity.
 */
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
  // Native state retains one content token. JavaScript appends the new suffix
  // after public Splices have read it, then releases its temporary source binding.
  appended.push_back({original.content, content, source_start, count, end, original.content_start});
  if (content)
    released.push_back({content, 0, 0});
  const auto next = strips.right[last];
  // An intact visible endpoint can grow in place. Existing children or interior
  // fragmentation require replay through the same anchor placement used for normal history.
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
    for (auto fragment = origin; fragment; fragment = strips.fragment[fragment]) {
      strips.identity[fragment].coordinates.diff += std::int32_t(count);
      strips.identity[fragment].content_start = 0;
      strips.identity[fragment].content_owned = true;
    }
    return at;
  }

  // A suffix follows every existing descendant at the old endpoint. It extends
  // the same canonical root and never participates in sibling competition.
  const auto left = subtree_end(origin);
  const auto right = strips.right[left];
  auto grown = original;
  grown.coordinates.diff += std::int32_t(count);
  grown.content_start = 0;
  grown.content_owned = true;
  const auto incoming = allocate(grown);
  strips.fragment_start[incoming] = end;
  strips.fragment_diff[incoming] = std::int32_t(count);
  strips.offset[incoming] = strips.fragmented[incoming] = true;
  strips.left[incoming] = left;
  strips.right[incoming] = right;
  strips.right[left] = incoming;
  if (right)
    strips.left[right] = incoming;
  if (!head || right == head)
    head = incoming;
  if (!tail || !right || left == tail)
    tail = incoming;
  ++structural_count;
  frame_count += count;
  for (auto fragment = origin; fragment; fragment = strips.fragment[fragment]) {
    strips.identity[fragment].coordinates.diff = grown.coordinates.diff;
    strips.identity[fragment].content_start = 0;
    strips.identity[fragment].content_owned = true;
    strips.fragmented[fragment] = true;
  }
  // All fragments share the grown original extent and the rebased private Footage array.
  strips.fragment[last] = incoming;
  patch_jumps(std::int32_t(count), 1, incoming);
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
