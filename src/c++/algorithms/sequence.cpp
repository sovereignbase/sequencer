/**
 * @file
 * Compacts acknowledged Footage while retaining canonical replication coordinates.
 */
#include "../auxiliary/magnitude.hpp"
#include "../auxiliary/snapshotRuns.hpp"
#include "../auxiliary/snapshotWords.hpp"
#include "../class.hpp"
#include <algorithm>

namespace sequencer {
Sequence Projection::sequence() const {
  const auto compactable = frontier.compactable();
  if (compactable.empty() && content_ranges.empty()) {
    Sequence output;
    const auto eligible = containment.size() >= 64;
    output.words.reserve(1 + structural_count * (eligible ? 3 : 6));
    output.footage.reserve(std::min(structural_count, containment.size()));
    output.words.push_back(0);
    for (const auto &a : frontier.frontiers()) {
      output.words.push_back(Word(a.size()));
      output.words.insert(output.words.end(), a.begin(), a.end());
    }
    output.words[0] = Word(output.words.size());
    SnapshotWords writer{output.words, {}, 0, false, eligible};
    for (auto i = structural_head; i; i = strips.right[i]) {
      const auto insertion = strips.identity[i];
      const auto c = insertion.coordinates;
      if (strips.offset[i] && (c.diff > 0 || containment.get(c.session, c.start) != i))
        continue;
      writer.append(c);
      if (c.diff > 0) {
        if (output.footage.empty())
          output.shared_root = i;
        output.footage.push_back({insertion.content, insertion.content_start, Word(c.diff)});
      }
    }
    if (writer.packed)
      output.words[2] = writer.count;
    if (output.words.size() == 1)
      output.words.clear();
    return output;
  }
  std::unordered_map<std::uint64_t, std::vector<FrameRange>> removed;
  std::vector<Index> roots;
  roots.reserve(containment.size());
  for (auto i = structural_head; i; i = strips.right[i]) {
    const auto c = strips.identity[i].coordinates;
    if (strips.offset[i] && (c.diff > 0 || containment.get(c.session, c.start) != i))
      continue;
    roots.push_back(i);
    const auto ack = compactable.find(c.session);
    if (c.diff < 0 && ack != compactable.end() &&
        std::uint64_t(c.start) + magnitude(c.diff) <= ack->second)
      removed[identity(c.anchor_session, c.anchor_start)].push_back(
          {c.anchor_diff, magnitude(c.diff)});
  }
  const auto sparse = !removed.empty() || !content_ranges.empty();
  Sequence output;
  output.words.reserve(4 + roots.size() * 4);
  output.footage.reserve(roots.size());
  if (sparse)
    output.words = {0, 0, 0x3ffffffeu, Word(roots.size())};
  else
    output.words.push_back(0);
  for (const auto &a : frontier.frontiers()) {
    output.words.push_back(Word(a.size()));
    for (const auto word : a) {
      if (sparse)
        snapshot_word(output.words, word);
      else
        output.words.push_back(word);
    }
  }
  output.words[sparse ? 1 : 0] = Word(output.words.size());
  SnapshotWords writer{output.words, {}, 0, sparse, !sparse && roots.size() >= 64};
  SnapshotRuns runs(writer);
  for (const auto root : roots) {
    const auto insertion = strips.identity[root];
    const auto c = insertion.coordinates;
    if (c.diff < 0) {
      if (sparse)
        runs.append(c);
      else
        writer.append(c);
      continue;
    }
    if (output.footage.empty())
      output.shared_root = root;
    if (!sparse) {
      writer.append(c);
      output.footage.push_back({insertion.content, insertion.content_start, Word(c.diff)});
      continue;
    }
    const auto key = identity(c.session, c.start);
    const auto layout = content_ranges.find(key);
    const auto masks = removed.find(key);
    std::vector<FrameRange> retained;
    if (layout == content_ranges.end())
      retained.push_back({0, Word(c.diff)});
    else
      retained = layout->second;
    if (masks != removed.end()) {
      auto &intervals = masks->second;
      std::sort(intervals.begin(), intervals.end(),
                [](auto a, auto b) { return a.start < b.start; });
      std::vector<FrameRange> kept;
      std::size_t mask = 0;
      for (const auto range : retained) {
        auto at = range.start;
        const auto end = at + range.count;
        while (mask < intervals.size() && intervals[mask].start + intervals[mask].count <= at)
          ++mask;
        for (auto n = mask; n < intervals.size() && intervals[n].start < end; ++n) {
          if (intervals[n].start > at)
            kept.push_back({at, intervals[n].start - at});
          at = std::max(at, std::min(end, intervals[n].start + intervals[n].count));
        }
        if (at < end)
          kept.push_back({at, end - at});
      }
      retained = std::move(kept);
    }
    std::size_t source_range = 0;
    Word physical = 0;
    for (const auto range : retained) {
      auto start = range.start;
      if (layout != content_ranges.end()) {
        const auto &source = layout->second;
        while (source_range < source.size() &&
               source[source_range].start + source[source_range].count <= start) {
          physical += source[source_range].count;
          ++source_range;
        }
        start = physical + start - source[source_range].start;
      }
      output.footage.push_back({insertion.content, insertion.content_start + start, range.count});
    }
    runs.append(c, std::move(retained));
  }
  if (sparse)
    runs.finish();
  if (writer.packed && !sparse)
    output.words[2] = writer.count;
  if (output.words.size() == 1)
    output.words.clear();
  return output;
}
} // namespace sequencer
