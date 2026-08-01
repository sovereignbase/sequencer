#pragma once

#include "../../types/sequence.hpp"
#include "../strip_contains_sequence_point/index.hpp"
#include <cstdint>
#include <utility>
#include <variant>

[[nodiscard]] inline std::variant<
    std::pair<const StripOfSequence *, std::uint32_t>, bool>
find_strip_by_sequence_point(const SequenceState *sequence,
                             const PointInSequence *sequence_point) noexcept {
  if (sequence->index.size() == 0)
    return false;

  const StripOfSequence *strip =
      &sequence->index.get(sequence->first_strip_start);
  std::uint32_t offset;

  while ((offset = strip_contains_sequence_point(strip, sequence_point)) ==
         max_uint32) {
    const PointInSequence &next = strip->next_strip_start;
    if (next.unix_lower_bits == max_uint32 &&
        next.counter_bits == max_uint32 && next.random_bits == max_uint32)
      return false;
    strip = &sequence->index.get(next);
  }

  return std::pair{strip, offset};
}
