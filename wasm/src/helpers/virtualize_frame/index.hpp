#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::uint32_t
virtualize_frame(Instance *instance, const std::uint32_t items_index,
                 const std::uint32_t deleted_flag,
                 const std::uint32_t frame_length,
                 const std::uint32_t frame_timestamp_first_32bits,
                 const std::uint32_t frame_timestamp_second_32bits,
                 const std::uint32_t frame_timestamp_third_32bits,
                 const std::uint32_t frame_timestamp_fourth_32bits,
                 const std::uint32_t previous_timestamp_first_32bits,
                 const std::uint32_t previous_timestamp_second_32bits,
                 const std::uint32_t previous_timestamp_third_32bits,
                 const std::uint32_t previous_timestamp_fourth_32bits) {
  const std::uint32_t index = instance->frames.size();

  const Timestamp frame_timestamp = {
      {frame_timestamp_first_32bits, frame_timestamp_second_32bits,
       frame_timestamp_third_32bits, frame_timestamp_fourth_32bits}};

  const Timestamp previous_timestamp = {
      {previous_timestamp_first_32bits, previous_timestamp_second_32bits,
       previous_timestamp_third_32bits, previous_timestamp_fourth_32bits}};

  instance->frames.push_back(Frame{
      deleted_flag > 0, frame_timestamp, previous_timestamp,
      invalid_frame_index, invalid_frame_index, frame_length, items_index});

  instance->last_frame_by_index = index;
  instance->frame_indices_by_timestamp.insert({frame_timestamp, index});

  if (!instance->frames[index].deleted)
    instance->size += frame_length;

  return index;
}
