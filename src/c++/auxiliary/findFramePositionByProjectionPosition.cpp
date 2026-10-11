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
  const auto tail_index = std::int64_t(frame_count) - strips[tail].effect();
  const auto tail_distance = std::abs(tail_index - index);
  const auto gate_distance = std::abs(cursor_index - index);
  if (index < gate_distance && index <= tail_distance) {
    cursor = head; cursor_index = 0;
    patch_left = cursor; patch_right = strips[cursor].right_jump;
  } else if (tail_distance < gate_distance) {
    cursor = tail; cursor_index = tail_index;
    patch_left = strips[cursor].left_jump; patch_right = cursor;
  }
  const auto spacing = Word(std::round(std::sqrt(structural_count)));
  auto jump_start = cursor;
  auto jump_index = cursor_index;
  std::int32_t steps = 0;
  while (cursor) {
    if (strips[cursor].left_jump || strips[cursor].right_jump) {
      jump_start = cursor; jump_index = cursor_index; steps = 0;
    }
    const auto length = std::max(0, strips[cursor].effect());
    if (cursor_index <= index && index < cursor_index + length) {
      if (for_insertion && !after && index == cursor_index && strips[cursor].offset) {
        const auto mask = strips[cursor].left;
        const auto& m = strips[mask];
        const auto& c = strips[cursor];
        const bool original_zero = mask && m.coordinates.diff < 0 && m.coordinates.anchor_diff == 0 &&
          m.coordinates.anchor_session == c.coordinates.session && m.coordinates.anchor_start == c.coordinates.start &&
          m.left && strips[m.left].coordinates.session == m.coordinates.anchor_session &&
          strips[m.left].coordinates.start == m.coordinates.anchor_start && !strips[m.left].offset;
        if ((original_zero || c.fragment_start == 0 ||
             (index == 0 && (m.coordinates.anchor_session != c.coordinates.session || m.coordinates.anchor_start != c.coordinates.start))) &&
            mask && m.coordinates.diff < 0) {
          if (original_zero && (m.left_jump || m.right_jump)) {
            jump_start = mask; jump_index = cursor_index; steps = 1;
          }
          after = original_zero ? 0 : magnitude(m.fragment_diff);
          cursor = original_zero ? m.left : mask;
          steps = strips[cursor].left_jump || strips[cursor].right_jump ? 0 : steps - (original_zero ? 2 : 1);
        } else if (index > 0) { --index; after = 1; continue; }
      }
      if (steps > 0) {
        const auto right = strips[jump_start].right_jump;
        const auto frames = Word(cursor_index - jump_index);
        if (right) link_jumps(*this, cursor, right, strips[jump_start].right_jump_frames - frames,
          strips[jump_start].right_jump_strips - steps);
        link_jumps(*this, jump_start, cursor, frames, Word(steps));
      } else if (steps < 0) {
        const auto left = strips[jump_start].left_jump;
        const auto frames = Word(jump_index - cursor_index);
        if (left) link_jumps(*this, left, cursor, strips[jump_start].left_jump_frames - frames,
          strips[jump_start].left_jump_strips + steps);
        link_jumps(*this, cursor, jump_start, frames, Word(-steps));
      }
      if (strips[cursor].right_jump) { patch_left = cursor; patch_right = strips[cursor].right_jump; }
      else if (cursor == patch_right) patch_left = patch_right = none;
      gate = cursor; gate_position = Word(cursor_index);
      left_jump_to_patch = patch_left; right_jump_to_patch = patch_right;
      return Word(strips[cursor].fragment_start + index - cursor_index + after);
    }
    if (cursor_index <= index) {
      const auto walk = strips[cursor].right;
      const auto walk_index = cursor_index + length;
      auto jump = strips[cursor].right_jump;
      if (jump && cursor_index >= 0) {
        auto frames = strips[cursor].right_jump_frames, distance = strips[cursor].right_jump_strips;
        if (distance < spacing && jump != head && jump != tail) {
          const auto next = strips[jump].right_jump;
          if (next && strips[jump].right_jump_strips <= spacing - distance) {
            frames += strips[jump].right_jump_frames; distance += strips[jump].right_jump_strips;
            link_jumps(*this, cursor, next, frames, distance); jump = next;
          }
        }
        const auto destination = cursor_index + frames;
        if (cursor_index <= index && index <= destination) { patch_left = cursor; patch_right = jump; }
        if (destination <= index && distance > 1) {
          cursor = jump; cursor_index = destination; patch_left = patch_right = none;
          continue;
        }
      }
      if (jump) { patch_left = cursor; patch_right = jump; }
      cursor = walk; cursor_index = walk_index; ++steps;
      if (cursor == patch_right) patch_left = patch_right = none;
    } else {
      const auto walk = strips[cursor].left;
      const auto walk_index = cursor_index - std::max(0, strips[walk].effect());
      auto jump = strips[cursor].left_jump;
      if (jump) {
        auto frames = strips[cursor].left_jump_frames, distance = strips[cursor].left_jump_strips;
        if (distance < spacing && jump != head && jump != tail) {
          const auto next = strips[jump].left_jump;
          if (next && strips[jump].left_jump_strips <= spacing - distance) {
            frames += strips[jump].left_jump_frames; distance += strips[jump].left_jump_strips;
            link_jumps(*this, next, cursor, frames, distance); jump = next;
          }
        }
        const auto destination = cursor_index - frames;
        if (destination <= index && index <= cursor_index) { patch_left = jump; patch_right = cursor; }
        if (index <= destination && distance > 1) {
          cursor = jump; cursor_index = destination; patch_left = patch_right = none;
          continue;
        }
      }
      if (jump) { patch_left = jump; patch_right = cursor; }
      cursor = walk; cursor_index = walk_index; --steps;
      if (cursor == patch_left) patch_left = patch_right = none;
    }
  }
  throw std::runtime_error("Visible position has no owner");
}
}
