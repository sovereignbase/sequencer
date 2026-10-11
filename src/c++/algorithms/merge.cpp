#include "../class.hpp"

namespace sequencer {
Result Projection::merge(const Gossip& insertions, const std::vector<Acknowledgement>& frontiers) {
  auto result = apply(insertions);
  for (const auto& a : frontiers) frontier.observe(a);
  return result;
}
}
