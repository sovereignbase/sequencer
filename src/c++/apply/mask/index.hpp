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
 * @param containing_strip_index Stable Position containing the first Frame.
 * @param incoming_strip_index Stable Position of the Mask command.
 * @param offset First masked Frame offset in the containing Strip.
 * @return Number of previously visible Frames that became masked.
 */
[[nodiscard]] inline std::uint32_t
apply_mask(Projector *projector, std::uint32_t containing_strip_index,
           const std::uint32_t incoming_strip_index,
           std::uint32_t offset) noexcept {

  std::uint32_t remaining_mask_length =
      projector->strip_length_of[incoming_strip_index];
  std::uint32_t materialized_mask_length = 0;

  while (remaining_mask_length != 0) {
    const std::uint32_t containing_strip_length =
        projector->strip_length_of[containing_strip_index];
    const std::uint32_t mask_length =
        std::min(remaining_mask_length, containing_strip_length - offset);

    if (projector->is_masked_of[containing_strip_index] == 0) {
      if (offset != 0)
        containing_strip_index =
            split_strip(projector, containing_strip_index, offset);

      if (mask_length != projector->strip_length_of[containing_strip_index])
        static_cast<void>(
            split_strip(projector, containing_strip_index, mask_length));

      projector->is_masked_of[containing_strip_index] =
          projector->is_masked_of[incoming_strip_index];

      materialized_mask_length += mask_length;
    }

    remaining_mask_length -= mask_length;

    if (remaining_mask_length != 0) {
      containing_strip_index =
          projector->larger_split_strip_index_of[containing_strip_index];
      offset = 0;
    }
  }

  return { materialized_mask_length }
}