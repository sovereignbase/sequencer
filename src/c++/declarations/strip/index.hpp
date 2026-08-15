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
#include <vector>

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

  /** @brief Visible Strip reached by the current left Projection jump. */
  std::uint32_t left_jump_strip_index{u32_max};

  /** @brief Projection Frame distance to `left_jump_strip_index`. */
  std::uint32_t left_jump_frame_offset{0};

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::uint32_t right_jump_strip_index{u32_max};

  /** @brief Projection Frame distance to `right_jump_strip_index`. */
  std::uint32_t right_jump_frame_offset{0};

  /** @brief Projector generation in which the jump fields are valid. */
  std::uint32_t jump_generation{0};
};
