#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::uint32_t timecode_is_within_strip(const Timecode *evaluated,
                                       const Timecode *against,
                                       const std::uint32_t length) {
  std::uint32_t offset = 0;

  for (std::uint32_t i = 0; i < 4; ++i) {
    const std::uint32_t evaluated_lane = (*evaluated)[i];
    const std::uint32_t against_lane = (*against)[i];

    if (evaluated_lane < against_lane) {
      return invalid_strip_indicator;
    }

    if (evaluated_lane > against_lane) {
      offset = evaluated_lane - against_lane;

      if (offset >= length) {
        return invalid_strip_indicator;
      }
    }
  }

  return offset;
}