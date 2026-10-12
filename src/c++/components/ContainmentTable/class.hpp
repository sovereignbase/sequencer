#pragma once
#include "../../types/type.hpp"

namespace sequencer {
class ContainmentTable {
  struct Slot {
    Word session{}, start{};
    Index strip{};
  };
  std::vector<Slot> slots;
  Word count{};
  static Word hash(Word session, Word start) {
    Word h = session * 0x9e3779b9u + start;
    h = (h ^ (h >> 16)) * 0x85ebca6bu;
    h = (h ^ (h >> 13)) * 0xc2b2ae35u;
    return h ^ (h >> 16);
  }

public:
  Word size() const { return count; }
  Index get(Word session, Word start) const {
    if (slots.empty())
      return none;
    const auto mask = Word(slots.size() - 1);
    for (auto at = hash(session, start) & mask; slots[at].strip; at = (at + 1) & mask)
      if (slots[at].session == session && slots[at].start == start)
        return slots[at].strip;
    return none;
  }
  bool has(const Coordinates &c) const { return get(c.session, c.start) != none; }
  void set(const Coordinates &c, Index strip) {
    if ((count + 1) * 4 > slots.size() * 3) {
      std::vector<Slot> grown(std::max(std::size_t(8), slots.size() * 2));
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
    const auto mask = Word(slots.size() - 1);
    auto at = hash(c.session, c.start) & mask;
    while (slots[at].strip && (slots[at].session != c.session || slots[at].start != c.start))
      at = (at + 1) & mask;
    count += slots[at].strip == none;
    slots[at] = {c.session, c.start, strip};
  }
};
} // namespace sequencer
