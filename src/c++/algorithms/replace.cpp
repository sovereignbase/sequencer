#include "../class.hpp"

namespace sequencer {
Gossip Projection::replace(Word count, Word content, Word start, std::int64_t end) {
  auto output = remove(start, end);
  if (count) {
    auto addition = insert(count, content, start);
    output.insert(output.end(), addition.begin(), addition.end());
  }
  return output;
}
} // namespace sequencer
