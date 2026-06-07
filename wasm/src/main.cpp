
// Fixed-width uint32 ABI types used by every exported wasm function.
#include <cstdint>

// Range, key, and state contracts for the virtual list engine.
#include "./types/type.hpp"

// Cursor walking, range splicing, key ordering, and state registry helpers.
#include "./helpers/index.hpp"

// EMSCRIPTEN_KEEPALIVE keeps the C ABI functions exported to JavaScript.
#include <emscripten/emscripten.h>

// Export unmangled C symbols so JavaScript can call them by stable names.
extern "C" {
/**
 * @name CREATE
 * Functions that allocate states and append the initial linked projection.
 */
/// @{

/**
 * @brief Allocate an empty range engine state for one replicated list instance.
 *
 * The instance id is supplied as four uint32 lanes. The wasm core keeps only
 * virtual range metadata; JavaScript owns the actual values and later addresses
 * them through consumer references returned by read operations.
 *
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 */
EMSCRIPTEN_KEEPALIVE
void add_instance(std::uint32_t instance_id_a, std::uint32_t instance_id_b,
                  std::uint32_t instance_id_c, std::uint32_t instance_id_d) {
  // Insert a new State under the four-lane instance id.
  states_by_instance_id.insert(
      // Key stores the instance id exactly as JavaScript passed it.
      {Key{instance_id_a, instance_id_b, instance_id_c, instance_id_d},
       State{
           {},      // pending ranges waiting for their previous range
           {},      // ranges addressable by start id
           0,       // current target index
           0,       // non-deleted length
           nullptr, // first projected range
           nullptr, // cursor range
           nullptr  // last projected range
       }});
}

/**
 * @brief Append one range to the initial projection.
 *
 * Build the linked range projection in ingestion order. After
 * resolve_order_for() has created deterministic order, update using apply() to
 * patch the existing projection. This function does not insert inside the
 * projection and does not remove ranges.
 *
 * @param range_length Number of entries represented by the range.
 * @param consumer_reference JavaScript-owned reference for the first entry.
 * @param deleted_flag Non-zero means the appended range is already tombstoned.
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 * @param range_id_a First uint32 lane of the range start id.
 * @param range_id_b Second uint32 lane of the range start id.
 * @param range_id_c Third uint32 lane of the range start id.
 * @param range_id_d Fourth uint32 lane of the range start id.
 * @param previous_id_a First uint32 lane of the previous range anchor.
 * @param previous_id_b Second uint32 lane of the previous range anchor.
 * @param previous_id_c Third uint32 lane of the previous range anchor.
 * @param previous_id_d Fourth uint32 lane of the previous range anchor.
 */
EMSCRIPTEN_KEEPALIVE
void add_range_to(std::uint32_t range_length, std::uint32_t consumer_reference,
                  std::uint32_t deleted_flag, std::uint32_t instance_id_a,
                  std::uint32_t instance_id_b, std::uint32_t instance_id_c,
                  std::uint32_t instance_id_d, std::uint32_t range_id_a,
                  std::uint32_t range_id_b, std::uint32_t range_id_c,
                  std::uint32_t range_id_d, std::uint32_t previous_id_a,
                  std::uint32_t previous_id_b, std::uint32_t previous_id_c,
                  std::uint32_t previous_id_d) {
  // Resolve the mutable state that receives this appended range.
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);

  Range *range =
      create_range(range_length, consumer_reference, deleted_flag, range_id_a,
                   range_id_b, range_id_c, range_id_d, previous_id_a,
                   previous_id_b, previous_id_c, previous_id_d);
  range->previous_range = state->current;
  // Index the range by its first virtual id for later anchor lookup.
  state->ranges.insert({range->this_id, range});

  // Empty projection: the appended range becomes the head.
  if (!state->current) {
    state->first = range;
    // Non-empty projection: append after the current tail.
  } else {
    state->current->next_range = range;
  }

  // The current visible index before appending is the old visible size.
  state->index = state->size;
  // Cursor moves to the appended range.
  state->current = range;
  // Tail moves to the appended range.
  state->last = range;
  // Tombstoned ranges stay linked but do not increase visible length.
  if (!range->deleted)
    state->size += range_length;
}

