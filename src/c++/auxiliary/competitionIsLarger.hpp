#pragma once
#include "../types/type.hpp"

namespace sequencer {
template <class Incoming, class Competitor>
inline bool competition_is_larger(const Incoming &incoming, const Competitor &competitor) {
  const auto &a = incoming.coordinates;
  const auto &b = competitor.coordinates;
  return (a.diff < 0 && b.diff > 0) ||
         ((a.diff < 0) == (b.diff < 0) &&
          (a.session < b.session || (a.session == b.session && a.start < b.start)));
}
} // namespace sequencer
