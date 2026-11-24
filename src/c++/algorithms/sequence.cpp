/**
 * @file
 * Exports compactable history while preserving hydrated Projection and future ordering.
 */
#include "../auxiliary/magnitude.hpp"
#include "../auxiliary/snapshotFootage.hpp"
#include "../auxiliary/snapshotWords.hpp"
#include "../class.hpp"
#include "../components/Words/writer.hpp"
#include <algorithm>
#include <limits>

namespace sequencer {
template <bool Binary> void Projection::sequence_into(Sequence &output) const {
  const auto compactable = frontier.compactable();
  // Original Frame deletion map, converted in place to removed-prefix counts during export.
  struct Removed {
    // Whole positive Insertion length when every original Frame is compacted.
    Word whole{};
    // Per-original-Frame marks, later cumulative removed counts.
    std::vector<Word> frames;
    // Counts compacted Frames before an original exclusive boundary.
    Word before(Word at) const {
      if (!at)
        return 0;
      if (whole)
        return std::min(at, whole);
      return frames.empty() ? 0 : frames[std::min<std::size_t>(at, frames.size()) - 1];
    }
  };
  ContainmentTable removed;
  std::vector<Removed> deletions;
  if (tuple && !compactable.empty()) {
    for (const auto &version : tuple->versions) {
      const auto &c = version.coordinates;
      if (c.diff < 0 && compactable.contains(c.session) &&
          !removed.get(c.anchor_session, c.anchor_start))
        removed.set({.session = c.anchor_session, .start = c.anchor_start}, 1);
    }
  }
  // Collect actual consumed mask fragments, not authored lengths: overlapping
  // removals must never delete an original Frame twice from the exported Footage.
  if (!tuple && !compactable.empty()) {
    for (auto i = structural_head; i; i = strips.right[i]) {
      const auto s = i;
      const auto &c = strips.identity[s].coordinates;
      const auto diff = strips.fragment_diff[s];
      if (diff >= 0 || !compactable.contains(c.session))
        continue;
      const auto start = c.anchor_diff + strips.fragment_start[s];
      auto index = removed.get(c.anchor_session, c.anchor_start);
      const auto added = !index;
      if (added) {
        deletions.emplace_back();
        index = Word(deletions.size());
        removed.set({.session = c.anchor_session, .start = c.anchor_start}, index);
      }
      auto &frames = deletions[index - 1];
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
    const auto index = removed.get(session, start);
    return index ? &deletions[index - 1] : nullptr;
  };
  const auto before = [](const Removed *frames, Word at) {
    return frames ? frames->before(at) : 0;
  };
  // Eligibility is a capacity hint; the writer promotes only at 64 actually retained roots.
  const auto eligible = containment.size() >= 64;
  const auto count = tuple ? Word(tuple->versions.size()) : structural_count;
  const auto words = 1 + count * (eligible ? 3 : 6);
  const auto spans = std::min(count, containment.size());
  // Reuse fitting buffers without retaining capacity from a larger previous snapshot.
  if ((Binary ? output.bytes.capacity() > std::size_t(words) * 2
              : output.words.capacity() > words) ||
      output.footage.capacity() > spans)
    output = {};
  output.words.clear();
  output.bytes.clear();
  output.footage.clear();
  output.shared_root = none;
  if constexpr (Binary)
    output.bytes.reserve(std::size_t(words) * 2);
  else
    output.words.reserve(words);
  output.footage.reserve(spans);
  auto writer = [&] {
    if constexpr (Binary)
      return WordsWriter<true>(output.bytes);
    else
      return SnapshotWords{output.words, {}, 0, false, eligible};
  }();
  const auto frontiers = frontier.frontiers();
  if constexpr (Binary) {
    writer.byte(
        std::uint8_t(3 | (tuple ? 128 : 0) | (tuple && tuple->capacity != UINT32_MAX ? 64 : 0)));
    if (tuple) {
      if (tuple->capacity != UINT32_MAX)
        writer.uint(tuple->capacity);
      else
        writer.uint(frame_count);
    }
    writer.uint(Word(frontiers.size()));
  } else
    output.words.push_back(0);
  // Keep Actor admission even when all of its compactable Session pairs disappear.
  for (const auto &a : frontiers) {
    if constexpr (Binary) {
      Word count = 1;
      for (std::size_t i = 1; i + 1 < a.size(); i += 2)
        count += compactable.contains(a[i]) ? 0 : 2;
      writer.uint(count);
      writer.uint(a[0]);
      for (std::size_t i = 1; i + 1 < a.size(); i += 2)
        if (!compactable.contains(a[i])) {
          writer.session(a[i]);
          writer.uint(a[i + 1]);
        }
      continue;
    }
    const auto begin = output.words.size();
    output.words.push_back(0);
    output.words.push_back(a[0]);
    Word count = 1;
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      if (!compactable.contains(a[i])) {
        output.words.insert(output.words.end(), {a[i], a[i + 1]});
        count += 2;
      }
    }
    output.words[begin] = count;
  }
  if constexpr (!Binary)
    output.words[0] = Word(output.words.size());
  constexpr auto omitted = std::numeric_limits<Word>::max();
  if (tuple) {
    for (Index index = 0; index < tuple->versions.size(); ++index) {
      const auto &insertion = tuple->versions[index];
      const auto &c = insertion.coordinates;
      if (removed.get(c.diff > 0 ? c.session : c.anchor_session,
                      c.diff > 0 ? c.start : c.anchor_start))
        continue;
      if (c.diff > 0) {
        if (output.footage.empty())
          output.shared_root = index + 1;
        append_footage(output.footage, {insertion.content, insertion.content_start, 1});
      }
      writer.append(c);
    }
  }
  Word left = omitted, left_diff = 0;
  Word left_session = 0, left_start = 0;
  for (auto i = structural_head; i; i = strips.right[i]) {
    const auto s = i;
    const auto &c = strips.identity[s].coordinates;
    if (c.diff < 0 && compactable.contains(c.session))
      continue;
    auto *frames = removed_frames(c.session, c.start);
    if (frames && frames->whole)
      continue;
    // Positive chains begin with a non-offset node. An overlapping mask may
    // consume its prefix, so its canonical node must be recognized by identity.
    const auto first =
        !strips.identity[s].offset || (c.diff < 0 && containment.get(c.session, c.start) == s);
    Word insertion = omitted;
    if (first) {
      auto exported = c;
      auto &footage = output.footage;
      auto fragment = s;
      if (c.diff > 0 && footage.empty())
        output.shared_root = s;
      // Compaction can collapse distinct historical points. Re-anchor positive
      // roots along their resolved retained order rather than recomputing sibling competition.
      if (c.diff > 0 && !compactable.empty()) {
        exported.anchor_session = left == omitted ? 0 : left_session;
        exported.anchor_start = left == omitted ? 0 : left_start;
        exported.anchor_diff = left_diff;
      } else if (c.diff < 0 && removed.size()) {
        exported.anchor_diff -=
            before(removed_frames(c.anchor_session, c.anchor_start), c.anchor_diff);
      }
      if (c.diff > 0 && frames) {
        // Copy surviving Footage in original order and turn deletion marks into
        // prefix counts for later anchors and masks targeting this same Insertion.
        Word count = 0;
        if (strips.identity[s].string_content) {
          Word start = 0;
          for (Word n = 0; n < Word(c.diff); ++n) {
            if (frames->frames[n]) {
              if (n > start)
                append_text_spans(strips, s, start, n - start, fragment, footage);
              start = n + 1;
            }
            count += frames->frames[n];
            frames->frames[n] = count;
          }
          if (start < Word(c.diff))
            append_text_spans(strips, s, start, Word(c.diff) - start, fragment, footage);
        } else {
          for (Word n = 0; n < Word(c.diff); ++n) {
            if (!frames->frames[n]) {
              append_footage(footage,
                             {strips.identity[s].content, strips.identity[s].content_start + n, 1});
            }
            count += frames->frames[n];
            frames->frames[n] = count;
          }
        }
        exported.diff -= std::int32_t(count);
      } else if (c.diff < 0 && removed.size()) {
        // Retained masks cover only the target Frames left after acknowledged deletion.
        const auto *target = removed_frames(c.anchor_session, c.anchor_start);
        exported.diff +=
            std::int32_t(before(target, c.anchor_diff - c.diff) - before(target, c.anchor_diff));
      } else if (c.diff > 0) {
        if (strips.identity[s].string_content && strips.identity[s].fragmented)
          append_text_spans(strips, s, 0, Word(c.diff), fragment, footage);
        else
          append_footage(footage, {strips.identity[s].content, strips.identity[s].content_start,
                                   Word(c.diff)});
      }
      if (exported.diff) {
        if constexpr (Binary)
          insertion = 0;
        else
          insertion = Word(output.words.size());
        writer.append(exported);
      }
    } else if (c.diff > 0) {
      if (!frames || before(frames, Word(c.diff)) < Word(c.diff))
        insertion = 0;
    } else {
      const auto *target = removed_frames(c.anchor_session, c.anchor_start);
      if (before(target, c.anchor_diff - c.diff) - before(target, c.anchor_diff) <
          magnitude(c.diff))
        insertion = 0;
    }
    // A later fragment advances the retained boundary without emitting a second root.
    // Zero-effect fragments cannot move the boundary past surviving structural children.
    if (insertion != omitted && (first || strips.fragment_diff[s] != 0)) {
      left = insertion;
      left_session = c.session;
      left_start = c.start;
      left_diff = strips.fragment_start[s] + magnitude(strips.fragment_diff[s]);
      if (removed.size() && c.diff > 0)
        left_diff -= before(frames, left_diff);
      else if (removed.size()) {
        const auto *target = removed_frames(c.anchor_session, c.anchor_start);
        left_diff -= before(target, c.anchor_diff + left_diff) - before(target, c.anchor_diff);
      }
    }
  }
  if constexpr (Binary) {
    writer.finish();
    if (!tuple && !writer.count && frontiers.empty())
      output.bytes.clear();
  } else {
    if (writer.packed)
      output.words[2] = writer.count;
    if (tuple)
      output.words.insert(output.words.begin(), {UINT32_MAX, 1, tuple->capacity, frame_count});
    else if (output.words.size() == 1)
      output.words.clear();
  }
}
void Projection::sequence(Sequence &output, bool binary) const {
  if (binary)
    sequence_into<true>(output);
  else
    sequence_into<false>(output);
}
} // namespace sequencer
