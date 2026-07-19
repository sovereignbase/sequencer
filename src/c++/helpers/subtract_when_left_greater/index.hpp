#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::uint32_t substract_when_left_greater(const SequencePoint *left,
                                          const SequencePoint *right) noexcept {

  for (std::uint32_t i = 0; i < 4; ++i) {
    const std::uint32_t left_lane = (*left)[i];
    const std::uint32_t right_lane = (*right)[i];

    if (left_lane > right_lane) {
      return (*left)[3] - (*right)[3];
    }

    if (left_lane < right_lane) {
      return max_uint32;
    }
  }

  return max_uint32;
}