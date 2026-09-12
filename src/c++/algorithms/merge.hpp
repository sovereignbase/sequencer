#pragma once

#include "./runtime.hpp"
#include "./read.hpp"
#include "../.auxiliary/stage_strip/index.hpp"
#include "../apply/insert/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

namespace sequencer {

/**
 * @brief Consume remote Strips once, ignoring unknown dependencies.
 * @details Snapshot fragments reconstruct newly accepted sources. Their applied
 * Mask types carry the hidden state; instructions may precede those fragments.
 * Incoming split and competitor indices are never used. Invalid metadata stops
 * consumption; changes from the accepted prefix are still returned.
 */
inline std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 std::uint32_t footage_frame_index,
                 const std::uint32_t footage_length = u32_max) noexcept {
  const auto projection = projection_buffer.read_buffer();
  Projector &projector = *projectors[projection_id];
  const auto previous_length = projector.projection_frame_count;
  const auto previous_strip_count = projector.strip_count;
  auto remaining_footage = std::min(footage_length, u32_max - footage_frame_index);
  std::uint32_t incoming_footage_index = 0;
  std::uint32_t first_change = u32_max;
  std::uint32_t fragment_source = u32_max;
  std::uint32_t fragment_tail = u32_max;

  for (const auto &strip : projection) {
    const auto type = strip[0];
    if ((type > 2 && type != 6 && type != 7 && type != 22 && type != 23) ||
        (strip[4] != u32_max && strip[1] >= u32_max - strip[4]) ||
        strip[11] > strip[7])
      break;
    const auto footage = type == 2 || (type & 16) != 0
        ? u32_max : footage_frame_index;
    const auto incoming_footage = incoming_footage_index;
    if (footage != u32_max) {
      if (strip[10] > remaining_footage)
        break;
      remaining_footage -= strip[10];
      incoming_footage_index += strip[10];
    }
    const auto accept_footage = [&] {
      if (footage != u32_max && strip[10] != 0) {
        footage_span_buffer.write_span(u32_max, incoming_footage, strip[10], 0);
        footage_frame_index += strip[10];
      }
    };
    const SequencePoint dependency{strip[5], strip[6], strip[7]};
    const SequencePoint origin{strip[5], strip[6], strip[7] - strip[11]};
    auto source = projector.containment_table.get(origin).first;
    if (source != u32_max && projector.strip_start_of[source] != origin)
      source = u32_max;

    if (strip[4] == u32_max) {
      if (type == 2 || source == u32_max || source < previous_strip_count ||
          strip[11] > projector.initial_length_of[source] ||
          strip[10] > projector.initial_length_of[source] - strip[11])
        continue;
      auto previous = fragment_source == source ? fragment_tail : source;
      while (projector.larger_split_strip_index_of[previous] != u32_max)
        previous = projector.larger_split_strip_index_of[previous];
      if (strip[11] < projector.fragment_offset(previous) +
                          projector.fragment_length_of[previous])
        continue;
      const auto fragment = stage_strip(projector, static_cast<std::uint8_t>(type),
          0, {u32_max, u32_max, u32_max}, dependency, footage, strip[11], strip[10]);
      const auto left = subtree_end(projector, previous);
      projector.larger_split_strip_index_of[previous] = fragment;
      insert_between(projector, left, fragment, projector.right_strip_index_of[left]);
      const auto length = projector.get_projected_strip_length(fragment);
      projector.projection_frame_count += length;
      const auto position = find_projection_frame_index_of(projector, fragment, length, 1);
      projector.gate_strip_index = fragment;
      projector.projection_frame_index = position;
      if (length != 0)
        first_change = std::min(first_change, position);
      fragment_source = source;
      fragment_tail = fragment;
      accept_footage();
      continue;
    }

    const SequencePoint start{strip[2], strip[3], strip[4]};
    if (projector.containment_table.get(start).first != u32_max)
      continue;
    const bool birth = type != 2 && origin == SequencePoint{0, 0, 0};
    if (!birth && (source == u32_max ||
                  strip[11] > projector.initial_length_of[source]))
      continue;
    if (type == 2 && (projector.strip_type_of[source] == 2 || strip[1] == 0 ||
        strip[1] > projector.initial_length_of[source] - strip[11]))
      continue;
    if (type != 2 && strip[10] > strip[1])
      continue;

    const auto incoming = stage_strip(projector, static_cast<std::uint8_t>(type),
        strip[1], start, dependency, footage, strip[11], strip[10]);
    auto [containing, offset] = projector.resolve_dependency(incoming);
    std::pair<std::int32_t, std::int32_t> counts{0, 0};
    bool snapshot_mask = false;
    if (type == 2 && source >= previous_strip_count) {
      auto tail = fragment_source == source ? fragment_tail : source;
      while (projector.larger_split_strip_index_of[tail] != u32_max)
        tail = projector.larger_split_strip_index_of[tail];
      snapshot_mask = projector.fragment_offset(tail) +
          projector.fragment_length_of[tail] < projector.initial_length_of[source];
      if (snapshot_mask) {
        const auto left = containing == u32_max ? tail : containing;
        insert_between(projector, left, incoming, projector.right_strip_index_of[left]);
        projector.projection_frame_index =
            find_projection_frame_index_of(projector, incoming, 0, 1);
      }
    }
    if (!snapshot_mask && (birth || containing != u32_max))
      counts = apply_insert(projector, birth ? u32_max : containing, incoming,
                            birth ? 0 : offset, &first_change);
    if (projector.left_strip_index_of[incoming] == incoming) {
      projector.containment_table.erase(start);
      --projector.strip_count;
      continue;
    }
    const auto position = type == 2 ? projector.projection_frame_index
        : find_projection_frame_index_of(projector, incoming, counts.first, counts.second);
    projector.gate_strip_index = incoming;
    projector.projection_frame_index = position;
    if (counts.first != 0 && type != 2)
      first_change = std::min(first_change, position);
    accept_footage();
    if (start.unix_lower_bits == projector.shared_session_unix_lower_bits) {
      if (start.crypto_random_bits == projector.insert_session_crypto_random_bits)
        projector.operation_count = std::max(projector.operation_count,
                                             start.counter_bits + strip[1] + 1);
      if (start.crypto_random_bits == projector.mask_session_crypto_random_bits)
        projector.mask_operation_count = std::max(projector.mask_operation_count,
                                                  start.counter_bits + strip[1] + 1);
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
