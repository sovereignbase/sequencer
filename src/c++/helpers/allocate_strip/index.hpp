#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::uint32_t allocate_strip(Projector *projector, const std::uint32_t length,
                             const std::uint32_t masked_flag,
                             const std::uint32_t footage_position,
                             const SequencePoint this_strip_start,
                             const SequencePoint previous_strip_start) {
  const std::uint32_t strip_start_position = projector->reel.size();

  projector->reel.push_back(
      Strip{masked_flag > 0, this_strip_start, previous_strip_start,
            footage_code, max_uint32, max_uint32, previous_strip_timecode});

  projector->last_strip_start_position = strip_start_position;

  if (!projector->reel[strip_start_position].masked)
    projector->reel_length += strip_length;

  return strip_start_position;
}
