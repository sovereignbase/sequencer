/**
 * @file
 * @brief Positions a projector gate at a requested projection frame index.
 *
 * The search begins at the current gate unless the projection head is closer.
 * It then runs by linked strip spans rather than advancing frame by frame.
 */
#pragma once

#include "../../declarations/projector/index.hpp"
#include "../absolute_distance/index.hpp"
#include "../run_projector_backward/index.hpp"
#include "../run_projector_forward/index.hpp"
#include "../strip_contains_frame_index/index.hpp"
#include <cstdint>

/**
 * @brief Move the gate to the strip containing a projection frame index.
 *
 * Masked strips remain traversable structural links but contribute zero to the
 * projection frame index. On return, both gate fields describe the containing
 * strip: `gate_strip_start` identifies it and
 * `gate_projection_frame_index` is the projection index at which it begins.
 *
 * @param projector Projector whose gate is repositioned.
 * @param projection_frame_index Zero-based visible frame index to locate.
 * @pre `projector` is non-null.
 * @pre For a non-empty projection, `projection_frame_index` is less than
 * `projector->projection_frame_count` and all structural links are indexed.
 * @note An empty projection leaves the gate unchanged.
 * @complexity O(s) in the number of linked strips traversed and O(1) space.
 */
inline void run_projector_to_frame_index(
    Projector *projector,
    const std::uint32_t projection_frame_index) noexcept {
  if (projector->projection_frame_count == 0)
    return;

  const Strip *gate_strip =
      projector->strip_index.get(projector->gate_strip_start);

  if (strip_contains_frame_index(gate_strip,
                                 projector->gate_projection_frame_index,
                                 projection_frame_index))
    return;

  const std::uint32_t gate_distance = absolute_distance(
      projector->gate_projection_frame_index, projection_frame_index);

  if (projection_frame_index < gate_distance) {
    projector->gate_projection_frame_index = 0;
    projector->gate_strip_start = projector->first_strip_start;
    gate_strip = projector->strip_index.get(projector->gate_strip_start);
  }

  if (strip_contains_frame_index(gate_strip,
                                 projector->gate_projection_frame_index,
                                 projection_frame_index))
    return;

  if (projector->gate_projection_frame_index <= projection_frame_index) {
    do {
      gate_strip = &run_projector_forward(projector, gate_strip);
    } while (!strip_contains_frame_index(
        gate_strip, projector->gate_projection_frame_index,
        projection_frame_index));
    return;
  }

  do {
    gate_strip = &run_projector_backward(projector, gate_strip);
  } while (!strip_contains_frame_index(
      gate_strip, projector->gate_projection_frame_index,
      projection_frame_index));
}