/**
 * @brief Sort the initial doubly linked range projection by merge rules.
 *
 * This is the one full ordering pass for the wasm range engine. It relinks the
 * already appended ranges in place. Later mutations must use apply() so the
 * projection is patched instead of rebuilt.
 *
 * Root ranges use the zero previous id. Non-root ranges are ordered after their
 * previous range, with sibling order decided by the range ids.
 *
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 */
EMSCRIPTEN_KEEPALIVE
void resolve_order_for(std::uint32_t instance_id_a, std::uint32_t instance_id_b,
                       std::uint32_t instance_id_c,
                       std::uint32_t instance_id_d) {
  // Resolve the state whose initial projection must be ordered once.
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
  // Start the ordering pass from the current projection head.
  state->current = state->first;
  // curr is the range being checked or moved.
  Range *curr = state->current;
  // prev remembers curr's old left neighbor before any move.
  Range *prev = nullptr;
  // next remembers curr's old right neighbor before any move.
  Range *next = nullptr;

  // Walk the original chain forward; next is captured before any relink.
  while (state->current->next_range) {
    // Capture curr's old left neighbor.
    prev = curr->previous_range;
    // Capture curr's old right neighbor.
    next = curr->next_range;

    // Only move ranges whose current left neighbor is not their anchor.
    if (!curr->previous_range ||
        curr->previous_id != curr->previous_range->this_id) {
      // Close the old gap from which curr was moved.
      if (prev)
        prev->next_range = next;
      // Moving the old head makes the old right neighbor the new head.
      else
        state->first = next;

      // Link the old right neighbor back to the old left neighbor.
      next->previous_range = prev;

      if (key_is_root(curr->previous_id))
        insert_root_range(curr, state);
      else
        insert_regular_range(curr, state);
    }

    // Continue from the old right neighbor captured before relinking.
    curr = next;
    // Keep the shared state cursor aligned with curr.
    state->current = next;
  }
}

/// @}

/**
 * @name READ
 * Functions that resolve visible indexes into JavaScript consumer references.
 */
/// @{

/**
 * @brief Resolve a target index to the JavaScript-owned consumer reference.
 *
 * The target index addresses the non-tombstoned projection. The returned
 * value is the consumer reference for the concrete entry at that index.
 * JavaScript uses the returned uint32 as its own array/index/reference value.
 *
 * @param target_index Zero-based target index in the current projection.
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 * @return JavaScript-owned consumer reference for the target entry.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t get_consumer_reference_of(
    std::uint32_t target_index, std::uint32_t instance_id_a,
    std::uint32_t instance_id_b, std::uint32_t instance_id_c,
    std::uint32_t instance_id_d) {
  // Resolve the state to read from.
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
  // Move the cursor to the range containing target_index.
  find_target_range(target_index, state);
  // Return the range's consumer reference plus the offset inside the range.
  return state->current->consumer_reference +
         absolute_distance(state->index, target_index);
}

/**
 * @brief Return the number of non-tombstoned entries in an instance.
 *
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 * @return Current target-indexable entry count.
 */
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_live_item_amount(std::uint32_t instance_id_a,
                                   std::uint32_t instance_id_b,
                                   std::uint32_t instance_id_c,
                                   std::uint32_t instance_id_d) {
  // Resolve the state and return the visible, non-tombstoned size.
  return find_state_by_instance_id(instance_id_a, instance_id_b, instance_id_c,
                                   instance_id_d)
      ->size;
}

/// @}

/**
 * @name UPDATE / DELETE
 * Functions that patch the existing linked projection after initial ordering.
 */
/// @{

/**
 * @brief Patch the linked range projection with one insert or tombstone
 * range.
 *
 * Local operations pass a concrete target_index. Remote operations may pass
 * UINT32_MAX when JavaScript does not know the local target index; in that
 * case previous_id is used as the range anchor. If the anchor range has not
 * arrived yet, the patch range is stored in State::pending and the function
 * returns UINT32_MAX to indicate that no observable patch can be emitted.
 *
 * The patch range itself is always allocated as a Range node. Insert patches
 * are linked as non-deleted ranges. Delete patches are linked as tombstoned
 * ranges. Existing nodes are split and relinked, never physically removed.
 *
 * @param target_index Inclusive target index, or UINT32_MAX when unknown.
 * @param range_length Number of entries represented by the patch range.
 * @param deleted_flag Non-zero applies the patch as a tombstone range.
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 * @param range_id_a First uint32 lane of the patch range start id.
 * @param range_id_b Second uint32 lane of the patch range start id.
 * @param range_id_c Third uint32 lane of the patch range start id.
 * @param range_id_d Fourth uint32 lane of the patch range start id.
 * @param previous_id_a First uint32 lane of the patch range anchor.
 * @param previous_id_b Second uint32 lane of the patch range anchor.
 * @param previous_id_c Third uint32 lane of the patch range anchor.
 * @param previous_id_d Fourth uint32 lane of the patch range anchor.
 * @return First touched target index, or UINT32_MAX when the patch is
 * pending.
 */
