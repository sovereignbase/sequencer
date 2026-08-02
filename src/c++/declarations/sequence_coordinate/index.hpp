/**
 * @file
 * @brief Defines the Sequence Coordinate carried by a Strip.
 *
 * A Sequence Coordinate expresses Strip placement entirely with stable
 * Sequence Points. On transfer it describes how to integrate a Strip. After
 * materialization the same fields identify the Strip's Frame Span and link it
 * to its immediate structural predecessor. Neither meaning depends on a
 * mutable Projection frame index.
 */
#pragma once

#include "../sequence_point/index.hpp"

/**
 * @brief Stable placement and structural relationship carried by one Strip.
 *
 * In vocabulary order, the coordinate is the pair
 * `(previous_strip_start, this_strip_start)`. `this_strip_start` always
 * identifies the first Frame of the Strip's Frame Span. The meaning of the
 * previous point is specific to the Strip's lifecycle and visibility state.
 *
 * @par Transfer semantics
 *
 * For a visible Strip, `previous_strip_start` is the Root or the stable point
 * of the Frame after which the Strip is placed. For a Mask, it is the exact
 * indexed start of the visible Strip containing the complete masked Frame
 * Span, while `this_strip_start` is the existing Sequence Point of the first
 * masked Frame. Masking therefore issues no new Sequence Point.
 *
 * @par Materialized semantics
 *
 * The Projector normalizes `previous_strip_start` to the indexed start of the
 * immediately preceding retained Strip, or to the Root for the first retained
 * Strip. It then serves as the backward structural link paired with the
 * predecessor's `next_strip_start`. Garbage collection may normalize it again
 * after removing a Mask. `this_strip_start` remains the primary StripIndex key
 * and the first point of the retained Frame Span.
 *
 * @invariant `this_strip_start` identifies the first Frame represented by its
 * Strip in both transfer and materialized forms.
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

  // Transfer dependency or retained structural context.

  /**
   * @brief Transfer dependency or normalized structural predecessor.
   *
   * A transferable visible Strip names its placement Frame; a transferable Mask
   * names the exact indexed start of its containing Strip. Pending indexes use
   * that value as their dependency key. Once materialized, the value is the
   * Root or the exact indexed start of the immediate retained predecessor.
   */
  SequencePoint previous_strip_start;
};
