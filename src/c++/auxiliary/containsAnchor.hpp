#pragma once
#include "../types/type.hpp"

namespace sequencer {
template <class Anchor, class Child>
inline bool contains_anchor(const Anchor &anchor, const Child &child, Word start, Word end) {
  const auto &a = anchor.coordinates;
  const auto &c = child.coordinates;
  return a.session == c.anchor_session && a.start == c.anchor_start && c.anchor_diff >= start &&
         c.anchor_diff <= end;
}
} // namespace sequencer
