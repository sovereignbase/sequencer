/**
 * @file
 * @brief Defines the Projector state for one materialized Sequence.
 *
 * A Projector owns Strip storage, dense Structural Order, point containment,
 * bounded Projection navigation, and a movable Gate. It references but never
 * owns consumer Footage.
 */
#pragma once

#include "../../classes/hash_table/index.hpp"
#include "../../classes/length_table/index.hpp"
#include "../strip/index.hpp"
#include <cstdint>
#include <vector>

/**
 * @brief Owned runtime state that materializes one Sequence and its Projection.
 *
 * `strips`, `left`, and `right` share the Stable Position index domain.
 * Materialized Strips form one circular bidirectional chain. A valid unresolved
 * Strip remains self-linked until Initial Projection Resolution or a later
 * operation materializes it. HashTable maps Sequence Point containment to this
 * dense domain; LengthTable stores periodic entry points into it.
 *
 * The Gate caches one materialized Stable Position and its visible Projection
 * start. It accelerates navigation but never determines Sequence order.
 *
 * @invariant `strips.size() == left.size() == right.size()`.
 * @invariant The materialized circular chain contains each materialized Strip,
 * including Masks, exactly once.
 * @invariant Adjacent structural Strips have mutually consistent forward and
 * backward links.
 * @invariant `projection_frame_count` equals the sum of `frame_count` over all
 * visible materialized Strips.
 * @invariant A non-empty LengthTable and Gate refer to materialized Stable
 * Positions.
 */
struct Projector {
  // Authoritative materialized Sequence and Projection state.

  /**
   * @brief Append-only Strip storage indexed by Stable Position.
   *
   * It contains materialized and Pending Strips. Structural membership is
   * determined by the matching dense link entries.
   */
  std::vector<Strip> strips;

  /**
   * @brief Stable Position immediately to the right in Structural Order.
   *
   * A Pending Strip points to itself until materialized.
   */
  std::vector<uint32_t> right;

  /**
   * @brief Stable Position immediately to the left in Structural Order.
   *
   * A Pending Strip points to itself until materialized.
   */
  std::vector<uint32_t> left;

  /**
   * @brief Sequence Point containment index returning Stable Positions.
   *
   * HashTable owns compact Realm entries only; Strip objects remain owned by
   * `strips`.
   */
  HashTable hash_table;

  /** @brief Fixed-frequency entry points for bounded Projection traversal. */
  LengthTable length_table;

  /** @brief Total number of visible frames in the current Projection. */
  std::uint32_t projection_frame_count{0};

  // Movable Projection traversal Gate.

  /**
   * @brief Projection frame index at which the Gate Strip begins.
   *
   * A Mask has zero projected length, so it may share this position with an
   * adjacent Strip.
   */
  std::uint32_t gate_projection_frame_index{0};

  /** @brief Dense index of the materialized Strip cached by the Gate. */
  std::uint32_t gate_strip_index{0};
};
