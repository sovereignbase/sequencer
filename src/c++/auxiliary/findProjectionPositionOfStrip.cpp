#include "../class.hpp"
#include "linkJumps.hpp"
#include <algorithm>
#include <optional>

namespace sequencer {
Word Projection::position_of(Index target, std::int32_t gate_diff) {
  auto left = target, right = target;
  Word left_frames = 0, right_frames = 0, left_distance = 0, right_distance = 0;
  Index left_jump = none, right_jump = none;
  Word left_jumped = 0, right_jumped = 0;
  std::optional<Word> known;
  const auto spacing = Word(std::round(std::sqrt(structural_count)));
  bool found_left = !strips[left].left, found_right = !strips[right].right;
  while (!found_left || !found_right) {
    if (!found_left) {
      left = strips[left].left;
      left_frames += std::max(0, strips[left].effect());
      ++left_distance;
      if (left == gate)
        known = gate_position + left_frames;
      if (left_distance == spacing) {
        left_jump = left;
        left_jumped = left_frames;
      }
      found_left = left == head || left == tail || !strips[left].left || strips[left].right_jump ||
                   strips[left].left_jump;
    }
    if (!found_right) {
      right_frames += std::max(0, strips[right].effect());
      right = strips[right].right;
      ++right_distance;
      if (right == gate)
        known = gate_position + gate_diff - right_frames;
      if (right_distance == spacing) {
        right_jump = right;
        right_jumped = right_frames;
      }
      found_right = right == head || right == tail || !strips[right].right ||
                    strips[right].left_jump || strips[right].right_jump;
    }
  }
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
  right_jump_to_patch = strips[target].right_jump;
  if (right == head && target != head)
    return 0;
  if (left == tail && target != tail)
    return frame_count - std::max(0, strips[target].effect());
  if (known)
    return *known;
  while (true) {
    if (left == head)
      return left_frames;
    if (right == head)
      return 0;
    if (left == tail)
      return frame_count - std::max(0, strips[target].effect());
    if (right == tail)
      return frame_count - std::max(0, strips[right].effect()) - right_frames;
    if (!strips[left].left)
      return left_frames;
    if (!strips[right].right)
      return frame_count - std::max(0, strips[right].effect()) - right_frames;
    const auto lj = strips[left].left_jump;
    if (lj) {
      auto frames = strips[left].left_jump_frames, distance = strips[left].left_jump_strips;
      const auto next = strips[lj].left_jump;
      if (distance < spacing && lj != head && lj != tail && lj != gate && next &&
          strips[lj].left_jump_strips <= spacing - distance) {
        frames += strips[lj].left_jump_frames;
        distance += strips[lj].left_jump_strips;
        link_jumps(*this, next, left, frames, distance);
        left = next;
      } else
        left = lj;
      left_frames += frames;
    } else {
      left = strips[left].left;
      left_frames += std::max(0, strips[left].effect());
    }
    const auto rj = strips[right].right_jump;
    if (rj) {
      auto frames = strips[right].right_jump_frames, distance = strips[right].right_jump_strips;
      const auto next = strips[rj].right_jump;
      if (distance < spacing && rj != head && rj != tail && rj != gate && next &&
          strips[rj].right_jump_strips <= spacing - distance) {
        frames += strips[rj].right_jump_frames;
        distance += strips[rj].right_jump_strips;
        link_jumps(*this, right, next, frames, distance);
        right = next;
      } else
        right = rj;
      right_frames += frames;
    } else {
      right_frames += std::max(0, strips[right].effect());
      right = strips[right].right;
    }
  }
}
} // namespace sequencer
