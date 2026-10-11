#pragma once
#include "../types/type.hpp"

namespace sequencer {
inline bool anchors_overlap(const Coordinates &a, const Coordinates &b) {
  return a.anchor_session == b.anchor_session && a.anchor_start == b.anchor_start &&
         a.anchor_diff == b.anchor_diff;
}
} // namespace sequencer
