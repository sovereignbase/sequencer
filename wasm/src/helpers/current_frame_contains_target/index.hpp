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
                                   std::uint32_t target_index) {
  // Tombstones stay linked but never contain visible target indexes.
  if (instance->current->deleted)
    return false;
  // The range starts at state->index and covers range_length visible slots.
  return (target_index >= instance->index &&
          target_index < (instance->index + instance->current->frame_length));
}