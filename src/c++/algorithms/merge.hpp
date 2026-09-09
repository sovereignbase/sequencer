#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/strip_contains_previous_strip_end/index.hpp"
#include "../apply/insert/before/index.hpp"
#include "../apply/insert/after/index.hpp"
#include "../apply/mask/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <tuple>

namespace sequencer {

inline std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 const std::uint32_t footage_frame_index) noexcept {

  const auto projection = projection_buffer.read_buffer();
  if (projection.empty())
    return;

  Projector &projector = *projectors[projection_id];

  for ()

    const std::uint32_t incoming_strip_index =
        strip_buffer.read_strip(projector);

  // Return early in case of a duplicate
  if (incoming_strip_index == u32_max)
    return u32_max;

  const std::uint32_t incoming_strip_type =
      projector.strip_type_of[incoming_strip_index];

  // Handle root inserts trough a fast path
  if (incoming_strip_type == 0)
    return apply_root(projector, incoming_strip_index);

  // Check if gate is at target
  std::uint32_t containing_strip_index = projector.gate_strip_index;
  std::uint32_t offset = strip_contains_previous_strip_end(
      projector.strip_start_of[containing_strip_index],
      projector.strip_length_of[containing_strip_index],
      projector.previous_strip_end_of[incoming_strip_index]);

  // If gate strip is not containing strip
  if (offset == u32_max) {
    // try resolving containing strip from containment index
    std::tie(containing_strip_index, offset) = projector.containment_table.get(
        projector.previous_strip_end_of[incoming_strip_index]);

    // If resolving failed return u32_max sentinel
    if (containing_strip_index == u32_max)
      return u32_max
  }

  std::int32_t frame_count_diff;
  std::int32_t strip_count_diff;
  if (operation_type == 1)
    std::tie(frame_count_diff, strip_count_diff) = apply_insert(
        projector, containing_strip_index, incoming_strip_index, offset);
  else if (operation_type == 2)
    std::tie(frame_count_diff, strip_count_diff) = apply_mask(
        projector, containing_strip_index, incoming_strip_index, offset);
  else
    return u32_max;

  return find_projection_frame_index_of(projector, incoming_strip_index,
                                        frame_count_diff, strip_count_diff)
}

}
