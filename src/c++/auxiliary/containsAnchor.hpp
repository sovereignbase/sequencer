#pragma once
#include "../types/type.hpp"

namespace sequencer {
inline bool contains_anchor(const Coordinates &a, const Coordinates &c, Word start, Word end) {
  return a.session == c.anchor_session && a.start == c.anchor_start && c.anchor_diff >= start &&
         c.anchor_diff <= end;
}
} // namespace sequencer
