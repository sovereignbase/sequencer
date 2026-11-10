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
  // A hit within the visible gate needs no walk. Insertion at its first Frame
  // still resolves hidden boundaries through the ordinary traversal below.
  if (gate && position >= gate_position && (!for_insertion || position != gate_position) &&
      strips.fragment_diff[gate] > 0 && position - gate_position < Word(strips.fragment_diff[gate]))
    return strips.fragment_start[gate] + position - gate_position;
  const auto tail_index = frame_count - Word(strips.fragment_diff[tail]);
  // The last visible fragment owns its entire range. Its first insertion
  // boundary can still belong to hidden history and uses the resolution below.
  if (position >= tail_index && position < frame_count &&
      (!for_insertion || position != tail_index)) {
    gate = tail;
    gate_position = tail_index;
    return strips.fragment_start[tail] + position - tail_index;
  }
  std::int64_t index = position, cursor_index = gate_position;
  auto cursor = gate;
  Word after = 0;
  const auto tail_distance = std::abs(std::int64_t(tail_index) - index);
  const auto gate_distance = std::abs(cursor_index - index);
  // Start at the closest known visible reference; structural distance can differ
  // because masks and zero-effect fragments do not advance Projection positions.
  if (index < gate_distance && index <= tail_distance) {
    cursor = head;
    cursor_index = 0;
  } else if (tail_distance < gate_distance) {
    cursor = tail;
    cursor_index = tail_index;
  }
  const auto spacing = traversal_spacing();
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
      if (for_insertion && !after && index == cursor_index && strips.identity[cursor].offset) {
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
            !strips.identity[strips.left[m]].offset;
        const bool adjoining_mask =
            mask &&
            strips.identity[m].coordinates.anchor_session ==
                strips.identity[c].coordinates.session &&
            strips.identity[m].coordinates.anchor_start == strips.identity[c].coordinates.start &&
            strips.identity[m].coordinates.anchor_diff + strips.fragment_start[m] +
                    magnitude(strips.fragment_diff[m]) ==
                strips.fragment_start[c] &&
            strips.left[m] &&
            (strips.fragment_diff[strips.left[m]] == 0 ||
             strips.identity[strips.left[m]].coordinates.session !=
                 strips.identity[c].coordinates.session ||
             strips.identity[strips.left[m]].coordinates.start !=
                 strips.identity[c].coordinates.start);
        if ((original_zero || adjoining_mask || strips.fragment_start[c] == 0 ||
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
      gate = cursor;
      gate_position = Word(cursor_index);
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
        // Jump only when its visible destination cannot overshoot the requested Frame.
        if (destination <= index && distance > 1) {
          cursor = jump;
          cursor_index = destination;
          continue;
        }
      }
      cursor = walk;
      cursor_index = walk_index;
      ++steps;
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
        if (index <= destination && distance > 1) {
          cursor = jump;
          cursor_index = destination;
          continue;
        }
      }
      cursor = walk;
      cursor_index = walk_index;
      --steps;
    }
  }
  throw std::runtime_error("Visible position has no owner");
}
} // namespace sequencer
