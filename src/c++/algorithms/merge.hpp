#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/stage_strip/index.hpp"
#include "../apply/insert/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

namespace sequencer {

/**
 * @brief Consume one dependency-ordered remote Delta once.
 * @details The first Strip must be a birth, already known, or depend on a
 * locally known source. Every later Strip must depend on local state or an
 * earlier accepted Strip in this Delta. Consumption stops at the first missing
 * dependency or invalid row. Incoming split and competitor indices are never
 * used.
 */
inline std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 std::uint32_t footage_frame_index,
                 const std::uint32_t footage_length = u32_max) noexcept {
  const auto projection = projection_buffer.read_buffer();
  Projector &projector = *projectors[projection_id];
  auto remaining_footage = std::min(footage_length, u32_max - footage_frame_index);
  std::uint32_t incoming_footage_index = 0;
  std::uint32_t first_change = u32_max;

  if (projection.empty())
    return u32_max;

  // A Delta is an ordered dependency chain, not a bag of independently
  // discoverable Strips. Reject it before mutation when its first dependency
  // is absent; the sender can retry after a snapshot exchange.
  const auto &first = projection.front();
  if (first[0] > 2 || first[4] == u32_max ||
      (first[4] != u32_max && first[1] >= u32_max - first[4]) ||
      first[11] > first[7])
    return u32_max;
  const SequencePoint first_origin{
      first[5], first[6], first[7] - first[11]};
  if (first_origin != SequencePoint{0, 0, 0}) {
    const auto first_source = projector.containment_table.get(first_origin).first;
    const SequencePoint first_start{first[2], first[3], first[4]};
    const bool already_known = first[4] != u32_max &&
        projector.containment_table.get(first_start).first != u32_max;
    if (!already_known &&
        (first_source == u32_max ||
         projector.strip_start_of[first_source] != first_origin))
      return u32_max;
  }

  for (const auto &strip : projection) {
    const auto type = strip[0];
    if (type > 2 || strip[4] == u32_max ||
        (strip[4] != u32_max && strip[1] >= u32_max - strip[4]) ||
        strip[11] > strip[7])
      break;
    const auto footage = type == 2 ? u32_max : footage_frame_index;
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

    const SequencePoint start{strip[2], strip[3], strip[4]};
    if (projector.containment_table.get(start).first != u32_max)
      continue;
    const bool birth = type != 2 && origin == SequencePoint{0, 0, 0};
    if (!birth && (source == u32_max ||
                   strip[11] > projector.initial_length_of[source]))
      break;
    if (type == 2 && (projector.strip_type_of[source] == 2 || strip[1] == 0 ||
        strip[1] > projector.initial_length_of[source] - strip[11]))
      continue;
    if (type != 2 && strip[10] > strip[1])
      continue;

    const auto incoming = stage_strip(projector, static_cast<std::uint8_t>(type),
        strip[1], start, dependency, footage, strip[11], strip[10]);
    auto [containing, offset] = projector.resolve_dependency(incoming);
    std::pair<std::int32_t, std::int32_t> counts{0, 0};
    std::uint32_t candidate_change = u32_max;
    if (birth || containing != u32_max)
      counts = apply_insert(projector, birth ? u32_max : containing, incoming,
                            birth ? 0 : offset, &candidate_change);
    if (projector.left_strip_index_of[incoming] == incoming) {
      projector.containment_table.erase(start);
      --projector.strip_count;
      break;
    }
    const auto position = type == 2 ? projector.projection_frame_index
        : find_projection_frame_index_of(projector, incoming, counts.first, counts.second);
    projector.gate_strip_index = incoming;
    projector.projection_frame_index = position;
    if (counts.first != 0 && type != 2) {
      first_change = std::min(first_change, position);
      candidate_change = position;
    } else if (candidate_change != u32_max) {
      first_change = std::min(first_change, candidate_change);
    }
    accept_footage();
    if (type == 2 && counts.first < 0)
      footage_span_buffer.write_span(candidate_change, u32_max,
          static_cast<std::uint32_t>(-counts.first), 1);
    else if (type != 2 && counts.first > 0)
      footage_span_buffer.write_span(position,
          projector.footage_frame_index_of[incoming],
          static_cast<std::uint32_t>(counts.first), 0);
    if (start.unix_lower_bits == projector.shared_session_unix_lower_bits) {
      if (start.crypto_random_bits == projector.insert_session_crypto_random_bits)
        projector.operation_count = std::max(projector.operation_count,
                                             start.counter_bits + strip[1] + 1);
      if (start.crypto_random_bits == projector.mask_session_crypto_random_bits)
        projector.mask_operation_count = std::max(projector.mask_operation_count,
                                                  start.counter_bits + strip[1] + 1);
    }
  }
  return first_change;
}

}
