/**
 * @file
 * @brief Materializes one staged Strip in deterministic Structural Order.
 */
#pragma once

#include "../../../.auxiliary/insert_between/index.hpp"
#include "../../../.auxiliary/split_strip/index.hpp"
#include "../../../.declarations/projector/index.hpp"
#include <cstdint>
#include <utility>

/**
 * @brief Materialize one fully resolved visible Strip.
 * @param projector Owning Projector.
 * @param containing_strip_index Strip containing the dependency.
 * @param incoming_strip_index Strip Index of the staged Strip.
 * @param offset Dependency point offset; zero is the anchor, positive values
 * identify content Frames before which the incoming Strip is inserted.
 * @pre `offset <= strip_length_of[containing_strip_index]`.
 * @note Retain or create a contentless causal placeholder at the dependency.
 * @return Projection Frame count and materialized Strip count differences.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_left(Projector &projector, const std::uint32_t containing_strip_index,
           const std::uint32_t incoming_strip_index,
           const std::uint32_t offset) noexcept {
  const std::uint32_t containing_strip_length =
      projector.strip_length_of[containing_strip_index];

  const std::uint32_t previous_materialized_strip_count =
      projector.materialized_strip_count;

  std::uint32_t left_strip_index;
  std::uint32_t right_strip_index;

  if (offset == 0) {
    left_strip_index = containing_strip_index;
    right_strip_index = containing_strip_length == 0
                            ? projector.right_strip_index_of[containing_strip_index]
                            : split_strip(projector, containing_strip_index, 0);
  } else {
    left_strip_index = split_strip(projector, containing_strip_index, offset - 1);
    right_strip_index = split_strip(projector, left_strip_index, 0);
  }

  insert_between(projector, left_strip_index, incoming_strip_index,
                 right_strip_index);

  const std::int32_t frame_count_diff = static_cast<std::int32_t>(
      projector.strip_length_of[incoming_strip_index]);

  projector.projection_frame_count +=
      projector.strip_length_of[incoming_strip_index];

  const std::int32_t strip_count_diff = static_cast<std::int32_t>(
      projector.materialized_strip_count - previous_materialized_strip_count);

  return {frame_count_diff, strip_count_diff};
}
