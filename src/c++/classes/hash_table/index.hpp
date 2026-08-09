/**
 * @file
 * @brief Maps a Sequence Point to the stable position of its containing Strip.
 */
#pragma once

#include "../../declarations/sequence_coordinate/index.hpp"
#include <algorithm>
#include <cstdint>
#include <limits>
#include <memory>
#include <utility>
#include <vector>

class HashTable {
  struct Entry {
    std::uint32_t counter_bits;
    std::uint32_t frame_count;
    std::uint32_t stable_position;
  };

  struct Realm {
    std::uint32_t crypto_random_bits{0};
    std::uint32_t unix_lower_bits{0};
    std::vector<Entry> entries;
  };

  static constexpr std::uint32_t minimum_realm_capacity = 256;

  std::uint32_t realm_capacity;
  std::uint32_t realm_index_mask;
  std::uint32_t realm_count{0};
  std::unique_ptr<Realm[]> realms;

public:
  static constexpr std::uint32_t no_stable_position =
      std::numeric_limits<std::uint32_t>::max();

  explicit HashTable(
      const std::uint32_t initial_realm_capacity = minimum_realm_capacity)
      : realm_capacity(initial_realm_capacity),
        realm_index_mask(initial_realm_capacity - 1),
        realms(std::make_unique<Realm[]>(initial_realm_capacity)) {}

  inline void set(const SequencePoint &point, const std::uint32_t frame_count,
                  const std::uint32_t stable_position) noexcept {
    std::uint32_t realm_index = point.crypto_random_bits & realm_index_mask;

    while (!realms[realm_index].entries.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == point.crypto_random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        if (realm.entries.back().counter_bits < point.counter_bits) {
          realm.entries.push_back(
              {point.counter_bits, frame_count, stable_position});
          return;
        }

        const auto entry = std::lower_bound(
            realm.entries.begin(), realm.entries.end(), point.counter_bits,
            [](const Entry &candidate,
               const std::uint32_t counter_bits) noexcept {
              return candidate.counter_bits < counter_bits;
            });

        if (entry != realm.entries.end() &&
            entry->counter_bits == point.counter_bits)
          *entry = {point.counter_bits, frame_count, stable_position};
        else
          realm.entries.insert(
              entry, {point.counter_bits, frame_count, stable_position});
        return;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }

    Realm &realm = realms[realm_index];
    realm.crypto_random_bits = point.crypto_random_bits;
    realm.unix_lower_bits = point.unix_lower_bits;
    realm.entries.push_back({point.counter_bits, frame_count, stable_position});
    ++realm_count;

    if (realm_count >= realm_capacity / 2)
      resize(realm_capacity * 2);
  }

  [[nodiscard]] inline std::uint32_t
  get(const SequencePoint &point) const noexcept {
    std::uint32_t realm_index = point.crypto_random_bits & realm_index_mask;

    while (!realms[realm_index].entries.empty()) {
      const Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == point.crypto_random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        auto entry = std::upper_bound(
            realm.entries.begin(), realm.entries.end(), point.counter_bits,
            [](const std::uint32_t counter_bits,
               const Entry &candidate) noexcept {
              return counter_bits < candidate.counter_bits;
            });

        if (entry == realm.entries.begin())
          return no_stable_position;

        --entry;
        return point.counter_bits - entry->counter_bits < entry->frame_count
                   ? entry->stable_position
                   : no_stable_position;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }
    return no_stable_position;
  }

  [[nodiscard]] inline bool is_empty() const noexcept {
    return realm_count == 0;
  }

private:
  void resize(const std::uint32_t new_realm_capacity) {
    auto previous_realms = std::move(realms);
    const std::uint32_t previous_realm_capacity = realm_capacity;

    realm_capacity = new_realm_capacity;
    realm_index_mask = new_realm_capacity - 1;
    realm_count = 0;
    realms = std::make_unique<Realm[]>(new_realm_capacity);

    for (std::uint32_t previous_realm_index = 0;
         previous_realm_index < previous_realm_capacity;
         ++previous_realm_index) {
      if (previous_realms[previous_realm_index].entries.empty())
        continue;

      std::uint32_t realm_index =
          previous_realms[previous_realm_index].crypto_random_bits &
          realm_index_mask;
      while (!realms[realm_index].entries.empty())
        realm_index = (realm_index + 1) & realm_index_mask;

      realms[realm_index] = std::move(previous_realms[previous_realm_index]);
      ++realm_count;
    }
  }
};
