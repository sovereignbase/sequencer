/**
 * @file
 * Resolves visible ranges to ordered binding spans without reading application values.
 */
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
void Projection::values(Word start, Word end, std::vector<Span> &output) {
  output.clear();
  if (tuple) {
    if (!frame_count || start >= frame_count || start > end)
      return;
    end = std::min(end, frame_count - 1);
    for (Word at = start; at <= end; ++at) {
      const auto span = tuple->value(at);
      if (!output.empty() && output.back().content == span.content &&
          (!span.content || output.back().start + output.back().count == span.start))
        ++output.back().count;
      else
        output.push_back(span);
    }
    return;
  }
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
