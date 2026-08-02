/**
 * @file
 * @brief Positions a projector gate at the strip containing a sequence point.
 *
 * The search is tuned for sequential integration: it tests the gate, the last
 * strip, and the first strip before expanding in both directions from the gate.
 * Every remaining strip is tested at most once.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include "../strip_contains_sequence_point/index.hpp"
#include <cstdint>
#include <utility>
#include <variant>

/**
 * @brief Find the strip containing a stable sequence point and move the gate.
 *
 * Masked strips participate because their sequence points remain structural,
 * but they contribute zero frames while the projection positions of both
 * search directions are maintained. If found, the final gate start and gate
 * projection frame index both describe the returned strip.
 *
 * @param projector Projector whose linked strips are searched and whose gate
 * is updated on success.
 * @param sequence_point Stable point to locate within a strip frame span.
 * @return Pair of the containing strip and its zero-based strip frame offset,
 * or `false` when the projector is empty or the point is absent.
 * @pre Both pointers are non-null.
 * @pre A non-empty projector has valid first, gate, and last strip starts and
 * one bounded bidirectional structural chain.
 * @note The returned strip pointer remains valid only until StripIndex is
 * modified.
 * @complexity O(s) worst case and O(1) auxiliary space, where s is the number
 * of materialized strips.
 */
[[nodiscard]] inline std::variant<std::pair<const Strip *, std::uint32_t>, bool>
run_projector_to_sequence_point(
    Projector *projector, const SequencePoint *sequence_point) noexcept {
  if (projector->strip_index.is_empty())
    return false;

  const Strip *gate_strip =
      projector->strip_index.get(projector->gate_strip_start);
  const Strip *first_strip =
      projector->strip_index.get(projector->first_strip_start);
  const Strip *last_strip =
      projector->strip_index.get(projector->last_strip_start);
  std::uint32_t strip_frame_offset;

  if ((strip_frame_offset =
           strip_contains_sequence_point(gate_strip, sequence_point)) !=
      sequence_point_outside_strip)
    return std::pair{gate_strip, strip_frame_offset};

  const std::uint32_t last_strip_projection_frame_index =
      projector->projection_frame_count -
      (last_strip->is_masked == 0 ? last_strip->frame_count : 0);

  if (last_strip != gate_strip &&
      (strip_frame_offset =
           strip_contains_sequence_point(last_strip, sequence_point)) !=
          sequence_point_outside_strip) {
    projector->gate_strip_start = last_strip->coordinate.this_strip_start;
    projector->gate_projection_frame_index =
        last_strip_projection_frame_index;
    return std::pair{last_strip, strip_frame_offset};
  }

  if (first_strip != gate_strip && first_strip != last_strip &&
      (strip_frame_offset =
           strip_contains_sequence_point(first_strip, sequence_point)) !=
          sequence_point_outside_strip) {
    projector->gate_strip_start = first_strip->coordinate.this_strip_start;
    projector->gate_projection_frame_index = 0;
    return std::pair{first_strip, strip_frame_offset};
  }

  const Strip *forward_strip = gate_strip;
  const Strip *backward_strip = gate_strip;
  std::uint32_t forward_projection_frame_index =
      projector->gate_projection_frame_index;
  std::uint32_t backward_projection_frame_index =
      projector->gate_projection_frame_index;

  while (forward_strip != last_strip || backward_strip != first_strip) {
    if (forward_strip != last_strip) {
      if (forward_strip->is_masked == 0)
        forward_projection_frame_index += forward_strip->frame_count;
      forward_strip =
          projector->strip_index.get(forward_strip->next_strip_start);

      if (forward_strip != last_strip &&
          (strip_frame_offset = strip_contains_sequence_point(
               forward_strip, sequence_point)) !=
              sequence_point_outside_strip) {
        projector->gate_strip_start =
            forward_strip->coordinate.this_strip_start;
        projector->gate_projection_frame_index =
            forward_projection_frame_index;
        return std::pair{forward_strip, strip_frame_offset};
      }
    }

    if (backward_strip != first_strip) {
      backward_strip = projector->strip_index.get(
          backward_strip->coordinate.previous_strip_start);
      if (backward_strip->is_masked == 0)
        backward_projection_frame_index -= backward_strip->frame_count;

      if (backward_strip != first_strip &&
          (strip_frame_offset = strip_contains_sequence_point(
               backward_strip, sequence_point)) !=
              sequence_point_outside_strip) {
        projector->gate_strip_start =
            backward_strip->coordinate.this_strip_start;
        projector->gate_projection_frame_index =
            backward_projection_frame_index;
        return std::pair{backward_strip, strip_frame_offset};
      }
    }
  }

  return false;
}
