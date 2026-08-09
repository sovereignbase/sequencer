/**
 * @file
 * @brief Builds the first Projection from a batch of staged Strips.
 */
#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../declarations/projector/index.hpp"
#include "../insert_strip/index.hpp"
#include "../mask_strip/index.hpp"
#include <algorithm>
#include <cstdint>
#include <vector>

/**
 * @brief Resolve every reachable creation-time dependency into one Projection.
 *
 * Visible Strips whose previous point is absent seed the sentinel-free circular
 * Structural Order. Initial inverse Roots are ordered by descending Sequence
 * Point before their ring is linked. Remaining visible Strips and Masks are
 * then materialized dependency-first through the ordinary insert and Mask
 * algorithms. Cycles and unresolved dependencies stay Pending.
 *
 * The LengthTable and Gate are initialized after the root ring is created and
 * rebuilt after dependency resolution so no input arrival order becomes
 * Projection order.
 *
 * @param projector Projector containing a complete staged creation batch.
 * @pre Every Strip has matching self-linked dense entries unless already joined
 * to the root ring during this call.
 * @post Every reachable valid Strip is materialized exactly once; unresolved
 * Strips remain self-linked.
 * @complexity O(n log n) Root ordering plus staging-state storage, HashTable
 * lookups, and ordinary materialization for n Strips.
 */
inline void resolve_initial_projection(Projector *projector) noexcept {
  const std::uint32_t strip_count =
      static_cast<std::uint32_t>(projector->strips.size());
  if (strip_count == 0)
    return;

  std::vector<std::uint8_t> state(strip_count, 0);
  std::vector<std::uint32_t> roots;
  for (std::uint32_t position = 0; position < strip_count; ++position) {
    const Strip &strip = projector->strips[position];
    if (strip.is_masked == 0 &&
        projector->hash_table.get(strip.coordinate.previous_strip_end) ==
            HashTable::no_stable_position)
      roots.push_back(position);
  }
  if (roots.empty())
    return;

  std::sort(roots.begin(), roots.end(), [projector](const std::uint32_t left,
                                                    const std::uint32_t right) {
    return compare_sequence_points(
               &projector->strips[left].coordinate.this_strip_start,
               &projector->strips[right].coordinate.this_strip_start) > 0;
  });
  const std::uint32_t first_position = roots.front();

  projector->projection_frame_count = 0;
  const std::uint32_t root_count = static_cast<std::uint32_t>(roots.size());
  for (std::uint32_t root_index = 0; root_index < root_count; ++root_index) {
    const std::uint32_t position = roots[root_index];
    projector->left[position] =
        roots[(root_index + root_count - 1) % root_count];
    projector->right[position] = roots[(root_index + 1) % root_count];
    state[position] = 2;
    projector->projection_frame_count += projector->strips[position].frame_count;
  }

  projector->gate_strip_index = first_position;
  projector->gate_projection_frame_index = 0;
  projector->length_table.initialize(first_position, projector);

  const auto materialize = [&](const auto &self,
                               const std::uint32_t position) noexcept -> bool {
    if (position >= strip_count || state[position] == 2)
      return true;
    if (state[position] == 1)
      return false;

    state[position] = 1;
    const Strip strip = projector->strips[position];
    const std::uint32_t dependency_position =
        projector->hash_table.get(strip.coordinate.previous_strip_end);
    if (dependency_position == HashTable::no_stable_position ||
        dependency_position == position ||
        !self(self, dependency_position)) {
      state[position] = 0;
      return false;
    }

    const std::uint32_t containing_position = projector->hash_table.get(
        strip.is_masked == 0 ? strip.coordinate.previous_strip_end
                             : strip.coordinate.this_strip_start);
    if (containing_position == HashTable::no_stable_position) {
      state[position] = 0;
      return false;
    }

    if (strip.is_masked == 0)
      static_cast<void>(insert_strip(projector, containing_position, position));
    else
      static_cast<void>(mask_strip(projector, containing_position, position));
    state[position] = 2;
    return true;
  };

  for (std::uint32_t position = 0; position < strip_count; ++position)
    if (state[position] == 0)
      static_cast<void>(materialize(materialize, position));

  projector->length_table.initialize(first_position, projector);
  projector->gate_strip_index = first_position;
  projector->gate_projection_frame_index = 0;
}
