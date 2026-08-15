/**
 * @file
 * @brief Defines the fast path for integrating a root-relative Strip.
 */
#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../auxiliary/strip_contains_previous_strip_end/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Attempt root insertion relative to the current Gate Strip.
 *
 * Uses the cached Gate position to determine whether the incoming Strip can be
 * integrated immediately without a structural search. A valid fast-path
 * insertion places the incoming Strip directly left of the Gate Strip and
 * preserves the Gate's previous left neighbor.
 *
 * @param projector Projector containing the current structural and Projection
 * state.
 * @param incoming_strip_index Stable dense index of the incoming Strip.
 * @return Projection Frame index at which the incoming Strip was inserted;
 * `u32_max` when the fast path cannot resolve the insertion.
 * @pre `incoming_strip_index` and `projector.gate_strip_index` index existing
 * Strips in `projector`.
 * @complexity O(1) time and O(1) space for the fast path.
 */
[[nodiscard]] inline std::uint32_t
root_insert_fast_path(Projector &projector,
                      std::uint32_t &incoming_strip_index) noexcept {
  // Collect the Gate values required to test the incoming coordinate.
  const std::uint32_t &gate_strip_index = projector.gate_strip_index;
  const std::uint32_t &gate_strip_length =
      projector.strip_length_of[gate_strip_index];
  const std::uint32_t &gate_to_incoming_offset =
      strip_contains_previous_strip_end(
          projector.strip_start_of[gate_strip_index],
          projector.strip_length_of[gate_strip_index],
          projector.previous_strip_end_of[incoming_strip_index]);

  // A root insert whose previous Strip end resolves against the Gate may only
  // continue immediately after the Gate's represented Frame Span. The incoming
  // Strip's inverse state makes this the only valid fast-path arrangement.
  if (gate_to_incoming_offset != u32_max &&
      gate_to_incoming_offset == gate_strip_length) {
    // Preserve the Strip currently left of the Gate.
    const std::uint32_t &gate_left_strip_index =
        projector.left_strip_index_of[gate_strip_index];

    // Insert the incoming Strip directly left of the Gate.
    projector.right_strip_index_of[incoming_strip_index] = gate_strip_index;
    projector.left_strip_index_of[incoming_strip_index] = gate_left_strip_index;
    projector.left_strip_index_of[gate_strip_index] = incoming_strip_index;

    // The previous Gate position is now occupied by the incoming Strip.
    return projector.gate_projection_frame_index;
  }

  // Search from the head for a Strip containing the incoming previous Strip
  // end.

  std::uint32_t cursor_index = projector.head_strip_index;

  return u32_max;
}