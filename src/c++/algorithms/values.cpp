/**
 * @file
 * Resolves visible ranges to ordered binding spans without reading application values.
 */
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
std::vector<Span> Projection::values(Word start, Word end) {
  std::vector<Span> output;
  values(start, end, output);
  return output;
}
void Projection::values(Word start, Word end, std::vector<Span> &output) {
  output.clear();
  if (!frame_count || start > end)
    return;
  auto frame = find_frame(start);
  auto cursor = gate;
  auto remaining = std::int64_t(end) - start + 1;
  while (cursor && remaining > 0) {
    const auto effect = strips.fragment_diff[cursor];
    // Only positive runtime effects contribute visible Frames; hidden masks stay in the walk.
    if (effect > 0) {
      const auto count = Word(std::max<std::int64_t>(
          0, std::min(remaining, std::int64_t(effect) - frame + strips.fragment_start[cursor])));
      if (count)
        output.push_back({strips.identity[cursor].content,
                          strips.identity[cursor].content_start + frame, count});
      remaining -= count;
    }
    const auto next = strips.right[cursor];
    // Carry any unconsumed original offset into the next fragment's coordinate space.
    frame = strips.fragment_start[next] +
            Word(std::max<std::int64_t>(0, std::int64_t(frame) - strips.fragment_start[cursor] -
                                               std::max(0, effect)));
    cursor = next;
  }
}
} // namespace sequencer
