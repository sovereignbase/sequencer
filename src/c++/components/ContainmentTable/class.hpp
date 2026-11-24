#pragma once
#include "../../types/type.hpp"
#include <span>
#include <type_traits>

namespace sequencer {
/** Maps exact coordinate pairs or individual identifiers to nonzero values. */
template <bool Paired = true> class IdentityTable {
  struct NoStart {};
  /** Open-addressed identity slot; value zero marks unused storage. */
  struct Slot {
    Word session{};
    [[no_unique_address]] std::conditional_t<Paired, Word, NoStart> start{};
    Word value{};
  };
  static_assert(sizeof(Slot) == (Paired ? 12 : 8));
  // Power-of-two capacity permits masked probing; entries are never erased from live history.
  std::unique_ptr<Slot[]> slots;
  Word count{};
  std::size_t mask{}; /**< Slot count minus one; zero denotes empty storage. */
  static Word start_of(const Slot &slot) {
    if constexpr (Paired)
      return slot.start;
    else
      return 0;
  }
  /** Mixes both identity lanes for placement; exact comparison still resolves collisions. */
  static Word hash(Word session, Word start) {
    Word h = session * 0x9e3779b9u + start;
    h = (h ^ (h >> 16)) * 0x85ebca6bu;
    h = (h ^ (h >> 13)) * 0xc2b2ae35u;
    return h ^ (h >> 16);
  }

public:
  /** Reserves slots before admitting a known key count.
   * @param capacity Required entry count.
   */
  void reserve(Word capacity) {
    if (std::size_t(capacity) * 4 <= (mask + 1) * 3)
      return;
    auto size = std::max(std::size_t(2), mask + 1);
    while (std::size_t(capacity) * 4 > size * 3)
      size *= 2;
    auto grown = std::make_unique<Slot[]>(size);
    const auto grown_mask = size - 1;
    for (const auto &slot : std::span(slots.get(), mask ? mask + 1 : 0))
      if (slot.value) {
        auto at = hash(slot.session, start_of(slot)) & grown_mask;
        while (grown[at].value)
          at = (at + 1) & grown_mask;
        grown[at] = slot;
      }
    slots = std::move(grown);
    mask = grown_mask;
  }
  /** Counts stored keys.
   * @return Stored key count.
   */
  Word size() const { return count; }
  bool empty() const { return !count; }
  bool contains(Word session) const
    requires(!Paired)
  {
    return get(session) != none;
  }
  /** Finds the value for an exact key.
   * @param session Identifier or authoring Session.
   * @param start Logical Insertion start for paired keys.
   * @return Nonzero mapped value, or zero when absent.
   */
  Word get(Word session, Word start = 0) const {
    if (!mask)
      return none;
    for (auto at = hash(session, Paired ? start : 0) & mask; slots[at].value; at = (at + 1) & mask)
      if (slots[at].session == session && start_of(slots[at]) == (Paired ? start : 0))
        return slots[at].value;
    return none;
  }
  /** Registers or replaces a key's mapped value.
   * @param c Coordinates supplying the identifier and optional start.
   * @param value Nonzero mapped value.
   */
  void set(const Coordinates &c, Word value) {
    // Retain an empty probe slot by growing before the table exceeds 75% occupancy.
    if ((count + 1) * 4 > (mask + 1) * 3 && !get(c.session, c.start))
      reserve(count + 1);
    auto at = hash(c.session, Paired ? c.start : 0) & mask;
    while (slots[at].value &&
           (slots[at].session != c.session || start_of(slots[at]) != (Paired ? c.start : 0)))
      at = (at + 1) & mask;
    count += slots[at].value == none;
    slots[at].session = c.session;
    if constexpr (Paired)
      slots[at].start = c.start;
    slots[at].value = value;
  }
};
/** Canonical identities map to roots; fragments do not have separate identities. */
using ContainmentTable = IdentityTable<>;
/** One-word identifiers map to nonzero states or admission indices. */
using WordTable = IdentityTable<false>;
} // namespace sequencer
