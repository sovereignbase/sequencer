#pragma once
#include "../../types/type.hpp"
#include <algorithm>
#include <unordered_map>
#include <unordered_set>

namespace sequencer {
class ContainmentTable {
  std::unordered_map<std::uint64_t, Index> strips;

public:
  Index get(Word session, Word start) const {
    auto it = strips.find(identity(session, start));
    return it == strips.end() ? none : it->second;
  }
  bool has(const Coordinates &c) const { return get(c.session, c.start) != none; }
  void set(const Coordinates &c, Index strip) { strips[identity(c.session, c.start)] = strip; }
};
} // namespace sequencer
