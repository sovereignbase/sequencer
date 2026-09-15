#pragma once

#include "./runtime.hpp"
#include "../.auxiliary/stage_strip/index.hpp"

namespace sequencer {

[[nodiscard]] inline std::uint32_t
issue_strip(Projector &projector, const std::uint8_t type,
            const std::uint32_t length, const Clock anchor,
            const std::uint32_t offset, const std::uint32_t footage = u32_max) noexcept {
  if ((type != 1 && type != 2) || length == 0)
    return u32_max;
  auto &time = type == 2 ? projector.mask_time : projector.insert_time;
  if (length >= u32_max - time)
    return u32_max;
  const auto prefix = time;
  time += length + 1;
  const Clock inserted{type == 2 ? projector.mask_session : projector.actor_id,
                       time};
  return stage_strip(projector, type, length, anchor, inserted, offset, footage,
                     prefix);
}

} // namespace sequencer
