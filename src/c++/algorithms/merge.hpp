#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/stage_strip/index.hpp"
#include "../apply/insert/index.hpp"
#include "../find/projection_frame_index/index.hpp"
#include <algorithm>

namespace sequencer {

/** @brief Consume remote Strips and return the earliest changed visible index. */
inline std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 std::uint32_t footage_frame_index) noexcept {
  const auto projection = projection_buffer.read_buffer();
  Projector &projector = *projectors[projection_id];
  std::uint32_t first_change = u32_max;
  std::vector<std::uint32_t> ready;

  for (const auto &strip : projection) {
    if (strip[0] >= 3)
      break;
    const SequencePoint start{strip[2], strip[3], strip[4]};
    const SequencePoint previous{strip[5], strip[6], strip[7]};
    const auto footage = strip[0] == 2 ? u32_max : footage_frame_index;
    if (strip[0] != 2)
      footage_frame_index += strip[1];
    if (projector.containment_table.get(start).first != u32_max)
      continue;

    const auto incoming = stage_strip(projector, static_cast<std::uint8_t>(strip[0]),
                                      strip[1], start, previous, footage);
    if (start.unix_lower_bits == shared_realm_unix_lower_bits) {
      if (start.crypto_random_bits == insert_realm_crypto_random_bits)
        projector.operation_count = std::max(projector.operation_count,
                                              start.counter_bits + strip[1] + 1);
      if (start.crypto_random_bits == mask_realm_crypto_random_bits)
        projector.mask_operation_count = std::max(projector.mask_operation_count,
                                                   start.counter_bits + strip[1] + 1);
    }
    ready.push_back(incoming);
    while (!ready.empty()) {
      const auto candidate = ready.back();
      ready.pop_back();
      const auto dependency = projector.previous_strip_end_of[candidate];
      const auto type = projector.strip_type_of[candidate];
      const auto length = projector.strip_length_of[candidate];
      const bool birth = type != 2 && dependency == SequencePoint{0, 0, 0};
      auto [containing, offset] = projector.containment_table.get(dependency);
      if (birth) {
        containing = u32_max;
        offset = 0;
      } else if (containing == u32_max ||
                 projector.left_strip_index_of[containing] == containing) {
        projector.pending_table.set(dependency, candidate);
        continue;
      }

      const auto [frame_diff, strip_diff] =
          apply_insert(projector, containing, candidate, offset);
      if (projector.left_strip_index_of[candidate] == candidate) {
        projector.pending_table.set(dependency, candidate);
        continue;
      }
      const auto position = find_projection_frame_index_of(
          projector, candidate, frame_diff, strip_diff);
      projector.gate_strip_index = candidate;
      projector.projection_frame_index = position;
      if (frame_diff != 0)
        first_change = std::min(first_change, position);
      auto waiters = projector.pending_table.take(
          projector.strip_start_of[candidate], length);
      ready.insert(ready.end(), waiters.begin(), waiters.end());
    }
  }
  return first_change;
}

}
