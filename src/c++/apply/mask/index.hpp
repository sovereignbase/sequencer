/**
 * @file
 * @brief Materializes a Mask over retained Sequence Frames.
 */
#pragma once

#include "../../.auxiliary/split_strip/index.hpp"
#include "../../.declarations/projector/index.hpp"
#include <algorithm>
#include <cstdint>
#include <utility>

/**
 * @brief Convert the addressed retained Frame Span into materialized Masks.
 * @param projector Owning Projector.
 * @param containing_strip_index Strip containing the first Frame.
 * @param incoming_strip_index Strip Index of the Mask command.
 * @param offset First masked Frame offset in the containing Strip.
 * @pre The addressed content span is available through the larger-split chain.
 * @note Zero-length placeholders are followed without masking their anchors.
 * @return Projection Frame count and materialized Strip count differences.
 */
[[nodiscard]] inline std::pair<std::int32_t, std::int32_t>
apply_mask(Projector &projector, std::uint32_t containing_strip_index,
           const std::uint32_t incoming_strip_index,
           std::uint32_t offset) noexcept {
  const std::uint32_t previous_materialized_strip_count =
      projector.materialized_strip_count;

  std::uint32_t remaining_mask_length =
      projector.strip_length_of[incoming_strip_index];
  std::uint32_t materialized_mask_length = 0;

  while (remaining_mask_length != 0) {
    const std::uint32_t containing_strip_length =
        projector.strip_length_of[containing_strip_index];

    if (offset == containing_strip_length) {
      containing_strip_index =
          projector.larger_split_strip_index_of[containing_strip_index];
      offset = 0;
      continue;
    }

    const std::uint32_t mask_length =
        std::min(remaining_mask_length, containing_strip_length - offset);

    if (offset != 0)
      containing_strip_index =
          split_strip(projector, containing_strip_index, offset);

    if (mask_length != projector.strip_length_of[containing_strip_index])
      static_cast<void>(
          split_strip(projector, containing_strip_index, mask_length));

    if (projector.strip_type_of[containing_strip_index] != 2) {
      projector.strip_type_of[containing_strip_index] = 2;
      materialized_mask_length += mask_length;
    }
    remaining_mask_length -= mask_length;

    if (remaining_mask_length != 0) {
      containing_strip_index =
          projector.larger_split_strip_index_of[containing_strip_index];
      offset = 0;
    }
  }

  projector.projection_frame_count -= materialized_mask_length;

  return {
      -static_cast<std::int32_t>(materialized_mask_length),
      static_cast<std::int32_t>(projector.materialized_strip_count -
                                previous_materialized_strip_count),
  };
}
