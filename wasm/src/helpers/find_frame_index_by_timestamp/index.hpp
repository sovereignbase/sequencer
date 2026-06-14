#pragma once

#include <cstdint>

#include "../../types/type.hpp"

std::uint32_t find_frame_index_by_timestamp(const Instance *instance,
                                            const Timestamp &timestamp) {
  const auto frame_index = instance->frame_indices_by_timestamp.find(timestamp);

  if (frame_index == instance->frame_indices_by_timestamp.end())
    return invalid_frame_index;

  return frame_index->second;
}
