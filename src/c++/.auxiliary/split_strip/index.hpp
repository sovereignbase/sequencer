/**
 * @file
 * @brief Splits one material Strip without copying Footage.
 */
#pragma once

#include "../../.declarations/projector/index.hpp"
#include "../../.declarations/sentinels/index.hpp"
#include <cstdint>

/**
 * @brief Divide a Strip into prefix and suffix fragments at a Frame offset.
 *
 * The existing Strip becomes the prefix. A new append-only Strip becomes the
 * suffix with advanced Sequence and Footage starts. The split chain preserves
 * the remaining fragments of the originally issued Strip.
 *
 * @param projector Owning Projector.
 * @param strip_index Strip Index of the source Strip and resulting prefix.
 * @param frame_offset Positive suffix start offset within the source Strip.
 * @return Newly appended Strip Index of the suffix.
 * @pre `0 < frame_offset < strip_length_of[strip_index]`.
 * @post Prefix and suffix cover the exact original Frame and Footage spans with
 * no overlap or gap.
 * @complexity Amortized O(1), excluding vector reallocation.
 */
[[nodiscard]] inline std::uint32_t
split_strip(Projector &projector, const std::uint32_t strip_index,
            const std::uint32_t frame_offset) noexcept {
  const std::uint32_t suffix_strip_index = projector.strip_type_of.size();
  const std::uint32_t source_length = projector.strip_length_of[strip_index];

  SequencePoint suffix_start = projector.strip_start_of[strip_index];
  suffix_start.counter_bits += frame_offset;

  SequencePoint suffix_previous_end = suffix_start;
  --suffix_previous_end.counter_bits;

  projector.strip_type_of.push_back(projector.strip_type_of[strip_index]);
  projector.strip_length_of.push_back(source_length - frame_offset);

  projector.larger_competitor_strip_index_of.push_back(
      projector.larger_competitor_strip_index_of[strip_index]);
  projector.larger_split_strip_index_of.push_back(
      projector.larger_split_strip_index_of[strip_index]);

  projector.strip_start_of.push_back(suffix_start);
  projector.previous_strip_end_of.push_back(suffix_previous_end);

  projector.right_strip_index_of.push_back(suffix_strip_index);
  projector.left_strip_index_of.push_back(suffix_strip_index);

  projector.left_jump_strip_index_of.push_back(u32_max);
  projector.left_jump_strip_count_of.push_back(0);
  projector.left_jump_length_of.push_back(0);

  projector.right_jump_strip_index_of.push_back(u32_max);
  projector.right_jump_strip_count_of.push_back(0);
  projector.right_jump_length_of.push_back(0);

  projector.footage_frame_index_of.push_back(
      projector.footage_frame_index_of[strip_index] + frame_offset);

  projector.strip_length_of[strip_index] = frame_offset;
  projector.larger_split_strip_index_of[strip_index] = suffix_strip_index;

  const std::uint32_t right_strip_index =
      projector.right_strip_index_of[strip_index];

  projector.right_strip_index_of[strip_index] = suffix_strip_index;
  projector.left_strip_index_of[suffix_strip_index] = strip_index;
  projector.right_strip_index_of[suffix_strip_index] = right_strip_index;
  projector.left_strip_index_of[right_strip_index] = suffix_strip_index;

  if (projector.tail_strip_index == strip_index)
    projector.tail_strip_index = suffix_strip_index;

  ++projector.materialized_strip_count;

  projector.containment_table.set(projector.strip_start_of[strip_index],
                                  frame_offset, strip_index);
  projector.containment_table.set(suffix_start, source_length - frame_offset,
                                  suffix_strip_index);

  return suffix_strip_index;
}
