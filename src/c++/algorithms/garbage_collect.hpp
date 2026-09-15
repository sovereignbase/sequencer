#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/split_strip/index.hpp"
#include <cstdint>
#include <unordered_set>

namespace sequencer {

[[nodiscard]] inline std::uint64_t clock_key(const Clock clock) noexcept {
  return (std::uint64_t{clock.actor} << 32) | clock.time;
}

inline void rebuild_projection(Projector &projector) noexcept {
  projector.projection_frame_count = 0;
  projector.gate_strip_index = projector.head_strip_index;
  projector.projection_frame_index = 0;
  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip) {
    projector.left_jump_strip_index_of[strip] = u32_max;
    projector.right_jump_strip_index_of[strip] = u32_max;
    projector.left_jump_strip_count_of[strip] = 0;
    projector.right_jump_strip_count_of[strip] = 0;
    projector.left_jump_length_of[strip] = 0;
    projector.right_jump_length_of[strip] = 0;
  }
  for (auto strip = projector.head_strip_index; strip != u32_max;
       strip = projector.right_strip_index_of[strip]) {
    if (projector.get_projected_strip_length(strip) != 0 &&
        (projector.gate_strip_index == u32_max ||
         projector.get_projected_strip_length(projector.gate_strip_index) == 0))
      projector.gate_strip_index = strip;
    projector.projection_frame_count +=
        projector.get_projected_strip_length(strip);
  }
}

inline void unlink_strip(Projector &projector,
                         const std::uint32_t strip) noexcept {
  const auto left = projector.left_strip_index_of[strip];
  const auto right = projector.right_strip_index_of[strip];
  if (left == u32_max)
    projector.head_strip_index = right;
  else
    projector.right_strip_index_of[left] = right;
  if (right == u32_max)
    projector.tail_strip_index = left;
  else
    projector.left_strip_index_of[right] = left;
  projector.left_strip_index_of[strip] = strip;
  projector.right_strip_index_of[strip] = strip;
  projector.footage_frame_index_of[strip] = u32_max;
  projector.strip_type_of[strip] = 255;
  --projector.materialized_strip_count;
}

/** Drops globally acknowledged Masks and unreferenced, fully deleted anchors. */
inline void garbage_collect_projector(
    Projector &projector,
    const std::unordered_set<std::uint32_t> &sessions) noexcept {
  if (sessions.empty())
    return;

  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip) {
    if (projector.is_fragment(strip) || projector.strip_type_of[strip] != 2 ||
        !sessions.contains(projector.insert_clock_of[strip].actor))
      continue;
    unlink_strip(projector, strip);
    projector.strip_type_of[strip] = 3;
  }

  bool removed = true;
  while (removed) {
    removed = false;
    std::unordered_set<std::uint64_t> referenced;
    for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip)
      if (!projector.is_fragment(strip) && projector.strip_type_of[strip] != 255 &&
          projector.strip_type_of[strip] != 3 &&
          projector.anchor_clock_of[strip] != Clock{0, 0})
        referenced.insert(clock_key(projector.anchor_clock_of[strip]));

    for (std::uint32_t origin = 0; origin < projector.strip_count; ++origin) {
      if (projector.is_fragment(origin) || projector.strip_type_of[origin] != 1 ||
          referenced.contains(clock_key(projector.insert_clock_of[origin])))
        continue;
      bool fully_deleted = true;
      for (auto fragment = origin; fragment != u32_max;
           fragment = projector.larger_split_strip_index_of[fragment])
        fully_deleted = fully_deleted &&
            (projector.fragment_length_of[fragment] == 0 ||
             projector.footage_frame_index_of[fragment] == u32_max);
      if (!fully_deleted)
        continue;
      projector.containment_table.erase(projector.insert_clock_of[origin]);
      for (std::uint32_t mask = 0; mask < projector.strip_count; ++mask)
        if (projector.strip_type_of[mask] == 3 &&
            projector.anchor_clock_of[mask] ==
                projector.insert_clock_of[origin]) {
          projector.containment_table.erase(projector.insert_clock_of[mask]);
          projector.strip_type_of[mask] = 255;
        }
      for (auto fragment = origin; fragment != u32_max;) {
        const auto next = projector.larger_split_strip_index_of[fragment];
        if (projector.strip_type_of[fragment] != 255)
          unlink_strip(projector, fragment);
        fragment = next;
      }
      removed = true;
    }
  }
  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip) {
    if (projector.strip_type_of[strip] == 255)
      continue;
    auto &competitor = projector.smaller_competitor_strip_index_of[strip];
    while (competitor != u32_max &&
           projector.strip_type_of[competitor] == 255)
      competitor = projector.smaller_competitor_strip_index_of[competitor];
    auto &split = projector.larger_split_strip_index_of[strip];
    while (split != u32_max && projector.strip_type_of[split] == 255)
      split = projector.larger_split_strip_index_of[split];
  }
  rebuild_projection(projector);
}

/** Completes trusted creation: automatic GC, then a collision-free Mask clock. */
inline void finalize_projection(const std::uint32_t projection_id) noexcept {
  auto &projector = *projectors[projection_id];
  projector.frontier_table.acknowledge(projector.actor_id,
                                       [](const auto) {});
  const auto compactable = projector.frontier_table.get_compactable_sessions();
  garbage_collect_projector(projector, compactable);
  projector.frontier_table.free_compacted_sessions(compactable);
  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip)
    if (projector.strip_type_of[strip] == 3)
      projector.frontier_table.free_compacted_session(
          projector.insert_clock_of[strip].actor);
  projector.mask_session = projector.frontier_table.get_safe_session_id();
  projector.refresh_acknowledgement();
}

} // namespace sequencer
