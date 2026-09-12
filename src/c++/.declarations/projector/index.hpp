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
#include <chrono>
#include <cstring>
#include <memory>
#include <span>
#include <cstdint>
#include <random>
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
 * @invariant All SoA lanes share one allocation and capacity; strip_count is\n * the live append-only index limit.
 * @invariant The materialized circular chain contains each materialized Strip,
 * including Masks, exactly once.
 * @invariant Adjacent structural Strips have mutually consistent forward and
 * backward links.
 * @invariant `projection_frame_count` equals the sum of `frame_count` over all
 * visible materialized Strips.
 * @invariant A non-empty Projection has visible Head, Tail, and Gate Strips.
 */
struct Projector {
  std::uint32_t strip_count = 0;
  std::uint32_t strip_capacity = 0;
  std::unique_ptr<std::byte[]> strip_storage;

  void reserve_strips(const std::uint32_t required) {
    if (required <= strip_capacity)
      return;
    const auto capacity = std::max(required, std::max(64u, strip_capacity * 2));
    constexpr auto bytes_per_strip = sizeof(std::uint8_t) +
        14 * sizeof(std::uint32_t) + 2 * sizeof(SequencePoint);
    constexpr std::size_t lane_padding = 64;
    auto storage = std::unique_ptr<std::byte[]>{
        new std::byte[static_cast<std::size_t>(capacity) * bytes_per_strip +
                      17 * lane_padding]};
    auto *cursor = storage.get();
    const auto relocate = [&]<typename Value>(std::span<Value> &lane) {
      auto *target = reinterpret_cast<Value *>(cursor);
      std::uninitialized_default_construct_n(target, capacity);
      if (strip_count != 0)
        std::memcpy(target, lane.data(), sizeof(Value) * strip_count);
      lane = {target, capacity};
      cursor += sizeof(Value) * capacity + lane_padding;
    };
    relocate(initial_length_of);
    relocate(fragment_length_of);
    relocate(dependency_prefix_of);
    relocate(smaller_competitor_strip_index_of);
    relocate(larger_split_strip_index_of);
    relocate(strip_start_of);
    relocate(previous_strip_end_of);
    relocate(right_strip_index_of);
    relocate(left_strip_index_of);
    relocate(left_jump_strip_index_of);
    relocate(left_jump_strip_count_of);
    relocate(left_jump_length_of);
    relocate(right_jump_strip_index_of);
    relocate(right_jump_strip_count_of);
    relocate(right_jump_length_of);
    relocate(footage_frame_index_of);
    relocate(strip_type_of);
    strip_storage = std::move(storage);
    strip_capacity = capacity;
  }

  std::uint32_t append_strip() {
    if (strip_count == strip_capacity)
      reserve_strips(strip_count + 1);
    return strip_count++;
  }

  // Authoritative materialized Sequence and Projection state.
  ///////////////
  // ENCODING //
  /////////////
  std::span<uint8_t> strip_type_of;

  /**
   * @brief Immutable issued SequencePoint span lengths, excluding the zero
   * anchor.
   */
  std::span<std::uint32_t> initial_length_of;

  /** @brief Current physical source fragment lengths. */
  std::span<std::uint32_t> fragment_length_of;

  /** @brief Creation-time dependency offset; structural fragments store their
   * source offset. */
  std::span<std::uint32_t> dependency_prefix_of;

  /** @brief Next smaller sibling sharing the same previous Strip end. */
  std::span<std::uint32_t> smaller_competitor_strip_index_of;

  /** @brief Next physical source fragment; instructions never have a split
   * link. */
  std::span<std::uint32_t> larger_split_strip_index_of;

  /**
   * @brief Strip start Sequence Points indexed by Strip Index .
   */
  std::span<SequencePoint> strip_start_of;

  /**
   * @brief Previous Strip End Sequence Points indexed by Strip Index .
   */
  std::span<SequencePoint> previous_strip_end_of;

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
  std::span<std::uint32_t> right_strip_index_of;

  /**
   * @brief Strip Index immediately to the left in Structural Order.
   *
   * A Pending Strip points to itself until materialized.
   */
  std::span<std::uint32_t> left_strip_index_of;

  /** @brief Visible Strip reached by the current left Projection jump. */
  std::span<std::uint32_t> left_jump_strip_index_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::span<std::uint32_t> left_jump_strip_count_of;

