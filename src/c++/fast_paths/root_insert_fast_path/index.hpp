/**
 * @file
 * @brief Defines root-insert resolution through the cached Gate and inverse
 * Projection prefix.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Insert an incoming root Strip left of a resolved Strip.
 *
 * Root Strips sharing the same `previous_strip_end` are ordered by
 * `strip_start`, with larger Sequence Points placed farther left.
 *
 * @param projector Projector containing the structural state.
 * @param strip_index Resolved Strip whose start equals the incoming previous
 * Strip end.
 * @param incoming_strip_index Stable dense index of the incoming Strip.
 * @complexity O(s) time, where `s` is the number of competing root Strips
 * traversed, and O(1) space.
 */
inline void append_left(Projector &projector, const std::uint32_t strip_index,
                        const std::uint32_t incoming_strip_index) noexcept {
  // Start ordering immediately left of the resolved Strip.
  std::uint32_t &left_strip_index_of_incoming_strip =
      projector.left_strip_index_of[strip_index];

  // Among root Strips sharing the same previous Strip end, larger Strip starts
  // sort farther left than smaller Strip starts.
  while (projector.previous_strip_end_of[left_strip_index_of_incoming_strip] ==
             projector.previous_strip_end_of[incoming_strip_index] &&
         projector.strip_start_of[left_strip_index_of_incoming_strip] <
             projector.strip_start_of[incoming_strip_index])
    left_strip_index_of_incoming_strip =
        projector.left_strip_index_of[left_strip_index_of_incoming_strip];

  // Resolve the Strip currently right of the selected left neighbor.
  std::uint32_t &right_strip_index_of_incoming_strip =
      projector.right_strip_index_of[left_strip_index_of_incoming_strip];

  // Insert the incoming Strip between the resolved neighboring Strips.
  projector.right_strip_index_of[incoming_strip_index] =
      right_strip_index_of_incoming_strip;
  projector.left_strip_index_of[incoming_strip_index] =
      left_strip_index_of_incoming_strip;
  projector.right_strip_index_of[left_strip_index_of_incoming_strip] =
      incoming_strip_index;
  projector.left_strip_index_of[right_strip_index_of_incoming_strip] =
      incoming_strip_index;
}

/**
 * @brief Resolve and integrate a root-relative Strip.
 *
 * The cached Gate is tested first. If the incoming Strip's
 * `previous_strip_end` equals the Gate Strip start, the insertion position is
 * resolved from the Gate without searching the inverse Projection prefix.
 *
 * Otherwise, traversal starts at the Projection head and continues through
 * inverse Strips until a Strip beginning at the incoming `previous_strip_end`
 * is found or the inverse prefix ends.
 *
 * After a traversal resolves the insertion, the matched Strip becomes the new
 * Gate for consecutive root inserts.
 *
 * @param projector Projector containing the structural and Projection state.
 * @param incoming_strip_index Stable dense index of the incoming Strip.
 * @return Projection Frame index associated with the resolved insertion;
 * `u32_max` when the inverse prefix contains no valid insertion position.
 * @complexity O(k + s) time, where `k` is the number of traversed inverse
 * Strips and `s` is the number of competing root Strips traversed, and O(1)
 * space.
 */
[[nodiscard]] inline std::uint32_t
root_insert_fast_path(Projector &projector,
                      std::uint32_t &incoming_strip_index) noexcept {
  const std::uint32_t &gate_strip_index = projector.gate_strip_index;

  // Resolve immediately when the incoming previous Strip end equals the Gate
  // Strip start.
  if (projector.strip_start_of[gate_strip_index] ==
      projector.previous_strip_end_of[incoming_strip_index]) {
    append_left(projector, gate_strip_index, incoming_strip_index);
    return projector.projection_frame_index;
  }

  // Search the inverse Projection prefix from the head.
  std::uint32_t projection_frame_index = 0;
  std::uint32_t cursor_strip_index = projector.head_strip_index;

  while (projector.is_inverse_of[cursor_strip_index]) {
    // Resolve when the incoming previous Strip end equals the cursor Strip
    // start.
    if (projector.strip_start_of[cursor_strip_index] ==
        projector.previous_strip_end_of[incoming_strip_index]) {
      append_left(projector, cursor_strip_index, incoming_strip_index);

      // Cache the resolved cursor as the Gate for consecutive root inserts.
      projector.projection_frame_index = projection_frame_index;
      projector.gate_strip_index = cursor_strip_index;

      return projection_frame_index;
    }

    // Advance through the inverse Projection prefix.
    projection_frame_index += projector.strip_length_of[cursor_strip_index];
    cursor_strip_index = projector.right_strip_index_of[cursor_strip_index];
  }

  return u32_max;
}