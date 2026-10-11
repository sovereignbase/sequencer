#pragma once
#include "../types/type.hpp"

namespace sequencer {
inline bool contains_anchor(const Strip& anchor, const Strip& child, Word start, Word end) {
  const auto& a = anchor.coordinates;
  const auto& c = child.coordinates;
  return a.session == c.anchor_session && a.start == c.anchor_start && c.anchor_diff >= start && c.anchor_diff <= end;
}
}
