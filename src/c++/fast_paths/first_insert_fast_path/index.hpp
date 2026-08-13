#pragma once

#include "../../declarations/projector/index.hpp"
#include <cstdint>

[[nodiscard]] inline bool first_insert_fast_path(
    Projector *projector, const std::uint32_t strip_index) noexcept {
  const Strip &strip = projector->strips[strip_index];
  if (projector->structural_root_strip_index != u32_max ||
      strip.is_masked != 0 || strip.is_inverse == 0)
    return false;

  projector->structural_root_strip_index = strip_index;
  projector->head_strip_index = strip_index;
  projector->tail_strip_index = strip_index;
  projector->gate_strip_index = strip_index;
  projector->gate_projection_frame_index = 0;
  projector->projection_frame_count = projector->length[strip_index];
  return true;
}
