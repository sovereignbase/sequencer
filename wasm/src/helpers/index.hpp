#pragma once

#include <cstdint>
#include <unordered_map>

#include "../types/type.hpp"

static std::unordered_map<Key, State, KeyHash> instances;
/////
State *find_instance_by_id(std::uint32_t thisA, std::uint32_t thisB,
                           std::uint32_t thisC, std::uint32_t thisD) {
  auto iterator = instances.find(Key{thisA, thisB, thisC, thisD});

  if (iterator == instances.end()) {
    return nullptr;
  }

  return &iterator->second;
}
std::uint32_t distance_of_numbers(std::uint32_t num1, std::uint32_t num2) {
  return num1 > num2 ? num1 - num2 : num2 - num1;
}
/////
bool index_is_within_current_range(State *instance, std::uint32_t index) {
  return (index >= instance->index &&
          index < (instance->index + instance->current->range_length));
}
/////
void walk_to_target_range(std::uint32_t target, State *instance) {

  if (instance == nullptr) {
    return;
  }

  std::uint32_t distance = distance_of_numbers(instance->index, target);

  const std::uint32_t headDistance = target;

  if (headDistance < distance) {
    instance->index = 0;
    instance->current = instance->first;
    distance = headDistance;
  }

  const std::uint32_t tail = instance->size - 1;
  const std::uint32_t tailDistance = distance_of_numbers(tail, target);

  if (tailDistance < distance) {
    instance->index = tail;
    instance->current = instance->last;
  }

  if (index_is_within_current_range(instance, target)) {
    return;
  }

  if (instance->index < target) {
    while (!index_is_within_current_range(instance, target)) {
      instance->current = instance->current->next_range;
      if (!instance->current->deleted)
        instance->index += instance->current->range_length;
    }
    return;
  }

  while (!index_is_within_current_range(instance, target)) {
    instance->current = instance->current->previous_range;
    if (!instance->current->deleted)
      instance->index -= instance->current->range_length;
  }
}
/////
void splice_range_into_current_range(std::uint32_t target, Range *range,
                                     State *instance) {
  Range *left_range = instance->current;
  std::uint32_t distance = distance_of_numbers(instance->index, target);

  Range *right_range = new Range{
      .this_id =
          {
              .a = left_range->this_id.a,
              .b = left_range->this_id.b,
              .c = left_range->this_id.c,
              .d = left_range->this_id.d + distance,
          },
      .previous_id = left_range->this_id,
      .deleted = left_range->deleted,
      .range_length = left_range->range_length - distance,
      .previous_range = range,
      .next_range = left_range->next_range,
  };

  left_range->range_length -= distance;

  range->next_range = right_range;
  left_range->next_range = range;

  instance->current = range;
  instance->index += distance;
}
////