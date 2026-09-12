#pragma once

#include "../.declarations/projector/index.hpp"
#include <algorithm>
#include <array>
#include <cmath>
#include <cstdint>
#include <span>

/**
 * @brief Reconstruct a fresh Projector from a trusted, ordered snapshot.
 * @pre The Projector is empty and the snapshot has a materialized prefix
 * followed by its pending suffix. Counter spans and encoded links are valid.
 */
inline void initialize_projector(
    Projector &projector,
    const std::span<const std::array<std::uint32_t, 12>> projection,
    const std::uint32_t insert_realm_crypto_random_bits,
    const std::uint32_t mask_realm_crypto_random_bits,
    const std::uint32_t shared_realm_unix_lower_bits) noexcept {
  if (!projection.empty()) {
    const auto strip_count = static_cast<std::uint32_t>(projection.size());
    const auto first_pending_strip =
        std::find_if(projection.begin(), projection.end(),
                     [](const auto &strip) noexcept {
                       return strip[0] >= 3 && strip[0] <= 5;
                     });
    const auto materialized_strip_count =
        static_cast<std::uint32_t>(first_pending_strip - projection.begin());
    projector.strip_type_of.resize(strip_count);
    projector.initial_length_of.resize(strip_count);
    projector.fragment_length_of.resize(strip_count);
    projector.dependency_prefix_of.resize(strip_count);
    projector.strip_start_of.resize(strip_count);
    projector.previous_strip_end_of.resize(strip_count);
    projector.larger_split_strip_index_of.resize(strip_count);
    projector.smaller_competitor_strip_index_of.resize(strip_count);
    projector.left_strip_index_of.resize(strip_count);
    projector.right_strip_index_of.resize(strip_count);
    projector.footage_frame_index_of.resize(strip_count);
    projector.left_jump_strip_index_of.assign(strip_count, u32_max);
    projector.right_jump_strip_index_of.assign(strip_count, u32_max);
    projector.left_jump_strip_count_of.resize(strip_count);
    projector.right_jump_strip_count_of.resize(strip_count);
    projector.left_jump_length_of.resize(strip_count);
    projector.right_jump_length_of.resize(strip_count);
    projector.materialized_strip_count = materialized_strip_count;

    const std::uint32_t optimal_jump_distance = static_cast<std::uint32_t>(
        std::sqrt(projector.materialized_strip_count) + 0.5);

    std::uint32_t footage_frame_index = 0;
    std::uint32_t previous_jump_strip_index = 0;
    std::uint32_t previous_jump_projection_index = 0;
    std::uint32_t strip_index = 0;
    for (const auto &strip : projection) {
      const bool pending = strip_index >= materialized_strip_count;
      const auto strip_type =
          static_cast<std::uint8_t>(pending ? strip[0] - 3 : strip[0]);
      const SequencePoint strip_start{strip[2], strip[3], strip[4]};
      projector.strip_type_of[strip_index] = strip_type;
      projector.initial_length_of[strip_index] = strip[1];
      projector.fragment_length_of[strip_index] = strip[10];
      projector.dependency_prefix_of[strip_index] = strip[11];
      projector.strip_start_of[strip_index] = strip_start;
      projector.previous_strip_end_of[strip_index] = {strip[5], strip[6], strip[7]};
      projector.larger_split_strip_index_of[strip_index] = strip[8];
      projector.smaller_competitor_strip_index_of[strip_index] = strip[9];
      projector.left_strip_index_of[strip_index] =
          pending ? strip_index
                  : (strip_index == 0 ? u32_max : strip_index - 1);
      projector.right_strip_index_of[strip_index] =
          pending ? strip_index
                  : (strip_index + 1 == materialized_strip_count
                         ? u32_max
                         : strip_index + 1);
      projector.footage_frame_index_of[strip_index] =
          strip_type == 2 || (strip_type & 16) != 0 ? u32_max : footage_frame_index;
      if (!pending && strip_index != 0 &&
          (strip_index - previous_jump_strip_index >= optimal_jump_distance ||
           strip_index + 1 == materialized_strip_count)) {
        const auto jump_length = projector.projection_frame_count -
                                 previous_jump_projection_index;
        const auto jump_strip_count = strip_index - previous_jump_strip_index;
        projector.right_jump_strip_index_of[previous_jump_strip_index] =
            strip_index;
        projector.right_jump_length_of[previous_jump_strip_index] = jump_length;
        projector.right_jump_strip_count_of[previous_jump_strip_index] =
            jump_strip_count;
        projector.left_jump_strip_index_of[strip_index] =
            previous_jump_strip_index;
        projector.left_jump_length_of[strip_index] = jump_length;
        projector.left_jump_strip_count_of[strip_index] = jump_strip_count;
        previous_jump_strip_index = strip_index;
        previous_jump_projection_index = projector.projection_frame_count;
      }
      if (!pending && strip_type < 2 && strip[10] != 0 &&
          projector.gate_strip_index == u32_max)
        projector.gate_strip_index = strip_index;
      if (strip_type != 2 && (strip_type & 16) == 0)
        footage_frame_index += strip[10];
      if (!pending && strip_type < 2)
        projector.projection_frame_count += strip[10];
      if (pending)
        projector.pending_table.set(projector.dependency_origin(strip_index),
                                    strip_index, true);
      if (!projector.is_fragment(strip_index))
        projector.containment_table.set(strip_start, strip[1], strip_index, true);
      if (strip_start.crypto_random_bits == insert_realm_crypto_random_bits &&
          strip_start.unix_lower_bits == shared_realm_unix_lower_bits)
        projector.operation_count =
            std::max(projector.operation_count,
                     strip_start.counter_bits + strip[1] + 1);
      if (strip_start.crypto_random_bits == mask_realm_crypto_random_bits &&
          strip_start.unix_lower_bits == shared_realm_unix_lower_bits)
        projector.mask_operation_count =
            std::max(projector.mask_operation_count,
                     strip_start.counter_bits + strip[1] + 1);
      ++strip_index;
    }

    projector.containment_table.sort_realms();
    projector.pending_table.sort_realms();
    projector.head_strip_index = materialized_strip_count == 0 ? u32_max : 0;
    projector.tail_strip_index =
        materialized_strip_count == 0 ? u32_max : materialized_strip_count - 1;
  }
}
