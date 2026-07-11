#pragma once
#include "../../types/type.hpp"
#include "../index.hpp"
#include <cstdint>

void clip_strip_at_offset(ProjectorState *projector,
                          const std::uint32_t strip_to_add_position,
                          const std::uint32_t strip_to_clip_position,
                          std::uint32_t offset) {
  const std::uint32_t next_strip_start_position =
      projector->reel[strip_to_clip_position].next_strip_start_position;

  if (offset > 0) {
    const std::uint32_t clipped_strip_start_position = projector->reel.size();
    SequenceStrip clipped_strip = projector->reel[strip_to_clip_position];

    clipped_strip.length =
        projector->reel[strip_to_clip_position].length - offset;
    clipped_strip.this_strip_start.add(offset);
    clipped_strip.footage_position += offset;
    clipped_strip.previous_strip_start_position = strip_to_add_position;

    projector->reel[strip_to_clip_position].length = offset;
    projector->reel[strip_to_clip_position].next_strip_start_position =
        strip_to_add_position;

    projector->reel[strip_to_add_position].previous_strip_start_position =
        strip_to_clip_position;
    projector->reel[strip_to_add_position].next_strip_start_position =
        clipped_strip_start_position;

    projector->reel.push_back(clipped_strip);

    if (next_strip_start_position != max_uint32) {
      projector->reel[next_strip_start_position].previous_strip_start_position =
          clipped_strip_start_position;
    } else {
      projector->last_strip_start_position = clipped_strip_start_position;
    }

  } else {
    projector->reel[strip_to_clip_position].next_strip_start_position =
        strip_to_add_position;

    projector->reel[strip_to_add_position].previous_strip_start_position =
        strip_to_clip_position;
    projector->reel[strip_to_add_position].next_strip_start_position =
        next_strip_start_position;

    if (next_strip_start_position != max_uint32) {
      projector->reel[next_strip_start_position].previous_strip_start_position =
          strip_to_add_position;
    } else {
      projector->last_strip_start_position = strip_to_add_position;
    }
  }
}
