/**
 * @file
 * Splits runtime materialization while preserving original coordinates and Footage identity.
 */
#include "../class.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Index Projection::split_strip(Index a, Word point, std::int32_t incoming_diff, bool indexed) {
  // Masking may clear content slots, so detach externally owned Footage first.
  if (incoming_diff < 0)
    own_content(a);
  // Copy before arena growth: indices survive relocation, C++ references do not.
  const auto original = strips.identity[a];
  const auto old_fragment = strips.fragment[a], old_right = strips.right[a];
  const auto effect = strips.fragment_diff[a];
  if (incoming_diff < 0 && original.content)
    released.push_back(
        {original.content, original.content_start + point, magnitude(incoming_diff)});
  // The consumed prefix disappears from the right fragment's visible effect;
  // fragment_start still addresses the original Insertion's coordinate space.
  const auto left_diff = (effect < 0 ? -1 : 1) * std::int32_t(point - strips.fragment_start[a]);
  const auto right_diff = effect - left_diff + std::min(0, incoming_diff);
  strips.identity[a].fragmented = true;
  strips.fragment_diff[a] = left_diff;
  if (!right_diff) {
    if (indexed)
      traversal.update(strips, a, effect);
    return old_right;
  }
  const auto right = allocate(original);
  strips.fragment[right] = old_fragment;
  strips.fragment_start[right] = point + (incoming_diff < 0 ? magnitude(incoming_diff) : 0);
  strips.fragment_diff[right] = right_diff;
  strips.identity[right].fragmented = strips.identity[right].offset = true;
  strips.left[right] = a;
  strips.right[right] = old_right;
  // Fragment links track common identity; structural links also include intervening children.
  strips.fragment[a] = strips.right[a] = right;
  if (old_right)
    strips.left[old_right] = right;
  if (head == a && !left_diff && right_diff > 0)
    head = right;
  if (tail == a)
    tail = right;
  ++structural_count;
  // Both fragments share one block until insertion splits it; update only their net weight.
  if (indexed)
    traversal.insert(strips, structural_head, structural_count, right,
                     Word(std::max(0, effect) - std::max(0, left_diff)));
  return right;
}
} // namespace sequencer
