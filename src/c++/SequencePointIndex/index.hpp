#include <cstdint>
#include <memory>
#include <utility>

class SequencePointIndex {
public:
  struct Slot {
    uint32_t random{0};
    uint32_t unix_low_ms{0};
    uint32_t counter{0};
    uint32_t k3{0}; // Counter / sequence-osa
    uint32_t val{0};
    uint8_t occupied{0};
  };

private:
  uint32_t capacity;
  uint32_t limit = capacity * 0.5f;
  uint32_t mask;
  uint32_t size = 0;

  std::unique_ptr<Slot[]> slots;

public:
  explicit SequencePointIndex(uint32_t initial_capacity = 256)
      : capacity(initial_capacity), mask(initial_capacity - 1) {
    slots = std::make_unique<Slot[]>(capacity);
  }

  inline void set(uint32_t k0, uint32_t k1, uint32_t k2, uint32_t k3,
                  uint32_t val) noexcept {
    uint32_t slot = k0 & mask;

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

    if (size > limit) {
      upsize(capacity * 2);
    }
    if (size < limit) {
      downsize
    }
  }

  [[nodiscard]] inline int64_t get(uint32_t k0, uint32_t k1, uint32_t k2,
                                   uint32_t k3) const noexcept {
    uint32_t slot = hash(k0, k1, k2, k3) & mask;

    while (slots[slot].occupied == 1) {
      const Slot &s = slots[slot];
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

    slots = std::make_unique<Slot[]>(new_capacity);

    for (uint32_t i = 0; i < old_capacity; ++i) {
      if (old_slots[i].occupied == 1) {
        set(old_slots[i].k0, old_slots[i].k1, old_slots[i].k2, old_slots[i].k3,
            old_slots[i].val);
      }
    }
  }
};