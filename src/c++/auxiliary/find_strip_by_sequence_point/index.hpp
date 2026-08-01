#pragma once

#include "../../types/sequence.hpp"
#include "../strip_contains_sequence_point/index.hpp"
#include <cstdint>
#include <utility>

[[nodiscard]] inline std::pair<const StripOfSequence *, std::uint32_t>
find_strip_by_sequence_point(const SequenceState *sequence,
                             const PointInSequence *sequence_point) noexcept {
  const StripOfSequence *strip =
      &sequence->index.get(sequence->first_strip_start);
  std::uint32_t offset;

  while ((offset = strip_contains_sequence_point(strip, sequence_point)) ==
         max_uint32)
    strip = &sequence->index.get(strip->next_strip_start);

  return {strip, offset};
}
