#pragma once

#include "./runtime.hpp"
#include <algorithm>
#include <cmath>

namespace sequencer {

/** @brief Mark locally released applied content without changing its identities. */
inline void release_mask_footage(const std::uint32_t id, const std::uint32_t crypto,
                                 const std::uint32_t unix_bits, const std::uint32_t counter) noexcept {
  auto &projector = *projectors[id];
  const auto mask = projector.containment_table.get({crypto, unix_bits, counter}).first;
  if (mask == u32_max || projector.strip_type_of[mask] != 2)
    return;
  projector.for_each_mask_target(mask, [&](const auto source, const auto, const auto) {
    projector.footage_frame_index_of[source] = u32_max;
    projector.strip_type_of[source] |= 16;
  });
}

/** @brief Collect acknowledged instructions and their eligible applied fragments. */
inline std::uint32_t compact_projection(const std::uint32_t projection_id,
                                        const std::uint32_t hard = 0) noexcept {
  const auto frontiers = sequence_point_buffer.read_buffer();
  auto &projector = *projectors[projection_id];
  const auto count = projector.strip_type_of.size();
  std::vector<SequencePoint> agreed;
  projector.containment_table.for_each_realm([&](SequencePoint end, const auto entries) {
    end.counter_bits = projector.collected_counter(end);
    for (const auto &entry : entries) {
      if (projector.strip_type_of[entry.strip_index] != 2 ||
          projector.left_strip_index_of[entry.strip_index] == entry.strip_index ||
          entry.counter_bits != end.counter_bits ||
          entry.frame_count >= u32_max - end.counter_bits)
        return;
      bool released = true;
      if (!projector.for_each_mask_target(entry.strip_index,
            [&](const auto source, const auto, const auto) {
              if (projector.footage_frame_index_of[source] != u32_max)
                released = false;
            }) || (!hard && !released))
        return;
      end.counter_bits += entry.frame_count + 1;
    }
    for (std::size_t index = 0; index + 2 < frontiers.size(); index += 3)
      if (end == SequencePoint{frontiers[index], frontiers[index + 1], frontiers[index + 2]}) {
        agreed.push_back(end);
        return;
      }
  });
  std::vector<bool> remove(count), covered(count), blocked(count);
  for (auto mask = projector.head_strip_index; mask != u32_max;
       mask = projector.right_strip_index_of[mask]) {
    if (projector.strip_type_of[mask] != 2)
      continue;
    const auto point = projector.strip_start_of[mask];
    bool eligible = std::any_of(agreed.begin(), agreed.end(), [&](const auto frontier) {
      return point.crypto_random_bits == frontier.crypto_random_bits &&
             point.unix_lower_bits == frontier.unix_lower_bits;
    });
    std::vector<std::uint32_t> targets;
    const bool complete = projector.for_each_mask_target(mask,
        [&](const auto source, const auto, const auto) {
          targets.push_back(source);
          if (!hard && projector.footage_frame_index_of[source] != u32_max)
            eligible = false;
        });
    eligible = eligible && complete;
    remove[mask] = eligible;
    for (const auto source : targets) {
      covered[source] = covered[source] || eligible;
      blocked[source] = blocked[source] || !eligible;
    }
    if (!complete)
      std::fill(blocked.begin(), blocked.end(), true);
  }
  for (std::uint32_t strip = 0; strip < count; ++strip)
    if (projector.strip_type_of[strip] >= 6 && projector.left_strip_index_of[strip] != strip)
      remove[strip] = covered[strip] && !blocked[strip];

  if (std::none_of(remove.begin(), remove.end(), [](const bool value) { return value; }))
    return 0;

  std::vector<SequencePoint> replacements(count);
  SequencePoint previous{0, 0, 0};
  for (auto strip = projector.head_strip_index; strip != u32_max;
       strip = projector.right_strip_index_of[strip]) {
    replacements[strip] = previous;
    if (!remove[strip]) {
      previous = projector.strip_start_of[strip];
      previous.counter_bits += projector.strip_length_of[strip];
    }
  }
  const auto reattach = [&](const SequencePoint dependency) {
    const auto source = projector.containment_table.get(dependency).first;
    return source != u32_max && remove[source] ? replacements[source] : dependency;
  };
  for (auto &source : projector.collected_sources)
    source.previous = reattach(source.previous);
  for (std::uint32_t strip = 0; strip < count; ++strip) {
    if (!remove[strip])
      projector.previous_strip_end_of[strip] = reattach(projector.previous_strip_end_of[strip]);
    auto &split = projector.larger_split_strip_index_of[strip];
    while (split != u32_max && remove[split])
      split = projector.larger_split_strip_index_of[split];
    auto &competitor = projector.smaller_competitor_strip_index_of[strip];
    while (competitor != u32_max && remove[competitor])
      competitor = projector.smaller_competitor_strip_index_of[competitor];
  }
  for (const auto frontier : agreed) {
    bool retained = false;
    for (std::uint32_t strip = 0; strip < count; ++strip)
      if (!remove[strip] && projector.strip_type_of[strip] == 2 &&
          projector.strip_start_of[strip].crypto_random_bits == frontier.crypto_random_bits &&
          projector.strip_start_of[strip].unix_lower_bits == frontier.unix_lower_bits)
        retained = true;
    if (!retained) {
      auto found = std::find_if(projector.collected_frontiers.begin(), projector.collected_frontiers.end(),
          [&](const auto point) { return point.crypto_random_bits == frontier.crypto_random_bits &&
                                       point.unix_lower_bits == frontier.unix_lower_bits; });
      if (found == projector.collected_frontiers.end())
        projector.collected_frontiers.push_back(frontier);
      else
        *found = frontier;
    }
  }
  std::uint32_t projection_index = 0;
  for (auto strip = projector.head_strip_index; strip != u32_max;) {
    const auto next = projector.right_strip_index_of[strip];
    if (remove[strip]) {
      if (projector.strip_type_of[strip] != 2) {
        projector.for_each_footage_span(strip, [&](const auto footage, const auto length) {
          footage_span_buffer.write_span(projection_index, footage, length, 1);
        });
      }
      projector.remember_collected_source({projector.strip_start_of[strip],
          projector.strip_length_of[strip], replacements[strip]});
      projector.containment_table.erase(projector.strip_start_of[strip]);
      const auto left = projector.left_strip_index_of[strip];
      if (left == u32_max) projector.head_strip_index = next;
      else projector.right_strip_index_of[left] = next;
      if (next == u32_max) projector.tail_strip_index = left;
      else projector.left_strip_index_of[next] = left;
      projector.left_strip_index_of[strip] = strip;
      projector.right_strip_index_of[strip] = strip;
      projector.footage_frame_index_of[strip] = u32_max;
      projector.strip_type_of[strip] = 255;
      projector.mask_owner_of.erase(strip);
      --projector.materialized_strip_count;
    } else {
      projection_index += projector.get_projected_strip_length(strip);
    }
    strip = next;
  }
  projector.mask_owner_of.clear();
  for (auto mask = projector.head_strip_index; mask != u32_max;
       mask = projector.right_strip_index_of[mask])
    if (projector.strip_type_of[mask] == 2)
      projector.for_each_mask_target(mask, [&](const auto source, const auto, const auto) {
        const auto owner = projector.mask_owner_of.find(source);
        if (owner == projector.mask_owner_of.end() ||
            projector.strip_start_of[owner->second] < projector.strip_start_of[mask])
          projector.mask_owner_of[source] = mask;
      });

  std::fill(projector.left_jump_strip_index_of.begin(), projector.left_jump_strip_index_of.end(), u32_max);
  std::fill(projector.right_jump_strip_index_of.begin(), projector.right_jump_strip_index_of.end(), u32_max);
  const auto distance = static_cast<std::uint32_t>(std::sqrt(projector.materialized_strip_count) + 0.5);
  std::uint32_t previous_jump = projector.head_strip_index, previous_index = 0, steps = 0;
  projection_index = 0;
  projector.gate_strip_index = projector.head_strip_index;
  projector.projection_frame_index = 0;
  for (auto strip = projector.head_strip_index; strip != u32_max;
       strip = projector.right_strip_index_of[strip]) {
    if (strip != previous_jump && (steps >= distance || strip == projector.tail_strip_index)) {
      projector.right_jump_strip_index_of[previous_jump] = strip;
      projector.right_jump_length_of[previous_jump] = projection_index - previous_index;
      projector.right_jump_strip_count_of[previous_jump] = steps;
      projector.left_jump_strip_index_of[strip] = previous_jump;
      projector.left_jump_length_of[strip] = projection_index - previous_index;
      projector.left_jump_strip_count_of[strip] = steps;
      previous_jump = strip;
      previous_index = projection_index;
      steps = 0;
    }
    projection_index += projector.get_projected_strip_length(strip);
    ++steps;
  }
  return footage_span_buffer.get_span_count();
}

}
