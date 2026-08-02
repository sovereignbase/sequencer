/**
 * @file
 * @brief Defines the material representation of one contiguous Frame Span.
 *
 * A Strip joins a Sequence Coordinate, equally long contiguous Footage, one
 * visibility state, and runtime structural linkage in a fixed-size value.
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
 * contributes none while retaining the same structural position in the
 * Sequence until garbage collection. In both states, `footage_frame_index`
 * maps the Strip to an equally long contiguous region of consumer-owned
 * Footage; C++ stores the index only and never owns the payload.
 *
 * A transferred Strip carries an integration coordinate and no trusted runtime
 * successor. The Projector normalizes a materialized Strip's
 * `coordinate.previous_strip_start` to the indexed start of its immediate
 * retained predecessor and derives `next_strip_start` from retained Sequence
 * order. Those points then form its backward and forward structural links.
 * `coordinate.this_strip_start` remains the StripIndex key and identifies the
 * first Frame of the represented span.
 *
 * A transferred Mask specifically names its containing visible Strip with
 * `coordinate.previous_strip_start` and its first masked Frame with
 * `coordinate.this_strip_start`. Materialization preserves the current point
 * while normalizing the previous point and runtime successor like every other
 * retained Strip.
 *
 * @invariant Every materialized Strip represents a positive `frame_count`.
 * @invariant The counter range beginning at
 * `coordinate.this_strip_start.counter_bits` remains within one Realm.
 * @invariant A visible Strip has `is_masked == 0`; a Mask has
 * `is_masked != 0`.
 */
struct Strip {
  // Transferable visibility, length, and Footage mapping.

  /**
   * @brief Visibility state encoded as an unsigned WebAssembly word.
   *
   * Zero denotes a visible Strip. Any nonzero value denotes a Mask, although
   * transferable values are conventionally normalized to one.
   */
  std::uint32_t is_masked;

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

  // Stable coordinate and Projector-owned successor linkage.

  /**
   * @brief Sequence Coordinate defining transfer placement or retained linkage.
   *
   * `this_strip_start` always identifies this Frame Span. Before integration,
   * `previous_strip_start` is a placement dependency; after integration, it is
   * the immediate retained predecessor's indexed start or the Root.
   */
  SequenceCoordinate coordinate;

  /**
   * @brief Start point of the next materialized Strip.
   *
   * The last retained Strip stores `unlinked_strip_start`. This runtime link is
   * derived by the Projector, is not trusted from transferred data, and is
   * deliberately absent from serialized Reels.
   */
  SequencePoint next_strip_start;
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
