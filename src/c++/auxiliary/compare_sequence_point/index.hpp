#pragma once
#include "../../types/type.hpp"
#include <cstdint>

std::int8_t compare_sequence_point(const SequencePoint *left,
                                   const SequencePoint *right) {

  if (left < right)
    return -1;

  if (left > right)
    return 1;

  return 0;
}
