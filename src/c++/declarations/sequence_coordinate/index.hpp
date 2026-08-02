/**
 * @file
 * @brief Defines the relational coordinate carried by a strip.
 *
 * Sequence coordinates express placement entirely with stable sequence
 * points. They therefore remain meaningful when strips arrive out of order or
 * when projection frame indexes change after insertion and masking.
 */
#pragma once

#include "../sequence_point/index.hpp"

/**
 * @brief Placement relationship between an established strip and a new strip.
 *
 * `previous_strip_start` supplies the established sequence context and
 * `this_strip_start` identifies the first frame represented by the strip. Once
 * materialized, the previous component also serves as the strip's backward
 * structural link.
 */
struct SequenceCoordinate {
  /// Stable point identifying the first frame represented by this strip.
  SequencePoint this_strip_start;

  /// Established strip-start context from which placement is resolved.
  SequencePoint previous_strip_start;
};
