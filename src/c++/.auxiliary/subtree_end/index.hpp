#pragma once

#include "../../.declarations/projector/index.hpp"
#include "../strip_contains_previous_strip_end/index.hpp"
#include <cstdint>
#include <vector>

/**
 * @brief Find the last linked Strip belonging to one causal subtree.
 * @note Descendants may belong to other Realms. Split continuations remain
 * part of the original subtree even when descendants separate the fragments.
 * @complexity O(d) time and O(h) auxiliary space for d visited descendants
 * and h active ancestors in the materialized depth-first order.
 */
[[nodiscard]] inline std::uint32_t
subtree_end(const Projector &projector,
            const std::uint32_t root_strip_index) noexcept {
  std::vector<std::uint32_t> ancestors;
  std::uint32_t last_strip_index = root_strip_index;
  auto next_strip_index = projector.right_strip_index_of[last_strip_index];
  while (next_strip_index != u32_max) {
    auto ancestor_strip_index = last_strip_index;
    const auto &dependency = projector.previous_strip_end_of[next_strip_index];
    while (projector.larger_split_strip_index_of[ancestor_strip_index] !=
               next_strip_index &&
           strip_contains_previous_strip_end(
               projector.strip_start_of[ancestor_strip_index],
               projector.strip_length_of[ancestor_strip_index], dependency) ==
               u32_max) {
      if (ancestors.empty())
        return last_strip_index;
      ancestor_strip_index = ancestors.back();
      ancestors.pop_back();
    }
    ancestors.push_back(ancestor_strip_index);
    last_strip_index = next_strip_index;
    next_strip_index = projector.right_strip_index_of[last_strip_index];
  }
  return last_strip_index;
}
