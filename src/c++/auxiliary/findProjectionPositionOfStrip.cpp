/**
 * @file
 * Finds a linked Strip's visible boundary without resetting the retained local gate.
 */
#include "../class.hpp"
#include "linkJumps.hpp"
#include <algorithm>
#include <optional>

namespace sequencer {
Word Projection::position_of(Index target, std::int32_t gate_diff, bool locate) {
  auto left = target, right = target;
  Word left_frames = 0, right_frames = 0, left_distance = 0, right_distance = 0;
  Index left_jump = none, right_jump = none;
  Word left_jumped = 0, right_jumped = 0;
  std::optional<Word> known;
  const auto spacing = traversal_spacing();
  bool found_left = !strips.left[left], found_right = !strips.right[right];
  // Walk outwards until each side reaches an indexed or visible endpoint.
  // Distances count positive effects only; structural steps also count hidden nodes.
  while (!found_left || !found_right) {
    if (!found_left) {
      left = strips.left[left];
      left_frames += std::max(0, strips.fragment_diff[left]);
      ++left_distance;
      if (left == gate)
        known = gate_position + left_frames;
      if (left_distance == spacing) {
        left_jump = left;
        left_jumped = left_frames;
      }
      found_left = left == head || left == tail || !strips.left[left] || strips.right_jump[left] ||
                   strips.left_jump[left];
    }
    if (!found_right) {
      right_frames += std::max(0, strips.fragment_diff[right]);
      right = strips.right[right];
      ++right_distance;
      // The edit is already linked, but the retained gate position is from before it.
      if (right == gate)
        known = gate_position + gate_diff - right_frames;
      if (right_distance == spacing) {
        right_jump = right;
        right_jumped = right_frames;
      }
      found_right = right == head || right == tail || !strips.right[right] ||
                    strips.left_jump[right] || strips.right_jump[right];
    }
  }
  // Index the resolved boundary using the work already done; long spans split near sqrt(count).
  if (left != target) {
    if (left_distance >= spacing * 2) {
      link_jumps(*this, left, left_jump, left_frames - left_jumped, left_distance - spacing);
      link_jumps(*this, left_jump, target, left_jumped, spacing);
    } else
      link_jumps(*this, left, target, left_frames, left_distance);
  }
  if (right != target) {
    if (right_distance >= spacing * 2) {
      link_jumps(*this, target, right_jump, right_jumped, spacing);
      link_jumps(*this, right_jump, right, right_frames - right_jumped, right_distance - spacing);
    } else
      link_jumps(*this, target, right, right_frames, right_distance);
  }
  left_jump_to_patch = target;
  right_jump_to_patch = strips.right_jump[target];
  // Index maintenance callers do not consume an absolute visible position.
  if (!locate)
    return 0;
  if (right == head && target != head)
    return 0;
  if (left == tail && target != tail)
    return frame_count - std::max(0, strips.fragment_diff[target]);
  if (known)
    return *known;
  // Endpoint distances establish absolute visible positions; further search uses jumps.
  while (true) {
    if (left == head)
      return left_frames;
    if (right == head)
      return 0;
    if (left == tail)
      return frame_count - std::max(0, strips.fragment_diff[target]);
    if (right == tail)
      return frame_count - std::max(0, strips.fragment_diff[right]) - right_frames;
    if (!strips.left[left])
      return left_frames;
    if (!strips.right[right])
      return frame_count - std::max(0, strips.fragment_diff[right]) - right_frames;
    const auto lj = strips.left_jump[left];
    if (lj) {
      auto frames = strips.left_jump_frames[left], distance = strips.left_jump_strips[left];
      const auto next = strips.left_jump[lj];
      if (distance < spacing && lj != head && lj != tail && lj != gate && next &&
          strips.left_jump_strips[lj] <= spacing - distance) {
        frames += strips.left_jump_frames[lj];
        distance += strips.left_jump_strips[lj];
        link_jumps(*this, next, left, frames, distance);
        left = next;
      } else
        left = lj;
      left_frames += frames;
    } else {
      left = strips.left[left];
      left_frames += std::max(0, strips.fragment_diff[left]);
    }
    const auto rj = strips.right_jump[right];
    if (rj) {
      auto frames = strips.right_jump_frames[right], distance = strips.right_jump_strips[right];
      const auto next = strips.right_jump[rj];
      if (distance < spacing && rj != head && rj != tail && rj != gate && next &&
          strips.right_jump_strips[rj] <= spacing - distance) {
        frames += strips.right_jump_frames[rj];
        distance += strips.right_jump_strips[rj];
        link_jumps(*this, right, next, frames, distance);
        right = next;
      } else
        right = rj;
      right_frames += frames;
    } else {
      right_frames += std::max(0, strips.fragment_diff[right]);
      right = strips.right[right];
    }
  }
}
} // namespace sequencer
