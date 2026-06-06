#pragma once
#include <cstddef>
#include <cstdint>
#include <unordered_map>

// Four uint32 lanes for every instance id, range id, and previous-range anchor.
//
// JavaScript passes ids as uint32 values only; wasm never parses strings,
// allocates UUID objects, or owns application values.
struct Key {
  std::uint32_t a, b, c, d;

  bool operator==(const Key &other) const {
    return a == other.a && b == other.b && c == other.c && d == other.d;
  }
};

// Hash for direct range lookup by id. Ordering is handled separately by the
// merge-rule comparison helpers, not by this hash.
struct KeyHash {
  std::size_t operator()(const Key &k) const {
    std::uint64_t x = (std::uint64_t(k.a) << 32) | k.b;
    std::uint64_t y = (std::uint64_t(k.c) << 32) | k.d;
    x ^= y + 0x9e3779b97f4a7c15ULL + (x << 6) + (x >> 2);
    return std::size_t(x);
  }
};

// One contiguous virtual id run in the range projection.
//
// Ranges are never physically removed from the linked projection. A delete only
// flips `deleted`, so the same ordering can be patched without rebuilding.
struct Range {
  // First virtual id in this contiguous run.
  Key this_id;

  // Stable CRDT anchor: the id this range was inserted after.
  Key previous_id;

  // Projection links. These define the current materialized range order.
  Range *next_range;
  Range *previous_range;

  // Number of virtual entries represented by this range.
  std::uint32_t range_length;

  // JavaScript-owned reference for the first value in this range.
  // The consumer resolves later entries by adding the offset inside the range.
  std::uint32_t consumer_reference;

  // Tombstone marker. Deleted ranges stay linked and keep their ids.
  bool deleted;
};

// Complete state for one virtual list instance.
struct State {
  // Ranges whose previous_id is not known yet.
  std::unordered_map<Key, Range *, KeyHash> pending;

  // Ranges addressable by their first virtual id.
  std::unordered_map<Key, Range *, KeyHash> ranges;

  // Target index for `current`. Counts only non-deleted entries.
  std::uint32_t index;

  // Number of non-deleted entries addressable by target indexes.
  std::uint32_t size;

  // Linked projection boundaries and cursor.
  Range *first;
  Range *current;
  Range *last;
};
