#pragma once
#include "../../types/type.hpp"
#include "./index.hpp"
#include <cstdint>

std::uint32_t
find_strip_by_timecode_and_length(Projector *projector,
                                  const Timecode *strip_timecode,
                                  const std::uint32_t strip_length) {

  Timecode *current_timecode =
      &projector->reel[projector->gate_strip_start_position].timecode;

  std::uint32_t offset = current_strip_contains_timecode(
      current_timecode, strip_timecode, strip_length);

  // While the current strip does not contain timecode.
  while (offset == max_uint32) {
    // Move right, if strip timecode is larger than gate timecode, else left
    std::int8_t comparison_result =
        compare_timecode(current_timecode, strip_timecode);
    if (comparison_result == 1)
      run_backward(projector);
    if (comparison_result == -1)
      run_forward(projector);

    // Set timecode of the strip at the gate
    current_timecode =
        &projector->reel[projector->gate_strip_start_position].timecode;
    // Set offset
    offset = current_strip_contains_timecode(current_timecode, strip_timecode,
                                             strip_length);
  }
  return offset;
}
