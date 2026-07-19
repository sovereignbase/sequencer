#pragma once

#include "../../types/type.hpp"
#include "./index.hpp"
#include <cstdint>

std::uint32_t
find_strip_by_sequence_point(ProjectorState *projector,
                             const SequencePoint *sequence_point) noexcept {

  const SequenceReel &reel = projector->reel;

  for (std::uint32_t i = 0; i < reel.size(); ++i) {
    const std::uint32_t result =
        strip_contains_sequence_point(&reel[i], sequence_point);

    if (result != max_uint32) {
      return result;
    }
  }

  return max_uint32;
}