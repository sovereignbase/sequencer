/**
 * @file
 * @brief Positions a projector gate at a requested projection frame index.
 *
 * The search begins at the current Gate unless the beginning of the Projection
 * is closer. It traverses linked Strip spans rather than individual Frames.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include "../absolute_distance/index.hpp"
#include "../run_projector_backward/index.hpp"
#include "../run_projector_forward/index.hpp"
#include "../strip_contains_frame_index/index.hpp"
#include <cstdint>

/**
 * @brief Move the Gate to the Strip containing a Projection frame index.
 *
 * Masks remain part of retained strip order but contribute no Frames to the
 * Projection. On success, `gate_strip_start` identifies the containing Strip
 * and `gate_projection_frame_index` is the Projection frame index at which
 * that Strip begins.
 *
 * @param projector Projector whose gate is repositioned.
 * @param projection_frame_index Zero-based visible frame index to locate.
 * @pre `projector` is non-null.
 * @pre For a non-empty Projection, `projection_frame_index` is less than
 * `projector->projection_frame_count` and every retained Strip link resolves.
 * @post For a non-empty Projection, the Gate describes the unique visible
 * Strip containing `projection_frame_index`.
 * @note An empty Projection leaves the Gate unchanged.
 * @complexity O(s) time and O(1) space, where s is the number of linked Strips
 * traversed from the selected starting position.
 */
inline void run_projector_to_frame_index(
    Projector *projector, const std::uint32_t projection_frame_index) noexcept {
  // Leave an empty Projection Gate unchanged.
  if (projector->projection_frame_count == 0)
    return;

  // Test the current Gate before traversing.
  const Strip *gate_strip =
      projector->strip_index.get(projector->gate_strip_start);

  if (strip_contains_frame_index(gate_strip,
                                 projector->gate_projection_frame_index,
                                 projection_frame_index))
    return;

  const std::uint32_t gate_distance = absolute_distance(
      projector->gate_projection_frame_index, projection_frame_index);

  // Restart at the first Strip when the Projection beginning is closer.
  if (projection_frame_index < gate_distance) {
    projector->gate_projection_frame_index = 0;
    projector->gate_strip_start = projector->first_strip_start;
    gate_strip = projector->strip_index.get(projector->gate_strip_start);
  }

  // Accept the selected starting Strip when it contains the Frame.
  if (strip_contains_frame_index(gate_strip,
                                 projector->gate_projection_frame_index,
                                 projection_frame_index))
    return;

  // Traverse forward by complete Strip spans.
  if (projector->gate_projection_frame_index <= projection_frame_index) {
    do {
      gate_strip = &run_projector_forward(projector, gate_strip);
    } while (!strip_contains_frame_index(gate_strip,
                                         projector->gate_projection_frame_index,
                                         projection_frame_index));
    return;
  }

  // Traverse backward by complete Strip spans.
  do {
    gate_strip = &run_projector_backward(projector, gate_strip);
  } while (!strip_contains_frame_index(gate_strip,
                                       projector->gate_projection_frame_index,
                                       projection_frame_index));
}
