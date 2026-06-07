#pragma once
#include <cstddef>
#include <cstdint>
#include <unordered_map>

/**
 * @brief Four uint32 lanes for every instance id, range id, and range anchor.
 *
 * JavaScript passes ids as raw uint32 values. The wasm core does not parse UUID
 * strings, allocate UUID objects, or own application values.
 */
struct Key {
  /// First, second, third, and fourth uint32 lanes of the virtual id.
  std::uint32_t a, b, c, d;

  /**
   * @brief Compare two uint32-lane ids for exact equality.
   *
   * @param other Id to compare against this id.
   * @return True when every lane is equal.
   */
  bool operator==(const Key &other) const {
    // Every lane participates; there is no partial id equivalence.
    return a == other.a && b == other.b && c == other.c && d == other.d;
  }
};

/**
 * @brief Hash for direct unordered_map lookup by Key.
 *
 * Ordering is handled by merge-rule comparison helpers. This hash is only for
 * direct id lookup, not for list order.
 */
struct KeyHash {
  /**
   * @brief Mix the four uint32 lanes into one size_t hash value.
   *
   * @param k Key to hash.
   * @return Hash value accepted by std::unordered_map.
   */
  std::size_t operator()(const Key &k) const {
    // Pack the first two lanes into one 64-bit word.
    std::uint64_t x = (std::uint64_t(k.a) << 32) | k.b;
    // Pack the last two lanes into another 64-bit word.
    std::uint64_t y = (std::uint64_t(k.c) << 32) | k.d;
    // Mix the two words with the standard hash-combine constant.
    x ^= y + 0x9e3779b97f4a7c15ULL + (x << 6) + (x >> 2);
    // Return the platform-sized hash expected by unordered_map.
    return std::size_t(x);
  }
};

/**
 * @brief One contiguous virtual id run in the linked range projection.
 *
 * Ranges are never physically removed from the projection. Deletes are modeled
 * by setting deleted=true, so later operations can patch the existing order.
 */
struct Range {
  /// First virtual id in this contiguous run.
  Key this_id;

  /// Stable CRDT anchor: the id this range was inserted after.
  Key previous_id;

  /// Next projected range in the doubly linked range list.
  Range *next_range;

  /// Previous projected range in the doubly linked range list.
  Range *previous_range;

  /// Number of virtual entries represented by this range.
  std::uint32_t range_length;

  /**
   * @brief JavaScript-owned reference for the first value in this range.
   *
   * The consumer resolves later entries by adding the offset inside the range.
   */
  std::uint32_t consumer_reference;

  /// Tombstone marker. Deleted ranges stay linked and keep their ids.
  bool deleted;
};

/**
 * @brief Complete wasm state for one virtual replicated list instance.
 *
 * The state stores only range metadata and cursor position. JavaScript owns the
 * real values and talks to wasm through uint32 ids and consumer references.
 */
struct State {
  /// Ranges whose previous_id anchor is not known locally yet.
  std::unordered_map<Key, Range *, KeyHash> pending;

  /// Ranges addressable by their first virtual id.
  std::unordered_map<Key, Range *, KeyHash> ranges;

  /// Target index of current. Counts only non-deleted entries.
  std::uint32_t index;

  /// Number of non-deleted entries addressable by target indexes.
  std::uint32_t size;

  /// First range in the linked projection.
  Range *first;

  /// Cursor range used by reads and local patches.
  Range *current;

  /// Last range in the linked projection.
  Range *last;
};
