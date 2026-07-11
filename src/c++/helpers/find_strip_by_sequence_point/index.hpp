#pragma once
#include "../../types/type.hpp"
#include "./index.hpp"
#include <cstdint>

std::uint32_t find_strip_by_sequence_point(ProjectorState *projector,
                                           const SequencePoint *strip_start,
                                           const std::uint32_t strip_length) {

  SequencePoint *this_strip_start =
      &projector->reel[projector->gate_strip_start_position].this_strip_start;

  std::uint32_t offset = current_strip_contains_sequence_point(
      this_strip_start, strip_start, strip_length);

  // While the current strip does not contain timecode.
  while (offset == max_uint32) {
    // Move right, if strip timecode is larger than gate timecode, else left
    std::int8_t comparison_result =
        compare_sequence_point(this_strip_start, strip_start);
    if (comparison_result == 1)
      run_backward(projector);
    if (comparison_result == -1)
      run_forward(projector);

    // Set timecode of the strip at the gate
    this_strip_start =
        &projector->reel[projector->gate_strip_start_position].this_strip_start;
    // Set offset
    offset = current_strip_contains_sequence_point(
        this_strip_start, strip_start, strip_length);
  }
  return offset;
}
