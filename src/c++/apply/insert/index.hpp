#pragma once

#include "./birth/index.hpp"
#include "./before/index.hpp"
#include "./after/index.hpp"

/**
 * @brief Dispatch a staged Strip without duplicating placement logic.
 * @pre The incoming Strip has type 0 (before), 1 (after), or 2 (Mask).
 * When materialized state exists, the containing Strip and offset are resolved.
 * A Mask's offset is its first addressed Frame's content offset. Empty source
 * anchors are followed through larger_split without consuming Mask content.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_insert(Projector &projector, std::uint32_t containing_strip_index,
             const std::uint32_t incoming_strip_index,
             std::uint32_t offset) noexcept {
  if (projector.left_strip_index_of[incoming_strip_index] != incoming_strip_index)
    return {0, 0};
  if (projector.strip_type_of[incoming_strip_index] == 2) {
    while (containing_strip_index != u32_max &&
           offset == projector.strip_length_of[containing_strip_index] &&
           projector.larger_split_strip_index_of[containing_strip_index] != u32_max) {
      containing_strip_index =
          projector.larger_split_strip_index_of[containing_strip_index];
      offset = 0;
    }
    if (containing_strip_index == u32_max ||
        projector.left_strip_index_of[containing_strip_index] == containing_strip_index ||
        projector.strip_type_of[containing_strip_index] == 2 ||
        offset > projector.strip_length_of[containing_strip_index] ||
        projector.strip_length_of[incoming_strip_index] >
            projector.strip_length_of[containing_strip_index] - offset)
      return {0, 0};
  }
  if (containing_strip_index == u32_max)
    return insert_birth(projector, incoming_strip_index);
  if (projector.strip_type_of[incoming_strip_index] == 0)
    return insert_before(projector, containing_strip_index, incoming_strip_index, offset);
  return insert_after(projector, containing_strip_index, incoming_strip_index,
                      offset + (projector.strip_type_of[incoming_strip_index] == 2
                                    ? projector.strip_length_of[incoming_strip_index]
                                    : 0));
}
