/**
 * @file
 * Translates visible positions to original Frame coordinates and maintains local jumps.
 */
#include "../class.hpp"
#include "linkJumps.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Word Projection::find_frame(Word position, bool for_insertion) {
  std::int64_t index = position, cursor_index = gate_position;
  auto cursor = gate;
  Word after = 0;
  auto patch_left = left_jump_to_patch, patch_right = right_jump_to_patch;
  const auto tail_index = std::int64_t(frame_count) - strips.fragment_diff[tail];
  const auto tail_distance = std::abs(tail_index - index);
  const auto gate_distance = std::abs(cursor_index - index);
  // Start at the closest known visible reference; structural distance can differ
  // because masks and zero-effect fragments do not advance Projection positions.
  if (index < gate_distance && index <= tail_distance) {
    cursor = head;
    cursor_index = 0;
    patch_left = cursor;
    patch_right = strips.right_jump[cursor];
  } else if (tail_distance < gate_distance) {
    cursor = tail;
    cursor_index = tail_index;
    patch_left = strips.left_jump[cursor];
    patch_right = cursor;
  }
  const auto spacing = Word(std::round(std::sqrt(structural_count)));
  auto jump_start = cursor;
  auto jump_index = cursor_index;
  std::int32_t steps = 0;
  while (cursor) {
    if (strips.left_jump[cursor] || strips.right_jump[cursor]) {
      jump_start = cursor;
      jump_index = cursor_index;
      steps = 0;
    }
    const auto length = std::max(0, strips.fragment_diff[cursor]);
    if (cursor_index <= index && index < cursor_index + length) {
      // A visible fragment start can conceal an earlier stable mask boundary.
      // Insertion resolution may choose that history; ordinary reads stay on visible content.
      if (for_insertion && !after && index == cursor_index && strips.offset[cursor]) {
        const auto mask = strips.left[cursor];
        const auto m = mask;
        const auto c = cursor;
        const bool original_zero =
            mask && strips.identity[m].coordinates.diff < 0 &&
            strips.identity[m].coordinates.anchor_diff == 0 &&
            strips.identity[m].coordinates.anchor_session ==
                strips.identity[c].coordinates.session &&
            strips.identity[m].coordinates.anchor_start == strips.identity[c].coordinates.start &&
            strips.left[m] &&
            strips.identity[strips.left[m]].coordinates.session ==
                strips.identity[m].coordinates.anchor_session &&
            strips.identity[strips.left[m]].coordinates.start ==
                strips.identity[m].coordinates.anchor_start &&
            !strips.offset[strips.left[m]];
        if ((original_zero || strips.fragment_start[c] == 0 ||
             (index == 0 && (strips.identity[m].coordinates.anchor_session !=
                                 strips.identity[c].coordinates.session ||
                             strips.identity[m].coordinates.anchor_start !=
                                 strips.identity[c].coordinates.start))) &&
            mask && strips.identity[m].coordinates.diff < 0) {
          if (original_zero && (strips.left_jump[m] || strips.right_jump[m])) {
            jump_start = mask;
            jump_index = cursor_index;
            steps = 1;
          }
          after = original_zero ? 0 : magnitude(strips.fragment_diff[m]);
          cursor = original_zero ? strips.left[m] : mask;
          steps = strips.left_jump[cursor] || strips.right_jump[cursor]
                      ? 0
                      : steps - (original_zero ? 2 : 1);
        } else if (index > 0) {
          --index;
          after = 1;
          continue;
        }
      }
      // Split the enclosing jump using distances from the walk already completed.
      if (steps > 0) {
        const auto right = strips.right_jump[jump_start];
        const auto frames = Word(cursor_index - jump_index);
        if (right)
          link_jumps(*this, cursor, right, strips.right_jump_frames[jump_start] - frames,
                     strips.right_jump_strips[jump_start] - steps);
        link_jumps(*this, jump_start, cursor, frames, Word(steps));
      } else if (steps < 0) {
        const auto left = strips.left_jump[jump_start];
        const auto frames = Word(jump_index - cursor_index);
        if (left)
          link_jumps(*this, left, cursor, strips.left_jump_frames[jump_start] - frames,
                     strips.left_jump_strips[jump_start] + steps);
        link_jumps(*this, cursor, jump_start, frames, Word(-steps));
      }
      if (strips.right_jump[cursor]) {
        patch_left = cursor;
        patch_right = strips.right_jump[cursor];
      } else if (cursor == patch_right)
        patch_left = patch_right = none;
      gate = cursor;
      gate_position = Word(cursor_index);
      left_jump_to_patch = patch_left;
      right_jump_to_patch = patch_right;
      // Return original coordinates; content_start maps those coordinates to JavaScript slots.
      return Word(strips.fragment_start[cursor] + index - cursor_index + after);
    }
    if (cursor_index <= index) {
      const auto walk = strips.right[cursor];
      const auto walk_index = cursor_index + length;
      auto jump = strips.right_jump[cursor];
      if (jump && cursor_index >= 0) {
        auto frames = strips.right_jump_frames[cursor], distance = strips.right_jump_strips[cursor];
        // Coalesce short adjacent jumps while retaining visible head/tail boundaries.
        if (distance < spacing && jump != head && jump != tail) {
          const auto next = strips.right_jump[jump];
          if (next && strips.right_jump_strips[jump] <= spacing - distance) {
            frames += strips.right_jump_frames[jump];
            distance += strips.right_jump_strips[jump];
            link_jumps(*this, cursor, next, frames, distance);
            jump = next;
          }
        }
        const auto destination = cursor_index + frames;
        if (cursor_index <= index && index <= destination) {
          patch_left = cursor;
          patch_right = jump;
        }
        // Jump only when its visible destination cannot overshoot the requested Frame.
        if (destination <= index && distance > 1) {
          cursor = jump;
          cursor_index = destination;
          patch_left = patch_right = none;
          continue;
        }
      }
      if (jump) {
        patch_left = cursor;
        patch_right = jump;
      }
      cursor = walk;
      cursor_index = walk_index;
      ++steps;
      if (cursor == patch_right)
        patch_left = patch_right = none;
    } else {
      const auto walk = strips.left[cursor];
      const auto walk_index = cursor_index - std::max(0, strips.fragment_diff[walk]);
      auto jump = strips.left_jump[cursor];
      if (jump) {
        auto frames = strips.left_jump_frames[cursor], distance = strips.left_jump_strips[cursor];
        if (distance < spacing && jump != head && jump != tail) {
          const auto next = strips.left_jump[jump];
          if (next && strips.left_jump_strips[jump] <= spacing - distance) {
            frames += strips.left_jump_frames[jump];
            distance += strips.left_jump_strips[jump];
            link_jumps(*this, next, cursor, frames, distance);
            jump = next;
          }
        }
        const auto destination = cursor_index - frames;
        if (destination <= index && index <= cursor_index) {
          patch_left = jump;
          patch_right = cursor;
        }
        if (index <= destination && distance > 1) {
          cursor = jump;
          cursor_index = destination;
          patch_left = patch_right = none;
          continue;
        }
      }
      if (jump) {
        patch_left = jump;
        patch_right = cursor;
      }
      cursor = walk;
      cursor_index = walk_index;
      --steps;
      if (cursor == patch_left)
        patch_left = patch_right = none;
    }
  }
  throw std::runtime_error("Visible position has no owner");
}
} // namespace sequencer
