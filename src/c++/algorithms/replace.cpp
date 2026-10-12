#include "../class.hpp"

namespace sequencer {
Gossip Projection::replace(Word count, Word content, Word start, std::int64_t end) {
  auto output = remove(start, end);
  if (count) {
    output.push_back(Entry::insert(insert(count, content, start)));
  }
  return output;
}
} // namespace sequencer
