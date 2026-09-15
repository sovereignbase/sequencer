#pragma once

#include "../../.containment_table/index.hpp"
#include "../../.frontier_table/index.hpp"
#include "../clock/index.hpp"
#include "../sentinels/index.hpp"
#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <limits>
#include <memory>
#include <span>
#include <unordered_map>
#include <utility>
#include <vector>

/** Native, cache-friendly materialization of one replicated sequence. */
struct Projector {
  std::uint32_t strip_count{0};
  std::uint32_t strip_capacity{0};
  std::unique_ptr<std::byte[]> strip_storage;

  std::span<std::uint8_t> strip_type_of;
  std::span<std::uint32_t> initial_length_of;
  std::span<std::uint32_t> fragment_length_of;
  std::span<std::uint32_t> dependency_prefix_of;
  std::span<std::uint32_t> offset_length_of;
  std::span<std::uint32_t> smaller_competitor_strip_index_of;
  std::span<std::uint32_t> larger_split_strip_index_of;
  std::span<Clock> anchor_clock_of;
  std::span<Clock> insert_clock_of;
  std::span<std::uint32_t> right_strip_index_of;
  std::span<std::uint32_t> left_strip_index_of;
  std::span<std::uint32_t> left_jump_strip_index_of;
  std::span<std::uint32_t> left_jump_strip_count_of;
  std::span<std::uint32_t> left_jump_length_of;
  std::span<std::uint32_t> right_jump_strip_index_of;
  std::span<std::uint32_t> right_jump_strip_count_of;
  std::span<std::uint32_t> right_jump_length_of;
  std::span<std::uint32_t> footage_frame_index_of;

