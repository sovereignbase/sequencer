/**
 * @file
 * @brief Defines the Sequence Coordinate carried by a Strip.
 *
 * A Sequence Coordinate expresses Strip placement entirely with Sequence
 * Points and never depends on a mutable Projection frame index.
 */
#pragma once

#include "../sequence_point/index.hpp"

/**
 * @brief Logical placement carried by one Strip or derived fragment.
 *
 * The coordinate is the pair `(this_strip_start, previous_strip_end)`.
 * `this_strip_start` always identifies the first Frame of the represented Frame
 * Span.
 *
 * For a visible transfer, `previous_strip_end` is the referenced existing
 * Frame; `is_inverse` determines whether placement occurs before or after it.
 * For a Mask, `previous_strip_end` is the start of its containing material
 * Strip and `this_strip_start` is the first existing Frame to mask.
 *
 * A split suffix derives both points from the source fragment: its own start
 * advances by the split offset and its previous point becomes the immediately
 * preceding Frame. No Frame identity is changed.
 *
 * @invariant `this_strip_start` identifies the first represented Frame.
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

  // Logical placement or containment dependency.

  /**
   * @brief Stable logical dependency used for deterministic integration.
   *
   * A visible Strip names its referenced placement Frame. A Mask names the
   * start of its containing material Strip. Structural links are stored
   * separately in the Projector's dense traversal vectors.
   */
  SequencePoint previous_strip_end;
};
