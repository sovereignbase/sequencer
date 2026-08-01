#include "../types/type.hpp"
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

class SequenceStripIndex {
public:
  struct Realm {
    uint32_t unix_lower_bits{0};
    std::vector<StripOfSequence> entries[];
  };

private:
  uint32_t capacity;
  uint32_t limit = capacity * 0.5f;
  uint32_t mask;
  uint32_t size = 0;

  std::unique_ptr<Realm[]> realms;

public:
  explicit SequenceStripIndex(uint32_t initial_capacity = 256)
      : capacity(initial_capacity), mask(initial_capacity - 1) {
    realms = std::make_unique<Realm[]>(capacity);
  }

  inline void set(PointInSequence point, StripOfSequence strip) noexcept {
    uint32_t realm_index = point.random_bits & mask;

    while (realms[realm_index].unix_lower_bits >= 0) {
      Realm &realm = realms[realm_index];
      if (realm.unix_lower_bits == point.unix_lower_bits) {
        realm.entries[point.counter_bits] = strip;
        return;
      }
      realm_index = (realm_index + 1) & mask;
    }

    Realm &realm = realms[realm_index];
    realm.unix_lower_bits = point.unix_lower_bits;
    realm.entries[point.counter_bits] = strip;
    size++;

    if (size >= limit) {
      upsize(capacity * 2);
    }
  }

  [[nodiscard]] inline StripOfSequence
  get(PointInSequence *point) const noexcept {
    uint32_t realm_index = point->random_bits & mask;

    while (realms[realm_index].unix_lower_bits >= 0) {
      const Realm &realm = realms[realm_index];
      if (realm.unix_lower_bits == point->unix_lower_bits) {
        return realm.entries[point->counter_bits];
      }
      realm_index = (realm_index + 1) & mask;
    }
    return
  }

private:
  void upsize(uint32_t new_capacity) {
    auto old_realms = std::move(realms);
    uint32_t old_capacity = capacity;

    capacity = new_capacity;
    mask = new_capacity - 1;
    size = 0;

    realms = std::make_unique<Realm[]>(new_capacity);

    for (uint32_t i = 0; i < old_capacity; ++i) {
      if (old_realms[i].unix_lower_bits >= 0) {
        set();
      }
    }
  }
};