EMSCRIPTEN_KEEPALIVE
void applyLocal(std::uint32_t target_index, std::uint32_t range_length,
                std::uint32_t deleted_flag, std::uint32_t consumer_reference,
                std::uint32_t instance_id_a, std::uint32_t instance_id_b,
                std::uint32_t instance_id_c, std::uint32_t instance_id_d,
                std::uint32_t range_id_a, std::uint32_t range_id_b,
                std::uint32_t range_id_c, std::uint32_t range_id_d,
                std::uint32_t previous_id_a, std::uint32_t previous_id_b,
                std::uint32_t previous_id_c, std::uint32_t previous_id_d) {
  // Resolve the state that receives the local patch.
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);

  Range *patch_range =
      create_range(range_length, consumer_reference, deleted_flag, range_id_a,
                   range_id_b, range_id_c, range_id_d, previous_id_a,
                   previous_id_b, previous_id_c, previous_id_d);

  // Local patches know their visible target index, so seek directly.
  find_target_range(target_index, state);

  // Index the patch range by id before it is linked into the projection.
  state->ranges.insert({patch_range->this_id, patch_range});

  // Split the cursor range and insert or tombstone the patch range.
  splice_range_at_current(target_index, patch_range, state, deleted_flag > 0);
}

// MERGE
EMSCRIPTEN_KEEPALIVE
std::uint32_t
applyRemote(std::uint32_t range_length, std::uint32_t deleted_flag,
            std::uint32_t consumer_reference, std::uint32_t instance_id_a,
            std::uint32_t instance_id_b, std::uint32_t instance_id_c,
            std::uint32_t instance_id_d, std::uint32_t range_id_a,
            std::uint32_t range_id_b, std::uint32_t range_id_c,
            std::uint32_t range_id_d, std::uint32_t previous_id_a,
            std::uint32_t previous_id_b, std::uint32_t previous_id_c,
            std::uint32_t previous_id_d) {
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);

  Range *patch_range =
      create_range(range_length, consumer_reference, deleted_flag, range_id_a,
                   range_id_b, range_id_c, range_id_d, previous_id_a,
                   previous_id_b, previous_id_c, previous_id_d);

  state->ranges.insert({patch_range->this_id, patch_range});
  if (key_is_root(patch_range->previous_id)) {
    insert_root_range(patch_range, state);
    if (!patch_range->deleted)
      state->size += patch_range->range_length;
  } else {
    state->index = 0;
    state->current = state->first;
    std::uint32_t offset =
        key_distance(state->current->this_id, patch_range->previous_id);
    while (offset >= state->current->range_length) {
      if (!state->current->deleted)
        state->index += state->current->range_length;
      state->current = state->current->next_range;
      if (!state->current) {
        state->pending.insert({patch_range->this_id, patch_range});
        return std::uint32_t(-1);
      }
      offset = key_distance(state->current->this_id, patch_range->previous_id);
    }
    splice_range_at_current(state->index + offset + 1, patch_range, state,
                            deleted_flag > 0);
  }

  state->index = 0;
  state->current = state->first;
  while (state->current != patch_range) {
    if (!state->current->deleted)
      state->index += state->current->range_length;
    state->current = state->current->next_range;
  }
  return state->index;
}

// SNAPSHOT

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_amount(std::uint32_t instance_id_a,
                               std::uint32_t instance_id_b,
                               std::uint32_t instance_id_c,
                               std::uint32_t instance_id_d) {
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
  std::uint32_t amount = 0;
  for (Range *range = state ? state->first : nullptr; range;
       range = range->next_range)
    amount++;
  return amount;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_id(std::uint32_t range_index,
                           std::uint32_t previous_flag, std::uint32_t lane,
                           std::uint32_t instance_id_a,
                           std::uint32_t instance_id_b,
                           std::uint32_t instance_id_c,
                           std::uint32_t instance_id_d) {
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  if (!range)
    return 0;
  return key_lane(previous_flag ? range->previous_id : range->this_id, lane);
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_length(std::uint32_t range_index,
                               std::uint32_t instance_id_a,
                               std::uint32_t instance_id_b,
                               std::uint32_t instance_id_c,
                               std::uint32_t instance_id_d) {
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  return range ? range->range_length : 0;
}

EMSCRIPTEN_KEEPALIVE
std::uint32_t get_range_deleted(std::uint32_t range_index,
                                std::uint32_t instance_id_a,
                                std::uint32_t instance_id_b,
                                std::uint32_t instance_id_c,
                                std::uint32_t instance_id_d) {
  Range *range =
      range_at(find_state_by_instance_id(instance_id_a, instance_id_b,
                                         instance_id_c, instance_id_d),
               range_index);
  return range && range->deleted ? 1 : 0;
}
}
