/**
 * @file
 * @brief Defines the cache-oriented index for materialized and pending Strips.
 *
 * HashTable groups stable Sequence Point keys by Realm and stores each Realm's
 * Strips in counter order. Realm lookup uses open addressing with linear
 * probing; exact point lookup within one Realm uses binary search. This keeps
 * the common Realm-local insertion and traversal paths contiguous in memory.
 */
#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../declarations/strip/index.hpp"
#include "../footage_span_buffer/index.hpp"
#include "../frontier_buffer/index.hpp"
#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

/**
 * @brief Own and index Strip values by one Sequence Coordinate member.
 *
 * @tparam indexed_sequence_point Coordinate member used as the exact key.
 * The primary Projector index uses a materialized Strip's `this_strip_start`.
 * Pending indexes use the incoming `previous_strip_start`: for a Mask this is
 * the exact indexed start of its containing Strip, and for a visible Strip it
 * is its unresolved placement point. Key selection is resolved at compile time
 * and adds neither per-index memory nor a runtime branch.
 *
 * The index owns every stored Strip by value, its per-Realm vectors, and its
 * open-addressing table. Returned pointers borrow that storage and permit
 * algorithms to update non-key Strip fields in place.
 *
 * @invariant Every occupied table slot represents exactly one Realm, identified
 * by the pair `(unix_lower_bits, crypto_random_bits)`.
 * @invariant Each occupied Realm vector is non-empty and ordered by the
 * selected point's `counter_bits`. Pending Strips sharing a dependency are
 * ordered by `this_strip_start`.
 * @invariant Empty vectors denote unused hash-table slots and are never
 * retained as occupied Realms.
 * @warning Modifying the selected coordinate member through a pointer returned
 * by `get` corrupts index ordering and lookup.
 * @note Any mutating index operation may invalidate every pointer returned by
 * `get` because a Realm vector or the Realm table may move.
 * @note HashTable stores coordinates exactly as supplied. Projector algorithms
 * derive runtime structural links without modifying them.
 */
template <SequencePoint SequenceCoordinate::*indexed_sequence_point =
              &SequenceCoordinate::this_strip_start>
class HashTable {
public:
  // Realm-local owned storage.

  /**
   * @brief Storage owned for one indexed Realm.
   *
   * The identity components are meaningful exactly when `strips` is non-empty.
   * Strip values are owned directly by the vector and ordered by the counter of
   * `indexed_sequence_point`.
   */
  struct Realm {
    /** @brief Unix identity component shared by all indexed Realm points. */
    std::uint32_t unix_lower_bits{0};
    /** @brief Random identity component shared by all indexed Realm points. */
    std::uint32_t crypto_crypto_random_bits{0};

    /**
     * @brief Owned Strips ordered by the selected point's counter component.
     */
    std::vector<Strip> strips;
  };

  /** @brief Stateless traversal position for one complete index scan. */
  struct Cursor {
    std::uint32_t realm_index{0};
    std::uint32_t strip_index{0};
  };

private:
  // Open-addressing table limits and occupancy state.

  /** @brief Smallest supported power-of-two Realm table capacity. */
  static constexpr std::uint32_t minimum_realm_capacity = 256;

  /** @brief Number of slots currently allocated in the Realm hash table. */
  std::uint32_t realm_capacity;

  /** @brief `realm_capacity - 1`, used for power-of-two probe wrapping. */
  std::uint32_t realm_index_mask;

  /** @brief Number of occupied Realm slots in the table. */
  std::uint32_t realm_count{0};

  /** @brief Sole owner of the contiguous open-addressing Realm table. */
  std::unique_ptr<Realm[]> realms;

public:
  // Exact-key index lifecycle and mutation.

  /**
   * @brief Construct an empty index with a power-of-two realm capacity.
   *
   * @param initial_realm_capacity Initial number of open-addressing slots.
   * @pre `initial_realm_capacity` is a power of two and is at least 256.
   * @post The index owns an empty table of `initial_realm_capacity` slots.
   * @complexity O(initial_realm_capacity) initialization time and storage.
   * @throws std::bad_alloc when table allocation fails.
   */
  explicit HashTable(
      const std::uint32_t initial_realm_capacity = minimum_realm_capacity)
      : realm_capacity(initial_realm_capacity),
        realm_index_mask(initial_realm_capacity - 1),
        realms(std::make_unique<Realm[]>(initial_realm_capacity)) {}

