#pragma once
#include "../types/type.hpp"
#include <cstdint>
#include <memory>
#include <utility>

class SequencePointMap {
public:
  struct Slot {
    uint32_t k0{0};
    uint32_t k1{0};
    uint32_t k2{0};
    uint32_t k3{0};
    uint32_t val{0};
    uint8_t occupied{0};
  };

private:
  uint32_t capacity;
  uint32_t mask;
  uint32_t size = 0;

  std::unique_ptr<Slot[]> slots;

public:
  explicit SequencePointMap(uint32_t initial_capacity = 1024)
      : capacity(initial_capacity), mask(initial_capacity - 1) {
    slots = std::make_unique<Slot[]>(capacity);
  }

  [[nodiscard]] inline uint32_t hash(uint32_t k0, uint32_t k1, uint32_t k2,
                                     uint32_t k3) const noexcept {
    return k0 ^ k1 ^ k2 ^ (k3 * 0x9e3779b9u);
  }

  inline void set(SequencePoint key, uint32_t value) noexcept {
    uint32_t slot = hash(key[0], key[1], key[2], key[3]) & mask;

    while (slots[slot].occupied == 1) {
      Slot &s = slots[slot];
      if (s.k0 == k0 && s.k1 == k1 && s.k2 == k2 && s.k3 == k3) {
        s.val = val;
        return;
      }
      slot = (slot + 1) & mask;
    }

    Slot &s = slots[slot];
    s.k0 = k0;
    s.k1 = k1;
    s.k2 = k2;
    s.k3 = k3;
    s.val = val;
    s.occupied = 1;
    size++;

    if (size > capacity * 0.7f) {
      resize(capacity * 2);
    }
  }

  [[nodiscard]] inline uint32_t get(SequencePoint key) const noexcept {
    uint32_t slot_key = hash(k0, k1, k2, k3) & mask;

    while (slots[slot_key].occupied == 1) {
      const Slot &slot_value = slots[slot_key];
      if (slot_value.k0 == k0 && slot_value.k1 == k1 && slot_value.k2 == k2 &&
          slot_value.k3 == k3) {
        return s.val;
      }
      slot_key = (slot_key + 1) & mask;
    }
  }

private:
  void resize(uint32_t new_capacity) {
    auto old_slots = std::move(slots);
    uint32_t old_cap = capacity;

    capacity = new_capacity;
    mask = new_capacity - 1;
    size = 0;

    slots = std::make_unique<Slot[]>(new_capacity);

    for (uint32_t i = 0; i < old_cap; ++i) {
      if (old_slots[i].occupied == 1) {
        set(old_slots[i].k0, old_slots[i].k1, old_slots[i].k2, old_slots[i].k3,
            old_slots[i].val);
      }
    }
  }
};