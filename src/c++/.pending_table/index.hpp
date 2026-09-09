/**
 * @file
 * @brief Maps missing dependency points to all waiting Strip indices.
 *
 * Realm selection uses a power-of-two bit mask and linear probing. Each Realm
 * owns counter-sorted dependency entries, each containing its waiting Strips.
 */
#pragma once

#include "../.declarations/sentinels/index.hpp"
#include "../.declarations/sequence_point/index.hpp"
#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

/**
 * @brief Open-addressed Realm table of pending dependency points.
 * @invariant Realm capacity is a nonzero power of two.
 * @invariant Empty Realm entry vectors denote unoccupied slots.
 * @invariant Outside a skip_sort batch, dependency counters are sorted and
 * unique within each Realm.
 */
class PendingTable {
  struct Entry {
    std::uint32_t counter_bits;
    std::vector<std::uint32_t> strip_indices;
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
  /** @pre initial_realm_capacity is a nonzero power of two. */
  explicit PendingTable(
      const std::uint32_t initial_realm_capacity = minimum_realm_capacity)
      : realm_capacity(initial_realm_capacity),
        realm_index_mask(initial_realm_capacity - 1),
        realms(std::make_unique<Realm[]>(initial_realm_capacity)) {}

  /**
   * @brief Register a Strip waiting for the given previous Strip end.
   * @note Multiple Strips may wait for the same dependency point.
   * @note Normal registration of the same point and Strip is a no-op.
   * @pre A skip_sort batch contains unique point/Strip pairs; call sort_realms
   * before get, take, erase or normal set.
   */
  void set(const SequencePoint &point, const std::uint32_t strip_index,
           const bool skip_sort = false) noexcept {
    const std::uint32_t realm_index = find_realm(point);
    Realm &realm = realms[realm_index];

    if (realm.entries.empty()) {
      realm.crypto_random_bits = point.crypto_random_bits;
      realm.unix_lower_bits = point.unix_lower_bits;
      realm.entries.push_back({point.counter_bits, {strip_index}});
      ++realm_count;
      if (realm_count >= realm_capacity / 2)
        resize(realm_capacity * 2);
      return;
    }

    if (skip_sort || realm.entries.back().counter_bits < point.counter_bits) {
      realm.entries.push_back({point.counter_bits, {strip_index}});
      return;
    }

    const auto entry = std::lower_bound(
        realm.entries.begin(), realm.entries.end(), point.counter_bits,
        [](const Entry &candidate, const std::uint32_t counter_bits) noexcept {
          return candidate.counter_bits < counter_bits;
        });
    if (entry == realm.entries.end() ||
        entry->counter_bits != point.counter_bits) {
      realm.entries.insert(entry, {point.counter_bits, {strip_index}});
      return;
    }

    auto &strip_indices = entry->strip_indices;
    if (std::find(strip_indices.begin(), strip_indices.end(), strip_index) ==
        strip_indices.end())
      strip_indices.push_back(strip_index);
  }

  /** @brief Sort batched dependency entries and combine equal counters. */
  void sort_realms() noexcept {
    for (std::uint32_t realm_index = 0; realm_index < realm_capacity;
         ++realm_index) {
      auto &entries = realms[realm_index].entries;
      std::sort(entries.begin(), entries.end(),
                [](const Entry &left, const Entry &right) noexcept {
                  return left.counter_bits < right.counter_bits;
                });

      std::size_t entry_count = 0;
      for (std::size_t entry_index = 0; entry_index < entries.size();
           ++entry_index) {
        if (entry_count != 0 &&
            entries[entry_count - 1].counter_bits ==
                entries[entry_index].counter_bits) {
          auto &strip_indices = entries[entry_count - 1].strip_indices;
          const auto &incoming_indices = entries[entry_index].strip_indices;
          strip_indices.insert(strip_indices.end(), incoming_indices.begin(),
                               incoming_indices.end());
        } else {
          if (entry_count != entry_index)
            entries[entry_count] = std::move(entries[entry_index]);
          ++entry_count;
        }
      }
      entries.resize(entry_count);
    }
  }

  /**
   * @brief Return every Strip waiting on a point in the arriving Strip's span.
   * @note The range is [strip_start, strip_start + frame_count) within the same
   * Realm, without counter wraparound. No matches returns an empty vector.
   * @complexity Expected O(1 + log e + k) for e dependency entries in the Realm
   * and k returned Strip indices.
   */
  [[nodiscard]] std::vector<std::uint32_t>
  get(const SequencePoint &strip_start,
      const std::uint32_t frame_count) const noexcept {
    std::vector<std::uint32_t> result;
    if (frame_count == 0)
      return result;

    const auto &entries = realms[find_realm(strip_start)].entries;
    auto entry = std::lower_bound(
        entries.begin(), entries.end(), strip_start.counter_bits,
        [](const Entry &candidate, const std::uint32_t counter_bits) noexcept {
          return candidate.counter_bits < counter_bits;
        });
    for (; entry != entries.end() &&
           entry->counter_bits - strip_start.counter_bits < frame_count;
         ++entry)
      result.insert(result.end(), entry->strip_indices.begin(),
                    entry->strip_indices.end());
    return result;
  }

