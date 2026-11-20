#pragma once
#include "../types/type.hpp"
#include <algorithm>

namespace sequencer {
/** Appends immutable Footage ranges, preserving unacknowledged gaps as missing Frames. */
[[gnu::noinline]] inline void append_text_spans(const Strips &strips, Index root, Word start,
                                                Word count, Index &fragment,
                                                std::vector<Span> &footage) {
  const auto end = start + count;
  while (start < end) {
    while (fragment &&
           strips.fragment_start[fragment] + Word(std::max(0, strips.fragment_diff[fragment])) <=
               start)
      fragment = strips.fragment[fragment];
    const auto visible = fragment && start >= strips.fragment_start[fragment];
    const auto boundary =
        !fragment ? end
        : visible ? strips.fragment_start[fragment] + Word(strips.fragment_diff[fragment])
                  : strips.fragment_start[fragment];
    const auto size = std::min(end, boundary) - start;
    const auto token = visible ? strips.identity[root].content : 0;
    const auto offset = visible ? strips.identity[root].content_start + start : 0;
    if (!footage.empty() && footage.back().content == token &&
        (!token || footage.back().start + footage.back().count == offset))
      footage.back().count += size;
    else
      footage.push_back({token, offset, size});
    start += size;
  }
}
} // namespace sequencer
