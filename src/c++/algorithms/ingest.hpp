#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/stage_strip/index.hpp"
#include "../apply/insert/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

namespace sequencer {

/** Integrates the dependency-ordered Delta rows currently in ProjectionBuffer. */
inline std::uint32_t ingest_projection(
    const std::uint32_t projection_id, std::uint32_t footage_frame_index,
    const std::uint32_t footage_length = u32_max,
    const bool trusted_snapshot = false,
    const bool emit_spans = true) noexcept {
  const auto rows = projection_buffer.read_buffer();
  auto &projector = *projectors[projection_id];
  const auto acknowledgement = frontier_buffer.read();
  auto remaining_footage = std::min(footage_length, u32_max - footage_frame_index);
  std::uint32_t incoming_footage_index = 0;
  bool integrated = false;
  bool missing_dependency = false;
  std::size_t processed = 0;

  for (const auto &row : rows) {
    const auto type = static_cast<std::uint8_t>(row[0]);
    const auto prefix = row[1];
    const auto length = row[2];
    const auto offset = row[3];
    const Clock anchor{row[4], row[5]};
    const Clock inserted{row[6], row[7]};
    if ((type != 1 && type != 2 && !(trusted_snapshot && type == 3)) ||
        length == 0 || inserted.time <= prefix ||
        inserted.time - prefix != length + 1 || inserted == Clock{0, 0})
      break;

    const auto input_footage = incoming_footage_index;
    if (type == 1) {
      if (length > remaining_footage)
        break;
      remaining_footage -= length;
      incoming_footage_index += length;
    }

    if (projector.containment_table.has(inserted)) {
      ++processed;
      continue;
    }

    const bool birth = type == 1 && anchor == Clock{0, 0};
    auto source = birth ? u32_max : projector.containment_table.get(anchor);
    if (!birth && source == u32_max) {
      missing_dependency = true;
      break;
    }
    if (!birth && offset > projector.initial_length_of[source])
      break;
    if (type != 1 &&
        (source == u32_max || projector.strip_type_of[source] == 2 ||
         length > projector.initial_length_of[source] - offset))
      break;

    const auto footage = type == 1 ? footage_frame_index : u32_max;
    const auto applied_type = static_cast<std::uint8_t>(type == 3 ? 2 : type);
    const auto incoming = stage_strip(projector, applied_type, length, anchor, inserted,
                                      offset, footage, prefix);
    const auto [containing, physical_offset] = birth
        ? std::pair{u32_max, 0u}
        : projector.resolve_dependency(incoming);
    if (!birth && containing == u32_max) {
      projector.containment_table.erase(inserted);
      --projector.strip_count;
      break;
    }

    std::uint32_t candidate_change = u32_max;
    if (type == 1)
      projector.cache_jump_to_patch(u32_max, u32_max);
    const auto counts = apply_insert(
        projector, containing, incoming, physical_offset,
        [&](const auto position, const auto masked_footage,
            const auto masked_length) noexcept {
          candidate_change = std::min(candidate_change, position);
          if (emit_spans)
            footage_span_buffer.write_span(position, masked_footage,
                                           masked_length, 1);
        });
    if (projector.left_strip_index_of[incoming] == incoming) {
      projector.containment_table.erase(inserted);
      --projector.strip_count;
      break;
    }

    if (type == 3) {
      integrated = true;
      unlink_strip(projector, incoming);
      projector.strip_type_of[incoming] = 3;
      ++processed;
      continue;
    }

    const auto position = type == 2
        ? projector.projection_frame_index
        : find_projection_frame_index_of(projector, incoming, counts.first,
                                         counts.second);
    if (type == 2)
      projector.anchor_gate_after_mask(
          incoming, candidate_change == u32_max ? position : candidate_change);
    else {
      projector.gate_strip_index = incoming;
      projector.projection_frame_index = position;
    }
    if (type == 1) {
      projector.frontier_table.observe_actor(inserted.actor);
      if (emit_spans)
        footage_span_buffer.write_span(u32_max, input_footage, length, 0);
      footage_frame_index += length;
      if (counts.first > 0) {
        if (emit_spans)
          footage_span_buffer.write_span(position,
              projector.footage_frame_index_of[incoming],
              static_cast<std::uint32_t>(counts.first), 0);
      }
      if (inserted.actor == projector.actor_id)
        projector.insert_time = std::max(projector.insert_time, inserted.time);
    } else {
      projector.frontier_table.observe_mask(inserted.actor, prefix,
                                             inserted.time);
      if (inserted.actor == projector.mask_session)
        projector.mask_time = std::max(projector.mask_time, inserted.time);
    }
    integrated = true;
    ++processed;
  }
  const bool complete = processed == rows.size();
  if (complete && !trusted_snapshot) {
    if (!acknowledgement.empty())
      projector.frontier_table.observe_actor(acknowledgement.front());
    projector.frontier_table.observe_acknowledgement(acknowledgement);
    if (integrated)
      projector.refresh_acknowledgement();
  }
  if (complete && (trusted_snapshot || integrated))
    return 1u;
  return missing_dependency && !integrated ? 2u : 0u;
}

} // namespace sequencer
