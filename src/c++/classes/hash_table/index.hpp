/**
 * @file
 * @brief Maps Sequence Point containment to Stable Positions.
 *
 * Realm selection uses a power-of-two bit mask and linear probing. Each
 * occupied Realm owns a counter-sorted vector of compact span entries, allowing
 * containment to be resolved with one equality probe sequence followed by
 * binary search. Strip objects remain Projector-owned.
 */
#pragma once

#include "../../declarations/sequence_coordinate/index.hpp"
#include "../../declarations/sentinels/index.hpp"
#include <algorithm>
#include <cstdint>
#include <map>
#include <memory>
#include <utility>
#include <vector>

/**
 * @brief Open-addressed Realm table with binary-searched Frame Span entries.
 *
 * A Realm key is `(crypto_random_bits, unix_lower_bits)`. Each Entry describes
 * the half-open counter interval `[counter_bits, counter_bits + frame_count)`
 * and the Stable Position of its containing Strip.
 *
 * @invariant `realm_capacity` is a power of two and
 * `realm_index_mask == realm_capacity - 1`.
 * @invariant Entries within one Realm are sorted by `counter_bits`.
 * @invariant An empty Entry vector denotes an unoccupied Realm slot.
 */
class HashTable {
  struct SequencePointOrder {
    [[nodiscard]] bool operator()(const SequencePoint &left,
                                  const SequencePoint &right) const noexcept {
      if (left.crypto_random_bits != right.crypto_random_bits)
        return left.crypto_random_bits < right.crypto_random_bits;
      if (left.unix_lower_bits != right.unix_lower_bits)
        return left.unix_lower_bits < right.unix_lower_bits;
      return left.counter_bits < right.counter_bits;
    }
  };

  /** @brief Compact containment interval stored inside one Realm. */
  struct Entry {
    /** @brief Counter of the first represented Frame. */
    std::uint32_t counter_bits;

    /** @brief Positive length of the represented counter interval. */
    std::uint32_t frame_count;

    /** @brief Projector-owned Stable Position for the interval. */
    std::uint32_t stable_position;
  };

  /** @brief One occupied or empty open-addressing slot. */
  struct Realm {
    /** @brief Primary identity and initial-slot hash input. */
    std::uint32_t crypto_random_bits{0};

    /** @brief Secondary Realm identity component. */
    std::uint32_t unix_lower_bits{0};

    /** @brief Counter-sorted containment intervals for this Realm. */
    std::vector<Entry> entries;
  };

  /** @brief Smallest allocated Realm slot count. */
  static constexpr std::uint32_t minimum_realm_capacity = 256;

  /** @brief Current power-of-two Realm slot count. */
  std::uint32_t realm_capacity;

  /** @brief Mask converting crypto-random bits into an initial slot. */
  std::uint32_t realm_index_mask;

  /** @brief Number of occupied Realm slots. */
  std::uint32_t realm_count{0};

  /** @brief Contiguous open-addressing slot array. */
  std::unique_ptr<Realm[]> realms;

  std::map<SequencePoint, std::vector<std::uint32_t>, SequencePointOrder>
      pending_children;

public:
  /**
   * @brief Construct an empty containment table.
   *
   * @param initial_realm_capacity Initial power-of-two slot count.
   * @pre `initial_realm_capacity` is a nonzero power of two.
   * @complexity O(initial_realm_capacity) value initialization.
   */
  explicit HashTable(
      const std::uint32_t initial_realm_capacity = minimum_realm_capacity)
      : realm_capacity(initial_realm_capacity),
        realm_index_mask(initial_realm_capacity - 1),
        realms(std::make_unique<Realm[]>(initial_realm_capacity)) {}

  /**
   * @brief Insert or replace one Frame Span containment entry.
   *
   * The common append case writes directly to the Realm vector. Earlier or
   * replacement starts use `lower_bound` to preserve counter order. Creating a
   * new Realm may trigger a capacity doubling at 50 percent occupancy.
   *
   * @param point First Sequence Point in the represented Frame Span.
   * @param frame_count Number of consecutive counters in the span.
   * @param stable_position Projector-owned Stable Position containing it.
   * @pre `frame_count > 0` and the span stays within `point`'s Realm.
   * @post `get` resolves every Point inside the stored interval to
   * `stable_position` unless a later overlapping entry replaces containment.
   * @complexity Expected O(1 + log e), excluding vector insertion and resize,
   * for e entries in the selected Realm.
   */
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

  /**
   * @brief Return the Stable Position and Frame offset containing a Point.
   *
   * Lookup performs bit-mask slot selection, Realm equality probing, then an
   * `upper_bound` search for the greatest span start not exceeding the target
   * counter. A final subtraction verifies half-open interval containment.
   *
   * @param point Sequence Point to resolve.
   * @return Containing Stable Position and zero-based Frame offset, or two
   * `u32_max` values when absent.
   * @complexity Expected O(1 + log e) for e entries in the matching Realm.
   */
  [[nodiscard]] inline std::pair<std::uint32_t, std::uint32_t>
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
          return {u32_max, u32_max};

        --entry;
        const std::uint32_t offset =
            point.counter_bits - entry->counter_bits;
        return offset < entry->frame_count
                   ? std::pair{entry->stable_position, offset}
                   : std::pair{u32_max, u32_max};
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }
    return {u32_max, u32_max};
  }

  /**
   * @brief Report whether the table contains any Realm.
   * @return `true` when no Realm slot is occupied.
   * @complexity O(1).
   */
  [[nodiscard]] inline bool is_empty() const noexcept {
    return realm_count == 0;
  }

  inline void add_pending_child(const SequencePoint &point,
                                const std::uint32_t strip_index) {
    pending_children[point].push_back(strip_index);
  }

  inline void take_pending_children(
      const SequencePoint &start, const std::uint32_t frame_count,
      std::vector<std::uint32_t> &strip_indices) {
    auto entry = pending_children.lower_bound(start);
    const std::uint64_t end =
        static_cast<std::uint64_t>(start.counter_bits) + frame_count;
    while (entry != pending_children.end() &&
           entry->first.crypto_random_bits == start.crypto_random_bits &&
           entry->first.unix_lower_bits == start.unix_lower_bits &&
           static_cast<std::uint64_t>(entry->first.counter_bits) < end) {
      strip_indices.insert(strip_indices.end(), entry->second.begin(),
                           entry->second.end());
      entry = pending_children.erase(entry);
    }
  }

private:
  /**
   * @brief Rehash every occupied Realm into a larger slot array.
   *
   * Realm entry vectors are moved intact, so their counter order and storage
   * model are preserved.
   *
   * @param new_realm_capacity New power-of-two slot count.
   * @pre `new_realm_capacity > realm_capacity`.
   * @complexity O(realm_capacity) plus expected probe cost.
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
