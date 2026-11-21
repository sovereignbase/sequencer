#pragma once
#include "../../auxiliary/magnitude.hpp"
#include "../ContainmentTable/class.hpp"

namespace sequencer {
/** Writes byte metadata without changing canonical coordinates. */
template <bool Dictionary = false> class WordsWriter {
  std::vector<std::uint8_t> &bytes;
  ContainmentTable sessions;
  Word session_count{}, previous_session{}, previous_start{}, previous_size{};

public:
  Word count{};
  explicit WordsWriter(std::vector<std::uint8_t> &output) : bytes(output) {}

  void byte(std::uint8_t value) { bytes.push_back(value); }
  /** Unsigned base-128 integer, bounded to five bytes. */
  void uint(Word value) {
    while (value >= 128) {
      byte(std::uint8_t(value) | 0x80);
      value >>= 7;
    }
    byte(std::uint8_t(value));
  }
  /** Session entropy stays in four little-endian bytes. */
  void session(Word value) {
    if constexpr (Dictionary) {
      const auto index = sessions.get(value, 0);
      uint(index);
      if (index)
        return;
      sessions.set({.session = value}, ++session_count);
    }
    const auto begin = bytes.size();
    bytes.resize(begin + sizeof(value));
    std::memcpy(bytes.data() + begin, &value, sizeof(value));
  }
  /** Flags omit predictable fields; signed start deltas retain modular uint32 arithmetic. */
  void append(const Coordinates &c) {
    const auto birth = c.birth();
    const auto zero_anchor = c.anchor_session == 0;
    const auto predicted =
        Dictionary ? c.session == previous_session ? previous_start + previous_size + 1 : 0
        : !birth && c.anchor_session == c.session ? c.anchor_start + c.anchor_diff + 1
                                                  : 0;
    const auto anchor = Dictionary && c.anchor_session == previous_session ? previous_start : 0;
    const auto anchor_delta = c.anchor_start - anchor;
    const auto delta = c.start - predicted;
    const auto size = magnitude(c.diff);
    const auto control =
        Word(c.session != previous_session) |
        (Word(!zero_anchor && c.anchor_session != c.session) << 1) | (Word(delta != 0) << 2) |
        (Word(anchor_delta != 0) << 3) | (Word(c.anchor_diff != (zero_anchor ? 0u : 1u)) << 4) |
        (Word(size != 1) << 5) | (Word(zero_anchor) << 6) | (Word(c.diff < 0) << 7);
    byte(std::uint8_t(control));
    if (control & 1)
      session(c.session);
    if (control & 2)
      session(c.anchor_session);
    if (control & 8)
      uint(Dictionary ? (anchor_delta << 1) ^ (0u - (anchor_delta >> 31)) : anchor_delta);
    if (control & 16)
      uint(c.anchor_diff);
    if (control & 4)
      uint((delta << 1) ^ (0u - (delta >> 31)));
    if (control & 32)
      uint(size);
    previous_session = c.session;
    previous_start = c.start;
    previous_size = size;
    ++count;
  }
  /** Standalone ACKs end at their byte boundary; only snapshots share Session references. */
  void acknowledgement(std::span<const Word> a) {
    uint(a[0]);
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      session(a[i]);
      uint(a[i + 1]);
    }
  }
  /** A reversed final varuint supplies record count without moving the encoded prefix. */
  void finish() {
    const auto begin = bytes.size();
    uint(count);
    std::reverse(bytes.begin() + begin, bytes.end());
  }
};
} // namespace sequencer
