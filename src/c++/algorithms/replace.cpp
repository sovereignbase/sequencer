/**
 * @file
 * Preserves removal-before-insertion semantics in one locally authored Gossip batch.
 */
#include "../class.hpp"

namespace sequencer {
Gossip Projection::replace(Word count, Word content, Word start, std::int64_t end) {
  auto output = remove(start, end);
  // Anchor replacement content against the Projection already produced by removal.
  if (count) {
    output.push_back(Entry::insert(insert(count, content, start)));
  }
  return output;
}
} // namespace sequencer
