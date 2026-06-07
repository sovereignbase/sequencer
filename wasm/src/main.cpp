
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

  // Allocate the new range node; wasm owns range metadata, not values.
  Range *range = new Range{
      // Store the first virtual id represented by this contiguous range.
      .this_id = {.a = range_id_a,
                  .b = range_id_b,
                  .c = range_id_c,
                  .d = range_id_d},
      // Store the stable CRDT anchor supplied by JavaScript.
      .previous_id = {.a = previous_id_a,
                      .b = previous_id_b,
                      .c = previous_id_c,
                      .d = previous_id_d},
      // Appending starts with no successor.
      .next_range = nullptr,
      // The current tail is the predecessor in ingestion order.
      .previous_range = state->current,
      // Store how many virtual entries this range covers.
      .range_length = range_length,
      // Store JavaScript's reference to the first consumer value.
      .consumer_reference = consumer_reference,
      // Non-zero deleted_flag means the range is appended as a tombstone.
      .deleted = deleted_flag > 0,
  };
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
      // Root anchored ranges are sorted among other root siblings.
      if (key_is_root(curr->previous_id)) {
        // Root siblings are ordered from largest id to smallest id.
        Range *right = state->first;
        // Root insert starts before the current head until the walk moves it.
        curr->previous_range = nullptr;
        // Move right while the right sibling must stay left of curr.
        while (right && key_is_root(right->previous_id) &&
               key_is_before(curr->this_id, right->this_id))
          curr->previous_range = right, right = right->next_range;
        // First smaller or non-root range becomes curr's right neighbor.
        curr->next_range = right;
        // If the walk moved, link the larger left sibling to curr.
        if (curr->previous_range)
          curr->previous_range->next_range = curr;
        // If there is a right neighbor, link it back to curr.
        if (right)
          right->previous_range = curr;
        // Non-root ranges are sorted after their previous_id anchor.
      } else {
        // Normal siblings are ordered from smallest id to largest id.
        curr->previous_range = state->ranges.find(curr->previous_id)->second;
        Range *right = curr->previous_range->next_range;
        // Move right while the right sibling must stay left of curr.
        while (right && right->previous_id == curr->previous_id &&
               key_is_before(right->this_id, curr->this_id))
          curr->previous_range = right, right = right->next_range;
        // First larger or non-sibling range becomes curr's right neighbor.
        curr->next_range = right;
        curr->previous_range->next_range = curr;
        if (right)
          right->previous_range = curr;
      }

      // Close the old gap from which curr was moved.
      if (prev)
        prev->next_range = next;
      // Moving the old head makes the old right neighbor the new head.
      else
        state->first = next;

      // Link the old right neighbor back to the old left neighbor.
      next->previous_range = prev;
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

  // Allocate the patch range from the uint32 ABI values.
  Range *patch_range = new Range{
      // Store the first virtual id of the inserted or tombstoned run.
      .this_id = {.a = range_id_a,
                  .b = range_id_b,
                  .c = range_id_c,
                  .d = range_id_d},
      // Store the stable anchor carried by the operation.
      .previous_id = {.a = previous_id_a,
                      .b = previous_id_b,
                      .c = previous_id_c,
                      .d = previous_id_d},
      // Splice helper fills the forward link.
      .next_range = nullptr,
      // Splice helper fills the backward link.
      .previous_range = nullptr,
      // Store how many entries the patch represents.
      .range_length = range_length,
      // Store JavaScript's reference for the first inserted value.
      .consumer_reference = consumer_reference,
      // Store operation mode as the range tombstone marker.
      .deleted = deleted_flag > 0,
  };

  // Local patches know their visible target index, so seek directly.
  find_target_range(target_index, state);

  // Index the patch range by id before it is linked into the projection.
  state->ranges.insert({patch_range->this_id, patch_range});

  // Split the cursor range and insert or tombstone the patch range.
  splice_range_at_current(target_index, patch_range, state, deleted_flag > 0);
}

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
  // Resolve the state that receives the local patch.
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
}
}
