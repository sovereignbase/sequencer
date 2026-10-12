#include "../class.hpp"
#include <algorithm>

namespace sequencer {
std::vector<Span> Projection::values(Word start, Word end) {
  std::vector<Span> output;
  if (!frame_count || start > end)
    return output;
  auto frame = find_frame(start);
  auto cursor = gate;
  auto remaining = std::int64_t(end) - start + 1;
  while (cursor && remaining > 0) {
    const auto effect = strips.fragment_diff[cursor];
    if (effect > 0) {
      const auto count = Word(std::max<std::int64_t>(
          0, std::min(remaining, std::int64_t(effect) - frame + strips.fragment_start[cursor])));
      if (count)
        output.push_back({strips.identity[cursor].content,
                          strips.identity[cursor].content_start + frame, count});
      remaining -= count;
    }
    const auto next = strips.right[cursor];
    frame = strips.fragment_start[next] +
            Word(std::max<std::int64_t>(0, std::int64_t(frame) - strips.fragment_start[cursor] -
                                               std::max(0, effect)));
    cursor = next;
  }
  return output;
}
} // namespace sequencer
