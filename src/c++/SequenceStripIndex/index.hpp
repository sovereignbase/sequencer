#pragma once

#include "../types/type.hpp"
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

class SequenceStripIndex {
public:
  struct Realm {
    uint32_t random_bits{0};
    uint32_t unix_lower_bits{0};
    std::vector<StripOfSequence> entries;
  };

private:
  uint32_t capacity;
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

    while (!realms[realm_index].entries.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        if (realm.entries.size() <= point.counter_bits) {
          realm.entries.resize(static_cast<std::size_t>(point.counter_bits) +
                               1);
        }
        realm.entries[point.counter_bits] = strip;
        return;
      }
      realm_index = (realm_index + 1) & mask;
    }

    Realm &realm = realms[realm_index];
    realm.random_bits = point.random_bits;
    realm.unix_lower_bits = point.unix_lower_bits;
    realm.entries.resize(static_cast<std::size_t>(point.counter_bits) + 1);
    realm.entries[point.counter_bits] = strip;
    size++;

    if (size >= capacity / 2) {
      upsize(capacity * 2);
    }
  }

  [[nodiscard]] inline StripOfSequence
  get(PointInSequence *point) const noexcept {
    uint32_t realm_index = point->random_bits & mask;

    while (!realms[realm_index].entries.empty()) {
      const Realm &realm = realms[realm_index];
      if (realm.random_bits == point->random_bits &&
          realm.unix_lower_bits == point->unix_lower_bits &&
          realm.entries.size() > point->counter_bits) {
        return realm.entries[point->counter_bits];
      }
      realm_index = (realm_index + 1) & mask;
    }
    return {};
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
      if (!old_realms[i].entries.empty()) {
        uint32_t realm_index = old_realms[i].random_bits & mask;
        while (!realms[realm_index].entries.empty()) {
          realm_index = (realm_index + 1) & mask;
        }
        realms[realm_index] = std::move(old_realms[i]);
        size++;
      }
    }
  }
};
