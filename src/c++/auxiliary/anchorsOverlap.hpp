#pragma once
#include "../types/type.hpp"

namespace sequencer {
/** Tests sibling competition by exact canonical anchor, not intersecting Frame ranges.
 * @param a First Insertion.
 * @param b Second Insertion.
 * @return Whether both anchor triples are identical.
 */
inline bool anchors_overlap(const Coordinates &a, const Coordinates &b) {
  return a.anchor_session == b.anchor_session && a.anchor_start == b.anchor_start &&
         a.anchor_diff == b.anchor_diff;
}
} // namespace sequencer
