#include "../auxiliary/magnitude.hpp"
#include "../class.hpp"
#include <algorithm>
#include <limits>
#include <unordered_map>

namespace sequencer {
Sequence Projection::sequence() const {
  const auto compactable = frontier.compactable();
  struct Removed {
    Word whole{};
    std::vector<Word> frames;
    Word before(Word at) const {
      if (!at)
        return 0;
      if (whole)
        return std::min(at, whole);
      return frames.empty() ? 0 : frames[std::min<std::size_t>(at, frames.size()) - 1];
    }
  };
  std::unordered_map<std::uint64_t, Removed> removed;
  if (!compactable.empty()) {
    for (auto i = structural_head; i; i = strips.right[i]) {
      const auto s = i;
      const auto &c = strips.identity[s].coordinates;
      const auto diff = strips.fragment_diff[s];
      if (diff >= 0 || !compactable.contains(c.session))
        continue;
      const auto start = c.anchor_diff + strips.fragment_start[s];
      auto [it, added] = removed.try_emplace(identity(c.anchor_session, c.anchor_start));
      auto &frames = it->second;
      if (added) {
        const auto parent = containment.get(c.anchor_session, c.anchor_start);
        const auto count = Word(strips.identity[parent].coordinates.diff);
        if (!start && magnitude(diff) == count)
          frames.whole = count;
        else
          frames.frames.resize(count);
      }
      if (!frames.whole)
        std::fill(frames.frames.begin() + start, frames.frames.begin() + start + magnitude(diff),
                  1);
    }
  }
  const auto removed_frames = [&](Word session, Word start) -> Removed * {
    const auto it = removed.find(identity(session, start));
    return it == removed.end() ? nullptr : &it->second;
  };
  const auto before = [](const Removed *frames, Word at) {
    return frames ? frames->before(at) : 0;
  };
  Sequence output;
  output.words.reserve(1 + structural_count * 6);
  output.footage.reserve(structural_count);
  output.words.push_back(0);
  for (const auto &a : frontier.frontiers()) {
    const auto begin = output.words.size();
    output.words.insert(output.words.end(), {0, a[0]});
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      if (!compactable.contains(a[i]))
        output.words.insert(output.words.end(), {a[i], a[i + 1]});
    }
    output.words[begin] = Word(output.words.size() - begin - 1);
  }
  output.words[0] = Word(output.words.size());
  constexpr auto omitted = std::numeric_limits<Word>::max();
  std::unordered_map<std::uint64_t, Word> included;
  Word left = omitted, left_diff = 0;
  for (auto i = structural_head; i; i = strips.right[i]) {
    const auto s = i;
    const auto &c = strips.identity[s].coordinates;
    if (c.diff < 0 && compactable.contains(c.session))
      continue;
    auto *frames = removed_frames(c.session, c.start);
    if (frames && frames->whole)
      continue;
    const auto key = identity(c.session, c.start);
    auto found = included.find(key);
    const auto first = found == included.end();
    Word insertion = omitted;
    if (first) {
      auto exported = c;
      auto &footage = output.footage;
      if (c.diff > 0 && !compactable.empty()) {
        exported.anchor_session = left == omitted ? 0 : output.words[left + 3];
        exported.anchor_start = left == omitted ? 0 : output.words[left + 4];
        exported.anchor_diff = left_diff;
      } else if (c.diff < 0 && !removed.empty()) {
        exported.anchor_diff -=
            before(removed_frames(c.anchor_session, c.anchor_start), c.anchor_diff);
      }
      if (c.diff > 0 && frames) {
        Word count = 0;
        for (Word n = 0; n < Word(c.diff); ++n) {
          if (!frames->frames[n]) {
            if (!footage.empty() && footage.back().content == strips.identity[s].content &&
                footage.back().start + footage.back().count == strips.identity[s].content_start + n)
              ++footage.back().count;
            else
              footage.push_back({strips.identity[s].content,
                                 strips.identity[s].content_start + n, 1});
          }
          count += frames->frames[n];
          frames->frames[n] = count;
        }
        exported.diff -= std::int32_t(count);
      } else if (c.diff < 0 && !removed.empty()) {
        const auto *target = removed_frames(c.anchor_session, c.anchor_start);
        exported.diff +=
            std::int32_t(before(target, c.anchor_diff - c.diff) - before(target, c.anchor_diff));
      } else if (c.diff > 0)
        footage.push_back({strips.identity[s].content, strips.identity[s].content_start, Word(c.diff)});
      if (exported.diff) {
        insertion = Word(output.words.size());
        const auto words = std::bit_cast<std::array<Word, 6>>(exported);
        output.words.insert(output.words.end(), words.begin(), words.end());
      }
      included.emplace(key, insertion);
    } else
      insertion = found->second;
    if (insertion != omitted && (first || strips.fragment_diff[s] != 0)) {
      left = insertion;
      left_diff = strips.fragment_start[s] + magnitude(strips.fragment_diff[s]);
      if (!removed.empty() && c.diff > 0)
        left_diff -= before(frames, left_diff);
      else if (!removed.empty()) {
        const auto *target = removed_frames(c.anchor_session, c.anchor_start);
        left_diff -= before(target, c.anchor_diff + left_diff) - before(target, c.anchor_diff);
      }
    }
  }
  if (output.words.size() == 1)
    output.words.clear();
  return output;
}
} // namespace sequencer
