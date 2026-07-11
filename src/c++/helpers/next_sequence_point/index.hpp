#pragma once

#include "../../types/type.hpp"
#include "uuidv7.h"
#include <bit>
#include <chrono>
#include <cstdint>
#include <cstdlib>
#include <sys/random.h>

alignas(16) inline SequencePoint sequence_point_buffer = [] {
  SequencePoint initial{};
  std::uint8_t random_bytes[10];

  if (getentropy(random_bytes, sizeof random_bytes) != 0) {
    std::abort();
  }

  const auto unix_time_ms =
      std::chrono::duration_cast<std::chrono::milliseconds>(
          std::chrono::system_clock::now().time_since_epoch())
          .count();

  uuidv7_generate(reinterpret_cast<std::uint8_t *>(initial.lanes),
                  static_cast<std::uint64_t>(unix_time_ms), random_bytes,
                  nullptr);

  if constexpr (std::endian::native == std::endian::little) {
    initial.lanes[0] = std::byteswap(initial.lanes[0]);
    initial.lanes[1] = std::byteswap(initial.lanes[1]);
    initial.lanes[2] = std::byteswap(initial.lanes[2]);
    initial.lanes[3] = std::byteswap(initial.lanes[3]);
  }

  return initial;
}();

inline SequencePoint next_sequence_point() noexcept {
  if (++sequence_point_buffer.lanes[3] == 0 &&
      ++sequence_point_buffer.lanes[2] == 0 &&
      ++sequence_point_buffer.lanes[1] == 0) {
    ++sequence_point_buffer.lanes[0];
  }

  return sequence_point_buffer;
}
