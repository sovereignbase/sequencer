#pragma once
#include "../types/type.hpp"
#include <algorithm>

namespace sequencer {
/** Coalesces adjacent ranges of one JavaScript Footage binding. */
inline void append_footage(std::vector<Span> &footage, Span span) {
  if (!footage.empty() && footage.back().content == span.content &&
      (!span.content || footage.back().start + footage.back().count == span.start))
    footage.back().count += span.count;
  else
    footage.push_back(span);
}
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
    append_footage(footage, {token, offset, size});
    start += size;
  }
}
} // namespace sequencer
