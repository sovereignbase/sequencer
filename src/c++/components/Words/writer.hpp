#pragma once
#include "../../auxiliary/magnitude.hpp"
#include "../ContainmentTable/class.hpp"

namespace sequencer {
/** Writes byte metadata without changing canonical coordinates. */
template <bool Dictionary = false> class WordsWriter {
  std::vector<std::uint8_t> &bytes;
  // The first nonzero Session stays inline; later admissions start at index two.
  WordTable sessions;
  Word first_session{}, previous_session{}, previous_start{}, previous_size{};
  std::array<Word, 4> previous_record;
  std::size_t record_size{};
  Word repetitions{};

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
      if (!value) {
        uint(0);
        return;
      }
      const auto index = value == first_session ? 1 : sessions.get(value);
      uint(index ? index + 1 : 1);
      if (index)
        return;
      if (!first_session)
        first_session = value;
      else
        sessions.set({.session = value}, sessions.size() + 2);
    }
    const auto begin = bytes.size();
    bytes.resize(begin + sizeof(value));
    std::memcpy(bytes.data() + begin, &value, sizeof(value));
  }
  /** Emits a completed run once, without rewriting it for every repeated record. */
  void flush() {
    if constexpr (Dictionary) {
      if (!repetitions)
        return;
      if (record_size == 1 && repetitions == 1)
        byte(std::uint8_t(previous_record[0]));
      else {
        byte(255);
        uint(repetitions);
      }
      repetitions = 0;
    }
  }
  /** Flags omit predictable fields; signed start deltas retain modular uint32 arithmetic. */
  void append(const Coordinates &c) {
    const auto birth = c.birth();
    const auto zero_anchor = c.anchor_session == 0;
    const auto zero_point = zero_anchor && c.anchor_diff == 0;
    const auto predicted =
        Dictionary ? c.session == previous_session ? previous_start + previous_size + 1 : 0
        : !birth && c.anchor_session == c.session ? c.anchor_start + c.anchor_diff + 1
                                                  : 0;
    const auto anchor = Dictionary && c.anchor_session == previous_session ? previous_start : 0;
    const auto anchor_delta = c.anchor_start - anchor;
    const auto delta = c.start - predicted;
    const auto size = magnitude(c.diff);
    const auto inline_anchor = !Dictionary && c.session && c.anchor_session == c.session;
    const auto control =
        inline_anchor
            ? Word(66) | Word(c.anchor_diff > 1) | (Word(delta != 0) << 2) |
                  (Word(anchor_delta != 0) << 3) | (Word(c.anchor_diff == 0) << 4) |
                  (Word(size != 1) << 5) | (Word(c.diff < 0) << 7)
            : Word(c.session != previous_session) |
                  (Word((Dictionary ? !zero_point : !zero_anchor) && c.anchor_session != c.session)
                   << 1) |
                  (Word(delta != 0) << 2) | (Word(anchor_delta != 0) << 3) |
                  (Word(Dictionary ? c.anchor_diff == 0 : c.anchor_diff != (zero_anchor ? 0u : 1u))
                   << 4) |
                  (Word(size != 1) << 5) |
                  (Word(Dictionary ? c.anchor_diff > 1 || zero_point : zero_anchor) << 6) |
                  (Word(c.diff < 0) << 7);
    bool repeated = false;
    if constexpr (Dictionary) {
      // Session references must be read explicitly so dictionary admission stays ordered.
      const std::array<Word, 4> record{control, anchor_delta, c.anchor_diff, delta};
      repeated =
          !(control & 3) && record_size && size == previous_size && record == previous_record;
      if (repeated)
        ++repetitions;
      else {
        if (repetitions)
          flush();
        previous_record = record;
      }
    }
    if (!repeated) {
      const auto begin = bytes.size();
      byte(std::uint8_t(control));
      if (inline_anchor || (control & 1))
        session(c.session);
      if (!inline_anchor && (control & 2))
        session(c.anchor_session);
      if (control & 8)
        uint(Dictionary ? (anchor_delta << 1) ^ (0u - (anchor_delta >> 31)) : anchor_delta);
      if (Dictionary      ? (control & 64) && !(control & 16)
          : inline_anchor ? control & 1
                          : control & 16)
        uint(c.anchor_diff);
      if (control & 4)
        uint((delta << 1) ^ (0u - (delta >> 31)));
      if (control & 32)
        uint(size);
      if constexpr (Dictionary)
        record_size = control & 3 ? 0 : bytes.size() - begin;
    }
    previous_session = c.session;
    previous_start = c.start;
    previous_size = size;
    if constexpr (Dictionary)
      ++count;
  }
  /** A reversed final varuint supplies record count without moving the encoded prefix. */
  void finish() {
    flush();
    const auto begin = bytes.size();
    uint(count);
    std::reverse(bytes.begin() + begin, bytes.end());
  }
};
} // namespace sequencer
