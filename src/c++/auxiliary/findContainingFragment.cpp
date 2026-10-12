/**
 * @file
 * Finds the current owner of a historical logical boundary through fragments and masks.
 */
#include "../class.hpp"
#include "magnitude.hpp"
#include <algorithm>

namespace sequencer {
std::pair<Word, Index> Projection::find_containing_fragment(Index origin, Index incoming) {
  auto anchor = origin;
  const auto c = strips.identity[incoming].coordinates;
  const auto parent = strips.identity[origin].coordinates;
  while (anchor) {
    const auto fs = strips.fragment_start[anchor];
    const auto fe = fs + magnitude(strips.fragment_diff[anchor]);
    // Positive anchors include an endpoint; a mask begins on an actual original
    // Frame and therefore excludes the target fragment's right endpoint.
    if (c.diff < 0 ? c.anchor_diff >= fs && c.anchor_diff < fe : c.anchor_diff <= fe) {
      if (c.diff < 0 && magnitude(c.diff) > fe - c.anchor_diff) {
        strips.fragmented[incoming] = true;
        strips.fragment_diff[incoming] = std::int32_t(c.anchor_diff) - std::int32_t(fe);
      }
      return {std::max(c.anchor_diff, fs), anchor};
    }
    // Competing children can separate parent fragments in Structural Order.
    // Follow only relationships belonging to this canonical parent.
    auto mask = strips.right[anchor];
    while (mask) {
      const auto m = mask;
      if (strips.identity[m].coordinates.anchor_session != parent.session ||
          strips.identity[m].coordinates.anchor_start != parent.start)
        break;
      const auto end = strips.identity[m].coordinates.anchor_diff + strips.fragment_start[m] +
                       magnitude(strips.fragment_diff[m]);
      if (!(strips.fragment_diff[m] == 0 || strips.identity[m].coordinates.diff > 0 ||
            (c.diff < 0 ? c.anchor_diff >= end : c.anchor_diff > end)))
        break;
      if (strips.identity[m].coordinates.diff > 0)
        mask = strips.competitor[m];
      else if (strips.fragment[m] &&
               (c.diff < 0 ? c.anchor_diff >= strips.identity[m].coordinates.anchor_diff +
                                                  strips.fragment_start[strips.fragment[m]]
                           : c.anchor_diff > strips.identity[m].coordinates.anchor_diff +
                                                 strips.fragment_start[strips.fragment[m]]))
        mask = strips.fragment[m];
      else
        mask = strips.competitor[m] ? strips.competitor[m] : strips.right[m];
    }
    if (mask && strips.identity[mask].coordinates.diff < 0 &&
        strips.identity[mask].coordinates.anchor_session == parent.session &&
        strips.identity[mask].coordinates.anchor_start == parent.start) {
      const auto m = mask;
      const auto end = strips.identity[m].coordinates.anchor_diff + strips.fragment_start[m] +
                       magnitude(strips.fragment_diff[m]);
      const auto point = c.anchor_diff - strips.identity[m].coordinates.anchor_diff;
      // New content may anchor inside removed history without resurrecting its Frames.
      if (c.diff > 0)
        return {point, mask};
      // Already masked Frames shorten only runtime effect, never authored coordinates.
      const auto consumed =
          std::min(magnitude(strips.fragment_diff[incoming]), end - c.anchor_diff);
      strips.fragment_start[incoming] += consumed;
      strips.offset[incoming] = strips.fragmented[incoming] = true;
      strips.fragment_diff[incoming] = c.diff + std::int32_t(strips.fragment_start[incoming]);
      if (!strips.fragment_diff[incoming])
        return {point + consumed, mask};
      const auto advanced = c.anchor_diff + consumed;
      auto right = strips.fragment[anchor];
      while (right &&
             advanced >= strips.fragment_start[right] + magnitude(strips.fragment_diff[right]))
        right = strips.fragment[right];
      if (!right) {
        strips.fragment_start[incoming] = magnitude(c.diff);
        strips.fragment_diff[incoming] = 0;
        return {point + consumed, mask};
      }
      const auto resolved = std::max(advanced, strips.fragment_start[right]);
      strips.fragment_start[incoming] = std::min(magnitude(c.diff), resolved - c.anchor_diff);
      strips.fragment_diff[incoming] = c.diff + std::int32_t(strips.fragment_start[incoming]);
      return {resolved, right};
    }
    anchor = strips.fragment[anchor];
  }
  throw std::runtime_error("Anchor point has no materialized owner");
}
} // namespace sequencer
