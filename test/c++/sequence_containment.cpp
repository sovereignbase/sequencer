#include "../../src/c++/.auxiliary/strip_contains_previous_strip_end/index.hpp"
#include "../../src/c++/.containment_table/index.hpp"
#include "../../src/c++/.pending_table/index.hpp"
#include <array>
#include <cassert>
#include <cstdint>
#include <vector>

int main() {
  constexpr std::array counters{0u, 1u, 2u, 3u, 4u, 5u, 16u, 17u, 18u, 19u,
                                20u, 21u, 22u, u32_max - 5, u32_max - 4,
                                u32_max - 3, u32_max - 2, u32_max - 1, u32_max};
  for (const auto start : counters) {
    for (std::uint32_t length = 0; length <= 4; ++length) {
      if (length > u32_max - start)
        continue;
      const SequencePoint point{7, 8, start};
      ContainmentTable containment;
      PendingTable pending;
      containment.set(point, length, 42);
      std::vector<std::uint32_t> expected;
      std::vector<std::uint32_t> remaining;
      for (std::uint32_t index = 0; index < counters.size(); ++index) {
        const SequencePoint candidate{7, 8, counters[index]};
        pending.set(candidate, index);
        const bool contained = counters[index] >= start &&
            static_cast<std::uint64_t>(counters[index]) <=
                static_cast<std::uint64_t>(start) + length;
        const auto found = containment.get(candidate);
        const auto offset =
            strip_contains_previous_strip_end(point, length, candidate);
        assert(found.first == (contained ? 42u : u32_max));
        assert(found.second == (contained ? counters[index] - start : u32_max));
        assert(offset == found.second);
        (contained ? expected : remaining).push_back(index);
      }
      containment.for_each_realm([&](const SequencePoint realm, const auto entries) {
        assert((realm == SequencePoint{7, 8, 0}));
        assert(entries.size() == 1);
        assert(entries[0].frame_count == length);
      });
      for (const SequencePoint other : {SequencePoint{9, 8, start},
                                        SequencePoint{7, 9, start}}) {
        assert(containment.get(other).first == u32_max);
        assert(strip_contains_previous_strip_end(point, length, other) == u32_max);
        assert(pending.get(other, length).empty());
      }
      assert(pending.get(point, length) == expected);
      assert(pending.take(point, length) == expected);
      assert(pending.get(point, length).empty());
      assert(pending.get({7, 8, 0}, u32_max) == remaining);
      assert(containment.erase(point));
      assert(containment.is_empty());
    }
  }
}
