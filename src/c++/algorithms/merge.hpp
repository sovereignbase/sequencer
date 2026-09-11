#pragma once

#include "./runtime.hpp"
#include "./read.hpp"
#include "../.auxiliary/stage_strip/index.hpp"
#include "../apply/insert/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>
#include <unordered_map>

namespace sequencer {

/** @brief Consume remote Strips and return the earliest changed visible index. */
inline std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 std::uint32_t footage_frame_index,
                 const std::uint32_t footage_length = u32_max) noexcept {
  const auto projection = projection_buffer.read_buffer();
  Projector &projector = *projectors[projection_id];
  const auto previous_length = projector.projection_frame_count;
  std::uint32_t remaining_footage = std::min(footage_length, u32_max - footage_frame_index);
  std::vector<std::uint32_t> footage_indices;
  footage_indices.reserve(projection.size());
  for (const auto &strip : projection) {
    if (strip[0] >= 3 && strip[0] <= 5)
      break;
    footage_indices.push_back(u32_max);
    if (strip[0] == 8 || strip[0] == 9)
      continue;
    if ((strip[4] != u32_max && strip[1] >= u32_max - strip[4]) ||
        strip[11] > strip[7])
      return u32_max;
    if (strip[0] != 2 && (strip[0] & 16) == 0) {
      if (strip[10] > remaining_footage)
        return u32_max;
      footage_indices.back() = footage_frame_index;
      footage_frame_index += strip[10];
      remaining_footage -= strip[10];
    }
  }
  std::uint32_t first_change = u32_max;
  std::vector<std::uint32_t> incoming_roots;
  std::unordered_map<std::uint32_t, std::uint32_t> new_sources;

  for (std::size_t row = 0; row < footage_indices.size(); ++row) {
    const auto &strip = projection[row];
    if (strip[0] == 8 || strip[0] == 9 || strip[4] == u32_max)
      continue;
    const SequencePoint start{strip[2], strip[3], strip[4]};
    const auto [known, known_offset] = projector.containment_table.get(start);
    if ((known != u32_max && known_offset <= projector.initial_length_of[known]) ||
        (strip[0] == 2 && start.counter_bits < projector.collected_counter(start)) ||
        (projector.collected_table && projector.collected_table->get(start).first != u32_max))
      continue;
    const auto incoming = stage_strip(
        projector, static_cast<std::uint8_t>(strip[0]), strip[1], start,
        {strip[5], strip[6], strip[7]}, footage_indices[row], strip[11], strip[10]);
    incoming_roots.push_back(incoming);
    if (strip[0] != 2)
      new_sources.emplace(incoming, incoming);
    if (start.unix_lower_bits == shared_realm_unix_lower_bits) {
      if (start.crypto_random_bits == insert_realm_crypto_random_bits)
        projector.operation_count = std::max(projector.operation_count,
                                              start.counter_bits + strip[1] + 1);
      if (start.crypto_random_bits == mask_realm_crypto_random_bits)
        projector.mask_operation_count = std::max(projector.mask_operation_count,
                                                   start.counter_bits + strip[1] + 1);
    }
  }
  for (std::size_t row = 0; row < footage_indices.size(); ++row) {
    const auto &strip = projection[row];
    if (strip[4] != u32_max || strip[10] == 0)
      continue;
    const SequencePoint origin{strip[5], strip[6], strip[7] - strip[11]};
    const auto source = projector.containment_table.get(origin).first;
    if (!new_sources.contains(source) || projector.strip_start_of[source] != origin)
      continue;
    const auto fragment = stage_strip(
        projector, static_cast<std::uint8_t>(strip[0]), 0,
        {u32_max, u32_max, u32_max}, {strip[5], strip[6], strip[7]},
        footage_indices[row], strip[11], strip[10]);
    auto &tail = new_sources[source];
    projector.larger_split_strip_index_of[tail] = fragment;
    tail = fragment;
  }

  std::vector<std::uint32_t> ready(incoming_roots.rbegin(), incoming_roots.rend());
  while (!ready.empty()) {
    const auto candidate = ready.back();
    ready.pop_back();
    if (projector.left_strip_index_of[candidate] != candidate)
      continue;
    const auto type = projector.strip_type_of[candidate];
    auto dependency = projector.dependency_origin(candidate);
    const bool birth = type != 2 && dependency == SequencePoint{0, 0, 0};
    auto [containing, offset] = projector.resolve_dependency(candidate);
    if (birth) {
      containing = u32_max;
      offset = 0;
    } else if (containing == u32_max ||
               projector.left_strip_index_of[containing] == containing) {
      projector.pending_table.set(dependency, candidate);
      continue;
    }

    std::uint32_t mask_change = u32_max;
    if (type == 2)
      projector.for_each_mask_target(candidate, [&](const auto source, const auto start, const auto) {
        if (mask_change == u32_max && projector.get_projected_strip_length(source) != 0)
          mask_change = std::min(mask_change,
              find_projection_frame_index_of(projector, source, 0, 0) + start);
      });
    const auto [frame_diff, strip_diff] =
        apply_insert(projector, containing, candidate, offset);
    if (projector.left_strip_index_of[candidate] == candidate) {
      projector.pending_table.set(dependency, candidate);
      continue;
    }
    auto total_frames = frame_diff;
    auto total_strips = strip_diff;
    if (type != 2) {
      auto previous = candidate;
      for (auto fragment = projector.larger_split_strip_index_of[candidate];
           fragment != u32_max;
           fragment = projector.larger_split_strip_index_of[fragment]) {
        insert_between(projector, previous, fragment,
                       projector.right_strip_index_of[previous]);
        const auto length = projector.get_projected_strip_length(fragment);
        projector.projection_frame_count += length;
        total_frames += static_cast<std::int32_t>(length);
        ++total_strips;
        previous = fragment;
      }
    }
    const auto position = type == 2 ? projector.projection_frame_index
        : find_projection_frame_index_of(projector, candidate, total_frames, total_strips);
    projector.gate_strip_index = candidate;
    projector.projection_frame_index = position;
    if (total_frames != 0)
      first_change = std::min(first_change, type == 2 ? mask_change : position);

    auto waiters = projector.pending_table.take(
        projector.strip_start_of[candidate], projector.initial_length_of[candidate]);
    ready.insert(ready.end(), waiters.begin(), waiters.end());
    if (containing != u32_max && !projector.pending_table.is_empty()) {
      const auto source = projector.containment_table.get(dependency).first;
      if (source != u32_max) {
        auto source_waiters = projector.pending_table.take(
            projector.strip_start_of[source], projector.initial_length_of[source]);
        ready.insert(ready.end(), source_waiters.begin(), source_waiters.end());
      }
    }
  }
  if (first_change != u32_max) {
    write_projection_footage_spans_to_buffer(
        projection_id, first_change, projector.projection_frame_count);
    if (projector.projection_frame_count < previous_length)
      footage_span_buffer.write_span(projector.projection_frame_count, u32_max,
          previous_length - projector.projection_frame_count, 1);
  }
  return first_change;
}

}
