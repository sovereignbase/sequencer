/**
 * @file
 * @brief Materializes one staged Strip in deterministic Structural Order.
 */
#pragma once

#include "../../auxiliary/insert_between/index.hpp"
#include "../../auxiliary/split_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Materialize one fully resolved visible Strip.
 * @param projector Owning Projector.
 * @param containing_strip_index Stable Position containing the dependency.
 * @param incoming_strip_index Stable Position of the staged Strip.
 * @param offset Dependency Frame offset in the containing Strip.
 * @return Materialized Projection position.
 */
void insert(Projector *projector, const std::uint32_t containing_strip_index,
            const std::uint32_t incoming_strip_index,
            const std::uint32_t offset) noexcept {
  const std::uint32_t containing_strip_length =
      projector->strip_length_of[containing_strip_index];

  std::uint32_t strip_left_of_split_position;
  std::uint32_t strip_right_of_split_position;
  std::uint32_t parent_strip_index = containing_strip_index;
  if (offset == 0) {
    strip_left_of_split_position =
        projector->left_strip_index_of[containing_strip_index];
    strip_right_of_split_position = containing_strip_index;
  } else if (offset == containing_strip_length) {
    strip_left_of_split_position = containing_strip_index;
    strip_right_of_split_position =
        projector->right_strip_index_of[containing_strip_index];
  } else {
    strip_left_of_split_position = containing_strip_index;
    strip_right_of_split_position =
        split_strip(projector, containing_strip_index, offset);
  }

  const std::int64_t sibling_frame_offset = insert_between(
      projector, strip_left_of_split_position, incoming_strip_index,
      strip_right_of_split_position, true, parent_strip_index);
}
