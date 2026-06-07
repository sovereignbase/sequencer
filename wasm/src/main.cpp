
#include <cstdint>

#include "./types/type.hpp"

#include "./helpers/index.hpp"

#include <emscripten/emscripten.h>

extern "C" {
// CREATE
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
  states_by_instance_id.insert(
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
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);

  Range *range = new Range{
      .this_id = {.a = range_id_a,
                  .b = range_id_b,
                  .c = range_id_c,
                  .d = range_id_d},
      .previous_id = {.a = previous_id_a,
                      .b = previous_id_b,
                      .c = previous_id_c,
                      .d = previous_id_d},
      .next_range = nullptr,
      .previous_range = state->current,
      .range_length = range_length,
      .consumer_reference = consumer_reference,
      .deleted = deleted_flag > 0,
  };
  state->ranges.insert({range->this_id, range});

  if (!state->current) {
    state->first = range;
  } else {
    state->current->next_range = range;
  }

  state->index = state->size;
  state->current = range;
  state->last = range;
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
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
  state->current = state->first;
  Range *curr = state->current;
  Range *prev = nullptr;
  Range *next = nullptr;

  while (state->current->next_range) {
    prev = curr->previous_range;
    next = curr->next_range;

    if (!curr->previous_range ||
        curr->previous_id != curr->previous_range->this_id) {
      if (key_is_root(curr->previous_id)) {
        // root-haara sijoittaa currentin
      } else {
        // normaalihaara sijoittaa currentin
      }
      if (prev)
        prev->next_range = next;
      else
        state->first = next;

      next->previous_range = prev;
    }

    curr = next;
    state->current = next;
  }
}
// READ
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
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);
  find_target_range(target_index, state);
  return state->current->consumer_reference +
         absolute_distance(state->index, target_index);
}
EMSCRIPTEN_KEEPALIVE
/**
 * @brief Return the number of non-tombstoned entries in an instance.
 *
 * @param instance_id_a First uint32 lane of the instance id.
 * @param instance_id_b Second uint32 lane of the instance id.
 * @param instance_id_c Third uint32 lane of the instance id.
 * @param instance_id_d Fourth uint32 lane of the instance id.
 * @return Current target-indexable entry count.
 */
std::uint32_t get_live_item_amount(std::uint32_t instance_id_a,
                                   std::uint32_t instance_id_b,
                                   std::uint32_t instance_id_c,
                                   std::uint32_t instance_id_d) {
  return find_state_by_instance_id(instance_id_a, instance_id_b, instance_id_c,
                                   instance_id_d)
      ->size;
}
// UPDATE / DELETE
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
std::uint32_t
applyLocal(std::uint32_t target_index, std::uint32_t range_length,
           std::uint32_t deleted_flag, std::uint32_t consumer_reference,
           std::uint32_t instance_id_a, std::uint32_t instance_id_b,
           std::uint32_t instance_id_c, std::uint32_t instance_id_d,
           std::uint32_t range_id_a, std::uint32_t range_id_b,
           std::uint32_t range_id_c, std::uint32_t range_id_d,
           std::uint32_t previous_id_a, std::uint32_t previous_id_b,
           std::uint32_t previous_id_c, std::uint32_t previous_id_d) {
  State *state = find_state_by_instance_id(instance_id_a, instance_id_b,
                                           instance_id_c, instance_id_d);

  Range *patch_range = new Range{
      .this_id = {.a = range_id_a,
                  .b = range_id_b,
                  .c = range_id_c,
                  .d = range_id_d},
      .previous_id = {.a = previous_id_a,
                      .b = previous_id_b,
                      .c = previous_id_c,
                      .d = previous_id_d},
      .next_range = nullptr,
      .previous_range = nullptr,
      .range_length = range_length,
      .consumer_reference = consumer_reference,
      .deleted = deleted_flag > 0,
  };

  find_target_range(target_index, state);

  state->ranges.insert({patch_range->this_id, patch_range});

  splice_range_at_current(target_index, patch_range, state, deleted_flag > 0);
  return target_index;
}
}
