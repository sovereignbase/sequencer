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
#include "../sentinels/index.hpp"
#include "../strip/index.hpp"
#include <cstdint>
#include <vector>

/**
 * @brief Owned runtime state that materializes one Sequence and its Projection.
 *
 * `strips`, `left`, and `right` share the Strip Index index domain.
 * Materialized Strips form one circular bidirectional chain. A valid unresolved
 * Strip remains self-linked until Initial Projection Resolution or a later
 * operation materializes it. HashTable maps Sequence Point containment to this
 * dense domain; Strip-local jumps provide bounded Projection traversal.
 *
 * The Gate caches one materialized Strip Index and its visible Projection
 * start. It accelerates navigation but never determines Sequence order.
 *
 * @invariant `strips.size() == left.size() == right.size()`.
 * @invariant The materialized circular chain contains each materialized Strip,
 * including Masks, exactly once.
 * @invariant Adjacent structural Strips have mutually consistent forward and
 * backward links.
 * @invariant `projection_frame_count` equals the sum of `frame_count` over all
 * visible materialized Strips.
 * @invariant A non-empty Projection has visible Head, Tail, and Gate Strips.
 */
struct Projector {
  // Authoritative materialized Sequence and Projection state.
  ///////////////
  // ENCODING //
  /////////////
  /**
   * @brief Is masked flags indexed by Strip Index .
   */
  std::vector<bool> is_masked_of;
  /**
   * @brief Is inverse flags indexed by Strip Index .
   */
  std::vector<bool> is_inverse_of;

  /**
   * @brief Lengths indexed by Strip Index .
   */
  std::vector<uint32_t> strip_length_of;

  /**
   * @brief Strip start Sequence Points indexed by Strip Index .
   */
  std::vector<SequencePoint> strip_start_of;

  /**
   * @brief Previous Strip End Sequence Points indexed by Strip Index .
   */
  std::vector<SequencePoint> previous_strip_end_of;

  //////////////
  // RUNTIME //
  ////////////

  /** @brief Strip Index of the materialized Strip holding the first projection
   * frame. */
  std::uint32_t head_strip_index{u32_max};

  /** @brief Strip Index of the materialized Strip cached by the Gate. */
  std::uint32_t gate_strip_index{u32_max};

  /** @brief Strip Index of the materialized Strip holding the last projection
   * frame. */
  std::uint32_t tail_strip_index{u32_max};

  /**
   * @brief Strip Index immediately to the right in Structural Order.
   *
   * A Pending Strip points to itself until materialized.
   */
  std::vector<std::uint32_t> right_strip_index_of;

  /**
   * @brief Strip Index immediately to the left in Structural Order.
   *
   * A Pending Strip points to itself until materialized.
   */
  std::vector<std::uint32_t> left_strip_index_of;

  std::vector<std::uint32_t> footage_frame_index_of;

  /** @brief Strip Index of a Strip with the same previous_strip_end competing
   * for recency by lexograpical larfeness.
   */
  std::vector<std::uint32_t> larger_competitor_strip_index_of;

  /** @brief Next larger fragment of the same originally issued Strip. */
  std::vector<std::uint32_t> larger_split_strip_index_of;

  /** @brief Visible Strip reached by the current left Projection jump. */
  std::vector<std::uint32_t> left_jump_strip_index_of;

  /** @brief Projection Frame distance to `left_jump_strip_index`. */
  std::vector<std::uint32_t> left_jump_frame_length_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::vector<std::uint32_t> right_jump_strip_index_of;

  /** @brief Projection Frame distance to `right_jump_strip_index`. */
  std::vector<std::uint32_t> right_jump_frame_length_of;

  /**
   * @brief Sequence Point containment index returning Strip Indexs.
   *
   * HashTable owns compact Realm entries only; Strip objects remain owned
   * by `strips`.
   */
  HashTable hash_table;

  // Movable Projection traversal Gate.

  /**
   * @brief Projection frame index at which the Gate Strip begins.
   *
   * A Mask has zero projected length, so it may share this position with an
   * adjacent Strip.
   */
  std::uint32_t projection_frame_index{0};

  /** @brief Total number of visible frames in the current Projection. */
  std::uint32_t projection_frame_count{0};
};
