#pragma once
#include <ankerl/unordered_dense.h>
#include <cstddef>
#include <cstdint>
#include <limits>
#include <vector>

constexpr std::uint32_t invalid_frame_index =
    std::numeric_limits<std::uint32_t>::max();

struct Timestamp {
  std::uint32_t lanes[4];

  std::uint32_t operator[](std::uint32_t index) const { return lanes[index]; }

  bool operator==(const Timestamp &other) const {
    return lanes[0] == other.lanes[0] && lanes[1] == other.lanes[1] &&
           lanes[2] == other.lanes[2] && lanes[3] == other.lanes[3];
  }
};

struct TimestampHash {
  std::size_t operator()(const Timestamp &k) const {
    std::uint64_t x =
        (std::uint64_t(k.lanes[0]) << 32) | std::uint64_t(k.lanes[1]);

    std::uint64_t y =
        (std::uint64_t(k.lanes[2]) << 32) | std::uint64_t(k.lanes[3]);

    x ^= y + 0x9e3779b97f4a7c15ULL + (x << 6) + (x >> 2);

    return std::size_t(x);
  }
};

/**
 * @brief One contiguous virtual id run in the linked range projection.
 *
 * Ranges are never physically removed from the projection. Deletes are modeled
 * by setting deleted=true, so later operations can patch the existing order.
 */
struct Frame {
  /// Tombstone marker. Deleted ranges stay linked and keep their ids.
  bool deleted;

  /// First virtual id in this contiguous run.
  Timestamp this_timestamp;

  /// Stable CRDT anchor: the id this range was inserted after.
  Timestamp previous_timestamp;

  /// Next projected range in the doubly linked range list.
  std::uint32_t next_index;

  /// Previous projected range in the doubly linked range list.
  std::uint32_t previous_index;

  /// Number of virtual entries represented by this range.
  std::uint32_t frame_length;

  /**
   * @brief JavaScript-owned reference for the first value in this range.
   *
   * The consumer resolves later entries by adding the offset inside the range.
   */
  std::uint32_t items_index;
};

/**
 * @brief Complete wasm state for one virtual replicated list instance.
 *
 * The state stores only range metadata and cursor position. JavaScript owns the
 * real values and talks to wasm through uint32 ids and consumer references.
 */
struct Instance {
  /// Ranges addressable by their index, stored next to each other in memory.
  std::vector<Frame> frames;

  /// Pending ranges addressable by their virtual id.
  ankerl::unordered_dense::map<Timestamp, std::uint32_t, TimestampHash>
      frame_indices_by_timestamp;

  /// Pending ranges addressable by their virtual id.
  ankerl::unordered_dense::map<Timestamp, std::uint32_t, TimestampHash>
      pending_frame_indices_by_their_previous_timestamp;

  /// Target index of current. Counts only non-deleted entries.
  std::uint32_t index;

  /// Number of non-deleted entries addressable by target indexes.
  std::uint32_t size;

  /// First range in the linked projection.
  std::uint32_t first_frame_by_index;

  /// Cursor range used by reads and local patches.
  std::uint32_t current_frame_by_index;

  /// Last range in the linked projection.
  std::uint32_t last_frame_by_index;
};
