#include "../class.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Index Projection::split_strip(Index a, Word point, std::int32_t incoming_diff) {
  if (incoming_diff < 0)
    own_content(a);
  // Copy before arena growth: indices survive relocation, C++ references do not.
  const auto original = strips.identity[a];
  const auto old_fragment = strips.fragment[a], old_right = strips.right[a];
  const auto effect = strips.fragment_diff[a];
  if (incoming_diff < 0 && original.content)
    released.push_back(
        {original.content, original.content_start + point, magnitude(incoming_diff)});
  const auto left_diff = (effect < 0 ? -1 : 1) * std::int32_t(point - strips.fragment_start[a]);
  const auto right_diff = effect - left_diff + std::min(0, incoming_diff);
  strips.fragmented[a] = true;
  strips.fragment_diff[a] = left_diff;
  if (!right_diff)
    return old_right;
  const auto right = allocate(original);
  strips.fragment[right] = old_fragment;
  strips.fragment_start[right] = point + (incoming_diff < 0 ? magnitude(incoming_diff) : 0);
  strips.fragment_diff[right] = right_diff;
  strips.fragmented[right] = strips.offset[right] = true;
  strips.left[right] = a;
  strips.right[right] = old_right;
  strips.fragment[a] = strips.right[a] = right;
  if (old_right)
    strips.left[old_right] = right;
  if (tail == a)
    tail = right;
  ++structural_count;
  return right;
}
} // namespace sequencer
