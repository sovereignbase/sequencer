/**
 * @file
 * Defers JavaScript copy-on-write and rebases every fragment sharing a binding.
 */
#include "../class.hpp"

namespace sequencer {
void Projection::own_content(Index fragment, bool discard) {
  const auto original = strips.identity[fragment];
  if (!original.content || (!discard && original.content_owned))
    return;
  const auto root = containment.get(original.coordinates.session, original.coordinates.start);
  const auto target = discard ? 0 : original.shared_content ? next_content++ : original.content;
  // Copy the full original extent once, not each visible fragment independently.
  // JavaScript performs the slice before clearing any requested mask slots.
  if (!discard)
    copied.push_back(
        {target, original.content, original.content_start, Word(original.coordinates.diff)});
  if (original.shared_content ? !--shared_content_count : discard)
    released.push_back({original.content, 0, 0});
  for (auto i = root; i; i = strips.fragment[i]) {
    strips.identity[i].content = target;
    strips.identity[i].shared_content = false;
    strips.identity[i].content_start = 0;
    strips.identity[i].content_owned = !discard;
    strips.identity[i].footage_state = discard ? FootageState::Caller : FootageState::Private;
  }
}
} // namespace sequencer
