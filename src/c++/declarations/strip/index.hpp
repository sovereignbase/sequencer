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
 * A transferred Strip carries an immutable integration coordinate and no
 * trusted runtime links. The Projector derives
 * `previous_structural_strip_start` and `next_strip_start` independently from
 * retained Sequence order. `coordinate.this_strip_start` remains the
 * StripIndex key, while `coordinate.previous_strip_start` permanently retains
 * the logical dependency used for deterministic integration.
 *
 * A transferred Mask specifically names its containing visible Strip with
 * `coordinate.previous_strip_start` and its first masked Frame with
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
   * Zero denotes a visible Strip. Bit zero denotes a Mask. The remaining Mask
   * bits retain source-fragment boundaries without adding storage to the
   * fixed-size Strip.
   */
  std::uint32_t is_masked;

  /**
   * Whether `previous` is interpreted from right to left instead of left to
   * right.
   *
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

  // Stable coordinate and Projector-owned structural linkage.

  /**
   * @brief Immutable Sequence Coordinate defining logical placement.
   *
   * `this_strip_start` identifies this Frame Span and `previous_strip_start`
   * retains the original logical dependency. Materialization never rewrites
   * either point.
   */
  SequenceCoordinate coordinate;

  /**
   * @brief Previous material fragment of the same originally issued Strip.
   *
   * Root means this fragment begins its source. The link is runtime-only and
   * is rebuilt by splitting or Snapshot resolution.
   */
  std::uint32_t right_sibling_frames;

  /**
   * @brief Next material fragment of the same originally issued Strip.
   *
   * `unlinked_strip_start` means this fragment ends its source. The link is
   * runtime-only and never participates in sibling conflict resolution.
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
