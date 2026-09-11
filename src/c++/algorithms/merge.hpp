#pragma once

#include "./runtime.hpp"
#include "./read.hpp"
#include "../.auxiliary/stage_strip/index.hpp"
#include "../apply/insert/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

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
  for (const auto &strip : projection) {
    if (strip[0] >= 3 && strip[0] <= 5)
      break;
    if (strip[0] == 8 || strip[0] == 9)
      continue;
    if (strip[1] >= u32_max - strip[4])
      return u32_max;
    if (strip[0] == 2 && strip[8] != u32_max && strip[8] > strip[7])
      return u32_max;
    if (strip[0] != 2 && (strip[0] & 16) == 0) {
      if (strip[1] > remaining_footage)
        return u32_max;
      remaining_footage -= strip[1];
    }
  }
  std::uint32_t first_change = u32_max;
  std::vector<std::uint32_t> ready;

  for (const bool masks : {false, true})
  for (const auto &strip : projection) {
    if (strip[0] >= 3 && strip[0] <= 5)
      break;
    if (strip[0] == 8 || strip[0] == 9 || (strip[0] == 2) != masks)
      continue;
    const SequencePoint start{strip[2], strip[3], strip[4]};
    const SequencePoint previous{strip[5], strip[6], strip[7]};
    const auto footage = strip[0] == 2 || (strip[0] & 16) != 0 ? u32_max : footage_frame_index;
    if (strip[0] != 2 && (strip[0] & 16) == 0)
      footage_frame_index += strip[1];
    const auto [known, known_offset] = projector.containment_table.get(start);
    if ((known != u32_max && (known_offset < projector.strip_length_of[known] ||
                              projector.strip_start_of[known] == start)) ||
        (strip[0] == 2 && start.counter_bits < projector.collected_counter(start)) ||
        (projector.collected_table && projector.collected_table->get(start).first != u32_max))
      continue;

    const auto incoming = stage_strip(projector, static_cast<std::uint8_t>(strip[0]),
                                      strip[1], start, previous, footage);
    if (strip[0] == 2)
      projector.larger_split_strip_index_of[incoming] = strip[8];
    if (start.unix_lower_bits == shared_realm_unix_lower_bits) {
      if (start.crypto_random_bits == insert_realm_crypto_random_bits)
        projector.operation_count = std::max(projector.operation_count,
                                              start.counter_bits + strip[1] + 1);
      if (start.crypto_random_bits == mask_realm_crypto_random_bits)
        projector.mask_operation_count = std::max(projector.mask_operation_count,
                                                   start.counter_bits + strip[1] + 1);
    }
    ready.push_back(incoming);
    while (!ready.empty()) {
      const auto candidate = ready.back();
      ready.pop_back();
      const auto type = projector.strip_type_of[candidate];
      const auto dependency = type == 2 ? projector.mask_origin(candidate)
          : projector.resolve_collected_dependency(projector.previous_strip_end_of[candidate]);
      if (type != 2)
        projector.previous_strip_end_of[candidate] = dependency;
      const auto length = projector.strip_length_of[candidate];
      const bool birth = type != 2 && dependency == SequencePoint{0, 0, 0};
      auto [containing, offset] = projector.containment_table.get(dependency);
      std::uint32_t predecessor = u32_max;
      if (type != 2 && containing == candidate &&
          projector.strip_start_of[candidate] == dependency && dependency.counter_bits != 0) {
        auto before = dependency;
        --before.counter_bits;
        const auto previous_fragment = projector.containment_table.get(before).first;
        if (previous_fragment != u32_max &&
            projector.strip_start_of[previous_fragment].counter_bits +
                projector.strip_length_of[previous_fragment] == dependency.counter_bits) {
          predecessor = previous_fragment;
          containing = previous_fragment;
          offset = projector.strip_length_of[previous_fragment];
        }
      }
      if (birth) {
        containing = u32_max;
        offset = 0;
      } else if (containing == u32_max ||
                 projector.left_strip_index_of[containing] == containing) {
        projector.pending_table.set(dependency, candidate);
        continue;
      }

      const auto source_start = containing == u32_max ? dependency : projector.strip_start_of[containing];
      const auto source_length = containing == u32_max ? 0 : projector.strip_length_of[containing];
      const auto [frame_diff, strip_diff] =
          apply_insert(projector, containing, candidate, offset);
      if (projector.left_strip_index_of[candidate] == candidate) {
        auto missing = dependency;
        if (type == 2)
          projector.for_each_mask_target(candidate, [&](const auto source, const auto start_offset, const auto count) {
            missing = projector.strip_start_of[source];
            missing.counter_bits += start_offset + count;
          });
        projector.pending_table.set(missing, candidate);
        continue;
      }
      if (predecessor != u32_max) {
        projector.larger_split_strip_index_of[candidate] =
            projector.larger_split_strip_index_of[predecessor];
        projector.larger_split_strip_index_of[predecessor] = candidate;
      }
      const auto position = type == 2 ? projector.projection_frame_index
          : find_projection_frame_index_of(projector, candidate, frame_diff, strip_diff);
      projector.gate_strip_index = candidate;
      projector.projection_frame_index = position;
      if (frame_diff != 0)
        first_change = std::min(first_change, position);
      auto waiters = projector.pending_table.take(
          projector.strip_start_of[candidate], length);
      ready.insert(ready.end(), waiters.begin(), waiters.end());
      if (type != 2 && containing != u32_max && !projector.pending_table.is_empty()) {
        const auto changed_length = static_cast<std::uint32_t>(std::min<std::uint64_t>(
            std::uint64_t{source_length} + static_cast<std::uint32_t>(std::max(0, strip_diff - 1)),
            u32_max - source_start.counter_bits));
        auto source_waiters = projector.pending_table.take(source_start, changed_length);
        ready.insert(ready.end(), source_waiters.begin(), source_waiters.end());
      }
      if (predecessor != u32_max) {
        auto previous_waiters = projector.pending_table.take(dependency, 0);
        ready.insert(ready.end(), previous_waiters.begin(), previous_waiters.end());
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