  void reserve_strips(const std::uint32_t required) {
    if (required <= strip_capacity)
      return;
    const auto capacity = std::max(required, std::max(64u, strip_capacity * 2));
    constexpr auto bytes_per_strip = sizeof(std::uint8_t) +
                                     15 * sizeof(std::uint32_t) +
                                     2 * sizeof(Clock);
    if (capacity > std::numeric_limits<std::size_t>::max() / bytes_per_strip)
      throw std::bad_array_new_length{};
    auto storage = std::unique_ptr<std::byte[]>{
        new std::byte[static_cast<std::size_t>(capacity) * bytes_per_strip]};
    auto *cursor = storage.get();
    const auto relocate = [&]<typename Value>(std::span<Value> &lane) {
      auto *target = reinterpret_cast<Value *>(cursor);
      std::uninitialized_default_construct_n(target, capacity);
      if (strip_count != 0)
        std::memcpy(target, lane.data(), sizeof(Value) * strip_count);
      lane = {target, capacity};
      cursor += sizeof(Value) * capacity;
    };
    relocate(initial_length_of);
    relocate(fragment_length_of);
    relocate(dependency_prefix_of);
    relocate(offset_length_of);
    relocate(smaller_competitor_strip_index_of);
    relocate(larger_split_strip_index_of);
    relocate(anchor_clock_of);
    relocate(insert_clock_of);
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

  [[nodiscard]] std::uint32_t append_strip() {
    if (strip_count == strip_capacity)
      reserve_strips(strip_count + 1);
    return strip_count++;
  }

  std::uint32_t actor_id{0};
  std::uint32_t insert_time{0};
  std::uint32_t mask_time{0};
  std::uint32_t mask_session{u32_max};
  std::uint32_t head_strip_index{u32_max};
  std::uint32_t gate_strip_index{u32_max};
  std::uint32_t tail_strip_index{u32_max};
  std::uint32_t materialized_strip_count{0};
  std::uint32_t projection_frame_index{0};
  std::uint32_t projection_frame_count{0};
  std::uint32_t left_jump_to_patch{u32_max};
  std::uint32_t right_jump_to_patch{u32_max};
  ContainmentTable containment_table;
  FrontierTable frontier_table;
  std::vector<std::uint32_t> acknowledgement_cache;
  std::unordered_map<std::uint32_t, std::uint32_t>
      acknowledgement_frontier_offset;

  void refresh_acknowledgement(const bool full = false) {
    if (full) {
      acknowledgement_cache.clear();
      acknowledgement_frontier_offset.clear();
    }
    if (acknowledgement_cache.empty())
      acknowledgement_cache.push_back(actor_id);
    const auto update = [this](const auto session, const auto frontier) {
      const auto known = acknowledgement_frontier_offset.find(session);
      if (known == acknowledgement_frontier_offset.end()) {
        acknowledgement_cache.push_back(session);
        acknowledgement_cache.push_back(frontier);
        acknowledgement_frontier_offset.emplace(
            session,
            static_cast<std::uint32_t>(acknowledgement_cache.size() - 1));
      } else {
        acknowledgement_cache[known->second] = frontier;
      }
    };
    if (full)
      frontier_table.acknowledge_all(actor_id, update);
    else
      frontier_table.acknowledge_changed(actor_id, update);
  }

  void consume_acknowledgement() noexcept {
    acknowledgement_cache.resize(1);
    acknowledgement_frontier_offset.clear();
  }

  [[nodiscard]] bool is_fragment(const std::uint32_t strip) const noexcept {
    return initial_length_of[strip] == 0;
  }

  [[nodiscard]] std::uint32_t
  get_projected_strip_length(const std::uint32_t strip) const noexcept {
    return strip_type_of[strip] == 1 &&
                   footage_frame_index_of[strip] != u32_max
               ? fragment_length_of[strip]
               : 0;
  }

  [[nodiscard]] std::uint32_t
  get_fragment_offset(const std::uint32_t strip) const noexcept {
    const auto origin = containment_table.get(insert_clock_of[strip]);
    return origin == u32_max
        ? u32_max
        : dependency_prefix_of[strip] - dependency_prefix_of[origin];
  }

  void anchor_gate_after_mask(const std::uint32_t mask,
                              const std::uint32_t position) noexcept {
    left_jump_to_patch = u32_max;
    right_jump_to_patch = u32_max;
    if (projection_frame_count == 0) {
      gate_strip_index = mask;
      projection_frame_index = 0;
      return;
    }
    for (auto strip = right_strip_index_of[mask]; strip != u32_max;
         strip = right_strip_index_of[strip])
      if (get_projected_strip_length(strip) != 0) {
        gate_strip_index = strip;
        projection_frame_index = position;
        return;
      }
    for (auto strip = left_strip_index_of[mask]; strip != u32_max;
         strip = left_strip_index_of[strip]) {
      const auto length = get_projected_strip_length(strip);
      if (length != 0) {
        gate_strip_index = strip;
        projection_frame_index = position - length;
        return;
      }
    }
  }

  void clear_jumps() noexcept {
    left_jump_to_patch = u32_max;
    right_jump_to_patch = u32_max;
    for (std::uint32_t strip = 0; strip < strip_count; ++strip) {
      left_jump_strip_index_of[strip] = u32_max;
      right_jump_strip_index_of[strip] = u32_max;
      left_jump_strip_count_of[strip] = 0;
      right_jump_strip_count_of[strip] = 0;
      left_jump_length_of[strip] = 0;
      right_jump_length_of[strip] = 0;
    }
  }

  void cache_jump_to_patch(const std::uint32_t left,
                           const std::uint32_t right) noexcept {
    if (left != u32_max && right != u32_max &&
        right_jump_strip_index_of[left] == right &&
        left_jump_strip_index_of[right] == left) {
      left_jump_to_patch = left;
      right_jump_to_patch = right;
    } else {
      left_jump_to_patch = u32_max;
      right_jump_to_patch = u32_max;
    }
  }

  [[nodiscard]] bool patch_cached_jump(const std::int32_t frame_diff,
                                       const std::int32_t strip_diff) noexcept {
    const auto left = left_jump_to_patch;
    const auto right = right_jump_to_patch;
    left_jump_to_patch = u32_max;
    right_jump_to_patch = u32_max;
    if (left == u32_max || right == u32_max ||
        right_jump_strip_index_of[left] != right ||
        left_jump_strip_index_of[right] != left)
      return false;
    const auto frames = static_cast<std::uint32_t>(
        static_cast<std::int64_t>(right_jump_length_of[left]) + frame_diff);
    const auto strips = static_cast<std::uint32_t>(
        static_cast<std::int64_t>(right_jump_strip_count_of[left]) + strip_diff);
    right_jump_length_of[left] = frames;
    right_jump_strip_count_of[left] = strips;
    left_jump_length_of[right] = frames;
    left_jump_strip_count_of[right] = strips;
    return true;
  }

  template <typename Visitor>
  void for_each_footage_span(const std::uint32_t strip,
                             Visitor &&visit) const noexcept {
    if (strip_type_of[strip] != 2 && strip_type_of[strip] != 255 &&
        footage_frame_index_of[strip] != u32_max &&
        fragment_length_of[strip] != 0)
      visit(footage_frame_index_of[strip], fragment_length_of[strip]);
  }

  [[nodiscard]] std::pair<std::uint32_t, std::uint32_t>
  resolve_dependency(const std::uint32_t strip) const noexcept {
    auto source = containment_table.get(anchor_clock_of[strip]);
    const auto offset = offset_length_of[strip];
    while (source != u32_max) {
      const auto next = larger_split_strip_index_of[source];
      if (next == u32_max ||
          offset < get_fragment_offset(source) + fragment_length_of[source])
        break;
      source = next;
    }
    if (source == u32_max || offset < get_fragment_offset(source))
      return {u32_max, 0};
    return {source, offset - get_fragment_offset(source)};
  }

  template <typename Visitor>
  bool for_each_mask_target(const std::uint32_t mask,
                            Visitor &&visit) const noexcept {
    auto source = containment_table.get(anchor_clock_of[mask]);
    auto offset = offset_length_of[mask];
    std::uint32_t remaining = initial_length_of[mask];
    while (remaining != 0) {
      if (source == u32_max || strip_type_of[source] == 2 ||
          strip_type_of[source] == 255)
        return false;
      const auto start = get_fragment_offset(source);
      if (offset < start)
        return false;
      if (offset >= start + fragment_length_of[source]) {
        source = larger_split_strip_index_of[source];
        continue;
      }
      const auto length =
          std::min(remaining, start + fragment_length_of[source] - offset);
      visit(source, offset - start, length);
      remaining -= length;
      offset += length;
      source = larger_split_strip_index_of[source];
    }
    return true;
  }
};
