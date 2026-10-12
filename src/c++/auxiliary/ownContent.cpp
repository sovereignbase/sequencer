#include "../class.hpp"

namespace sequencer {
void Projection::own_content(Index fragment) {
  const auto original = strips.identity[fragment];
  if (!original.content || original.content_owned)
    return;
  const auto root = containment.get(original.coordinates.session, original.coordinates.start);
  copied.push_back({original.content, original.content_start, Word(original.coordinates.diff)});
  for (auto i = root; i; i = strips.fragment[i]) {
    strips.identity[i].content_start = 0;
    strips.identity[i].content_owned = true;
  }
}
} // namespace sequencer
