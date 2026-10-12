#pragma once
#include "../types/type.hpp"

namespace sequencer {
/** Tests whether an existing sibling belongs closer to the anchor than incoming a.
 * @param a Incoming same-anchor competitor.
 * @param b Existing competitor: positives precede masks, then larger Session/start wins.
 * @return Whether b precedes a; duplicate identity is handled before ordering.
 */
inline bool competition_is_larger(const Coordinates &a, const Coordinates &b) {
  return (a.diff < 0 && b.diff > 0) ||
         ((a.diff < 0) == (b.diff < 0) &&
          (a.session < b.session || (a.session == b.session && a.start < b.start)));
}
} // namespace sequencer
