/**
 * @file
 * @brief Positions a Projector Gate at the Strip containing a Sequence Point.
 *
 * The search favors locality during sequential integration: it tests the Gate,
 * last Strip, and first Strip before expanding in both directions from the
 * Gate. Every remaining materialized Strip is tested at most once.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include "../strip_contains_sequence_point/index.hpp"
#include <cstdint>
#include <utility>
#include <variant>

/**
 * @brief Find the Strip containing a Sequence Point and move the Gate to it.
 *
 * Masks participate because their Frame Spans remain in the retained Sequence,
 * but they contribute no Frames while the Projection positions of both search
 * directions are maintained. On success, both Gate fields describe the
 * returned Strip. Failure leaves the Gate unchanged.
 *
 * @param projector Projector whose linked strips are searched and whose gate
 * is updated on success.
 * @param sequence_point Stable point to locate within a Strip Frame Span.
 * @return Pair containing the Strip pointer and the point's zero-based Frame
 * offset within that Strip, or `false` when the Projector is empty or the point
 * is absent from every materialized Strip.
 * @pre Both pointers are non-null.
 * @pre A non-empty Projector has valid first, Gate, and last Strip starts and
 * one bounded bidirectional retained order in which every link resolves.
 * @post On success, `projector->gate_strip_start` identifies the returned Strip
 * and `projector->gate_projection_frame_index` is the Projection frame index at
 * which it begins.
 * @post On failure, both Gate fields retain their original values.
 * @note The returned strip pointer remains valid only until StripIndex is
 * modified.
 * @complexity O(s) worst-case time and O(1) auxiliary space, where s is the
 * number of materialized Strips.
 */
[[nodiscard]] inline std::variant<std::pair<const Strip *, std::uint32_t>, bool>
run_projector_to_sequence_point(Projector *projector,
                                const SequencePoint *sequence_point) noexcept {
  // Reject an empty retained Sequence.
  if (projector->strip_index.is_empty())
    return false;

  // Resolve the Gate and both retained boundaries.
  const Strip *gate_strip =
      projector->strip_index.get(projector->gate_strip_start);
  const Strip *first_strip =
      projector->strip_index.get(projector->first_strip_start);
  const Strip *last_strip =
      projector->strip_index.get(projector->last_strip_start);
  std::uint32_t strip_frame_offset;

  // Test the locality-optimized Gate candidate first.
  if ((strip_frame_offset = strip_contains_sequence_point(
           gate_strip, sequence_point)) != sequence_point_outside_strip)
    return std::pair{gate_strip, strip_frame_offset};

  // Derive the last Strip's Projection position.
  const std::uint32_t last_strip_projection_frame_index =
      projector->projection_frame_count -
      (last_strip->is_masked == 0 ? last_strip->frame_count : 0);

  // Test the last retained Strip as the common append candidate.
  if (last_strip != gate_strip &&
      (strip_frame_offset = strip_contains_sequence_point(
           last_strip, sequence_point)) != sequence_point_outside_strip) {
    projector->gate_strip_start = last_strip->coordinate.this_strip_start;
    projector->gate_projection_frame_index = last_strip_projection_frame_index;
    return std::pair{last_strip, strip_frame_offset};
  }

  // Test the first retained Strip as the common Root-adjacent candidate.
  if (first_strip != gate_strip && first_strip != last_strip &&
      (strip_frame_offset = strip_contains_sequence_point(
           first_strip, sequence_point)) != sequence_point_outside_strip) {
    projector->gate_strip_start = first_strip->coordinate.this_strip_start;
    projector->gate_projection_frame_index = 0;
    return std::pair{first_strip, strip_frame_offset};
  }

  // Initialize bidirectional traversal from the Gate.
  const Strip *forward_strip = gate_strip;
  const Strip *backward_strip = gate_strip;
  std::uint32_t forward_projection_frame_index =
      projector->gate_projection_frame_index;
  std::uint32_t backward_projection_frame_index =
      projector->gate_projection_frame_index;

  // Expand toward both retained boundaries until every Strip is covered.
  while (forward_strip != last_strip || backward_strip != first_strip) {
    // Advance and test one Strip in the forward direction.
    if (forward_strip != last_strip) {
      if (forward_strip->is_masked == 0)
        forward_projection_frame_index += forward_strip->frame_count;
      forward_strip =
          projector->strip_index.get(forward_strip->next_strip_start);

      if (forward_strip != last_strip &&
          (strip_frame_offset =
               strip_contains_sequence_point(forward_strip, sequence_point)) !=
              sequence_point_outside_strip) {
        projector->gate_strip_start =
            forward_strip->coordinate.this_strip_start;
        projector->gate_projection_frame_index = forward_projection_frame_index;
        return std::pair{forward_strip, strip_frame_offset};
      }
    }

    // Advance and test one Strip in the backward direction.
    if (backward_strip != first_strip) {
      backward_strip = projector->strip_index.get(
          backward_strip->coordinate.previous_strip_start);
      if (backward_strip->is_masked == 0)
        backward_projection_frame_index -= backward_strip->frame_count;

      if (backward_strip != first_strip &&
          (strip_frame_offset =
               strip_contains_sequence_point(backward_strip, sequence_point)) !=
              sequence_point_outside_strip) {
        projector->gate_strip_start =
            backward_strip->coordinate.this_strip_start;
        projector->gate_projection_frame_index =
            backward_projection_frame_index;
        return std::pair{backward_strip, strip_frame_offset};
      }
    }
  }

  // Report absence without mutating the Projector Gate.
  return false;
}
