#pragma once
#include "../../types/type.hpp"
#include <cstdint>

/**
 * @brief Test whether target_index falls inside the cursor range.
 *
 * @param state State whose current range and cursor index are checked.
 * @param target_index Zero-based non-deleted target index.
 * @return True when target_index is inside state->current.
 */
bool current_frame_contains_target(Instance *instance,
                                   const std::uint32_t target_index) {
  if (instance->current_frame_by_index == invalid_frame_index)
    return false;

  const Frame &current = instance->frames[instance->current_frame_by_index];

  // Tombstones stay linked but never contain visible target indexes.
  if (current.deleted)
    return false;
  // The range starts at state->index and covers range_length visible slots.
  return (target_index >= instance->index &&
          target_index < (instance->index + current.frame_length));
}
