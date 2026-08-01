#pragma once

#include "../../types/sequence.hpp"

[[nodiscard]] inline const StripOfSequence &find_strip_by_sequence_point(
    const SequenceState *sequence,
    const PointInSequence *sequence_point) noexcept {
  return sequence->index.get(*sequence_point);
}
