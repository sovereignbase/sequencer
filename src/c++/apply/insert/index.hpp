#pragma once

#include "./birth/index.hpp"
#include "./before/index.hpp"
#include "./after/index.hpp"

/**
 * @brief Dispatch a staged Strip without duplicating placement logic.
 * @pre The incoming Strip has type 0 (before), 1 (after), or 2 (Mask).
 * When materialized state exists, the containing Strip and offset are resolved.
 * A Mask's offset is its first addressed Frame's content offset and its span
 * is contained in the resolved Strip.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_insert(Projector &projector, const std::uint32_t containing_strip_index,
             const std::uint32_t incoming_strip_index,
             const std::uint32_t offset) noexcept {
  if (projector.materialized_strip_count == 0)
    return insert_birth(projector, incoming_strip_index);
  if (projector.strip_type_of[incoming_strip_index] == 0)
    return insert_before(projector, containing_strip_index, incoming_strip_index, offset);
  return insert_after(projector, containing_strip_index, incoming_strip_index,
                      offset + (projector.strip_type_of[incoming_strip_index] == 2
                                    ? projector.strip_length_of[incoming_strip_index]
                                    : 0));
}
