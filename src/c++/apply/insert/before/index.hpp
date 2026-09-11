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
 * @param offset Number of source Frames preceding the insertion boundary.
 * @pre `offset <= fragment_length_of[containing_strip_index]`.
 * @note Retain or create a contentless causal placeholder at the dependency.
 * @return Projection Frame count and materialized Strip count differences.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
insert_before(Projector &projector, const std::uint32_t containing_strip_index,
              const std::uint32_t incoming_strip_index,
              const std::uint32_t offset) noexcept {
  const std::uint32_t containing_strip_length =
      projector.fragment_length_of[containing_strip_index];

  const std::uint32_t previous_materialized_strip_count =
      projector.materialized_strip_count;

  std::uint32_t left_strip_index;
  std::uint32_t right_strip_index;

  if (projector.strip_type_of[containing_strip_index] == 2) {
    left_strip_index = containing_strip_index;
    right_strip_index = projector.right_strip_index_of[containing_strip_index];
  } else if (offset == 0) {
    left_strip_index = containing_strip_index;
    right_strip_index =
        containing_strip_length == 0
            ? projector.right_strip_index_of[containing_strip_index]
            : split_strip(projector, containing_strip_index, 0);
  } else {
    left_strip_index = containing_strip_index;
    right_strip_index = offset == containing_strip_length
        ? projector.right_strip_index_of[containing_strip_index]
        : split_strip(projector, containing_strip_index, offset);
  }

  insert_between(projector, left_strip_index, incoming_strip_index,
                 right_strip_index);

  const std::int32_t frame_count_diff = static_cast<std::int32_t>(
      projector.get_projected_strip_length(incoming_strip_index));

  projector.projection_frame_count +=
      projector.get_projected_strip_length(incoming_strip_index);

  const std::int32_t strip_count_diff = static_cast<std::int32_t>(
      projector.materialized_strip_count - previous_materialized_strip_count);

  return {frame_count_diff, strip_count_diff};
}
