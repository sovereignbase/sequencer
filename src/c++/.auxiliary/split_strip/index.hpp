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
 * suffix with a structural sentinel and advanced Footage start. The split chain preserves
 * the remaining fragments of the originally issued Strip.
 *
 * @param projector Owning Projector.
 * @param strip_index Strip Index of the source Strip and resulting prefix.
 * @param frame_offset Number of content Frames retained in the prefix.
 * @return Newly appended Strip Index of the suffix.
 * @pre The source is not a Mask and `frame_offset < fragment_length_of[strip_index]`.
 * @post Prefix and suffix cover the original Footage without copying it.
 * Original SequencePoints and the issued containment span remain unchanged.
 * A zero-length prefix retains its split link to the content continuation.
 * @complexity Amortized O(1), excluding vector reallocation.
 */
[[nodiscard]] inline std::uint32_t
split_strip(Projector &projector, const std::uint32_t strip_index,
            const std::uint32_t frame_offset) noexcept {
  const std::uint32_t suffix_strip_index = projector.append_strip();
  const std::uint32_t source_length = projector.fragment_length_of[strip_index];

  const SequencePoint suffix_start{u32_max, u32_max, u32_max};
  SequencePoint suffix_previous_end = projector.fragment_start(strip_index);
  suffix_previous_end.counter_bits += frame_offset;

  projector.strip_type_of[suffix_strip_index] = projector.strip_type_of[strip_index];
  projector.fragment_length_of[suffix_strip_index] = source_length - frame_offset;
  projector.initial_length_of[suffix_strip_index] = 0;
  projector.dependency_prefix_of[suffix_strip_index] =
      projector.fragment_offset(strip_index) + frame_offset;

  projector.smaller_competitor_strip_index_of[suffix_strip_index] = u32_max;
  projector.larger_split_strip_index_of[suffix_strip_index] =
      projector.larger_split_strip_index_of[strip_index];

  projector.strip_start_of[suffix_strip_index] = suffix_start;
  projector.previous_strip_end_of[suffix_strip_index] = suffix_previous_end;

  projector.right_strip_index_of[suffix_strip_index] = suffix_strip_index;
  projector.left_strip_index_of[suffix_strip_index] = suffix_strip_index;

  projector.left_jump_strip_index_of[suffix_strip_index] = u32_max;
  projector.left_jump_strip_count_of[suffix_strip_index] = 0;
  projector.left_jump_length_of[suffix_strip_index] = 0;

  projector.right_jump_strip_index_of[suffix_strip_index] = u32_max;
  projector.right_jump_strip_count_of[suffix_strip_index] = 0;
  projector.right_jump_length_of[suffix_strip_index] = 0;

  projector.footage_frame_index_of[suffix_strip_index] =
      projector.footage_frame_index_of[strip_index] == u32_max
          ? u32_max
          : projector.footage_frame_index_of[strip_index] + frame_offset;

  projector.fragment_length_of[strip_index] = frame_offset;
  projector.larger_split_strip_index_of[strip_index] = suffix_strip_index;

  const std::uint32_t right_strip_index =
      projector.right_strip_index_of[strip_index];

  projector.right_strip_index_of[strip_index] = suffix_strip_index;
  projector.left_strip_index_of[suffix_strip_index] = strip_index;
  projector.right_strip_index_of[suffix_strip_index] = right_strip_index;
  if (right_strip_index != u32_max)
    projector.left_strip_index_of[right_strip_index] = suffix_strip_index;

  if (projector.tail_strip_index == strip_index)
    projector.tail_strip_index = suffix_strip_index;

  ++projector.materialized_strip_count;

  return suffix_strip_index;
}
