/**
 * @file
 * @brief Defines the material representation of one contiguous Frame Span.
 *
 * A Strip joins a Sequence Coordinate, equally long contiguous Footage, one
 * visibility state, insertion direction, and sibling-fragment distances in a
 * fixed-size value.
 * Splitting a Strip changes its material boundaries while each resulting
 * Strip's coordinate identifies the start of its represented Frame Span.
 */
#pragma once

#include "../sentinels/index.hpp"
#include "../sequence_coordinate/index.hpp"
#include <cstdint>

/**
 * @brief Material representation of one contiguous Frame Span.
 *
 * A visible Strip contributes `frame_count` frames to the Projection. A Mask
 * contributes none while retaining its Structural Order position. In both
 * states, `footage_frame_index`
 * maps the Strip to an equally long contiguous region of consumer-owned
 * Footage; C++ stores the index only and never owns the payload.
 *
 * A transferred Strip carries integration metadata and no trusted runtime
 * links. The Projector owns Structural Order in dense `left` and `right`
 * vectors. `coordinate.this_strip_start` is indexed through HashTable, while
 * `coordinate.previous_strip_end` retains the logical dependency used for
 * deterministic integration.
 *
 * A transferred Mask specifically names its containing visible Strip with
 * `coordinate.previous_strip_end` and its first masked Frame with
 * `coordinate.this_strip_start`. Materialization preserves both points.
 *
 * @invariant Every materialized Strip represents a positive `frame_count`.
 * @invariant The counter range beginning at
 * `coordinate.this_strip_start.counter_bits` remains within one Realm.
 * @invariant A visible Strip has `is_masked == 0`; a Mask has bit zero set.
 */
struct Strip {
  // Transferable visibility, length, and Footage mapping.

  /**
   * @brief Visibility state encoded as an unsigned WebAssembly word.
   *
   * Zero denotes a visible Strip. Any nonzero value denotes a Mask.
   */
  std::uint32_t is_masked;

  /**
   * @brief Direction used to interpret the referenced placement Frame.
   *
   * Zero inserts after the referenced Frame and orders siblings forward;
   * nonzero inserts before it and orders siblings in the opposite direction.
   */
  std::uint32_t is_inverse;

  /**
   * @brief Number of consecutive frames in the represented Frame Span.
   *
   * This is also the length of the corresponding Footage region.
   */
  std::uint32_t frame_count;

  /**
   * @brief Index of the Strip's first frame in consumer-owned Footage.
   *
   * The payload and its lifetime remain outside C++; compaction reports
   * this index and `frame_count` when the region may be released.
   */
  std::uint32_t footage_frame_index;

  // Sequence coordinate and runtime-only source-fragment distances.

  /**
   * @brief Sequence Coordinate defining logical placement.
   *
   * `this_strip_start` identifies this Frame Span and `previous_strip_end`
   * retains its placement or containment dependency. A derived split suffix
   * receives the corresponding derived coordinate.
   */
  SequenceCoordinate coordinate;

  /**
   * @brief Next right-hand fragment of the same originally issued Strip.
   *
   * `u32_max` denotes that this is the rightmost remaining fragment.
   */
  std::uint32_t right_sibling_frames_strip_index{u32_max};

  /**
   * @brief Exact visible Projection start when this Strip is a checkpoint.
   *
   * `u32_max` denotes an ordinary Strip. This
   * runtime-only marker lets Structural Order traversal recognize a checkpoint
   * with one direct Strip load instead of searching the LengthTable.
   */
  std::uint32_t checkpoint_projection_frame_index{u32_max};
};
