/**
 * @file
 * @brief Defines the runtime that materializes and navigates one projection.
 *
 * Projector owns the structural strip chain, its visible projection, a movable
 * gate, and operations waiting for their coordinate dependency. It introduces
 * no second representation of sequence order: every structural reference is a
 * SequencePoint resolved through StripIndex.
 */
#pragma once

#include "../../classes/strip_index/index.hpp"
#include "../strip/index.hpp"
#include <cstdint>

/**
 * @brief Materialized structural sequence and its current visible projection.
 *
 * The primary index stores integrated strips by `this_strip_start`. Pending
 * indexes retain operations by `previous_strip_start` until that dependency
 * becomes available. Gate fields cache one projected location and never define
 * sequence ordering.
 */
struct Projector {
  /// Integrated strips indexed by their own stable start points.
  StripIndex<> strip_index;

  /// Total number of visible frames in the current projection.
  std::uint32_t projection_frame_count{0};

  /// Projection frame index at which the gate strip begins.
  std::uint32_t gate_projection_frame_index{0};

  /// Start point of the first materialized strip.
  SequencePoint first_strip_start{};

  /// Start point of the strip currently cached at the projector gate.
  SequencePoint gate_strip_start{};

  /// Start point of the last materialized strip.
  SequencePoint last_strip_start{};

  /// Masks waiting for the strip identified by their previous start point.
  StripIndex<&SequenceCoordinate::previous_strip_start> pending_masks;

  /// Inserts waiting for the strip identified by their previous start point.
  StripIndex<&SequenceCoordinate::previous_strip_start> pending_inserts;
};
