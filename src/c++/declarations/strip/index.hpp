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

#include "../sequence_coordinate/index.hpp"
#include <cstdint>
#include <limits>

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
   * The payload and its lifetime remain outside C++; garbage collection reports
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
   * @brief Number of source-strip Frames represented by fragments to the right.
   *
   * Together with `frame_count` and `left_siblings_frames`, this reconstructs
   * the originally issued Strip length without a fragment pointer.
   */
  std::uint32_t right_sibling_frames;

  /**
   * @brief Number of source-strip Frames represented by fragments to the left.
   *
   * Subtracting this distance from the fragment start counter reconstructs the
   * originally issued Strip start for sibling comparison.
   */
  std::uint32_t left_siblings_frames;
};

// Sequence-point containment result sentinel.
/**
 * @brief Offset sentinel denoting that a Sequence Point is outside a Strip.
 *
 * Every valid zero-based Strip offset is strictly less than `frame_count`, so
 * the maximum unsigned 32-bit value is never a valid result.
 */
inline constexpr std::uint32_t sequence_point_outside_strip =
    std::numeric_limits<std::uint32_t>::max();
