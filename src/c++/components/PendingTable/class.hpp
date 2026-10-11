#pragma once
#include "../../types/type.hpp"
#include <algorithm>
#include <unordered_map>
#include <unordered_set>

namespace sequencer {
class PendingTable {
  std::unordered_map<std::uint64_t, std::vector<Insertion>> buckets;
public:
  void set(Insertion i) {
    buckets[identity(i.coordinates.anchor_session, i.coordinates.anchor_start)].push_back(i);
  }
  std::vector<Insertion> take(const Coordinates& c) {
    auto it = buckets.find(identity(c.session, c.start));
    if (it == buckets.end()) return {};
    auto entries = std::move(it->second);
    buckets.erase(it);
    return entries;
  }
  std::size_t size() const { return buckets.size(); }
};
}
