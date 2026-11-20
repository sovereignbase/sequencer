/**
 * @file
 * Preserves removal-before-insertion semantics in one locally authored Gossip batch.
 */
#include "../class.hpp"

namespace sequencer {
Gossip Projection::replace(Word count, Word content, Word start, std::int64_t end, bool text) {
  auto output = remove(start, end);
  // Anchor replacement content against the Projection already produced by removal.
  if (count) {
    if (tuple && count > 1) {
      auto additions = insert_batch(count, content, start, text);
      output.insert(output.end(), std::make_move_iterator(additions.begin()),
                    std::make_move_iterator(additions.end()));
    } else
      output.push_back(Entry::insert(insert(count, content, start, text)));
  }
  return output;
}
} // namespace sequencer
