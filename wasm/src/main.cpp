
#include <cstdint>

#include "./types/type.hpp"

#include "./helpers/index.hpp"

#include <emscripten/emscripten.h>

extern "C" {
// CREATE
EMSCRIPTEN_KEEPALIVE
void add_instance(std::uint32_t instanceA, std::uint32_t instanceB,
                  std::uint32_t instanceC, std::uint32_t instanceD) {
  instances.insert(
      {Key{instanceA, instanceB, instanceC, instanceD}, State{
                                                            {},      // ranges
                                                            0,       // index
                                                            0,       // size
                                                            nullptr, // first
                                                            nullptr, // current
                                                            nullptr  // last
                                                        }});
}

EMSCRIPTEN_KEEPALIVE
void add_range_to(std::uint32_t range_length, std::uint32_t consumer_reference,
                  std::uint32_t deleted_flag std::uint32_t instanceA,
                  std::uint32_t instanceB, std::uint32_t instanceC,
                  std::uint32_t instanceD, std::uint32_t rangeA,
                  std::uint32_t rangeB, std::uint32_t rangeC,
                  std::uint32_t rangeD, std::uint32_t previousA,
                  std::uint32_t previousB, std::uint32_t previousC,
                  std::uint32_t previousD, ) {
  State *instance =
      find_instance_by_id(instanceA, instanceB, instanceC, instanceD);

  Range *range = new Range{
      .this_id = {a : rangeA, b : rangeB, c : rangeC, d : rangeD},
      .previous_id =
          {a : previousA, b : previousB, c : previousC, d : previousD},
      .next_range = nullptr,
      .previous_range = instance->current,
      .range_length = length,
      .consumer_reference = consumer_reference,
      .deleted = false,
  };
  instance->ranges.insert({range->this_id, range});

  if (!instance->current) {
    instance->first = range;
  } else {
    instance->current->next_range = range;
  }

  instance->index = instance->size;
  instance->current = range;
  instance->last = range;
  instance->size += length;
}

// Sort doubly linked list by merge rules
EMSCRIPTEN_KEEPALIVE
void resolve_order_for(std::uint32_t instanceA, std::uint32_t instanceB,
                       std::uint32_t instanceC, std::uint32_t instanceD) {
  State *instance =
      find_instance_by_id(instanceA, instanceB, instanceC, instanceD);
  instance->current = instance->first;
  Range *next = nullptr;
  while (instance->current->next_range) {
    Range *current = instance->current;
    next = current->next_range;

    Range *insert_after = current->previous_range;

    if (key_is_zero(current->previous_id)) {
      Range *before = instance->first;
      while (before != current && key_is_zero(before->previous_id) &&
             key_is_less(current->this_id, before->this_id))
        before = before->next_range;

      if (before != current)
        insert_after = before ? before->previous_range : instance->last;
    } else if (!current->previous_range ||
               current->previous_id != current->previous_range->this_id) {
      auto previous = instance->ranges.find(current->previous_id);
      if (previous != instance->ranges.end()) {
        insert_after = previous->second;

        while (insert_after->next_range &&
               insert_after->next_range != current &&
               insert_after->next_range->previous_id == current->previous_id &&
               key_is_less(insert_after->next_range->this_id, current->this_id))
          insert_after = insert_after->next_range;
      }
    }

    if (insert_after != current && insert_after != current->previous_range) {
      if (current->previous_range)
        current->previous_range->next_range = current->next_range;
      else
        instance->first = current->next_range;

      if (current->next_range)
        current->next_range->previous_range = current->previous_range;
      else
        instance->last = current->previous_range;

      if (!insert_after) {
        current->previous_range = nullptr;
        current->next_range = instance->first;
        instance->first->previous_range = current;
        instance->first = current;
      } else {
        current->previous_range = insert_after;
        current->next_range = insert_after->next_range;
        if (insert_after->next_range)
          insert_after->next_range->previous_range = current;
        else
          instance->last = current;
        insert_after->next_range = current;
      }
    }

    instance->current = next;
  }
  instance->current = instance->first;
  instance->index = 0;
}

// READ
EMSCRIPTEN_KEEPALIVE std::uint32_t
get_consumer_reference_of(std::uint32_t target, std::uint32_t a,
                          std::uint32_t b, std::uint32_t c, std::uint32_t d) {
  State *instance = find_instance_by_id(a, b, c, d);
  walk_to_target_range(target, instance);
  return instance->current->consumer_reference +
         distance_of_numbers(instance->index, target);
}
EMSCRIPTEN_KEEPALIVE
std::uint32_t get_live_item_amount(std::uint32_t instanceA,
                                   std::uint32_t instanceB,
                                   std::uint32_t instanceC,
                                   std::uint32_t instanceD) {
  return find_instance_by_id(instanceA, instanceB, instanceC, instanceD)->size;
}
// UPDATE / DELETE
/**
 * Moves entries to right for range length starting/including target_index or
 * Moves entries to left starting/including target_index to range length
 * @param target_index Inclusive zero-based index.
 * @param range_length Amount of inserted/removed entries
 */
EMSCRIPTEN_KEEPALIVE
void apply(std::uint32_t target_index, std::uint32_t range_length,
           std::uint32_t deleted_flag, std::uint32_t instanceA,
           std::uint32_t instanceB, std::uint32_t instanceC,
           std::uint32_t instanceD, std::uint32_t rangeA, std::uint32_t rangeB,
           std::uint32_t rangeC, std::uint32_t rangeD, std::uint32_t previousA,
           std::uint32_t previousB, std::uint32_t previousC,
           std::uint32_t previousD) {
  State *instance =
      find_instance_by_id(instanceA, instanceB, instanceC, instanceD);
  walk_to_target_range(target_index, instance);

  Range *range = new Range{
      .this_id = {a : rangeA, b : rangeB, c : rangeC, d : rangeD},
      .previous_id =
          {a : previousA, b : previousB, c : previousC, d : previousD},
      .next_range = nullptr,
      .previous_range = nullptr,
      .range_length = range_length,
      .consumer_reference = target_index,
      .deleted = remove > 0,
  };
  instance->ranges.insert({range->this_id, range});

  splice_range_into_current_range(target_index, range, instance, remove > 0);
  return;
}
}
