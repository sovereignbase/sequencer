#pragma once
#include "snapshotWords.hpp"

namespace sequencer {
/** Canonical record and the original intervals represented in packed Footage. */
struct SnapshotRecord {
  /** Original anchor, identity and signed Frame effect. */
  Coordinates coordinates;
  /** Original intervals retained in packed Footage; empty for a reducing Insertion. */
  std::vector<FrameRange> frames;
};

/** Streams affine runs of one or two records without changing Structural Order. */
class SnapshotRuns {
  SnapshotWords &writer;
  std::array<SnapshotRecord, 6> pending;
  std::array<SnapshotRecord, 2> pattern;
  std::array<std::array<Word, 6>, 2> stride{};
  Word size{}, width{}, repeats{};

  static bool same_frames(const SnapshotRecord &a, const SnapshotRecord &b) {
    if (a.frames.size() != b.frames.size())
      return false;
    for (std::size_t i = 0; i < a.frames.size(); ++i)
      if (a.frames[i].start != b.frames[i].start || a.frames[i].count != b.frames[i].count)
        return false;
    return true;
  }
  static std::array<Word, 6> words(const Coordinates &c) {
    return std::bit_cast<std::array<Word, 6>>(c);
  }
  static bool follows(const SnapshotRecord &base, const SnapshotRecord &next,
                      const std::array<Word, 6> &delta, Word count) {
    if (!same_frames(base, next))
      return false;
    const auto a = words(base.coordinates), b = words(next.coordinates);
    // Unsigned arithmetic preserves the original uint32 coordinates, including wraparound.
    for (Word i = 0; i < 6; ++i)
      if (b[i] != a[i] + count * delta[i])
        return false;
    return true;
  }
  bool starts(Word lanes) {
    if (size < 3 * lanes)
      return false;
    for (Word lane = 0; lane < lanes; ++lane) {
      const auto a = words(pending[lane].coordinates);
      const auto b = words(pending[lane + lanes].coordinates);
      for (Word i = 0; i < 6; ++i)
        stride[lane][i] = b[i] - a[i];
      if (stride[lane][3] || stride[lane][5] || !stride[lane][4] ||
          !follows(pending[lane], pending[lane + lanes], stride[lane], 1) ||
          !follows(pending[lane], pending[lane + 2 * lanes], stride[lane], 2))
        return false;
    }
    width = lanes;
    repeats = 3;
    for (Word lane = 0; lane < lanes; ++lane)
      pattern[lane] = std::move(pending[lane]);
    pop(3 * lanes);
    return true;
  }
  void pop(Word count) {
    for (Word i = count; i < size; ++i)
      pending[i - count] = std::move(pending[i]);
    size -= count;
  }
  void layout(const SnapshotRecord &record) {
    const auto c = record.coordinates;
    if (c.diff < 0)
      return;
    const auto full = record.frames.size() == 1 && !record.frames[0].start &&
                      record.frames[0].count == Word(c.diff);
    snapshot_word(writer.words, full ? 0 : Word(record.frames.size()) + 1);
    if (!full) {
      Word end = 0;
      for (const auto range : record.frames) {
        snapshot_word(writer.words, range.start - end);
        snapshot_word(writer.words, range.count);
        end = range.start + range.count;
      }
    }
  }
  void literal(const SnapshotRecord &record) {
    writer.append(record.coordinates);
    layout(record);
  }
  void flush() {
    // Bit 3 requires an explicit anchorStart, so this control with nonzero
    // inlined anchorStart cannot occur in a literal SnapshotWords record.
    writer.words.push_back(0x3ffffffeu);
    snapshot_word(writer.words, width);
    snapshot_word(writer.words, repeats);
    for (Word lane = 0; lane < width; ++lane) {
      writer.append(pattern[lane].coordinates);
      for (const auto value : stride[lane])
        snapshot_word(writer.words, value);
      layout(pattern[lane]);
    }
    auto last = words(pattern[width - 1].coordinates);
    for (Word i = 0; i < 6; ++i)
      last[i] += (repeats - 1) * stride[width - 1][i];
    writer.previous = std::bit_cast<Coordinates>(last);
    width = 0;
  }
  void drain(bool final) {
    while (true) {
      if (width) {
        if (size < width) {
          if (!final)
            return;
          flush();
        } else {
          bool match = true;
          for (Word lane = 0; lane < width; ++lane)
            match &= follows(pattern[lane], pending[lane], stride[lane], repeats);
          if (match) {
            pop(width);
            ++repeats;
            continue;
          }
          flush();
        }
      }
      if (starts(1) || starts(2))
        continue;
      if (!size || (!final && size < pending.size()))
        return;
      literal(pending[0]);
      pop(1);
    }
  }

public:
  /** Initializes bounded lookahead around the canonical metadata writer.
   * @param output Existing packed writer, including its ACK prefix.
   */
  explicit SnapshotRuns(SnapshotWords &output) : writer(output) {}
  /** Appends a record, retaining at most six records for lookahead.
   * @param coordinates Original six-word coordinates.
   * @param frames Original intervals retained in packed Footage.
   */
  void append(Coordinates coordinates, std::vector<FrameRange> frames = {}) {
    pending[size++] = {coordinates, std::move(frames)};
    drain(false);
  }
  /** Writes the final run and any literal suffix. */
  void finish() { drain(true); }
};
} // namespace sequencer
