#pragma once
#include "../types/type.hpp"

namespace sequencer {
template <class A, class B> inline bool anchors_overlap(const A &a, const B &b) {
  return a.coordinates.anchor_session == b.coordinates.anchor_session &&
         a.coordinates.anchor_start == b.coordinates.anchor_start &&
         a.coordinates.anchor_diff == b.coordinates.anchor_diff;
}
} // namespace sequencer
