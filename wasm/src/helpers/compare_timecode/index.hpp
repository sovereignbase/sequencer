#include "../../types/type.hpp"
#include <cstdint>
std::int8_t compare_timecode(const Timecode *left, const Timecode *right) {

  std::uint8_t lane;

  for (lane = 0; lane < 4; lane++) {
    if (left[lane] < right[lane])
      return -1;
    if (left[lane] > right[lane])
      return 1;
  };

  return 0;
}