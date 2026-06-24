#pragma once

#include <cstdint>

#include "../../types/type.hpp"

#include "./index.hpp"

/// implement doubly linked list walk istead of map

std::uint32_t
find_strip_start_position_by_timecode(const Projector *projector,
                                      const Timecode *timecode,
                                      const std::uint32_t length) {
  const Strip *next_to_measure =
      &projector->reel[projector->gate_strip_start_position];

  next_to_measure->length
}
