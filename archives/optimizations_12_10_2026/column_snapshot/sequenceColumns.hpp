#pragma once
#include "../types/type.hpp"
#include <span>
#include <unordered_map>

namespace sequencer {
constexpr Word column_sequence = 0x80000000;

// Only snapshots use columns. Replication operations retain their six words.
inline void pack_sequence(Sequence &sequence) {
  auto &words = sequence.words;
  const auto begin = words.empty() ? 0 : words[0];
  const auto count = Word((words.size() - begin) / 6);
  if (count < 32)
    return;
  std::vector<Word> packed(words.begin(), words.begin() + begin);
  packed[0] |= column_sequence;
  packed.push_back(count);
  std::unordered_map<Word, Word> sessions{{0, 0}};
  std::vector<Word> dictionary;
  for (auto at = begin; at < words.size(); at += 6)
    for (auto field : {0, 3}) {
      const auto session = words[at + field];
      if (sessions.emplace(session, Word(sessions.size())).second)
        dictionary.push_back(session);
    }
  packed.push_back(Word(dictionary.size()));
  packed.insert(packed.end(), dictionary.begin(), dictionary.end());
  std::vector<Word> values(count);
  for (Word field = 0; field < 6; ++field) {
    for (Word row = 0; row < count; ++row) {
      auto value = words[begin + row * 6 + field];
      if (field == 0 || field == 3)
        value = sessions.find(value)->second;
      else if (field == 5)
        value = (value << 1) ^ Word(std::bit_cast<std::int32_t>(value) >> 31);
      values[row] = value;
    }
    Word runs = 1, deltas = 0, previous_delta = 0;
    for (Word row = 1; row < count; ++row) {
      runs += values[row] != values[row - 1];
      const auto delta = values[row] - values[row - 1];
      deltas += row == 1 || delta != previous_delta;
      previous_delta = delta;
    }
    const auto mode = runs * 2 < count && runs * 2 <= deltas * 2 + 1 ? 2 :
                      deltas * 2 + 1 < count ? 3 : 0;
    packed.push_back(mode);
    if (!mode) {
      packed.insert(packed.end(), values.begin(), values.end());
      continue;
    }
    if (mode == 3)
      packed.push_back(values[0]);
    for (Word row = mode == 3 ? 1 : 0; row < count;) {
      const auto start = row++, value = values[start];
      auto encoded = value;
      if (mode == 3) {
        const auto delta = value - values[start - 1];
        while (row < count && values[row] - values[row - 1] == delta)
          ++row;
        encoded = (delta << 1) ^ Word(std::bit_cast<std::int32_t>(delta) >> 31);
      } else {
        while (row < count && values[row] == value)
          ++row;
      }
      packed.insert(packed.end(), {row - start, encoded});
    }
  }
  if (packed.size() < words.size())
    words = std::move(packed);
}

// Read directly into native operations; content never enters this stream.
inline bool unpack_sequence(std::span<const Word> words, Gossip &insertions) {
  std::size_t at = 0;
  const auto read = [&](Word &value) {
    if (at == words.size())
      return false;
    value = words[at++];
    return true;
  };
  Word count, session_count;
  if (!read(count) || !count || count > UINT32_MAX / sizeof(Entry) ||
      !read(session_count) || session_count > words.size() - at)
    return false;
  const auto sessions = words.subspan(at, session_count);
  at += session_count;
  // Validate the complete stream before allocating the operation array.
  const auto columns = at;
  for (Word field = 0; field < 6; ++field) {
    Word mode, ignored;
    if (!read(mode) || (mode != 0 && mode != 2 && mode != 3))
      return false;
    if (!mode) {
      if (count > words.size() - at)
        return false;
      at += count;
    } else {
      Word remaining = count;
      if (mode == 3) {
        if (!read(ignored))
          return false;
        --remaining;
      }
      while (remaining) {
        Word length;
        if (!read(length) || !length || length > remaining || !read(ignored))
          return false;
        remaining -= length;
      }
    }
  }
  if (at != words.size())
    return false;
  insertions.resize(count);
  at = columns;
  for (Word field = 0; field < 6; ++field) {
    const auto mode = words[at++];
    Word row = 0, value = 0;
    const auto store = [&](Word input) {
      if (field == 0 || field == 3) {
        if (input > session_count)
          return false;
        input = input ? sessions[input - 1] : 0;
      } else if (field == 5)
        input = (input >> 1) ^ (0u - (input & 1));
      std::memcpy(reinterpret_cast<std::byte *>(&insertions[row++].insertion.coordinates) +
                      field * sizeof(Word),
                  &input, sizeof(Word));
      return true;
    };
    if (!mode) {
      while (row < count)
        if (!store(words[at++]))
          return false;
    } else {
      if (mode == 3) {
        value = words[at++];
        if (!store(value))
          return false;
      }
      while (row < count) {
        const auto length = words[at++], next = words[at++];
        const auto delta = (next >> 1) ^ (0u - (next & 1));
        for (Word i = 0; i < length; ++i) {
          value = mode == 3 ? value + delta : next;
          if (!store(value))
            return false;
        }
      }
    }
  }
  return true;
}
} // namespace sequencer
