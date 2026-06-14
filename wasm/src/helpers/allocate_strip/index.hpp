#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::uint32_t
allocate_strip(Projector *projector, const std::uint32_t footage_code,
               const std::uint32_t masked_flag,
               const std::uint32_t strip_length,
               const std::uint32_t strip_timecode_first_32bits,
               const std::uint32_t strip_timecode_second_32bits,
               const std::uint32_t strip_timecode_third_32bits,
               const std::uint32_t strip_timecode_fourth_32bits,
               const std::uint32_t previous_strip_timecode_first_32bits,
               const std::uint32_t previous_strip_timecode_second_32bits,
               const std::uint32_t previous_strip_timecode_third_32bits,
               const std::uint32_t previous_strip_timecode_fourth_32bits) {
  const std::uint32_t strip_start_position = projector->reel.size();

  const Timecode strip_timecode = {
      {strip_timecode_first_32bits, strip_timecode_second_32bits,
       strip_timecode_third_32bits, strip_timecode_fourth_32bits}};

  const Timecode previous_strip_timecode = {
      {previous_strip_timecode_first_32bits,
       previous_strip_timecode_second_32bits,
       previous_strip_timecode_third_32bits,
       previous_strip_timecode_fourth_32bits}};

  projector->reel.push_back(Strip{
      masked_flag > 0, strip_length, strip_timecode, footage_code,
      invalid_strip_indicator, invalid_strip_indicator,
      previous_strip_timecode});

  projector->last_strip_start_position = strip_start_position;

  if (!projector->reel[strip_start_position].masked)
    projector->reel_length += strip_length;

  return strip_start_position;
}
