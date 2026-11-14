/** @file Resolves visible ownership and original-coordinate insertion boundaries. */
#include "../class.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
Word Projection::find_frame(Word position, bool for_insertion) {
  if (gate && position >= gate_position && (!for_insertion || position != gate_position) &&
      strips.fragment_diff[gate] > 0 && position - gate_position < Word(strips.fragment_diff[gate]))
    return strips.fragment_start[gate] + position - gate_position;
  const auto tail_index = frame_count - Word(strips.fragment_diff[tail]);
  if (position >= tail_index && position < frame_count &&
      (!for_insertion || position != tail_index)) {
    gate = tail;
    gate_position = tail_index;
    return strips.fragment_start[tail] + position - tail_index;
  }
  const auto locate = [&](Word at) -> std::pair<Index, Word> {
    if (at < Word(strips.fragment_diff[head]))
      return {head, 0};
    if (gate) {
      const auto frames = Word(std::max(0, strips.fragment_diff[gate]));
      if (at >= gate_position && at - gate_position < frames)
        return {gate, gate_position};
      const auto right = strips.right[gate];
      if (at >= gate_position && at - gate_position >= frames && right &&
          strips.fragment_diff[right] > 0 &&
          at - gate_position - frames < Word(strips.fragment_diff[right]))
        return {right, gate_position + frames};
      const auto left = strips.left[gate];
      if (at < gate_position && left && strips.fragment_diff[left] > 0 &&
          gate_position - at <= Word(strips.fragment_diff[left]))
        return {left, gate_position - Word(strips.fragment_diff[left])};
    }
    traversal.prepare(strips, structural_head, structural_count);
    return traversal.find(strips, structural_head, at, frame_count);
  };
  auto [cursor, cursor_index] = locate(position);
  if (!cursor)
    throw std::runtime_error("Visible position has no owner");
  Word index = position, after = 0;
  // A visible boundary can retain an original mask endpoint. Resolve it with
  // the same original coordinates, independently of the traversal starting point.
  if (for_insertion && index == cursor_index && strips.identity[cursor].offset) {
    const auto mask = strips.left[cursor];
    const auto m = mask;
    const auto c = cursor;
    const bool original_zero =
        mask && strips.identity[m].coordinates.diff < 0 &&
        strips.identity[m].coordinates.anchor_diff == 0 &&
        strips.identity[m].coordinates.anchor_session == strips.identity[c].coordinates.session &&
        strips.identity[m].coordinates.anchor_start == strips.identity[c].coordinates.start &&
        strips.left[m] &&
        strips.identity[strips.left[m]].coordinates.session ==
            strips.identity[m].coordinates.anchor_session &&
        strips.identity[strips.left[m]].coordinates.start ==
            strips.identity[m].coordinates.anchor_start &&
        !strips.identity[strips.left[m]].offset;
    const bool adjoining_mask =
        mask &&
        strips.identity[m].coordinates.anchor_session == strips.identity[c].coordinates.session &&
        strips.identity[m].coordinates.anchor_start == strips.identity[c].coordinates.start &&
        strips.identity[m].coordinates.anchor_diff + strips.fragment_start[m] +
                magnitude(strips.fragment_diff[m]) ==
            strips.fragment_start[c] &&
        strips.left[m] &&
        (strips.fragment_diff[strips.left[m]] == 0 ||
         strips.identity[strips.left[m]].coordinates.session !=
             strips.identity[c].coordinates.session ||
         strips.identity[strips.left[m]].coordinates.start != strips.identity[c].coordinates.start);
    if ((original_zero || adjoining_mask || strips.fragment_start[c] == 0 ||
         (index == 0 &&
          (strips.identity[m].coordinates.anchor_session !=
               strips.identity[c].coordinates.session ||
           strips.identity[m].coordinates.anchor_start != strips.identity[c].coordinates.start))) &&
        mask && strips.identity[m].coordinates.diff < 0) {
      after = original_zero ? 0 : magnitude(strips.fragment_diff[m]);
      cursor = original_zero ? strips.left[m] : mask;
    } else if (index > 0) {
      --index;
      after = 1;
      const auto previous = locate(index);
      cursor = previous.first;
      cursor_index = previous.second;
      if (!cursor)
        throw std::runtime_error("Visible position has no owner");
    }
  }
  gate = cursor;
  gate_position = cursor_index;
  return strips.fragment_start[cursor] + index - cursor_index + after;
}
} // namespace sequencer