  /** @brief Return and remove all waiters in the same half-open range as get. */
  [[nodiscard]] std::vector<std::uint32_t>
  take(const SequencePoint &strip_start,
       const std::uint32_t frame_count) noexcept {
    auto result = get(strip_start, frame_count);
    if (result.empty())
      return result;

    const std::uint32_t realm_index = find_realm(strip_start);
    auto &entries = realms[realm_index].entries;
    const auto first_entry = std::lower_bound(
        entries.begin(), entries.end(), strip_start.counter_bits,
        [](const Entry &candidate, const std::uint32_t counter_bits) noexcept {
          return candidate.counter_bits < counter_bits;
        });
    auto last_entry = first_entry;
    while (last_entry != entries.end() &&
           last_entry->counter_bits - strip_start.counter_bits < frame_count)
      ++last_entry;
    entries.erase(first_entry, last_entry);
    remove_empty_realm(realm_index);
    return result;
  }

  /** @brief Remove all Strips waiting on the exact dependency point. */
  bool erase(const SequencePoint &point) noexcept {
    const std::uint32_t realm_index = find_realm(point);
    auto &entries = realms[realm_index].entries;
    const auto entry = std::lower_bound(
        entries.begin(), entries.end(), point.counter_bits,
        [](const Entry &candidate, const std::uint32_t counter_bits) noexcept {
          return candidate.counter_bits < counter_bits;
        });
    if (entry == entries.end() || entry->counter_bits != point.counter_bits)
      return false;

    entries.erase(entry);
    remove_empty_realm(realm_index);
    return true;
  }

  /** @brief Remove one Strip without removing other waiters at its point. */
  bool erase(const SequencePoint &point,
             const std::uint32_t strip_index) noexcept {
    const std::uint32_t realm_index = find_realm(point);
    auto &entries = realms[realm_index].entries;
    const auto entry = std::lower_bound(
        entries.begin(), entries.end(), point.counter_bits,
        [](const Entry &candidate, const std::uint32_t counter_bits) noexcept {
          return candidate.counter_bits < counter_bits;
        });
    if (entry == entries.end() || entry->counter_bits != point.counter_bits)
      return false;

    auto &strip_indices = entry->strip_indices;
    const auto strip =
        std::find(strip_indices.begin(), strip_indices.end(), strip_index);
    if (strip == strip_indices.end())
      return false;

    strip_indices.erase(strip);
    if (strip_indices.empty())
      entries.erase(entry);
    remove_empty_realm(realm_index);
    return true;
  }

  /**
   * @brief List all pending Strip indices for snapshots without resolving them.
   * @note Leaves the table unchanged and provides no ordering guarantee.
   * @complexity O(r + k) for r Realm slots and k pending Strips.
   */
  [[nodiscard]] std::vector<std::uint32_t> values() const noexcept {
    std::vector<std::uint32_t> result;
    for (std::uint32_t realm_index = 0; realm_index < realm_capacity;
         ++realm_index)
      for (const auto &entry : realms[realm_index].entries)
        result.insert(result.end(), entry.strip_indices.begin(),
                      entry.strip_indices.end());
    return result;
  }

  /** @brief Report whether no Strips are waiting for dependencies. */
  [[nodiscard]] bool is_empty() const noexcept { return realm_count == 0; }

private:
  [[nodiscard]] std::uint32_t
  find_realm(const SequencePoint &point) const noexcept {
    std::uint32_t realm_index = point.crypto_random_bits & realm_index_mask;
    while (!realms[realm_index].entries.empty()) {
      const Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == point.crypto_random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits)
        break;
      realm_index = (realm_index + 1) & realm_index_mask;
    }
    return realm_index;
  }

  void remove_empty_realm(const std::uint32_t realm_index) noexcept {
    if (!realms[realm_index].entries.empty())
      return;

    --realm_count;
    std::uint32_t empty_index = realm_index;
    std::uint32_t next_index = (empty_index + 1) & realm_index_mask;
    while (!realms[next_index].entries.empty()) {
      const std::uint32_t home_index =
          realms[next_index].crypto_random_bits & realm_index_mask;
      if (((empty_index - home_index) & realm_index_mask) <
          ((next_index - home_index) & realm_index_mask)) {
        realms[empty_index] = std::move(realms[next_index]);
        realms[next_index].entries.clear();
        empty_index = next_index;
      }
      next_index = (next_index + 1) & realm_index_mask;
    }
  }

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
