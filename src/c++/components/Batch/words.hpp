#pragma once
#include "../Words/reader.hpp"
#include "../Words/writer.hpp"

namespace sequencer {
/** Local author clocks and compact field shapes shared by a replication batch. */
class BatchWriter : public WordsWriter<true> {
  std::vector<std::uint8_t> &output;
  const std::array<Word, 2> &authors;
  // Positive and reducing Sessions advance independently, including across nested batches.
  std::array<Word, 2> next{};
  // Local anchors do not evict the last foreign Session or its delta origin.
  Word foreign{}, foreign_start{};
  std::array<Word, 5> previous;
  std::size_t record_size{}, run_begin{};
  Word repetitions{};

public:
  Word positives{}, used{};
  bool single_frames = true;
  BatchWriter(std::vector<std::uint8_t> &bytes, const std::array<Word, 2> &sessions)
      : WordsWriter<true>(bytes), output(bytes), authors(sessions) {}
  void append(const Coordinates &c) {
    const Word reducing = c.diff < 0;
    used |= Word(1) << reducing;
    const auto size = magnitude(c.diff);
    const auto delta = c.start - next[reducing];
    const Word anchor = c.anchor_session == authors[reducing]       ? 0
                        : c.anchor_session == authors[1 - reducing] ? 1
                        : c.anchor_session == foreign               ? 2
                                                                    : 3;
    if (anchor == 1)
      used |= Word(1) << (1 - reducing);
    const auto point = c.anchor_diff;
    const Word mode = size == 1                   ? point < 2 ? point : 2
                      : point == 0                ? 3
                      : point == 1                ? 4
                      : size <= 17 && point <= 15 ? 5
                                                  : 6;
    const auto distance = anchor == 0 ? c.start - c.anchor_start
                          : anchor == 1 && next[1 - reducing]
                              ? next[1 - reducing] - 1 - c.anchor_start
                          : anchor == 2 ? ((c.anchor_start - foreign_start) << 1) ^
                                              (0u - ((c.anchor_start - foreign_start) >> 31))
                                        : c.anchor_start;
    // Anchor source, optional clock/anchor offsets, size/point shape, reducing sign.
    const Word control = anchor | (Word(delta != 0) << 2) | (Word(distance != 0) << 3) |
                         (mode << 4) | (reducing << 7);
    const auto begin = output.size();
    const std::array<Word, 5> record{control, delta, distance, point, size};
    // Explicit Session admission must run once; repeating it would mutate the dictionary.
    const auto repeated = anchor != 3 && record_size && record == previous;
    if (repeated) {
      if (!repetitions)
        run_begin = begin;
      output.resize(run_begin);
      ++repetitions;
      if (record_size == 1 && repetitions == 1)
        byte(std::uint8_t(control));
      else {
        byte(255);
        uint(repetitions);
      }
    } else {
      repetitions = 0;
      byte(std::uint8_t(control));
      if (anchor == 3)
        session(c.anchor_session);
      if (delta)
        uint((delta << 1) ^ (0u - (delta >> 31)));
      if (distance)
        uint(distance);
      if (mode == 2)
        uint(point);
      else if (mode == 3 || mode == 4)
        uint(size);
      else if (mode == 5)
        byte(std::uint8_t((size - 2) << 4 | point));
      else if (mode == 6) {
        uint(size);
        uint(point);
      }
      previous = record;
      record_size = anchor == 3 ? 0 : output.size() - begin;
    }
    if (anchor >= 2) {
      foreign = c.anchor_session;
      foreign_start = c.anchor_start;
    }
    next[reducing] = c.start + size + 1;
    positives += !reducing;
    if (!reducing)
      single_frames &= size == 1;
    ++count;
  }
};

/** Reconstructs canonical coordinates; palette references never replace their identities. */
class BatchReader : public WordsReader<true> {
  std::array<Word, 2> authors, next{};
  Word foreign{}, foreign_start{};
  // Offset zero is a valid first record, so absence needs a separate sentinel.
  std::size_t previous = std::numeric_limits<std::size_t>::max();
  Word repetitions{};

public:
  BatchReader(std::span<const std::uint8_t> bytes, std::array<Word, 2> sessions)
      : WordsReader<true>(bytes), authors(sessions) {
    compact = true;
  }
  Coordinates coordinates(Word remaining_records) {
    const auto begin = position;
    std::size_t after_run = 0;
    if (repetitions) {
      after_run = position;
      position = previous;
    }
    auto control = byte();
    if (!repetitions && control == 255) {
      repetitions = uint();
      if (previous == std::numeric_limits<std::size_t>::max() || !repetitions ||
          repetitions > remaining_records) {
        valid = false;
        return {};
      }
      after_run = position;
      position = previous;
      control = byte();
      if ((control & 3) == 3) {
        valid = false;
        return {};
      }
    }
    if (!repetitions)
      previous = begin;
    const Word reducing = control >> 7, anchor = control & 3, mode = (control >> 4) & 7;
    Coordinates c;
    c.session = authors[reducing];
    c.anchor_session = anchor == 0   ? c.session
                       : anchor == 1 ? authors[1 - reducing]
                       : anchor == 2 ? foreign
                                     : session();
    if (!c.session || (anchor == 1 && !c.anchor_session) || mode == 7) {
      valid = false;
      return {};
    }
    const auto delta = control & 4 ? uint() : 0;
    c.start = next[reducing] + ((delta >> 1) ^ (0u - (delta & 1)));
    const auto distance = control & 8 ? uint() : 0;
    c.anchor_start = anchor == 0                         ? c.start - distance
                     : anchor == 1 && next[1 - reducing] ? next[1 - reducing] - 1 - distance
                     : anchor == 2 ? foreign_start + ((distance >> 1) ^ (0u - (distance & 1)))
                                   : distance;
    Word size = 1;
    c.anchor_diff = mode == 0 || mode == 3 ? 0 : mode == 1 || mode == 4 ? 1 : 0;
    if (mode == 2)
      c.anchor_diff = uint();
    else if (mode == 3 || mode == 4)
      size = uint();
    else if (mode == 5) {
      const auto fields = byte();
      size = 2 + (fields >> 4);
      c.anchor_diff = fields & 15;
    } else if (mode == 6) {
      size = uint();
      c.anchor_diff = uint();
    }
    if (!size || size > Word(INT32_MAX))
      valid = false;
    c.diff = std::bit_cast<std::int32_t>(reducing ? 0u - size : size);
    if (anchor >= 2) {
      foreign = c.anchor_session;
      foreign_start = c.anchor_start;
    }
    next[reducing] = c.start + size + 1;
    if (repetitions) {
      --repetitions;
      position = after_run;
    }
    return c;
  }
};
} // namespace sequencer
