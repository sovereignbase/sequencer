#pragma once
#include "../../types/type.hpp"
#include <algorithm>
#include <unordered_map>
#include <unordered_set>

namespace sequencer {
/** Holds canonical operations until their parent's required logical extent exists. */
class PendingTable {
  // A bucket uses the missing parent identity, not the incoming operation identity.
  std::unordered_map<std::uint64_t, std::vector<Insertion>> buckets;

public:
  /** Retains an operation without allocating a linked Strip.
   * @param i Unresolved Insertion; Footage is retained through its numeric binding token.
   */
  void set(Insertion i) {
    buckets[identity(i.coordinates.anchor_session, i.coordinates.anchor_start)].push_back(i);
  }
  /** Removes the waiters for a materialized or extended parent.
   * @param c Parent coordinates whose Session/start key has become available.
   * @return Waiters in arrival order; apply preserves that order with a reversed stack push.
   */
  std::vector<Insertion> take(const Coordinates &c) {
    auto it = buckets.find(identity(c.session, c.start));
    if (it == buckets.end())
      return {};
    auto entries = std::move(it->second);
    buckets.erase(it);
    return entries;
  }
  /** Counts unresolved canonical parent identities.
   * @return Dependency bucket count, not waiting operation count.
   */
  std::size_t size() const { return buckets.size(); }
};
} // namespace sequencer
