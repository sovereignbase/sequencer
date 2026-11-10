#pragma once
#include "../ContainmentTable/class.hpp"

namespace sequencer {
/** Stable-index candidate storage; Projection owns replication and Session clocks. */
class Tuple {
public:
  struct Slot {
    /** Greatest active identity and head of the active candidate chain. */
    Index winner{}, head{};
  };
  struct Version {
    Coordinates coordinates;
    Word content{}, content_start{};
    /** Next active candidate at the same stable index. */
    Index next{};
    /** Active candidate status and membership in a shared local Footage binding. */
    bool active{}, shared{};
  };
  struct Binding {
    Word references{}, extent{};
    bool owned{};
  };
  // Fixed tuples allocate one dense table. Dynamic tuples allocate only touched pages.
  static constexpr Word page_size = 256;
  struct Page {
    Word number;
    std::array<Slot, page_size> slots{};
  };
  std::vector<Slot> slots;
  ContainmentTable page_index, binding_index;
  std::vector<Page> pages;
  std::vector<Version> versions{{}};
  std::vector<Binding> bindings;
  /** Registers shared local Footage without a separate hash-table implementation. */
  void share(Word content, Word count);
  /** Finds or allocates the addressed register. */
  Slot &slot(Word at);
  /** Looks up a register without allocating a dynamic page. */
  const Slot *find_slot(Word at) const;
  /** Returns the greatest active identity's pool index, or none. */
  Index winner(Word at) const;
  /** Retains canonical history and links positive versions into their register. */
  Index add(Insertion insertion, bool shared = false);
  /** Unlinks an observed version and defers Footage release to the ABI result. */
  void erase(Index target, std::vector<Span> &released, std::vector<Span> &copied);
  /** Lists nonempty registers in an inclusive range, without scanning absent pages. */
  std::vector<Word> occupied(Word start, Word end) const;
  /** UINT32_MAX denotes dynamic capacity. Projection retains the visible index extent. */
  const Word capacity;
  explicit Tuple(Word capacity);
  /** Checks external coordinates before any history or Acknowledgement changes. */
  bool valid(const Coordinates &coordinates, const ContainmentTable &containment) const;
  /** Returns an absent span for an empty register. */
  Span value(Word at) const;
};
} // namespace sequencer
