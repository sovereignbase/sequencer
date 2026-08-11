/**
 * @file
 * @brief Builds the first Projection from a batch of staged Strips.
 */
#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../declarations/projector/index.hpp"
#include "../../declarations/sentinels/index.hpp"
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
 * considered in the same deterministic order and materialized dependency-first
 * through the ordinary insert and Mask algorithms. A Mask also materializes
 * the visible Strip containing its first Frame before masking it. Cycles and
 * unresolved dependencies stay Pending. Dependency traversal uses an explicit
 * stack, so chain depth does not consume the WebAssembly call stack.
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
  std::vector<std::uint32_t> resolution_order;
  resolution_order.reserve(strip_count);
  for (std::uint32_t position = 0; position < strip_count; ++position) {
    resolution_order.push_back(position);
    const Strip &strip = projector->strips[position];
    if (strip.is_masked == 0 &&
        projector->hash_table.get(strip.coordinate.previous_strip_end) ==
            u32_max)
      roots.push_back(position);
  }
  if (roots.empty())
    return;

  const auto descending_point = [projector](const std::uint32_t left,
                                            const std::uint32_t right) {
    return compare_sequence_points(
               &projector->strips[left].coordinate.this_strip_start,
               &projector->strips[right].coordinate.this_strip_start) > 0;
  };
  std::sort(roots.begin(), roots.end(), descending_point);
  std::sort(resolution_order.begin(), resolution_order.end(), descending_point);
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

  struct ResolutionFrame {
    std::uint32_t position;
    std::uint8_t phase;
  };
  std::vector<ResolutionFrame> resolution_stack;
  resolution_stack.reserve(strip_count);
  const auto is_materialized = [&state, strip_count](
                                   const std::uint32_t position) noexcept {
    return position >= strip_count || state[position] == 2;
  };

  for (const std::uint32_t initial_position : resolution_order) {
    if (state[initial_position] != 0)
      continue;

    resolution_stack.push_back({initial_position, 0});
    while (!resolution_stack.empty()) {
      ResolutionFrame &frame = resolution_stack.back();
      const std::uint32_t position = frame.position;
      if (is_materialized(position)) {
        resolution_stack.pop_back();
        continue;
      }

      const Strip strip = projector->strips[position];
      if (frame.phase == 0) {
        state[position] = 1;
        const std::uint32_t dependency_position =
            projector->hash_table.get(strip.coordinate.previous_strip_end);
        if (dependency_position == u32_max ||
            dependency_position == position ||
            (dependency_position < strip_count &&
             state[dependency_position] == 1)) {
          state[position] = 0;
          resolution_stack.pop_back();
          continue;
        }

        frame.phase = 1;
        if (!is_materialized(dependency_position))
          resolution_stack.push_back({dependency_position, 0});
        continue;
      }

      const std::uint32_t dependency_position =
          projector->hash_table.get(strip.coordinate.previous_strip_end);
      if (dependency_position == u32_max ||
          dependency_position == position ||
          !is_materialized(dependency_position)) {
        state[position] = 0;
        resolution_stack.pop_back();
        continue;
      }

      const std::uint32_t containing_position = projector->hash_table.get(
          strip.is_masked == 0 ? strip.coordinate.previous_strip_end
                               : strip.coordinate.this_strip_start);
      if (containing_position == u32_max) {
        state[position] = 0;
        resolution_stack.pop_back();
        continue;
      }

      if (strip.is_masked != 0 && frame.phase == 1) {
        if (containing_position < strip_count &&
            state[containing_position] == 1) {
          state[position] = 0;
          resolution_stack.pop_back();
          continue;
        }
        frame.phase = 2;
        if (!is_materialized(containing_position))
          resolution_stack.push_back({containing_position, 0});
        continue;
      }

      if (!is_materialized(containing_position)) {
        state[position] = 0;
        resolution_stack.pop_back();
        continue;
      }

      if (strip.is_masked == 0)
        static_cast<void>(
            insert_strip(projector, containing_position, position));
      else
        static_cast<void>(
            mask_strip(projector, containing_position, position));
      state[position] = 2;
      resolution_stack.pop_back();
    }
  }

  projector->length_table.initialize(first_position, projector);
  projector->gate_strip_index = first_position;
  projector->gate_projection_frame_index = 0;
}