  /** @brief Projection Frame distance to `left_jump_strip_index`. */
  std::span<std::uint32_t> left_jump_length_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::span<std::uint32_t> right_jump_strip_index_of;

  /** @brief Visible Strip reached by the current right Projection jump. */
  std::span<std::uint32_t> right_jump_strip_count_of;

  /** @brief Projection Frame distance to `right_jump_strip_index`. */
  std::span<std::uint32_t> right_jump_length_of;

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

  std::span<std::uint32_t> footage_frame_index_of;

  const std::uint32_t mask_session_crypto_random_bits = std::random_device{}();
  const std::uint32_t insert_session_crypto_random_bits =
      std::random_device{}();
  const std::uint32_t shared_session_unix_lower_bits =
      static_cast<std::uint32_t>(
          std::chrono::duration_cast<std::chrono::milliseconds>(
              std::chrono::system_clock::now().time_since_epoch())
              .count());

  /**
   * @brief Visit retained Footage without copying it or splitting a Mask.
   * @param strip_index Materialized Strip whose content is read.
   * @param visit Receives each Footage start and content length in order.
   */
  template <typename Visitor>
  void for_each_footage_span(const std::uint32_t strip_index,
                             Visitor &&visit) const noexcept {
    if (strip_type_of[strip_index] != 2 &&
        footage_frame_index_of[strip_index] != u32_max)
      visit(footage_frame_index_of[strip_index],
            fragment_length_of[strip_index]);
  }

  /** @brief Visible length; Masks retain identity spans but project no Frames.
   */
  [[nodiscard]] std::uint32_t
  get_projected_strip_length(const std::uint32_t strip_index) const noexcept {
    return strip_type_of[strip_index] < 2 ? fragment_length_of[strip_index] : 0;
  }

  /** @brief Recover the creation-time source anchor without rewriting the
   * instruction. */
  SequencePoint dependency_origin(const std::uint32_t strip) const noexcept {
    auto origin = previous_strip_end_of[strip];
    origin.counter_bits -= dependency_prefix_of[strip];
    return origin;
  }

  bool is_fragment(const std::uint32_t strip) const noexcept {
    return strip_start_of[strip].counter_bits == u32_max;
  }

  SequencePoint fragment_start(const std::uint32_t strip) const noexcept {
    return is_fragment(strip) ? previous_strip_end_of[strip]
                              : strip_start_of[strip];
  }

  std::uint32_t fragment_offset(const std::uint32_t strip) const noexcept {
    return is_fragment(strip) ? dependency_prefix_of[strip] : 0;
  }

  std::pair<std::uint32_t, std::uint32_t>
  resolve_dependency(const std::uint32_t strip) const noexcept {
    const auto origin = dependency_origin(strip);
    auto source = containment_table.get(origin).first;
    auto offset = dependency_prefix_of[strip];
    if (source == u32_max || strip_start_of[source] != origin)
      return {u32_max, 0};
    while (source != u32_max &&
           offset > fragment_offset(source) + fragment_length_of[source]) {
      source = larger_split_strip_index_of[source];
    }
    if (source == u32_max || offset < fragment_offset(source))
      return {u32_max, 0};
    return {source, offset - fragment_offset(source)};
  }

  /** @brief Resolve a Mask in its creation-time source coordinate system. */
  template <typename Visitor>
  bool for_each_mask_target(const std::uint32_t mask, Visitor &&visit,
                            const bool include_prefix = false) const noexcept {
    const auto origin = dependency_origin(mask);
    auto [source, offset] = containment_table.get(origin);
    if (source == u32_max || strip_start_of[source] != origin)
      return false;
    offset = dependency_prefix_of[mask];
    std::uint64_t remaining = initial_length_of[mask];
    if (include_prefix) {
      remaining += offset;
      offset = 0;
    }
    while (remaining != 0) {
      if (source == u32_max || left_strip_index_of[source] == source ||
          strip_type_of[source] == 2)
        return false;
      const auto start = fragment_offset(source);
      if (offset < start)
        return false;
      if (offset >= start + fragment_length_of[source]) {
        source = larger_split_strip_index_of[source];
        continue;
      }
      const auto length = static_cast<std::uint32_t>(std::min<std::uint64_t>(
          remaining, start + fragment_length_of[source] - offset));
      if (length != 0) {
        visit(source, offset - start, length);
        remaining -= length;
        offset += length;
      }
      source = larger_split_strip_index_of[source];
    }
    return true;
  }
};
