/**
 * @file
 * Resolves sibling competition, original-Frame masking and causal subtree placement.
 */
#include "../class.hpp"
#include "anchorsOverlap.hpp"
#include "competitionIsLarger.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
std::int32_t Projection::anchor_strip(Index incoming, Index anchor, Word point, bool continuation) {
  const auto removal_end = strips.identity[incoming].coordinates.anchor_diff -
                           strips.identity[incoming].coordinates.diff;
  // Keep the authored removal endpoint fixed while runtime fragments consume available Frames.
  std::int32_t total = 0;
  while (true) {
    auto left = anchor;
    Index right = none;
    auto diff = strips.fragment_diff[incoming];
    if (strips.identity[incoming].coordinates.diff < 0 &&
        strips.identity[anchor].coordinates.diff > 0) {
      // Overlapping masks consume only the target fragment's surviving suffix.
      const auto available = std::max<std::int64_t>(0, std::int64_t(strips.fragment_start[anchor]) +
                                                           strips.fragment_diff[anchor] - point);
      diff = -std::int32_t(std::min<std::int64_t>(-std::int64_t(diff), available));
      strips.fragmented[incoming] = true;
      strips.fragment_diff[incoming] = diff;
    }
    // A fully overlapped mask still has identity and descendants; clamp only its placement.
    if (strips.identity[incoming].coordinates.diff < 0 && diff == 0)
      point = std::clamp(point, strips.fragment_start[anchor],
                         strips.fragment_start[anchor] + magnitude(strips.fragment_diff[anchor]));
    if (anchor) {
      right = point == strips.fragment_start[anchor] + magnitude(strips.fragment_diff[anchor])
                  ? strips.right[anchor]
                  : split_strip(anchor, point, diff);
    } else
      right = structural_head;
    const auto c = strips.identity[incoming].coordinates;
    // Original-boundary children precede mask children at that same historical point.
    if (c.diff > 0 && anchor && strips.identity[anchor].coordinates.diff < 0 &&
        c.anchor_session == strips.identity[anchor].coordinates.session &&
        c.anchor_start == strips.identity[anchor].coordinates.start && right &&
        strips.identity[right].coordinates.anchor_session ==
            strips.identity[anchor].coordinates.anchor_session &&
        strips.identity[right].coordinates.anchor_start ==
            strips.identity[anchor].coordinates.anchor_start &&
        strips.identity[right].coordinates.anchor_diff ==
            strips.identity[anchor].coordinates.anchor_diff + c.anchor_diff) {
      while (strips.competitor[right])
        right = strips.competitor[right];
      left = subtree_end(right);
      right = strips.right[left];
    }
    // Earlier zero-effect siblings may be skipped; same-point siblings must still compete.
    while (right && strips.fragment_diff[right] == 0 &&
           strips.identity[right].coordinates.anchor_session == c.anchor_session &&
           strips.identity[right].coordinates.anchor_start == c.anchor_start &&
           strips.identity[right].coordinates.anchor_diff < c.anchor_diff) {
      left = right;
      right = strips.right[right];
    }
    // An extension remains part of its parent rather than competing as a new
    // root. Preserve already attached child subtrees before its new suffix.
    if (continuation) {
      const auto &parent = strips.identity[incoming].coordinates;
      while (right && strips.identity[right].coordinates.anchor_session == parent.session &&
             strips.identity[right].coordinates.anchor_start == parent.start) {
        left = subtree_end(right);
        right = strips.right[left];
      }
    }
    if (!continuation && right &&
        anchors_overlap(strips.identity[incoming].coordinates,
                        strips.identity[right].coordinates)) {
      Index larger = none;
      auto smaller = right;
      while (smaller && competition_is_larger(strips.identity[incoming].coordinates,
                                              strips.identity[smaller].coordinates)) {
        larger = smaller;
        smaller = strips.competitor[smaller];
      }
      // Sibling links order exact-anchor competitors; structural links skip whole subtrees.
      strips.competitor[incoming] = smaller;
      if (larger) {
        strips.competitor[larger] = incoming;
        left = subtree_end(larger);
        right = strips.right[left];
      } else {
        right = smaller;
        left = strips.left[smaller];
      }
    }
    strips.left[incoming] = left;
    strips.right[incoming] = right;
    if (left)
      strips.right[left] = incoming;
    else
      structural_head = incoming;
    if (right)
      strips.left[right] = incoming;
    if (diff > 0) {
      if (!head || !left || right == head)
        head = incoming;
      if (!tail || !right || left == tail)
        tail = incoming;
    }
    // Visible endpoints exclude hidden history; jumps crossing newly hidden endpoints are detached.
    while (head && strips.fragment_diff[head] <= 0) {
      if (strips.right_jump[head] && strips.right_jump_frames[head] > 0) {
        strips.left_jump[strips.right_jump[head]] = none;
        strips.right_jump[head] = none;
      }
      head = strips.right[head];
    }
    while (tail && strips.fragment_diff[tail] <= 0) {
      if (strips.left_jump[tail] && strips.left_jump_frames[tail] > 0) {
        strips.right_jump[strips.left_jump[tail]] = none;
        strips.left_jump[tail] = none;
      }
      tail = strips.left_jump[tail] && !strips.left_jump_frames[tail] ? strips.left_jump[tail]
                                                                      : strips.left[tail];
    }
    ++structural_count;
    frame_count += diff;
    total += diff;
    const auto next =
        anchor && strips.identity[anchor].coordinates.diff > 0 ? strips.fragment[anchor] : none;
    if (c.diff >= 0 || !next || strips.fragment_start[next] >= removal_end)
      return total;
    // One canonical removal can have several runtime mask fragments. Their
    // offsets are relative to the removal, while each targets original parent Frames.
    const auto start = strips.fragment_start[next];
    const auto mask = allocate({c, 0});
    strips.offset[mask] = strips.fragmented[mask] = true;
    strips.fragment_start[mask] = start - c.anchor_diff;
    strips.fragment_diff[mask] =
        -std::int32_t(std::min(Word(std::max(0, strips.fragment_diff[next])), removal_end - start));
    strips.fragment[incoming] = mask;
    incoming = mask;
    anchor = next;
    point = start;
  }
}
} // namespace sequencer
