#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::uint32_t
current_strip_contains_sequence_point(const SequencePoint *current,
                                      const SequencePoint *evaluated,
                                      const std::uint32_t evaluated_lenght) {

  std::uint32_t offset = 0;

  for (std::uint32_t i = 0; i < 4; ++i) {
    const std::uint32_t evaluated_lane = (*evaluated)[i];
    const std::uint32_t current_lane = (*current)[i];

    if (evaluated_lane < current_lane) {
      return max_uint32;
    }

    if (evaluated_lane > current_lane) {
      offset = evaluated_lane - current_lane;

      if (offset >= evaluated_lenght) {
        return max_uint32;
      }
    }
  }

  return offset;
}