#pragma once
#include "../ContainmentTable/class.hpp"

namespace sequencer {
/** Stable-index candidate storage; Projection owns replication and Session clocks. */
class Tuple {
public:
  static constexpr Index no_version = UINT32_MAX;
  struct Slot {
    /** Winning Version offset and active-chain head; no_version means empty. */
    Index winner{no_version}, head{no_version};
  };
  struct Version {
    Coordinates coordinates;
    Word content{}, content_start{};
    /** Next active candidate at the same stable index. */
    Index next{no_version};
    /** Binding state when this Version owns its Footage token. */
    FootageState footage_state{};
    /** Active candidate status and membership in a shared local Footage binding. */
    bool active{}, shared{};
  };
  struct Binding {
    Word references{}, extent{};
    /** Binding state shared by all Versions referencing this local batch. */
    FootageState footage_state{};
    bool owned{};
  };
  static_assert(sizeof(Version) == 40 && sizeof(Binding) == 12);
  static_assert(offsetof(Version, footage_state) % sizeof(Word) == 0 &&
                offsetof(Binding, footage_state) % sizeof(Word) == 0);
  // Fixed tuples allocate one dense table. Dynamic tuples allocate only touched pages.
  static constexpr Word page_size = 256;
  struct Page {
    Word number;
    std::array<Slot, page_size> slots{};
  };
  std::vector<Slot> slots;
  ContainmentTable page_index, binding_index;
  std::vector<Page> pages;
  /** Version offsets are zero-based; canonical root handles are one-based. */
  std::vector<Version> versions;
  std::vector<Binding> bindings;
  /** Registers shared local Footage without a separate hash-table implementation.
   * @param content JavaScript Footage binding token.
   * @param count Number of Versions sharing the binding.
   */
  void share(Word content, Word count);
  /** Finds or allocates the addressed register.
   * @param at Valid tuple index.
   * @return Register at that index.
   */
  Slot &slot(Word at);
  /** Looks up a valid register without allocating a dynamic page.
   * @param at Valid tuple index.
   * @return Register, or nullptr when its dynamic page is absent.
   */
  const Slot *find_slot(Word at) const;
  /** Resolves the winning Version at a valid tuple index.
   * @param at Valid tuple index.
   * @return Zero-based Version offset, or no_version.
   */
  Index winner(Word at) const;
  /** Retains history and links positive Versions at their stable index.
   * @param insertion Valid canonical Insertion.
   * @param shared Whether its Footage belongs to a registered shared binding.
   * @return One-based canonical root handle.
   */
  Index add(Insertion insertion, bool shared = false);
  /** Unlinks an observed Version and defers Footage release to the ABI result.
   * @param root One-based canonical root handle.
   * @param released Output bindings or ranges whose values can be released.
   * @param copied Output shared bindings requiring a private copy before release.
   */
  void erase(Index root, std::vector<Span> &released, std::vector<Span> &copied);
  /** Lists nonempty registers without scanning absent pages.
   * @param start First tuple index, inclusive.
   * @param end Last tuple index, inclusive; clipped to fixed capacity.
   * @return Indices with active Versions; dynamic page order is retained.
   */
  std::vector<Word> occupied(Word start, Word end) const;
  /** UINT32_MAX denotes dynamic capacity. Projection retains the visible index extent. */
  const Word capacity;
  explicit Tuple(Word capacity);
  /** Checks external coordinates before any history or Acknowledgement changes.
   * @param coordinates Incoming Insertion coordinates.
   * @param containment Known canonical roots for checking removal targets.
   * @return Whether the coordinates satisfy tuple insertion and removal rules.
   */
  bool valid(const Coordinates &coordinates, const ContainmentTable &containment) const;
  /** Reads the winning Version at a valid tuple index.
   * @param at Valid tuple index.
   * @return Footage span, or an absent span for an empty register.
   */
  Span value(Word at) const;
};
} // namespace sequencer
