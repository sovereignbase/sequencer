#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/split_strip/index.hpp"
#include <cstdint>
#include <unordered_set>
#include <vector>

namespace sequencer {

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

  // A live operation contributes one reference to its anchor origin. Removing
  // an unreferenced deleted origin can make its own anchor unreferenced, so the
  // collection fixed point is a reference-count queue rather than repeated
  // full-table scans.
  std::vector<std::uint32_t> references(projector.strip_count, 0);
  for (std::uint32_t strip = 0; strip < projector.strip_count; ++strip) {
    if (projector.is_fragment(strip) || projector.strip_type_of[strip] == 255 ||
        projector.strip_type_of[strip] == 3 ||
        projector.anchor_clock_of[strip] == Clock{0, 0})
      continue;
    const auto anchor =
        projector.containment_table.get(projector.anchor_clock_of[strip]);
    if (anchor != u32_max)
      ++references[anchor];
  }

  const auto fully_deleted = [&](const std::uint32_t origin) noexcept {
    for (auto fragment = origin; fragment != u32_max;
         fragment = projector.larger_split_strip_index_of[fragment])
      if (projector.fragment_length_of[fragment] != 0 &&
          projector.footage_frame_index_of[fragment] != u32_max)
        return false;
    return true;
  };

  std::vector<std::uint32_t> ready;
  ready.reserve(projector.strip_count);
  for (std::uint32_t origin = 0; origin < projector.strip_count; ++origin)
    if (!projector.is_fragment(origin) &&
        projector.strip_type_of[origin] == 1 && references[origin] == 0 &&
        fully_deleted(origin))
      ready.push_back(origin);

  for (std::size_t next = 0; next < ready.size(); ++next) {
    const auto origin = ready[next];
    const auto anchor_clock = projector.anchor_clock_of[origin];
    const auto anchor = anchor_clock == Clock{0, 0}
        ? u32_max
        : projector.containment_table.get(anchor_clock);
    projector.containment_table.erase(projector.insert_clock_of[origin]);
    for (auto fragment = origin; fragment != u32_max;) {
      const auto following =
          projector.larger_split_strip_index_of[fragment];
      if (projector.strip_type_of[fragment] != 255)
        unlink_strip(projector, fragment);
      fragment = following;
    }
    if (anchor != u32_max && references[anchor] != 0 &&
        --references[anchor] == 0 && projector.strip_type_of[anchor] == 1 &&
        fully_deleted(anchor))
      ready.push_back(anchor);
  }

  // Compacted Masks can be forgotten once their source origin was collected.
  // This single pass replaces the former all-Masks scan for every origin.
  for (std::uint32_t mask = 0; mask < projector.strip_count; ++mask)
    if (projector.strip_type_of[mask] == 3 &&
        projector.containment_table.get(projector.anchor_clock_of[mask]) ==
            u32_max) {
      projector.containment_table.erase(projector.insert_clock_of[mask]);
      projector.strip_type_of[mask] = 255;
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
