#pragma once

#include "./runtime.hpp"

namespace sequencer {

inline void
snapshot_projection(const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];
  // Prepare pojection buffer
  const auto count = projector.strip_count;

  std::vector<std::uint32_t> projection_indices(count);
  std::uint32_t projection_strip_index = 0;

  // Encode ordered strip indices
  for (std::uint32_t strip_index = projector.head_strip_index;
       strip_index != u32_max;
       strip_index = projector.right_strip_index_of[strip_index])
    projection_indices[strip_index] = projection_strip_index++;

  projection_buffer.resize(projection_strip_index);
  projection_strip_index = 0;
  std::uint32_t projection_frame_index = 0;
  for (std::uint32_t strip_index = projector.head_strip_index;
       strip_index != u32_max;
       strip_index = projector.right_strip_index_of[strip_index]) {
    const auto &strip_start = projector.strip_start_of[strip_index];
    const auto &previous_strip_end =
        projector.previous_strip_end_of[strip_index];
    const auto larger_split_strip =
        projector.larger_split_strip_index_of[strip_index];
    const auto smaller_competitor_strip =
        projector.smaller_competitor_strip_index_of[strip_index];
    projection_buffer.write_projection(
        projection_strip_index++,
        {
            projector.strip_type_of[strip_index],
            projector.initial_length_of[strip_index],
            strip_start.crypto_random_bits,
            strip_start.unix_lower_bits,
            strip_start.counter_bits,
            previous_strip_end.crypto_random_bits,
            previous_strip_end.unix_lower_bits,
            previous_strip_end.counter_bits,
            larger_split_strip == u32_max
                ? u32_max
                : projection_indices[larger_split_strip],
            smaller_competitor_strip == u32_max
                ? u32_max
                : projection_indices[smaller_competitor_strip],
            projector.fragment_length_of[strip_index],
            projector.dependency_prefix_of[strip_index],
        });
    const auto frame_count = projector.fragment_length_of[strip_index];
    const bool masked = projector.strip_type_of[strip_index] >= 2;
    if (frame_count != 0)
      projector.for_each_footage_span(strip_index, [&](const auto footage, const auto length) {
        footage_span_buffer.write_span(projection_frame_index, footage, length, masked);
      });
    if (!masked)
      projection_frame_index += frame_count;
  }

}

}
