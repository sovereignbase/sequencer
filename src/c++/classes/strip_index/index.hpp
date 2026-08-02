/**
 * @file
 * @brief Defines the cache-oriented index used for materialized and pending
 * strips.
 *
 * StripIndex groups point keys by realm and keeps each realm's strips ordered
 * by point counter. Realm lookup uses open addressing with linear probing;
 * point lookup inside a realm uses binary search.
 */
#pragma once

#include "../../declarations/strip/index.hpp"
#include <algorithm>
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

/**
 * @brief Index Strip values by one member of SequenceCoordinate.
 *
 * @tparam indexed_sequence_point Coordinate member used as the exact key.
 * The primary projector index uses `this_strip_start`; pending indexes use
 * `previous_strip_start`. Key selection is resolved at compile time and adds
 * neither per-index memory nor a runtime branch.
 *
 * @note Any successful `set` or `remove` may invalidate pointers returned by
 * `get` because realm vectors and the realm table may move.
 */
template <SequencePoint SequenceCoordinate::*indexed_sequence_point =
              &SequenceCoordinate::this_strip_start>
class StripIndex {
public:
  /**
   * @brief One indexed point realm and its counter-ordered strips.
   */
  struct Realm {
    /// Realm discriminator shared by every indexed point in `strips`.
    std::uint32_t random_bits{0};

    /// Realm time component shared by every indexed point in `strips`.
    std::uint32_t unix_lower_bits{0};

    /// Strips ordered by the counter of the selected coordinate point.
    std::vector<Strip> strips;
  };

private:
  static constexpr std::uint32_t minimum_realm_capacity = 256;

  std::uint32_t realm_capacity;
  std::uint32_t realm_index_mask;
  std::uint32_t realm_count{0};
  std::unique_ptr<Realm[]> realms;

public:
  /**
   * @brief Construct an empty index with a power-of-two realm capacity.
   *
   * @param initial_realm_capacity Initial number of open-addressing slots.
   * @pre `initial_realm_capacity` is a power of two and is at least 256.
   */
  explicit StripIndex(
      const std::uint32_t initial_realm_capacity = minimum_realm_capacity)
      : realm_capacity(initial_realm_capacity),
        realm_index_mask(initial_realm_capacity - 1),
        realms(std::make_unique<Realm[]>(initial_realm_capacity)) {}

  /**
   * @brief Insert or replace one strip under its selected coordinate point.
   *
   * Appending a monotonically increasing point within an existing realm is a
   * constant-time fast path. Other counters are located with binary search.
   *
   * @param point Exact key represented by the selected coordinate member.
   * @param strip Strip to store by value.
   * @pre `point == strip.coordinate.*indexed_sequence_point`.
   * @complexity Expected O(1) realm lookup plus O(log n) search and O(n)
   * insertion within one realm; monotonic append is expected O(1).
   */
  inline void set(const SequencePoint &point, Strip strip) noexcept {
    std::uint32_t realm_index = point.random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        if ((realm.strips.back().coordinate.*indexed_sequence_point)
                .counter_bits < point.counter_bits) {
          realm.strips.push_back(strip);
          return;
        }

        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(), point.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });

        if (strip_iterator != realm.strips.end() &&
            (strip_iterator->coordinate.*indexed_sequence_point).counter_bits ==
                point.counter_bits) {
          *strip_iterator = strip;
        } else {
          realm.strips.insert(strip_iterator, strip);
        }
        return;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }

    Realm &realm = realms[realm_index];
    realm.random_bits = point.random_bits;
    realm.unix_lower_bits = point.unix_lower_bits;
    realm.strips.push_back(strip);
    realm_count++;

    if (realm_count >= realm_capacity / 2)
      resize(realm_capacity * 2);
  }

  /**
   * @brief Return the strip stored under one exact sequence point.
   *
   * @param point Exact selected-coordinate key to locate.
   * @return Pointer to the stored strip, or `nullptr` when absent.
   * @note The pointer remains valid only until the index is modified.
   * @complexity Expected O(1) realm lookup plus O(log n) within one realm.
   */
  [[nodiscard]] inline const Strip *
  get(const SequencePoint &point) const noexcept {
    std::uint32_t realm_index = point.random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      const Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(), point.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });

        if (strip_iterator != realm.strips.end() &&
            (strip_iterator->coordinate.*indexed_sequence_point).counter_bits ==
                point.counter_bits)
          return &*strip_iterator;

        return nullptr;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }
    return nullptr;
  }

  /**
   * @brief Remove the strip stored under one exact sequence point.
   *
   * Missing points are ignored. Removing a realm's final strip closes its
   * linear-probing hole and may halve a sparsely populated realm table.
   *
   * @param point Exact selected-coordinate key to remove.
   * @complexity Expected O(1) realm lookup, O(log n) search, and O(n) vector
   * erase within one realm; realm removal may additionally scan a probe run.
   */
  inline void remove(const SequencePoint &point) {
    std::uint32_t realm_index = point.random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.random_bits == point.random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(), point.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });

        if (strip_iterator == realm.strips.end() ||
            (strip_iterator->coordinate.*indexed_sequence_point).counter_bits !=
                point.counter_bits)
          return;

        realm.strips.erase(strip_iterator);
        if (!realm.strips.empty())
          return;

        std::uint32_t empty_realm_index = realm_index;
        std::uint32_t next_realm_index = (realm_index + 1) & realm_index_mask;

        while (!realms[next_realm_index].strips.empty()) {
          const std::uint32_t home_realm_index =
              realms[next_realm_index].random_bits & realm_index_mask;
          if (((next_realm_index - home_realm_index) & realm_index_mask) >
              ((empty_realm_index - home_realm_index) & realm_index_mask)) {
            realms[empty_realm_index] = std::move(realms[next_realm_index]);
            realms[next_realm_index] = Realm{};
            empty_realm_index = next_realm_index;
          }
          next_realm_index = (next_realm_index + 1) & realm_index_mask;
        }

        realms[empty_realm_index] = Realm{};
        realm_count--;
        if (realm_capacity > minimum_realm_capacity &&
            realm_count <= realm_capacity / 8)
          resize(realm_capacity / 2);
        return;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }
  }

  /**
   * @brief Report whether the index contains no strips.
   *
   * Realm occupancy is sufficient because an empty realm is never retained.
   *
   * @return `true` when no exact point key is stored; otherwise `false`.
   */
  [[nodiscard]] inline bool is_empty() const noexcept {
    return realm_count == 0;
  }

private:
  /**
   * @brief Rehash every occupied realm into a new power-of-two table.
   *
   * @param new_realm_capacity Number of slots in the replacement table.
   * @pre `new_realm_capacity` is a power of two and is at least 256.
   */
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
      if (previous_realms[previous_realm_index].strips.empty())
        continue;

      std::uint32_t realm_index =
          previous_realms[previous_realm_index].random_bits & realm_index_mask;
      while (!realms[realm_index].strips.empty())
        realm_index = (realm_index + 1) & realm_index_mask;

      realms[realm_index] = std::move(previous_realms[previous_realm_index]);
      realm_count++;
    }
  }
};
