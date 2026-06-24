#pragma once

#include <cstdint>

#include "../../types/type.hpp"

#include "../../helpers/index.hpp"

/// implement doubly linked list walk istead of map

std::uint32_t find_strip_start_position_by_timecode(const Projector *projector,
                                                    const Timecode *timecode) {
  Timecode *right =
      projector->reel[projector->gate_strip_start_position]->timecode;

  std::int8_t comparison_result = compare_timecode(timecode, right);

  while (comparison_result != 0) {
    if (compare_timecode(timecode, timecode) == 1) {
    };

    if (compare_timecode(timecode, timecode) == -1) {
    };
  };
}
