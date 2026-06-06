#pragma once

#include <cstdint>
#include <cstdlib>
#include <unordered_map>

#include "../types/type.hpp"

static std::unordered_map<Key, State, KeyHash> instances;

State* find_instance_by_id(
    std::int32_t a,
    std::int32_t b,
    std::int32_t c,
    std::int32_t d
) {
    auto iterator = instances.find(Key{a, b, c, d});

    if (iterator == instances.end()) {
        return nullptr;
    }

    return &iterator->second;
}

void seek_current_to_target(
    std::int32_t target,
    State* instance
) {

    if (instance == nullptr) {
        return;
    }

    std::int32_t distance = std::abs(instance->index - target);

    const std::int32_t headDistance = target;

    if (headDistance < distance) {
        instance->index = 0;
        instance->current = instance->first;
        distance = headDistance;
    }

    const std::int32_t tail = instance->size - 1;
    const std::int32_t tailDistance = std::abs(tail - target);

    if (tailDistance < distance) {
        instance->index = tail;
        instance->current = instance->last;
    }

    if (instance->index == target) {
        return;
    }

    if (instance->index < target) {
        
        while (instance->index != target) {
            instance->current = instance->current->next;
            instance->index++;
        }
        return;

    }

    while (instance->index != target) {
        instance->current = instance->current->previous;
        instance->index--;
    }
}

