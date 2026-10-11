#include "../class.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
std::pair<Word, Index> Projection::find_containing_fragment(Index origin, Index incoming) {
  auto anchor = origin;
  const auto c = strips[incoming].coordinates;
  const auto parent = strips[origin].coordinates;
  while (anchor) {
    const auto fs = strips[anchor].fragment_start;
    const auto fe = fs + magnitude(strips[anchor].effect());
    if (c.diff < 0 ? c.anchor_diff >= fs && c.anchor_diff < fe : c.anchor_diff <= fe) {
      if (c.diff < 0 && magnitude(c.diff) > fe - c.anchor_diff) {
        strips[incoming].fragmented = true;
        strips[incoming].fragment_diff = std::int32_t(c.anchor_diff) - std::int32_t(fe);
      }
      return {std::max(c.anchor_diff, fs), anchor};
    }
    auto mask = strips[anchor].right;
    while (mask) {
      const auto &m = strips[mask];
      if (m.coordinates.anchor_session != parent.session ||
          m.coordinates.anchor_start != parent.start)
        break;
      const auto end = m.coordinates.anchor_diff + m.fragment_start + magnitude(m.fragment_diff);
      if (!(m.effect() == 0 || m.coordinates.diff > 0 ||
            (c.diff < 0 ? c.anchor_diff >= end : c.anchor_diff > end)))
        break;
      if (m.coordinates.diff > 0)
        mask = m.competitor;
      else if (m.fragment && (c.diff < 0 ? c.anchor_diff >= m.coordinates.anchor_diff +
                                                                strips[m.fragment].fragment_start
                                         : c.anchor_diff > m.coordinates.anchor_diff +
                                                               strips[m.fragment].fragment_start))
        mask = m.fragment;
      else
        mask = m.competitor ? m.competitor : m.right;
    }
    if (mask && strips[mask].coordinates.diff < 0 &&
        strips[mask].coordinates.anchor_session == parent.session &&
        strips[mask].coordinates.anchor_start == parent.start) {
      const auto &m = strips[mask];
      const auto end = m.coordinates.anchor_diff + m.fragment_start + magnitude(m.fragment_diff);
      const auto point = c.anchor_diff - m.coordinates.anchor_diff;
      if (c.diff > 0)
        return {point, mask};
      const auto consumed = std::min(magnitude(strips[incoming].effect()), end - c.anchor_diff);
      strips[incoming].fragment_start += consumed;
      strips[incoming].offset = strips[incoming].fragmented = true;
      strips[incoming].fragment_diff = c.diff + std::int32_t(strips[incoming].fragment_start);
      if (!strips[incoming].fragment_diff)
        return {point + consumed, mask};
      const auto advanced = c.anchor_diff + consumed;
      auto right = strips[anchor].fragment;
      while (right && advanced >= strips[right].fragment_start + magnitude(strips[right].effect()))
        right = strips[right].fragment;
      if (!right) {
        strips[incoming].fragment_start = magnitude(c.diff);
        strips[incoming].fragment_diff = 0;
        return {point + consumed, mask};
      }
      const auto resolved = std::max(advanced, strips[right].fragment_start);
      strips[incoming].fragment_start = std::min(magnitude(c.diff), resolved - c.anchor_diff);
      strips[incoming].fragment_diff = c.diff + std::int32_t(strips[incoming].fragment_start);
      return {resolved, right};
    }
    anchor = strips[anchor].fragment;
  }
  throw std::runtime_error("Anchor point has no materialized owner");
}
} // namespace sequencer
