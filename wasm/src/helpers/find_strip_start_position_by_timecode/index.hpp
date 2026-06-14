#pragma once

#include <cstdint>

#include "../../types/type.hpp"

std::uint32_t find_strip_start_position_by_timecode(const Projector *projector,
                                                    const Timecode &timecode) {
  const auto strip_start_position =
      projector->loose_strip_start_positions_by_previous_timecode.find(
          timecode);

  if (strip_start_position ==
      projector->loose_strip_start_positions_by_previous_timecode.end())
    return invalid_strip_indicator;

  return strip_start_position->second;
}
