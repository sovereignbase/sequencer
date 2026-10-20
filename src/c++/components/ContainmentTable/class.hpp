#pragma once
#include "../../types/type.hpp"

namespace sequencer {
/** Maps exact canonical identities to roots; runtime fragments are not separate identities. */
class ContainmentTable {
  /** Open-addressed identity slot; strip zero marks an unused slot. */
  struct Slot {
    Word session{}, start{};
    Index strip{};
  };
  // Power-of-two capacity permits masked probing; entries are never erased from live history.
  std::vector<Slot> slots;
  Word count{};
  /** Mixes both identity lanes for placement; exact comparison still resolves collisions. */
  static Word hash(Word session, Word start) {
    Word h = session * 0x9e3779b9u + start;
    h = (h ^ (h >> 16)) * 0x85ebca6bu;
    h = (h ^ (h >> 13)) * 0xc2b2ae35u;
    return h ^ (h >> 16);
  }

public:
  /** Reserves identity slots before hydrating a known record count.
   * @param capacity Required identity capacity, excluding fragments.
   */
  void reserve(Word capacity) {
    if (std::size_t(capacity) * 4 <= slots.size() * 3)
      return;
    auto size = std::max(std::size_t(8), slots.size());
    while (std::size_t(capacity) * 4 > size * 3)
      size *= 2;
    std::vector<Slot> grown(size);
    const auto mask = Word(grown.size() - 1);
    for (const auto &slot : slots)
      if (slot.strip) {
        auto at = hash(slot.session, slot.start) & mask;
        while (grown[at].strip)
          at = (at + 1) & mask;
        grown[at] = slot;
      }
    slots = std::move(grown);
  }
  /** Counts materialized canonical identities.
   * @return Root count, excluding fragments and pending operations.
   */
  Word size() const { return count; }
  /** Finds the root for an exact identity.
   * @param session Authoring Session, not the anchor Session.
   * @param start Logical Insertion start.
   * @return Canonical root index, or none when not materialized.
   */
  Index get(Word session, Word start) const {
    if (slots.empty())
      return none;
    const auto mask = Word(slots.size() - 1);
    for (auto at = hash(session, start) & mask; slots[at].strip; at = (at + 1) & mask)
      if (slots[at].session == session && slots[at].start == start)
        return slots[at].strip;
    return none;
  }
  /** Tests materialization independently of anchor coordinates and Footage.
   * @param c Coordinates whose authoring identity is queried.
   * @return Whether that canonical Insertion has a root.
   */
  bool has(const Coordinates &c) const { return get(c.session, c.start) != none; }
  /** Registers or replaces an identity's canonical root.
   * @param c Coordinates supplying Session and start.
   * @param strip Nonzero materialized root index.
   */
  void set(const Coordinates &c, Index strip) {
    // Retain an empty probe slot by growing before the table exceeds 75% occupancy.
    if ((count + 1) * 4 > slots.size() * 3)
      reserve(count + 1);
    const auto mask = Word(slots.size() - 1);
    auto at = hash(c.session, c.start) & mask;
    while (slots[at].strip && (slots[at].session != c.session || slots[at].start != c.start))
      at = (at + 1) & mask;
    count += slots[at].strip == none;
    slots[at] = {c.session, c.start, strip};
  }
};
} // namespace sequencer
