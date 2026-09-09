#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/stage_strip/index.hpp"

namespace sequencer {

[[nodiscard]] inline std::uint32_t
issue_strip(Projector &projector, const std::uint8_t strip_type,
            const std::uint32_t strip_length,
            const SequencePoint previous_strip_end,
            const std::uint32_t footage_frame_index = u32_max) noexcept {
  if (strip_type > 2 || strip_length == 0)
    return u32_max;
  const bool mask = strip_type == 2;
  auto &counter = mask ? projector.mask_operation_count : projector.operation_count;
  if (strip_length >= u32_max - counter)
    return u32_max;
  const SequencePoint start{mask ? mask_realm_crypto_random_bits
                                 : insert_realm_crypto_random_bits,
                            shared_realm_unix_lower_bits, counter};
  const auto strip_index = stage_strip(projector, strip_type, strip_length,
                                       start, previous_strip_end,
                                       footage_frame_index);
  counter += strip_length + 1;
  return strip_index;
}

}
