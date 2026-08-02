/**
 * @file
 * @brief Defines the material representation of one contiguous frame span.
 *
 * A Strip joins stable sequence placement, contiguous footage, visibility, and
 * structural links in one fixed-size value. Splitting a strip changes its
 * material boundaries without changing the identities of its frames.
 */
#pragma once

#include "../sequence_coordinate/index.hpp"
#include <cstdint>
#include <limits>

/**
 * @brief One contiguous frame span in a materialized sequence.
 *
 * The strip maps its sequence frame span to an equally long footage frame span.
 * Its coordinate carries its own stable start and its previous structural
 * link; `next_strip_start` completes the projector's bidirectional chain.
 */
struct Strip {
  /// Zero when visible; nonzero when excluded from the projection.
  std::uint32_t is_masked;

  /// Number of consecutive frames represented by the strip.
  std::uint32_t frame_count;

  /// Footage frame index corresponding to the strip's first frame.
  std::uint32_t footage_frame_index;

  /// Relational placement and stable start point of the strip.
  SequenceCoordinate coordinate;

  /// Start point of the next materialized strip, or `unlinked_strip_start`.
  SequencePoint next_strip_start;
};

/**
 * @brief Offset sentinel returned when a sequence point is outside a strip.
 */
inline constexpr std::uint32_t sequence_point_outside_strip =
    std::numeric_limits<std::uint32_t>::max();
