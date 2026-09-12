#pragma once

#include "./runtime.hpp"
#include <algorithm>
#include <cmath>
#include <span>
#include <unordered_map>

namespace sequencer {

/** @brief Match all actor frontiers in expected O(total input words) time.
 * Each actor is encoded as a three-word header (point count, 0, 0), then triples.
 * actor_count zero accepts the already-selected flat native frontier format.
 */
inline std::unordered_map<std::uint64_t, std::uint32_t> select_compaction_frontiers(
    const std::span<const std::uint32_t> words, const std::uint32_t actor_count) noexcept {
  struct Agreement {
    std::uint32_t counter;
    std::uint32_t actors;
  };
  std::unordered_map<std::uint64_t, Agreement> candidates;
  std::size_t offset = 0;
  const auto participants = std::max(actor_count, 1u);
  for (std::uint32_t actor = 0; actor < participants; ++actor) {
    std::size_t count = words.size() / 3;
    if (actor_count != 0) {
      if (offset + 3 > words.size())
        return {};
      count = words[offset];
      offset += 3;
      if (count > (words.size() - offset) / 3)
        return {};
    }
    for (std::size_t point = 0; point < count; ++point, offset += 3) {
      const auto realm = (std::uint64_t{words[offset]} << 32) | words[offset + 1];
      const auto counter = words[offset + 2];
      if (actor == 0) {
        const auto [found, inserted] = candidates.try_emplace(realm, Agreement{counter, 1});
        if (!inserted && found->second.counter != counter)
          found->second.actors = 0;
      } else {
        const auto found = candidates.find(realm);
        if (found != candidates.end()) {
          auto &agreement = found->second;
          if (agreement.counter != counter)
            agreement.actors = 0;
          else if (agreement.actors == actor)
            ++agreement.actors;
        }
      }
    }
  }
  std::unordered_map<std::uint64_t, std::uint32_t> selected;
  for (const auto &[realm, agreement] : candidates)
    if (agreement.actors == participants)
      selected.emplace(realm, agreement.counter);
  return selected;
}

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
                                        const std::uint32_t hard = 0,
                                        const std::uint32_t actor_count = 0) noexcept {
  const auto words = sequence_point_buffer.read_buffer();
  const auto frontiers = select_compaction_frontiers(words, actor_count);
  if (frontiers.empty())
    return 0;
  auto &projector = *projectors[projection_id];
  const auto count = projector.strip_count;
  const auto realm_of = [](const SequencePoint point) {
    return (std::uint64_t{point.crypto_random_bits} << 32) | point.unix_lower_bits;
  };
  std::unordered_map<std::uint64_t, std::uint32_t> agreed;
  projector.containment_table.for_each_realm([&](SequencePoint end, const auto entries) {
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
    const auto selected = frontiers.find(realm_of(end));
    if (selected != frontiers.end() && selected->second == end.counter_bits)
      agreed.emplace(selected->first, selected->second);
  });
  std::vector<bool> remove(count), covered(count), blocked(count);
  bool incomplete = false;
  for (auto mask = projector.head_strip_index; mask != u32_max;
       mask = projector.right_strip_index_of[mask]) {
    if (projector.strip_type_of[mask] != 2)
      continue;
    const auto point = projector.strip_start_of[mask];
    bool eligible = agreed.contains(realm_of(point));
    std::vector<std::uint32_t> targets;
    const bool complete = projector.for_each_mask_target(mask,
        [&](const auto source, const auto, const auto) {
          targets.push_back(source);
        });
    eligible = eligible && complete;
    remove[mask] = eligible;
    for (const auto source : targets) {
      covered[source] = covered[source] || eligible;
      blocked[source] = blocked[source] || !eligible;
    }
    incomplete = incomplete || !complete;
  }
  if (incomplete)
    std::fill(blocked.begin(), blocked.end(), true);
  for (std::uint32_t strip = 0; strip < count; ++strip)
    if (projector.strip_type_of[strip] >= 6 && projector.left_strip_index_of[strip] != strip)
      remove[strip] = covered[strip] && !blocked[strip];

  std::vector<bool> retain_anchor(count);
  for (std::uint32_t source = 0; source < count; ++source) {
    if (projector.is_fragment(source) || projector.strip_type_of[source] == 2 || !remove[source])
      continue;
    for (auto fragment = projector.larger_split_strip_index_of[source];
         fragment != u32_max;
         fragment = projector.larger_split_strip_index_of[fragment])
      if (!remove[fragment]) {
        retain_anchor[source] = true;
        remove[source] = false;
        break;
      }
  }

  if (std::none_of(remove.begin(), remove.end(), [](const bool value) { return value; }))
    return 0;

  std::vector<SequencePoint> replacements(count);
  SequencePoint previous{0, 0, 0};
  for (auto strip = projector.head_strip_index; strip != u32_max;
       strip = projector.right_strip_index_of[strip]) {
    replacements[strip] = previous;
    if (!remove[strip]) {
      previous = projector.fragment_start(strip);
      previous.counter_bits += projector.fragment_length_of[strip];
    }
  }
  const auto reattach = [&](const SequencePoint dependency) {
    const auto source = projector.containment_table.get(dependency).first;
    return source != u32_max && remove[source] ? replacements[source] : dependency;
  };
  for (std::uint32_t strip = 0; strip < count; ++strip) {
    if (!remove[strip] && !projector.is_fragment(strip)) {
      const auto dependency = reattach(projector.previous_strip_end_of[strip]);
      if (dependency != projector.previous_strip_end_of[strip]) {
        projector.previous_strip_end_of[strip] = dependency;
        projector.dependency_prefix_of[strip] = projector.containment_table.get(dependency).second;
      }
    }
    auto &split = projector.larger_split_strip_index_of[strip];
    while (projector.strip_type_of[strip] != 2 && split != u32_max && remove[split])
      split = projector.larger_split_strip_index_of[split];
    auto &competitor = projector.smaller_competitor_strip_index_of[strip];
    while (competitor != u32_max && remove[competitor])
      competitor = projector.smaller_competitor_strip_index_of[competitor];
  }
  std::uint32_t projection_index = 0;
  for (auto strip = projector.head_strip_index; strip != u32_max;) {
    const auto next = projector.right_strip_index_of[strip];
    if (retain_anchor[strip]) {
      projector.for_each_footage_span(strip, [&](const auto footage, const auto length) {
        footage_span_buffer.write_span(projection_index, footage, length, 1);
      });
      projector.fragment_length_of[strip] = 0;
      projector.footage_frame_index_of[strip] = u32_max;
      projector.strip_type_of[strip] &= 1;
    }
    if (remove[strip]) {
      if (projector.strip_type_of[strip] != 2) {
        projector.for_each_footage_span(strip, [&](const auto footage, const auto length) {
          footage_span_buffer.write_span(projection_index, footage, length, 1);
        });
      }
      if (!projector.is_fragment(strip)) {
        projector.containment_table.erase(projector.strip_start_of[strip]);
      }
      const auto left = projector.left_strip_index_of[strip];
      if (left == u32_max) projector.head_strip_index = next;
      else projector.right_strip_index_of[left] = next;
      if (next == u32_max) projector.tail_strip_index = left;
      else projector.left_strip_index_of[next] = left;
      projector.left_strip_index_of[strip] = strip;
      projector.right_strip_index_of[strip] = strip;
      projector.footage_frame_index_of[strip] = u32_max;
      projector.strip_type_of[strip] = 255;
      projector.larger_split_strip_index_of[strip] = u32_max;
      --projector.materialized_strip_count;
    } else {
      projection_index += projector.get_projected_strip_length(strip);
    }
    strip = next;
  }
  std::fill_n(projector.left_jump_strip_index_of.begin(), count, u32_max);
  std::fill_n(projector.right_jump_strip_index_of.begin(), count, u32_max);
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
