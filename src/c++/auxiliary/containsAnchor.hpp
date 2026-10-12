#pragma once
#include "../types/type.hpp"

namespace sequencer {
/** Tests a child's canonical parent and inclusive logical boundary interval.
 * @param a Candidate parent Insertion.
 * @param c Child Insertion whose anchor is tested.
 * @param start First included original logical boundary.
 * @param end Last included boundary; endpoints are anchor points, not Frame indexes.
 * @return Whether c anchors to a inside the interval.
 */
inline bool contains_anchor(const Coordinates &a, const Coordinates &c, Word start, Word end) {
  return a.session == c.anchor_session && a.start == c.anchor_start && c.anchor_diff >= start &&
         c.anchor_diff <= end;
}
} // namespace sequencer
