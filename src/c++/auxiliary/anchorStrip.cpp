#include "../class.hpp"
#include "anchorsOverlap.hpp"
#include "competitionIsLarger.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
std::int32_t Projection::anchor_strip(Index incoming, Index anchor, Word point) {
  const auto removal_end = strips[incoming].coordinates.anchor_diff - strips[incoming].coordinates.diff;
  std::int32_t total = 0;
  while (true) {
    auto left = anchor;
    Index right = none;
    auto diff = strips[incoming].effect();
    if (strips[incoming].coordinates.diff < 0 && strips[anchor].coordinates.diff > 0) {
      const auto available = std::max<std::int64_t>(0, std::int64_t(strips[anchor].fragment_start) + strips[anchor].effect() - point);
      diff = -std::int32_t(std::min<std::int64_t>(-std::int64_t(diff), available));
      strips[incoming].fragmented = true;
      strips[incoming].fragment_diff = diff;
    }
    if (strips[incoming].coordinates.diff < 0 && diff == 0)
      point = std::clamp(point, strips[anchor].fragment_start, strips[anchor].fragment_start + magnitude(strips[anchor].effect()));
    if (anchor) {
      right = point == strips[anchor].fragment_start + magnitude(strips[anchor].effect())
        ? strips[anchor].right : split_strip(anchor, point, diff);
    } else right = structural_head;
    const auto c = strips[incoming].coordinates;
    if (c.diff > 0 && anchor && strips[anchor].coordinates.diff < 0 &&
        c.anchor_session == strips[anchor].coordinates.session && c.anchor_start == strips[anchor].coordinates.start && right &&
        strips[right].coordinates.anchor_session == strips[anchor].coordinates.anchor_session &&
        strips[right].coordinates.anchor_start == strips[anchor].coordinates.anchor_start &&
        strips[right].coordinates.anchor_diff == strips[anchor].coordinates.anchor_diff + c.anchor_diff) {
      while (strips[right].competitor) right = strips[right].competitor;
      left = subtree_end(right);
      right = strips[left].right;
    }
    while (right && strips[right].effect() == 0 && strips[right].coordinates.anchor_session == c.anchor_session &&
           strips[right].coordinates.anchor_start == c.anchor_start && strips[right].coordinates.anchor_diff < c.anchor_diff) {
      left = right;
      right = strips[right].right;
    }
    if (right && anchors_overlap(strips[incoming], strips[right])) {
      Index larger = none;
      auto smaller = right;
      while (smaller && competition_is_larger(strips[incoming], strips[smaller])) {
        larger = smaller;
        smaller = strips[smaller].competitor;
      }
      strips[incoming].competitor = smaller;
      if (larger) {
        strips[larger].competitor = incoming;
        left = subtree_end(larger);
        right = strips[left].right;
      } else {
        right = smaller;
        left = strips[smaller].left;
      }
    }
    strips[incoming].left = left;
    strips[incoming].right = right;
    if (left) strips[left].right = incoming;
    else structural_head = incoming;
    if (right) strips[right].left = incoming;
    if (diff > 0) {
      if (!head || !left || right == head) head = incoming;
      if (!tail || !right || left == tail) tail = incoming;
    }
    while (head && strips[head].effect() <= 0) {
      if (strips[head].right_jump && strips[head].right_jump_frames > 0) {
        strips[strips[head].right_jump].left_jump = none;
        strips[head].right_jump = none;
      }
      head = strips[head].right;
    }
    while (tail && strips[tail].effect() <= 0) {
      if (strips[tail].left_jump && strips[tail].left_jump_frames > 0) {
        strips[strips[tail].left_jump].right_jump = none;
        strips[tail].left_jump = none;
      }
      tail = strips[tail].left_jump && !strips[tail].left_jump_frames ? strips[tail].left_jump : strips[tail].left;
    }
    ++structural_count;
    frame_count += diff;
    total += diff;
    const auto next = anchor && strips[anchor].coordinates.diff > 0 ? strips[anchor].fragment : none;
    if (c.diff >= 0 || !next || strips[next].fragment_start >= removal_end) return total;
    const auto start = strips[next].fragment_start;
    const auto mask = allocate({c, 0});
    strips[mask].offset = strips[mask].fragmented = true;
    strips[mask].fragment_start = start - c.anchor_diff;
    strips[mask].fragment_diff = -std::int32_t(std::min(Word(std::max(0, strips[next].effect())), removal_end - start));
    strips[incoming].fragment = mask;
    incoming = mask;
    anchor = next;
    point = start;
  }
}
}
