/**
 * @file
 * Maps surviving original Frame intervals onto packed JavaScript Footage.
 */
#include "../class.hpp"

namespace sequencer {
void Projection::restore_content(const std::vector<ContentRanges> &ranges, bool external) {
  for (const auto &layout : ranges) {
    const auto root = containment.get(layout.session, layout.start);
    if (!root)
      continue;
    content_ranges[identity(layout.session, layout.start)] = layout.frames;
    Word offset = 0;
    std::size_t range = 0;
    for (auto fragment = root; fragment; fragment = strips.fragment[fragment]) {
      const auto start = strips.fragment_start[fragment];
      while (range < layout.frames.size() &&
             layout.frames[range].start + layout.frames[range].count <= start) {
        offset += layout.frames[range].count;
        ++range;
      }
      // The canonical root also retains the physical binding origin for copy-on-write.
      strips.identity[fragment].content_start =
          fragment == root
              ? layout.base
              : layout.base + offset -
                    (range < layout.frames.size() ? layout.frames[range].start : start);
      if (fragment == root && strips.fragment_diff[fragment] > 0 && range < layout.frames.size())
        strips.identity[fragment].content_start -= layout.frames[range].start;
    }
  }
  if (external)
    for (auto fragment = structural_head; fragment; fragment = strips.right[fragment])
      strips.identity[fragment].content_owned = false;
}

void Projection::clear_content(Index root) {
  const auto length = strips.identity[root].content_length;
  Word at = 0;
  for (auto fragment = root; fragment; fragment = strips.fragment[fragment]) {
    if (strips.fragment_diff[fragment] <= 0)
      continue;
    const auto start = strips.identity[fragment].content_start + strips.fragment_start[fragment] -
                       strips.identity[root].content_start;
    if (start > at) {
      own_content(root);
      released.push_back(
          {strips.identity[root].content, strips.identity[root].content_start + at, start - at});
    }
    at = start + Word(strips.fragment_diff[fragment]);
  }
  if (at < length) {
    own_content(root);
    released.push_back(
        {strips.identity[root].content, strips.identity[root].content_start + at, length - at});
  }
}
} // namespace sequencer
