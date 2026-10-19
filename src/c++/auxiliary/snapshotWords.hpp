#pragma once
#include "../types/type.hpp"

namespace sequencer {
/** Appends a full uint32 value using only JavaScript small-integer-compatible lanes.
 * @param words Compact metadata destination.
 * @param value Exact unsigned coordinate or Acknowledgement word.
 */
inline void snapshot_word(std::vector<Word> &words, Word value) {
  if (value < 0x3fffffffu)
    words.push_back(value);
  else {
    words.push_back(0x3fffffffu);
    words.push_back(value & 0xffffu);
    words.push_back(value >> 16);
  }
}
/** Streaming snapshot metadata writer; compression preserves every canonical coordinate. */
struct SnapshotWords {
  /** Destination beginning with the already written Acknowledgement section. */
  std::vector<Word> &words;
  /** Last compact record, used to predict Session and logical start. */
  Coordinates previous{};
  /** Actually retained canonical record count, excluding runtime fragments. */
  Word count{};
  /** Whether the destination has promoted to the compact header and variable records. */
  bool packed;
  /** Whether live root count makes promotion possible; retained count decides it. */
  bool eligible;

  /** Promotes the bounded plain prefix while preserving ACK values and record order. */
  void promote() {
    auto old = std::move(words);
    words.reserve(old.capacity());
    words.insert(words.end(), {0, 0, 0});
    for (Word at = 1; at < old[0];) {
      const auto size = old[at++];
      words.push_back(size);
      for (Word i = 0; i < size; ++i)
        snapshot_word(words, old[at++]);
    }
    words[1] = Word(words.size());
    packed = true;
    count = 0;
    for (auto at = old[0]; at < old.size(); at += 6)
      append({old[at], old[at + 1], old[at + 2], old[at + 3], old[at + 4],
              std::bit_cast<std::int32_t>(old[at + 5])});
  }

  /** Appends one retained canonical record, promoting at the 64th record.
   * @param c Canonical coordinates, unchanged by Footage compaction.
   */
  void append(const Coordinates &c) {
    // Only the first 63 records are revisited. Tiny surviving snapshots remain
    // plain when their canonical record count stays below the packing threshold.
    if (eligible && !packed && count == 63)
      promote();
    ++count;
    if (!packed) {
      const auto record = std::bit_cast<std::array<Word, 6>>(c);
      words.insert(words.end(), record.begin(), record.end());
      return;
    }
    // Control bits indicate explicit fields; the remaining 24 bits inline anchorStart.
    // Session IDs always use two 16-bit halves, while large scalar lanes use an escape.
    const auto session = c.session != previous.session;
    const auto predicted =
        session
            ? 0
            : previous.start + (previous.diff < 0 ? Word(-previous.diff) : Word(previous.diff)) + 1;
    const auto start = c.start != predicted;
    const auto anchor_session = c.anchor_session != c.session;
    const auto anchor_start = c.anchor_start > 0xffffffu;
    const auto anchor_diff = c.anchor_diff != 1;
    const auto diff = c.diff != 1;
    words.push_back((anchor_start ? 0 : c.anchor_start << 6) | Word(session) |
                    (Word(anchor_session) << 1) | (Word(start) << 2) | (Word(anchor_start) << 3) |
                    (Word(anchor_diff) << 4) | (Word(diff) << 5));
    if (session) {
      words.push_back(c.session & 0xffffu);
      words.push_back(c.session >> 16);
    }
    if (anchor_session) {
      words.push_back(c.anchor_session & 0xffffu);
      words.push_back(c.anchor_session >> 16);
    }
    if (start)
      snapshot_word(words, c.start);
    if (anchor_start)
      snapshot_word(words, c.anchor_start);
    if (anchor_diff)
      snapshot_word(words, c.anchor_diff);
    if (diff) {
      // Zigzag preserves the signed Frame effect as an unsigned scalar before escaping.
      const auto signed_diff = std::bit_cast<Word>(c.diff);
      snapshot_word(words, (signed_diff << 1) ^ (c.diff < 0 ? UINT32_MAX : 0));
    }
    previous = c;
  }
};
} // namespace sequencer
