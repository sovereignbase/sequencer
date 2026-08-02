/**
 * @file
 * @brief Defines the Sequence Coordinate carried by a Strip.
 *
 * A Sequence Coordinate expresses Strip placement entirely with stable
 * Sequence Points. It retains the same logical meaning before and after
 * materialization and never depends on a mutable Projection frame index.
 */
#pragma once

#include "../sequence_point/index.hpp"

/**
 * @brief Immutable logical placement carried by one Strip.
 *
 * In vocabulary order, the coordinate is the pair
 * `(previous_strip_start, this_strip_start)`. `this_strip_start` always
 * identifies the first Frame of the Strip's Frame Span.
 *
 * For a visible Strip, `previous_strip_start` is the Root or the stable point
 * of the Frame after which the Strip is placed. For a Mask, it is the exact
 * indexed start of the visible Strip containing the complete masked Frame
 * Span, while `this_strip_start` is the existing Sequence Point of the first
 * masked Frame. Masking therefore issues no new Sequence Point.
 *
 * @invariant `this_strip_start` identifies the first Frame represented by its
 * @invariant Materialization never modifies either Sequence Point.
 *
 * @note Member declaration order is a C++ storage detail and does not redefine
 * the vocabulary order of the pair.
 */
struct SequenceCoordinate {
  // Stable identity of the represented Frame Span.

  /**
   * @brief Stable Sequence Point identifying the Strip's first frame.
   *
   * For a Mask this is an existing point inside the containing visible Strip,
   * not a newly issued Mask identity. After materialization this point is the
   * Strip's primary index key.
   */
  SequencePoint this_strip_start;

  // Immutable logical dependency.

  /**
   * @brief Stable logical dependency used for deterministic integration.
   *
   * A transferable visible Strip names its placement Frame; a transferable Mask
   * names the exact indexed start of its containing Strip. Pending indexes use
   * that value as their dependency key. The Projector never rewrites it as a
   * runtime link.
   */
  SequencePoint previous_strip_start;
};
