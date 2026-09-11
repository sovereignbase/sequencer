/**
 * @file
 * @brief Defines the Projector state for one materialized Sequence.
 *
 * A Projector owns Strip storage, dense Structural Order, point containment,
 * bounded Projection navigation, and a movable Gate. It references but never
 * owns consumer Footage.
 */
#pragma once

#include "../../.containment_table/index.hpp"
#include "../../.pending_table/index.hpp"
#include "../sentinels/index.hpp"
#include <cstdint>
#include <unordered_map>
#include <utility>
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
  std::vector<uint8_t> strip_type_of;

  /**
   * @brief Content lengths, excluding each Strip's reserved zero anchor.
   */
  std::vector<std::uint32_t> strip_length_of;

  /** @brief Next smaller sibling sharing the same previous Strip end. */
  std::vector<std::uint32_t> smaller_competitor_strip_index_of;

  /** @brief Next larger fragment of the same originally issued Strip. */
  std::vector<std::uint32_t> larger_split_strip_index_of;

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

  /** @brief Next local insert counter, advanced by content length plus one. */
  std::uint32_t operation_count{0};

  /** @brief Next local Mask Realm counter, independent of insert issuance. */
  std::uint32_t mask_operation_count{0};

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

  /** @brief Visible Strip reached by the current left Projection jump. */
  std::vector<std::uint32_t> left_jump_strip_index_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::vector<std::uint32_t> left_jump_strip_count_of;

  /** @brief Projection Frame distance to `left_jump_strip_index`. */
  std::vector<std::uint32_t> left_jump_length_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::vector<std::uint32_t> right_jump_strip_index_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::vector<std::uint32_t> right_jump_strip_count_of;

  /** @brief Projection Frame distance to `right_jump_strip_index`. */
  std::vector<std::uint32_t> right_jump_length_of;

  std::uint32_t materialized_strip_count{0};

  /**
   * @brief Sequence Point containment index returning Strip Indexs.
   *
   * ContainmentTable owns compact Realm entries only; Strip objects remain
   * owned by `strips`.
   */
  ContainmentTable containment_table;

  /**
   * @brief Pending Strip indices grouped by their missing previous Strip end.
   *
   * An arriving Strip releases all waiters whose dependency is in its span.
   */
  PendingTable pending_table;

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

  std::vector<std::uint32_t> footage_frame_index_of;

  /** @brief Non-contiguous retained Footage spans of unsplit Masks only. */
  std::unordered_map<std::uint32_t,
                     std::vector<std::pair<std::uint32_t, std::uint32_t>>>
      mask_footage_spans;

  /**
   * @brief Visit retained Footage without copying it or splitting a Mask.
   * @param strip_index Materialized Strip whose content is read.
   * @param visit Receives each Footage start and content length in order.
   */
  template <typename Visitor>
  void for_each_footage_span(const std::uint32_t strip_index,
                            Visitor &&visit) const noexcept {
    if (strip_type_of[strip_index] == 2 && !mask_footage_spans.empty()) {
      const auto found = mask_footage_spans.find(strip_index);
      if (found != mask_footage_spans.end()) {
        for (const auto &[footage, length] : found->second)
          visit(footage, length);
        return;
      }
    }
    visit(footage_frame_index_of[strip_index], strip_length_of[strip_index]);
  }

  /** @brief Visible length; Masks retain identity spans but project no Frames. */
  [[nodiscard]] std::uint32_t
  get_projected_strip_length(const std::uint32_t strip_index) const noexcept {
    return strip_type_of[strip_index] == 2 ? 0 : strip_length_of[strip_index];
  }
};
