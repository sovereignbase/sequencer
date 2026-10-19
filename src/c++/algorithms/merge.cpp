/**
 * @file
 * Merges canonical snapshot history and reports its final visible changes.
 */
#include "../class.hpp"
#include <algorithm>
#include <unordered_set>

namespace sequencer {
namespace {
/** Visible original Frames, before their Footage offsets are translated. */
struct VisibleRange {
  Word start, count, position;
};
} // namespace

Result Projection::merge(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers,
                         const std::vector<ContentRanges> &ranges) {
  if (ranges.empty()) {
    auto result = apply(insertions);
    for (const auto &a : frontiers)
      frontier.observe(a);
    return result;
  }

  // Compacted Footage has no slots for acknowledged deletions. Integrate the
  // canonical operations first; intermediate positive effects are not consumer changes.
  std::unordered_map<std::uint64_t, std::vector<VisibleRange>> before;
  Word old_length = 0;
  for (auto i = structural_head; i; i = strips.right[i]) {
    if (strips.fragment_diff[i] <= 0)
      continue;
    const auto c = strips.identity[i].coordinates;
    const auto count = Word(strips.fragment_diff[i]);
    before[identity(c.session, c.start)].push_back({strips.fragment_start[i], count, old_length});
    old_length += count;
  }
  auto input = insertions;
  std::unordered_map<std::uint64_t, ContentRanges> source;
  for (const auto &layout : ranges)
    source.emplace(identity(layout.session, layout.start), layout);
  std::unordered_set<Word> affected;
  std::vector<std::uint64_t> incoming_roots;
  for (auto &entry : input) {
    auto &insertion = entry.insertion;
    const auto c = insertion.coordinates;
    if (c.diff <= 0)
      continue;
    const auto key = identity(c.session, c.start);
    const auto root = containment.get(c.session, c.start);
    if (!root) {
      insertion.content_owned = true;
      affected.insert(insertion.content);
      incoming_roots.push_back(key);
      const auto layout = source.find(key);
      if (layout != source.end())
        content_ranges[key] = layout->second.frames;
    } else if (c.diff > strips.identity[root].coordinates.diff) {
      affected.insert(strips.identity[root].content);
      incoming_roots.push_back(key);
    }
  }
  Result result;
  apply(input, result, &source);
  for (const auto &a : frontiers)
    frontier.observe(a);

  std::vector<ContentRanges> mapped;
  for (const auto key : incoming_roots) {
    const auto root = containment.get(Word(key >> 32), Word(key));
    if (!root)
      continue;
    const auto layout = content_ranges.find(key);
    if (layout != content_ranges.end())
      mapped.push_back(
          {Word(key >> 32), Word(key), strips.identity[root].content_start, layout->second});
  }
  restore_content(mapped, false);

  // Public Splices read source bindings before deferred copies and appends.
  // Native offsets already address the private arrays those effects will produce.
  std::unordered_map<Word, Word> read_base;
  for (const auto copy : copied)
    read_base.emplace(copy.content, copy.start);
  for (const auto append : appended)
    read_base.try_emplace(append.target, append.base);
  result.changes.clear();
  Word position = 0, consumed = 0;
  const auto insert_span = [&](Span span) {
    while (span.count) {
      auto part = span;
      bool appended_part = false;
      for (const auto append : appended) {
        if (append.target != span.content)
          continue;
        if (span.start >= append.at && span.start < append.at + append.count) {
          part = {append.source, append.start + span.start - append.at,
                  std::min(span.count, append.at + append.count - span.start)};
          appended_part = true;
          break;
        }
        if (append.at > span.start)
          part.count = std::min(part.count, append.at - span.start);
      }
      if (!appended_part) {
        const auto base = read_base.find(part.content);
        if (base != read_base.end())
          part.start += base->second;
      }
      result.changes.push_back({position, position, part});
      position += part.count;
      span.start += part.count;
      span.count -= part.count;
    }
  };
  for (auto i = structural_head; i; i = strips.right[i]) {
    if (strips.fragment_diff[i] <= 0)
      continue;
    const auto insertion = strips.identity[i];
    const auto c = insertion.coordinates;
    auto at = strips.fragment_start[i];
    const auto end = at + Word(strips.fragment_diff[i]);
    const auto old = before.find(identity(c.session, c.start));
    while (at < end) {
      const VisibleRange *match = nullptr;
      if (old != before.end()) {
        const auto &frames = old->second;
        const auto next =
            std::lower_bound(frames.begin(), frames.end(), at, [](const auto &range, Word point) {
              return range.start + range.count <= point;
            });
        if (next != frames.end())
          match = &*next;
      }
      if (match && match->start <= at) {
        const auto original = match->position + at - match->start;
        if (original < consumed)
          throw std::runtime_error("Snapshot reordered retained Frames");
        if (original > consumed)
          result.changes.push_back({position, position + original - consumed, {}});
        consumed = original;
        const auto count = std::min(end - at, match->start + match->count - at);
        at += count;
        consumed += count;
        position += count;
      } else {
        const auto count = std::min(end, match ? match->start : end) - at;
        insert_span({insertion.content, insertion.content_start + at, count});
        at += count;
      }
    }
  }
  if (consumed < old_length)
    result.changes.push_back({position, position + old_length - consumed, {}});

  // During materialization an omitted interval still has its original logical
  // length. Clear only physical slots after the packed offsets have been restored.
  std::erase_if(released,
                [&](const Span &span) { return span.count && affected.contains(span.content); });
  for (const auto key : incoming_roots) {
    const auto root = containment.get(Word(key >> 32), Word(key));
    if (!root)
      continue;
    const auto binding = strips.identity[root];
    const auto private_content = read_base.contains(binding.content);
    for (auto fragment = root; fragment; fragment = strips.fragment[fragment]) {
      auto &part = strips.identity[fragment];
      part.content_owned = private_content;
    }
    clear_content(root);
  }
  return result;
}
} // namespace sequencer
