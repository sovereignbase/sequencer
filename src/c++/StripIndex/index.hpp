#pragma once

#include "../types/strip.hpp"
#include <algorithm>
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

template <PointInSequence StripOfSequence::*indexed_point =
              &StripOfSequence::this_strip_start>
class StripIndex {
public:
  struct Realm {
    uint32_t random_bits{0};
    uint32_t unix_lower_bits{0};
    std::vector<StripOfSequence> entries;
  };

private:
  uint32_t capacity;
  uint32_t mask;
  uint32_t realm_count = 0;

  std::unique_ptr<Realm[]> realms;

public:
  explicit StripIndex(uint32_t initial_capacity = 256)
      : capacity(initial_capacity), mask(initial_capacity - 1) {
    realms = std::make_unique<Realm[]>(capacity);
  }

  inline void set(PointInSequence point, StripOfSequence strip) noexcept {
    uint32_t realm_index = point.random_bits & mask;

    while (!realms[realm_index].entries.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        if ((realm.entries.back().*indexed_point).counter_bits <
            point.counter_bits) {
          realm.entries.push_back(strip);
          return;
        }

        const auto entry = std::lower_bound(
            realm.entries.begin(), realm.entries.end(), point.counter_bits,
            [](const StripOfSequence &candidate,
               const uint32_t counter_bits) noexcept {
              return (candidate.*indexed_point).counter_bits < counter_bits;
            });

        if (entry != realm.entries.end() &&
            ((*entry).*indexed_point).counter_bits == point.counter_bits) {
          *entry = strip;
        } else {
          realm.entries.insert(entry, strip);
        }
        return;
      }
      realm_index = (realm_index + 1) & mask;
    }

    Realm &realm = realms[realm_index];
    realm.random_bits = point.random_bits;
    realm.unix_lower_bits = point.unix_lower_bits;
    realm.entries.push_back(strip);
    realm_count++;

    if (realm_count >= capacity / 2) {
      resize(capacity * 2);
    }
  }

  [[nodiscard]] inline const StripOfSequence *
  get(const PointInSequence &point) const noexcept {
    uint32_t realm_index = point.random_bits & mask;

    while (!realms[realm_index].entries.empty()) {
      const Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        const auto entry = std::lower_bound(
            realm.entries.begin(), realm.entries.end(), point.counter_bits,
            [](const StripOfSequence &candidate,
               const uint32_t counter_bits) noexcept {
              return (candidate.*indexed_point).counter_bits < counter_bits;
            });

        if (entry != realm.entries.end() &&
            ((*entry).*indexed_point).counter_bits == point.counter_bits) {
          return &*entry;
        }
        return nullptr;
      }
      realm_index = (realm_index + 1) & mask;
    }
    return nullptr;
  }

  inline void remove(const PointInSequence &point) {
    uint32_t realm_index = point.random_bits & mask;

    while (!realms[realm_index].entries.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        const auto entry = std::lower_bound(
            realm.entries.begin(), realm.entries.end(), point.counter_bits,
            [](const StripOfSequence &candidate,
               const uint32_t counter_bits) noexcept {
              return (candidate.*indexed_point).counter_bits < counter_bits;
            });

        if (entry == realm.entries.end() ||
            ((*entry).*indexed_point).counter_bits != point.counter_bits)
          return;

        realm.entries.erase(entry);
        if (!realm.entries.empty())
          return;

        uint32_t empty_index = realm_index;
        uint32_t next_index = (realm_index + 1) & mask;

        while (!realms[next_index].entries.empty()) {
          const uint32_t home_index = realms[next_index].random_bits & mask;
          if (((next_index - home_index) & mask) >
              ((empty_index - home_index) & mask)) {
            realms[empty_index] = std::move(realms[next_index]);
            empty_index = next_index;
          }
          next_index = (next_index + 1) & mask;
        }

        realms[empty_index] = Realm{};
        realm_count--;
        if (capacity > 256 && realm_count <= capacity / 8)
          resize(capacity / 2);
        return;
      }
      realm_index = (realm_index + 1) & mask;
    }
  }

  inline uint32_t size() const noexcept { return realm_count; }

private:
  void resize(uint32_t new_capacity) {
    auto old_realms = std::move(realms);
    uint32_t old_capacity = capacity;

    capacity = new_capacity;
    mask = new_capacity - 1;
    realm_count = 0;

    realms = std::make_unique<Realm[]>(new_capacity);

    for (uint32_t i = 0; i < old_capacity; ++i) {
      if (!old_realms[i].entries.empty()) {
        uint32_t realm_index = old_realms[i].random_bits & mask;
        while (!realms[realm_index].entries.empty()) {
          realm_index = (realm_index + 1) & mask;
        }
        realms[realm_index] = std::move(old_realms[i]);
        realm_count++;
      }
    }
  }
};
