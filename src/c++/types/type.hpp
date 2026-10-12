#pragma once
#include <algorithm>
#include <array>
#include <bit>
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <memory>
#include <vector>

namespace sequencer {
using Word = std::uint32_t;
using Index = Word;
constexpr Index none = 0;

// The replication identity is always exactly six words. Content is an opaque
// main-thread binding, never a value or a second coordinate space.
struct Coordinates {
  Word anchor_session{}, anchor_start{}, anchor_diff{}, session{}, start{};
  std::int32_t diff{};
  bool birth() const { return !(anchor_session | anchor_start | anchor_diff); }
  bool extension() const {
    return diff > 0 && session == anchor_session && start == anchor_start + anchor_diff;
  }
};
static_assert(sizeof(Coordinates) == 6 * sizeof(Word));
inline std::uint64_t identity(Word session, Word start) {
  return (std::uint64_t(session) << 32) | start;
}
struct Insertion {
  Coordinates coordinates;
  Word content{};
  Word content_start{};
  bool content_owned{};
};
using Acknowledgement = std::vector<Word>;
struct Entry {
  bool acknowledgement{};
  Insertion insertion{};
  Acknowledgement frontier;
  static Entry insert(Insertion i) { return {false, i, {}}; }
  static Entry acknowledge(Acknowledgement a) { return {true, {}, std::move(a)}; }
};
using Gossip = std::vector<Entry>;
struct Span {
  Word content{}, start{}, count{};
};
struct ContentAppend {
  Word target{}, source{}, start{}, count{}, at{}, base{};
};
struct Splice {
  Word start{}, end{};
  std::vector<Span> values;
};
struct Result {
  std::vector<Splice> changes;
  Gossip gossip;
};
struct Sequence {
  std::vector<Word> words;
  std::vector<Span> footage;
};

// Links are arena indices: growth cannot invalidate links, there are no
// per-fragment heap objects, and all fields fit wasm32 loads/stores.
struct Strips {
  std::unique_ptr<std::byte[]> memory;
  Word count{}, capacity{};
  Insertion *identity{};
  Word *fragment_start{};
  std::int32_t *fragment_diff{};
  Index *left{}, *right{}, *competitor{}, *fragment{}, *left_jump{}, *right_jump{};
  Word *left_jump_frames{}, *left_jump_strips{}, *right_jump_frames{}, *right_jump_strips{};
  std::uint8_t *fragmented{}, *offset{};

  Strips() { append({}); }
  void reserve(Word next) {
    if (next <= capacity)
      return;
    constexpr Word lanes = 12;
    auto grown = std::make_unique_for_overwrite<std::byte[]>(
        (sizeof(Insertion) + lanes * sizeof(Word) + 2) * next);
    auto *identities = reinterpret_cast<Insertion *>(grown.get());
    auto *fields = reinterpret_cast<Word *>(identities + next);
    auto *bits = reinterpret_cast<std::uint8_t *>(fields + lanes * next);
    if (count) {
      std::memcpy(identities, identity, count * sizeof(Insertion));
      auto *old = reinterpret_cast<Word *>(identity + capacity);
      for (Word field = 0; field < lanes; ++field)
        std::memcpy(fields + field * next, old + field * capacity, count * sizeof(Word));
      std::memcpy(bits, fragmented, count);
      std::memcpy(bits + next, offset, count);
    }
    memory = std::move(grown);
    capacity = next;
    identity = identities;
    fragment_start = fields;
    fragment_diff = reinterpret_cast<std::int32_t *>(fields + next);
    left = fields + 2 * next;
    right = fields + 3 * next;
    competitor = fields + 4 * next;
    fragment = fields + 5 * next;
    left_jump = fields + 6 * next;
    right_jump = fields + 7 * next;
    left_jump_frames = fields + 8 * next;
    left_jump_strips = fields + 9 * next;
    right_jump_frames = fields + 10 * next;
    right_jump_strips = fields + 11 * next;
    fragmented = bits;
    offset = bits + next;
  }
  Index append(Insertion insertion) {
    constexpr Word lanes = 12;
    if (count == capacity)
      reserve(std::max(Word(64), capacity * 2));
    const auto index = count++;
    std::construct_at(identity + index, insertion);
    auto *fields = reinterpret_cast<Word *>(identity + capacity);
    for (Word field = 0; field < lanes; ++field)
      std::construct_at(fields + field * capacity + index, Word(0));
    std::construct_at(fragmented + index, std::uint8_t(0));
    std::construct_at(offset + index, std::uint8_t(0));
    fragment_diff[index] = insertion.coordinates.diff;
    return index;
  }
};
} // namespace sequencer