  /**
   * @brief Insert or replace one Strip under its selected Sequence Point.
   *
   * Appending a monotonically increasing point within an existing Realm is a
   * constant-time fast path. Other counters are located with binary search.
   *
   * @param point Exact key represented by the selected coordinate member.
   * @param strip Strip value copied into index-owned storage.
   * @pre `point == strip.coordinate.*indexed_sequence_point`.
   * @post The primary index stores one Strip under `point`. A pending index
   * stores every distinct `this_strip_start` sharing `point` and replaces only
   * an exact repeated Strip.
   * @note A new Realm may grow and rehash the table. Any successful call must
   * be treated as invalidating pointers returned by `get`.
   * @warning Allocation failure terminates the program because this operation
   * is `noexcept`.
   * @complexity Expected O(1) Realm lookup plus O(log n) search and O(n)
   * insertion within one Realm; monotonic append is amortized O(1). Rehashing a
   * full Realm table additionally costs O(c), where c is its prior capacity.
   */
  inline void set(const SequencePoint &point, Strip strip) noexcept {
    // Probe for the Realm identified by the point.
    std::uint32_t realm_index =
        point.crypto_crypto_random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == point.crypto_random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        // Append monotonically increasing counters without a binary search.
        if ((realm.strips.back().coordinate.*indexed_sequence_point)
                .counter_bits < point.counter_bits) {
          realm.strips.push_back(strip);
          return;
        }

        // Locate the exact counter or its ordered insertion position.
        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(), point.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });

        // Replace an exact primary key or retain every pending sibling.
        if (strip_iterator != realm.strips.end() &&
            (strip_iterator->coordinate.*indexed_sequence_point).counter_bits ==
                point.counter_bits) {
          if constexpr (indexed_sequence_point ==
                        &SequenceCoordinate::this_strip_start) {
            *strip_iterator = strip;
          } else {
            const auto equal_key_end = std::upper_bound(
                strip_iterator, realm.strips.end(), point.counter_bits,
                [](const std::uint32_t counter_bits,
                   const Strip &candidate) noexcept {
                  return counter_bits <
                         (candidate.coordinate.*indexed_sequence_point)
                             .counter_bits;
                });
            const auto pending_strip_iterator = std::lower_bound(
                strip_iterator, equal_key_end,
                strip.coordinate.this_strip_start,
                [](const Strip &candidate,
                   const SequencePoint &strip_start) noexcept {
                  return compare_sequence_points(
                             &candidate.coordinate.this_strip_start,
                             &strip_start) < 0;
                });

            if (pending_strip_iterator != equal_key_end &&
                pending_strip_iterator->coordinate.this_strip_start ==
                    strip.coordinate.this_strip_start)
              *pending_strip_iterator = strip;
            else
              realm.strips.insert(pending_strip_iterator, strip);
          }
        } else {
          realm.strips.insert(strip_iterator, strip);
        }
        return;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }

    // Initialize the first Strip of a previously unrepresented Realm.
    Realm &realm = realms[realm_index];
    realm.crypto_random_bits = point.crypto_random_bits;
    realm.unix_lower_bits = point.unix_lower_bits;
    realm.strips.push_back(strip);
    realm_count++;

    // Grow before open-addressing occupancy reaches one half.
    if (realm_count >= realm_capacity / 2)
      resize(realm_capacity * 2);
  }

  /**
   * @brief Return the Strip stored under one exact Sequence Point.
   *
   * @param point Exact selected-coordinate key to locate.
   * @return Mutable borrowed pointer to the stored Strip, or `nullptr` when the
   * point is absent.
   * @post The index is unchanged.
   * @note The pointer remains valid only until the next mutating index
   * operation or destruction of this HashTable.
   * @warning The selected coordinate key must not be changed through the
   * returned pointer.
   * @complexity Expected O(1) Realm lookup plus O(log n) within one Realm;
   * worst-case probing may inspect the table's occupied probe run.
   */
  [[nodiscard]] inline Strip *get(const SequencePoint &point) noexcept {
    // Probe for the Realm identified by the point.
    std::uint32_t realm_index = point.crypto_random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == point.crypto_random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        // Search the counter-ordered Realm vector for the exact key.
        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(), point.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });

        // Return only an exact counter match.
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
   * @brief Return the first Strip keyed within one Frame Span.
   *
   * Pending indexes use this overload to resolve every dependency point made
   * available by one newly materialized visible Strip.
   *
   * @param frame_span_start First point of the materialized Frame Span.
   * @param frame_count Positive number of consecutive points in the span.
   * @return Mutable borrowed pointer to the first matching Strip, or `nullptr`.
   * @pre `frame_count > 0` and the span remains within one Realm.
   * @complexity Expected O(1) Realm lookup plus O(log n) Realm search.
   */
  [[nodiscard]] inline Strip *get(const SequencePoint &frame_span_start,
                                  const std::uint32_t frame_count) noexcept {
    // Probe for the Realm containing the complete Frame Span.
    std::uint32_t realm_index =
        frame_span_start.crypto_random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == frame_span_start.crypto_random_bits &&
          realm.unix_lower_bits == frame_span_start.unix_lower_bits) {
        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(),
            frame_span_start.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });
        if (strip_iterator == realm.strips.end())
          return nullptr;

        const std::uint32_t counter_bits =
            (strip_iterator->coordinate.*indexed_sequence_point).counter_bits;
        return counter_bits - frame_span_start.counter_bits < frame_count
                   ? &*strip_iterator
                   : nullptr;
      }
      realm_index = (realm_index + 1) & realm_index_mask;
    }
    return nullptr;
  }

  /**
   * @brief Begin a read-only traversal over every stored Strip.
   *
   * @param cursor Traversal state initialized to the returned Strip.
   * @return First stored Strip, or `nullptr` when the index is empty.
   * @complexity O(c) worst-case time across leading empty Realm slots.
   */
  [[nodiscard]] inline const Strip *first(Cursor &cursor) const noexcept {
    cursor = {};
    while (cursor.realm_index < realm_capacity &&
           realms[cursor.realm_index].strips.empty())
      ++cursor.realm_index;
    return cursor.realm_index < realm_capacity
               ? &realms[cursor.realm_index].strips[0]
               : nullptr;
  }

  /**
   * @brief Advance a read-only traversal over every stored Strip.
   *
   * @param cursor Traversal state produced by `first` or this method.
   * @return Next stored Strip, or `nullptr` after the final Strip.
   * @pre The index has not been mutated since traversal began.
   * @complexity O(c + n) across a complete traversal of n Strips.
   */
  [[nodiscard]] inline const Strip *next(Cursor &cursor) const noexcept {
    if (++cursor.strip_index < realms[cursor.realm_index].strips.size())
      return &realms[cursor.realm_index].strips[cursor.strip_index];

    cursor.strip_index = 0;
    do
      ++cursor.realm_index;
    while (cursor.realm_index < realm_capacity &&
           realms[cursor.realm_index].strips.empty());
    return cursor.realm_index < realm_capacity
               ? &realms[cursor.realm_index].strips[0]
               : nullptr;
  }

  /**
   * @brief Remove the first Strip stored under one exact Sequence Point.
   *
   * Missing points are ignored. Removing a Realm's final Strip closes its
   * linear-probing hole so later Realm lookups remain reachable, and may halve
   * a sparsely populated Realm table.
   *
   * @param point Exact selected-coordinate key to remove.
   * @post The first exact-key Strip is removed; pending siblings remain. An
   * absent point leaves the index unchanged.
   * @note Successful removal may invalidate every pointer returned by `get`.
   * @throws std::bad_alloc when removal triggers a table shrink whose
   * allocation fails outside a `noexcept` caller.
   * @complexity Expected O(1) Realm lookup, O(log n) search, and O(n) vector
   * erasure within one Realm. Removing an empty Realm additionally scans its
   * probe run and a table shrink costs O(c).
   */
  inline void remove(const SequencePoint &point) {
    // Probe for the Realm identified by the point.
    std::uint32_t realm_index = point.crypto_random_bits & realm_index_mask;

    while (!realms[realm_index].strips.empty()) {
      Realm &realm = realms[realm_index];
      if (realm.crypto_random_bits == point.crypto_random_bits &&
          realm.unix_lower_bits == point.unix_lower_bits) {
        // Locate the exact counter without scanning the Realm vector.
        const auto strip_iterator = std::lower_bound(
            realm.strips.begin(), realm.strips.end(), point.counter_bits,
            [](const Strip &candidate,
               const std::uint32_t counter_bits) noexcept {
              return (candidate.coordinate.*indexed_sequence_point)
                         .counter_bits < counter_bits;
            });

        // Leave an absent key unchanged.
        if (strip_iterator == realm.strips.end() ||
            (strip_iterator->coordinate.*indexed_sequence_point).counter_bits !=
                point.counter_bits)
          return;

        // Erase the Strip while retaining an occupied Realm when possible.
        realm.strips.erase(strip_iterator);
        if (!realm.strips.empty())
          return;

        // Close the open-addressing hole left by an empty Realm.
        std::uint32_t empty_realm_index = realm_index;
        std::uint32_t next_realm_index = (realm_index + 1) & realm_index_mask;

        while (!realms[next_realm_index].strips.empty()) {
          const std::uint32_t home_realm_index =
              realms[next_realm_index].crypto_random_bits & realm_index_mask;
          if (((next_realm_index - home_realm_index) & realm_index_mask) >
              ((empty_realm_index - home_realm_index) & realm_index_mask)) {
            realms[empty_realm_index] = std::move(realms[next_realm_index]);
            realms[next_realm_index] = Realm{};
            empty_realm_index = next_realm_index;
          }
          next_realm_index = (next_realm_index + 1) & realm_index_mask;
        }

        // Release the final hole and shrink a sparse table.
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

  // Frontier-based Mask collection.

  /**
   * @brief Report Footage retained by acknowledged Masks.
   *
   * Each Frontier entry resolves its Realm directly. A Mask's Footage is
   * eligible when its own start counter is no greater than that Realm's
   * selected boundary. Every Strip, coordinate, and structural link remains
   * materialized as permanent dependency data.
   *
   * The selected boundary is expected to be the least corresponding Frontier
   * point acknowledged across the participating Replicas. Frontier selection
   * remains outside HashTable; this operation applies the supplied result.
   *
   * @param frontier_buffer Selected Realm boundaries acknowledged by all
   * participating Replicas.
   * @param footage_span_buffer Output replaced with one releasable Footage
   * range for each eligible Mask.
   * @pre This is the primary index keyed by `this_strip_start`.
   * @pre The Frontier contains at most one selected point per Realm.
   * @post The output buffer contains exactly the Footage ranges belonging to
   * eligible Masks; its previous contents are discarded.
   * @post This HashTable and all structural Projector state remain unchanged.
   * @note Pending Masks are unaffected because they have no resolved Footage
   * span.
   * @warning Allocation failure while writing output to this `noexcept`
   * operation terminates the program.
   * @complexity Expected O(f + sum(n_r)) time for f Frontier entries and the
   * Strips scanned in each matching Realm, with O(k) output for k Masks.
   */
  inline void
  garbage_collect(const FrontierBuffer &frontier_buffer,
                  FootageSpanBuffer &footage_span_buffer) const noexcept {
    // Replace the previously reported Footage ranges.
    footage_span_buffer.clear();

    // Apply each selected Realm boundary independently.
    for (std::uint32_t frontier_index = 0;
         frontier_index < frontier_buffer.get_frontier_count();
         ++frontier_index) {
      const SequencePoint frontier =
          frontier_buffer.read_frontier(frontier_index);
      // Probe for the Realm represented by this Frontier entry.
      std::uint32_t realm_index =
          frontier.crypto_random_bits & realm_index_mask;

      while (!realms[realm_index].strips.empty()) {
        const Realm &realm = realms[realm_index];
        if (realm.crypto_random_bits == frontier.crypto_random_bits &&
            realm.unix_lower_bits == frontier.unix_lower_bits) {
          // Report every Mask in the acknowledged counter prefix.
          for (const Strip &strip : realm.strips) {
            const SequencePoint &strip_start =
                strip.coordinate.*indexed_sequence_point;
            if (strip_start.counter_bits > frontier.counter_bits)
              break;
            if (strip.is_masked != 0)
              footage_span_buffer.write_span(strip.footage_frame_index,
                                             strip.frame_count);
          }
          break;
        }
        realm_index = (realm_index + 1) & realm_index_mask;
      }
    }
  }

  /**
   * @brief Report whether the index contains no Strips.
   *
   * Realm occupancy is sufficient because an empty Realm is never retained.
   *
   * @return `true` when no exact point key is stored; otherwise `false`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline bool is_empty() const noexcept {
    // Occupied Realms are equivalent to stored Strips.
    return realm_count == 0;
  }

  // Replica Frontier materialization.

  /**
   * @brief Write this Replica's Frontier from all occupied Realms.
   *
   * Realm vectors are already ordered by counter, so each final entry is that
   * Realm's greatest locally materialized Strip start. Empty table slots are
   * skipped; visibility does not affect acknowledgement because both visible
   * Strips and Masks are materialized Sequence structure.
   *
   * @param frontier_buffer Non-null transfer buffer replaced by the resulting
   * Frontier.
   * @param realm_hint Point belonging to any represented Realm when the index
   * is non-empty.
   * @pre This is the primary index keyed by `this_strip_start`.
   * @pre `frontier_buffer != nullptr`.
   * @post The buffer contains exactly one greatest point per occupied Realm and
   * no entry for an unrepresented Realm. Entry order follows table order and is
   * not structural Sequence order.
   * @warning Allocation failure terminates the program because this operation
   * is `noexcept`.
   * @complexity O(1) time for one Realm, otherwise O(c) time, and O(r) retained
   * buffer space, where c is the Realm table capacity and r is its occupied
   * Realm count.
   */
  inline void write_acknowledgement_frontier(
      FrontierBuffer *frontier_buffer,
      const SequencePoint &realm_hint) const noexcept {
    // Replace the prior Frontier and reserve one entry per occupied Realm.
    frontier_buffer->clear();
    frontier_buffer->reserve(realm_count);

    // Resolve the overwhelmingly common single Realm directly from its hash.
    if (realm_count == 1) {
      const Realm &realm =
          realms[realm_hint.crypto_random_bits & realm_index_mask];
      frontier_buffer->write_frontier(realm.strips.back().coordinate.*
                                      indexed_sequence_point);
      return;
    }

    // Emit each Realm's greatest materialized Strip start.
    for (std::uint32_t realm_index = 0; realm_index < realm_capacity;
         ++realm_index) {
      const Realm &realm = realms[realm_index];
      if (!realm.strips.empty())
        frontier_buffer->write_frontier(realm.strips.back().coordinate.*
                                        indexed_sequence_point);
    }
  }

private:
  // Realm-table capacity maintenance.

  /**
   * @brief Rehash every occupied Realm into a new power-of-two table.
   *
   * @param new_realm_capacity Number of slots in the replacement table.
   * @pre `new_realm_capacity` is a power of two and is at least 256.
   * @pre `new_realm_capacity` is greater than `realm_count`.
   * @post Every exact key and owned Strip is retained, `realm_capacity` equals
   * `new_realm_capacity`, and every borrowed Strip pointer is invalidated.
   * @complexity O(c + r) time for c previous slots and r occupied Realms, plus
   * O(new_realm_capacity) replacement-table storage.
   * @throws std::bad_alloc when replacement-table allocation fails outside a
   * `noexcept` caller.
   */
  void resize(const std::uint32_t new_realm_capacity) {
    // Preserve the previous table while allocating its replacement.
    auto previous_realms = std::move(realms);
    const std::uint32_t previous_realm_capacity = realm_capacity;

    // Initialize the empty power-of-two replacement table.
    realm_capacity = new_realm_capacity;
    realm_index_mask = new_realm_capacity - 1;
    realm_count = 0;
    realms = std::make_unique<Realm[]>(new_realm_capacity);

    // Rehash each occupied Realm without moving its Strip allocation.
    for (std::uint32_t previous_realm_index = 0;
         previous_realm_index < previous_realm_capacity;
         ++previous_realm_index) {
      if (previous_realms[previous_realm_index].strips.empty())
        continue;

      std::uint32_t realm_index =
          previous_realms[previous_realm_index].crypto_random_bits &
          realm_index_mask;
      while (!realms[realm_index].strips.empty())
        realm_index = (realm_index + 1) & realm_index_mask;

      realms[realm_index] = std::move(previous_realms[previous_realm_index]);
      realm_count++;
    }
  }
};
