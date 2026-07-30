#include "../types/type.hpp"
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

class SequenceStripIndex {
public:
  struct Realm {
    uint32_t random{0};
    uint32_t unix_low_ms{0};
    std::vector<uint32_t> entries[];
  };

private:
  uint32_t capacity;
  uint32_t limit = capacity * 0.5f;
  uint32_t mask;
  uint32_t size = 0;

  std::unique_ptr<Realm[]> realms;

public:
  explicit SequencePointIndex(uint32_t initial_capacity = 256)
      : capacity(initial_capacity), mask(initial_capacity - 1) {
    realms = std::make_unique<Realm[]>(capacity);
  }

  inline void set(SequenceStrip) noexcept {
    uint32_t realm_index = random & mask;

    while (realms[realm_index].) {
      Realm &realm = realms[realm_index];
      if (realm.random == random && realm.unix_low_ms == unix_low_ms) {
        realm.entries[counter] = val;
        return;
      }
      realm_index = (realm_index + 1) & mask;
    }

    Realm &s = realms[realm_index];
    s.k0 = k0;
    s.k1 = k1;
    s.k2 = k2;
    s.k3 = k3;
    s.val = val;
    s.occupied = 1;
    size++;

    if (size > limit) {
      upsize(capacity * 2);
    }
  }

  [[nodiscard]] inline int64_t get(uint32_t random, uint32_t k1, uint32_t k2,
                                   uint32_t k3) const noexcept {
    uint32_t slot = random & mask;

    while (slots[slot].occupied == 1) {
      const Realm &s = slots[slot];
      if (s.k0 == k0 && s.k1 == k1 && s.k2 == k2 && s.k3 == k3) {
        return s.val;
      }
      slot = (slot + 1) & mask;
    }

    return -1;
  }

private:
  void upsize(uint32_t new_capacity) {
    auto old_slots = std::move(slots);
    uint32_t old_capacity = capacity;

    capacity = new_capacity;
    mask = new_capacity - 1;
    size = 0;

    slots = std::make_unique<Realm[]>(new_capacity);

    for (uint32_t i = 0; i < old_capacity; ++i) {
      if (old_slots[i].occupied == 1) {
        set(old_slots[i].k0, old_slots[i].k1, old_slots[i].k2, old_slots[i].k3,
            old_slots[i].val);
      }
    }
  }
};