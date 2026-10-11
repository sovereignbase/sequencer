#include "../class.hpp"
#include "../auxiliary/magnitude.hpp"
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
      if (!at) return 0;
      if (whole) return std::min(at, whole);
      return frames.empty() ? 0 : frames[std::min<std::size_t>(at, frames.size()) - 1];
    }
  };
  std::unordered_map<std::uint64_t, Removed> removed;
  if (!compactable.empty()) {
    for (auto i = structural_head; i; i = strips[i].right) {
      const auto& s = strips[i];
      const auto& c = s.coordinates;
      const auto diff = s.effect();
      if (diff >= 0 || !compactable.contains(c.session)) continue;
      const auto start = c.anchor_diff + s.fragment_start;
      auto [it, added] = removed.try_emplace(identity(c.anchor_session, c.anchor_start));
      auto& frames = it->second;
      if (added) {
        const auto parent = containment.get(c.anchor_session, c.anchor_start);
        const auto count = Word(strips[parent].coordinates.diff);
        if (!start && magnitude(diff) == count) frames.whole = count;
        else frames.frames.resize(count);
      }
      if (!frames.whole)
        std::fill(frames.frames.begin() + start, frames.frames.begin() + start + magnitude(diff), 1);
    }
  }
  const auto removed_frames = [&](Word session, Word start) -> Removed* {
    const auto it = removed.find(identity(session, start));
    return it == removed.end() ? nullptr : &it->second;
  };
  const auto before = [](const Removed* frames, Word at) { return frames ? frames->before(at) : 0; };
  Sequence output;
  constexpr auto omitted = std::numeric_limits<Word>::max();
  std::unordered_map<std::uint64_t, Word> included;
  Word left = omitted, left_diff = 0;
  for (auto i = structural_head; i; i = strips[i].right) {
    const auto& s = strips[i];
    const auto& c = s.coordinates;
    if (c.diff < 0 && compactable.contains(c.session)) continue;
    auto* frames = removed_frames(c.session, c.start);
    if (frames && frames->whole) continue;
    const auto key = identity(c.session, c.start);
    auto found = included.find(key);
    const auto first = found == included.end();
    Word insertion = omitted;
    if (first) {
      auto exported = c;
      std::vector<Span> footage;
      if (c.diff > 0 && !compactable.empty()) {
        exported.anchor_session = left == omitted ? 0 : output.insertions[left].coordinates.session;
        exported.anchor_start = left == omitted ? 0 : output.insertions[left].coordinates.start;
        exported.anchor_diff = left_diff;
      } else if (c.diff < 0 && !removed.empty()) {
        exported.anchor_diff -= before(removed_frames(c.anchor_session, c.anchor_start), c.anchor_diff);
      }
      if (c.diff > 0 && frames) {
        Word count = 0;
        for (Word n = 0; n < Word(c.diff); ++n) {
          if (!frames->frames[n]) {
            if (!footage.empty() && footage.back().start + footage.back().count == n) ++footage.back().count;
            else footage.push_back({s.content, n, 1});
          }
          count += frames->frames[n];
          frames->frames[n] = count;
        }
        exported.diff -= std::int32_t(count);
      } else if (c.diff < 0 && !removed.empty()) {
        const auto* target = removed_frames(c.anchor_session, c.anchor_start);
        exported.diff += std::int32_t(before(target, c.anchor_diff - c.diff) - before(target, c.anchor_diff));
      } else if (c.diff > 0) footage.push_back({s.content, 0, Word(c.diff)});
      if (exported.diff) {
        insertion = Word(output.insertions.size());
        output.insertions.push_back({exported, std::move(footage)});
      }
      included.emplace(key, insertion);
    } else insertion = found->second;
    if (insertion != omitted && (first || s.fragment_diff != 0)) {
      left = insertion;
      left_diff = s.fragment_start + magnitude(s.effect());
      if (!removed.empty() && c.diff > 0) left_diff -= before(frames, left_diff);
      else if (!removed.empty()) {
        const auto* target = removed_frames(c.anchor_session, c.anchor_start);
        left_diff -= before(target, c.anchor_diff + left_diff) - before(target, c.anchor_diff);
      }
    }
  }
  for (const auto& a : frontier.frontiers()) {
    auto& exported = output.frontiers.emplace_back(Acknowledgement{a[0]});
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      if (compactable.contains(a[i])) continue;
      exported.push_back(a[i]);
      exported.push_back(a[i + 1]);
    }
  }
  return output;
}
}
