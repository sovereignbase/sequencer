#pragma once
#include "../../types/type.hpp"

namespace sequencer {
/** Resolves visible positions through block weights without changing Structural Order. */
class Traversal {
  struct Metadata {
    /** First free row, occupied count, logical first row and visible weight before it. */
    Word gap{}, count{}, head{}, before{};
  };
  static_assert(sizeof(Metadata) == TraversalLayout::header * sizeof(Word));
  struct Block {
    Word frames;
    Index first, last;
    Word count;
    Index id;
  };
  struct Record {
    Index first, last;
    Word count, ordinal;
  };
  static_assert(sizeof(Record) == 4 * sizeof(Word));
  /** Borrowed arena storage; node growth refreshes this view before releasing the old arena. */
  Word *data{};
  Word capacity{};
  Metadata &metadata() const {
    return *reinterpret_cast<Metadata *>(data - TraversalLayout::header);
  }
  Record *records() const { return reinterpret_cast<Record *>(data + 2 * capacity); }
  Block block(Word at) const;
  void block(Word at, const Block &value);
  void move(Word destination, Word source);
  void rebuild();
  [[gnu::noinline]] void rebuild(Word start, Word count);
  void clear(Word start, Word count);
  Word prefix(Word end) const;
  void add(Word at, Word delta);
  void split(Strips &strips, Index first, Index incoming);

public:
  /** Builds deferred weights before the first lookup outside retained endpoints. */
  void prepare(Strips &strips, Index first, Word linked);
  /** Rebinds the directory after arena growth while its former allocation remains alive. */
  void grow(Strips &strips);
  /** Builds weights from linked history and returns its visible head and tail. */
  std::pair<Index, Index> build(Strips &strips, Index first, Word linked);
  /** Indexes a linked node, optionally transferring positive weight from its left neighbor. */
  void insert(Strips &strips, Index first, Word linked, Index incoming, Word transferred = 0);
  /** Replaces one linked node's positive contribution after its signed effect changes. */
  void update(const Strips &strips, Index node, std::int32_t previous);
  /** Returns a linked node's visible boundary without moving the retained gate. */
  Word position(const Strips &strips, Index first, Index node, Word frames) const;
  /** Returns the unique visible owner and its absolute visible start. */
  std::pair<Index, Word> find(const Strips &strips, Index first, Word position, Word frames) const;
};
} // namespace sequencer
