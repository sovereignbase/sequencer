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
std::int32_t Projection::anchor_strip(Index incoming, Index anchor, Word point,
                                      bool index_fragments) {
  const auto coordinates = strips.identity[incoming].coordinates;
  auto parent = anchor;
  if (coordinates.diff > 0 && anchor) {
    if (coordinates.anchor_session != strips.identity[anchor].coordinates.session ||
        coordinates.anchor_start != strips.identity[anchor].coordinates.start)
      parent = containment.get(coordinates.anchor_session, coordinates.anchor_start);
    if (parent && strips.identity[parent].coordinates.diff < 0 &&
        (anchor != parent || point != coordinates.anchor_diff ||
         strips.fragment_start[parent] != 0 ||
         strips.fragment_diff[parent] != strips.identity[parent].coordinates.diff)) {
      const auto resolved = find_containing_fragment(parent, coordinates);
      point = resolved.first;
      anchor = resolved.second;
    }
  }
  const auto removal_end = strips.identity[incoming].coordinates.anchor_diff -
                           strips.identity[incoming].coordinates.diff;
  // Keep the authored removal endpoint fixed while runtime fragments consume available Frames.
  std::int32_t total = 0;
  const auto first = incoming;
  while (true) {
    // A continuation can alter a different jump span from the first mask.
    // Make its parent an endpoint before consuming that fragment's Frames.
    if (index_fragments && incoming != first && !strips.left_jump[anchor] &&
        !strips.right_jump[anchor])
      position_of(anchor);
    const auto previous_count = structural_count;
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
    // Zero-effect masks retain identity but cannot hide boundary competitors.
    while (c.diff > 0 && right && strips.identity[right].coordinates.diff < 0 &&
           strips.fragment_diff[right] == 0) {
      left = right;
      right = strips.right[right];
    }
    // At one original boundary, direct children precede mask children. Distinct
    // mask parents retain canonical anchor order, then Session/start competition.
    if (c.diff > 0 && parent && strips.identity[parent].coordinates.diff < 0) {
      const auto p = strips.identity[parent].coordinates;
      const auto boundary = p.anchor_diff + c.anchor_diff;
      while (right && strips.identity[right].coordinates.diff > 0) {
        const auto r = strips.identity[right].coordinates;
        if (r.session == p.anchor_session && r.start == p.anchor_start)
          break;
        bool before = r.anchor_session == p.anchor_session && r.anchor_start == p.anchor_start &&
                      r.anchor_diff == boundary;
        if (!before) {
          const auto other = containment.get(r.anchor_session, r.anchor_start);
          if (!other || other == parent)
            break;
          const auto q = strips.identity[other].coordinates;
          if (q.diff >= 0 || q.anchor_session != p.anchor_session ||
              q.anchor_start != p.anchor_start || q.anchor_diff + r.anchor_diff != boundary)
            break;
          before = q.anchor_diff < p.anchor_diff ||
                   (q.anchor_diff == p.anchor_diff && competition_is_larger(p, q));
        }
        if (!before)
          break;
        left = subtree_end(right);
        right = strips.right[left];
        while (right && strips.identity[right].coordinates.diff < 0 &&
               strips.fragment_diff[right] == 0) {
          left = right;
          right = strips.right[right];
        }
      }
    }
    // Earlier zero-effect siblings may be skipped; same-point siblings must still compete.
    while (right && strips.fragment_diff[right] == 0 &&
           strips.identity[right].coordinates.anchor_session == c.anchor_session &&
           strips.identity[right].coordinates.anchor_start == c.anchor_start &&
           strips.identity[right].coordinates.anchor_diff < c.anchor_diff) {
      left = right;
      right = strips.right[right];
    }
    if (right && right != strips.fragment[anchor] &&
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
    if (index_fragments && incoming != first)
      patch_jumps(diff, structural_count - previous_count, incoming);
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
