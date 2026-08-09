/**
 * @file
 * @brief Defines the Projector state for one materialized Sequence.
 *
 * A Projector owns the structural Strip indexes, tracks the resulting
 * Projection, and maintains a movable Gate for locality-aware navigation. It
 * introduces no second source of Sequence order: structural references are
 * Sequence Points resolved through the primary StripIndex.
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
 * The primary index owns all materialized Strips under their stable starts.
 * Pending indexes own incoming Strips under unresolved transfer dependencies.
 * For a pending Mask that dependency is the exact indexed start of its
 * containing Strip; for a pending visible Strip it is the Frame after which it
 * is placed. The Gate caches one materialized Strip and the Projection position
 * at which it begins; it accelerates navigation but never determines Sequence
 * order.
 *
 * Integration preserves every transfer coordinate and derives separate
 * structural links. Every retained non-first Strip stores its immediate
 * predecessor's indexed start in `previous_structural_strip_start`; the first
 * stores the Root. The predecessor names the same Strip through
 * `next_strip_start`.
 *
 * @invariant The structural chain contains every materialized Strip, including
 * Masks, exactly once from `first_strip_start` through `last_strip_start`.
 * @invariant Adjacent structural Strips have mutually consistent forward and
 * backward links.
 * @invariant The first retained Strip has the Root as its previous point, every
 * other retained Strip has its immediate predecessor's `this_strip_start` in
 * `previous_structural_strip_start`, and the last retained Strip has
 * `unlinked_strip_start` as its successor.
 * @invariant `projection_frame_count` equals the sum of `frame_count` over all
 * visible materialized Strips.
 * @invariant When the primary index is non-empty, the first, Gate, and last
 * starts resolve to materialized Strips; when it is empty, their values are the
 * Root and the Projection frame count is zero.
 * @note The Projector owns Strip values and index storage. It references
 * consumer-owned Footage only through each Strip's `footage_frame_index`.
 */
struct Projector {
  // Authoritative materialized Sequence and Projection state.

  /**
   * @brief Materialized Strips indexed by their own stable start points.
   *
   * This is the authoritative runtime representation of structural membership.
   * Each stored Strip has derived predecessor and successor links while its
   * Sequence Coordinate remains immutable.
   */
  std::vector<Strip> strips;

  /**
   * @brief Materialized Strips indexed by their own stable start points.
   *
   * This is the authoritative runtime representation of structural membership.
   * Each stored Strip has derived predecessor and successor links while its
   * Sequence Coordinate remains immutable.
   */
  HashTable<> hash_table;

  LengthTable length_table;

  /** @brief Total number of visible frames in the current Projection. */
  std::uint32_t projection_frame_count{0};

  // Movable Gate and retained structural boundaries.

  /**
   * @brief Projection frame index at which the Gate Strip begins.
   *
   * A Mask has zero projected length, so it may share this position with an
   * adjacent Strip.
   */
  std::uint32_t gate_projection_frame_index{0};

  /**
   * @brief Stable start of the first structural Strip, or Root when empty.
   */
  SequencePoint first_strip_start{};

  /** @brief Stable start of the materialized Strip cached by the Gate. */
  SequencePoint gate_strip_start{};

  /**
   * @brief Stable start of the last structural Strip, or Root when empty.
   */
  SequencePoint last_strip_start{};

  // Incoming Strips awaiting coordinate dependencies.

  /**
   * @brief Masks awaiting their containing Strip's indexed start.
   *
   * Each incoming Mask is keyed by `coordinate.previous_strip_start`, which
   * names the exact primary-index key of its containing visible Strip. Its
   * `coordinate.this_strip_start` already names the first masked Frame.
   */
  HashTable<&SequenceCoordinate::previous_strip_end> pending_masks;

  /**
   * @brief Visible Strips awaiting their placement Frame.
   *
   * Each pending insertion is keyed by the transferred
   * `coordinate.previous_strip_start`, the Root or Frame after which it is to
   * be placed. Materialization preserves that dependency.
   */
  HashTable<&SequenceCoordinate::previous_strip_end> pending_inserts;
};
