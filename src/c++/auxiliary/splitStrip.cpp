#include "../class.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Index Projection::split_strip(Index a, Word point, std::int32_t incoming_diff) {
  // Copy before arena growth: indices survive relocation, C++ references do not.
  const Strip old = strips[a];
  if (incoming_diff < 0 && old.content)
    released.push_back({old.content, point, magnitude(incoming_diff)});
  const auto left_diff = (old.effect() < 0 ? -1 : 1) * std::int32_t(point - old.fragment_start);
  const auto right_diff = old.effect() - left_diff + std::min(0, incoming_diff);
  strips[a].fragmented = true;
  strips[a].fragment_diff = left_diff;
  if (!right_diff)
    return old.right;
  const auto right = allocate({old.coordinates, old.content});
  strips[right].fragment = old.fragment;
  strips[right].fragment_start = point + (incoming_diff < 0 ? magnitude(incoming_diff) : 0);
  strips[right].fragment_diff = right_diff;
  strips[right].fragmented = strips[right].offset = true;
  strips[right].left = a;
  strips[right].right = old.right;
  strips[a].fragment = strips[a].right = right;
  if (old.right)
    strips[old.right].left = right;
  if (tail == a)
    tail = right;
  ++structural_count;
  return right;
}
} // namespace sequencer
