#pragma once
#include <array>
#include <bit>
#include <cstdint>
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
};
static_assert(sizeof(Coordinates) == 6 * sizeof(Word));
inline std::uint64_t identity(Word session, Word start) {
  return (std::uint64_t(session) << 32) | start;
}
struct Insertion { Coordinates coordinates; Word content{}; };
using Acknowledgement = std::vector<Word>;
struct Entry {
  bool acknowledgement{};
  Insertion insertion{};
  Acknowledgement frontier;
  static Entry insert(Insertion i) { return {false, i, {}}; }
  static Entry acknowledge(Acknowledgement a) { return {true, {}, std::move(a)}; }
};
using Gossip = std::vector<Entry>;
struct Span { Word content{}, start{}, count{}; };
struct Splice { Word start{}, end{}; std::vector<Span> values; };
struct Result { std::vector<Splice> changes; Gossip gossip; };
struct ExportInsertion { Coordinates coordinates; std::vector<Span> footage; };
struct Sequence { std::vector<Acknowledgement> frontiers; std::vector<ExportInsertion> insertions; };

// Links are arena indices: growth cannot invalidate links, there are no
// per-fragment heap objects, and all fields fit wasm32 loads/stores.
struct Strip {
  Coordinates coordinates;
  Word content{};
  Word fragment_start{};
  std::int32_t fragment_diff{};
  bool fragmented{};
  bool offset{};
  Index left{}, right{}, competitor{}, fragment{};
  Index left_jump{}, right_jump{};
  Word left_jump_frames{}, left_jump_strips{}, right_jump_frames{}, right_jump_strips{};
  std::int32_t effect() const { return fragmented ? fragment_diff : coordinates.diff; }
};
}
