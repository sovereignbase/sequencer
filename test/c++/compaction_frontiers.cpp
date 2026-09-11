#include "../../src/c++/algorithms/compact.hpp"
#include <cassert>
#include <vector>

using Frontiers = std::vector<std::vector<std::uint32_t>>;

static auto select(const Frontiers &frontiers) {
  std::vector<std::uint32_t> words;
  for (const auto &frontier : frontiers) {
    words.insert(words.end(), {static_cast<std::uint32_t>(frontier.size() / 3), 0, 0});
    words.insert(words.end(), frontier.begin(), frontier.end());
  }
  return sequencer::select_compaction_frontiers(words, static_cast<std::uint32_t>(frontiers.size()));
}

int main() {
  const auto realm = [](const std::uint32_t crypto, const std::uint32_t unix_bits) {
    return (std::uint64_t{crypto} << 32) | unix_bits;
  };
  const auto check = [&](const Frontiers &frontiers) {
    std::unordered_map<std::uint64_t, std::uint32_t> expected;
    if (!frontiers.empty())
      for (std::size_t point = 0; point < frontiers.front().size(); point += 3) {
        const auto &first = frontiers.front();
        bool shared = true;
        for (const auto &frontier : frontiers) {
          bool found = false;
          for (std::size_t offset = 0; offset < frontier.size(); offset += 3)
            if (first[point] == frontier[offset] && first[point + 1] == frontier[offset + 1] &&
                first[point + 2] == frontier[offset + 2])
              found = true;
          shared = shared && found;
        }
        if (shared)
          expected.emplace(realm(first[point], first[point + 1]), first[point + 2]);
      }
    assert(select(frontiers) == expected);
  };
  check({});
  check({{}});
  check({{10, 20, 8}, {}});
  check({{}, {10, 20, 8}});
  check({{10, 20, 8, 30, 40, 12}});
  check({{10, 20, 8, 30, 40, 12}, {30, 40, 12, 10, 20, 8}, {10, 20, 8, 30, 40, 12}});
  check({{10, 20, 8}, {10, 20, 7}});
  check({{10, 20, 8}, {10, 20, 9}});
  check({{10, 20, 8, 30, 40, 12}, {10, 20, 8}, {30, 40, 12}});
  check({{10, 20, 8, 30, 40, 12, 50, 60, 16}, {50, 60, 17, 10, 20, 8, 90, 91, 32},
         {10, 20, 8, 30, 40, 12}});
  check({{10, 20, 8}, {10, 21, 8}});
  check({{10, 20, 8}, {11, 20, 8}});
  check({{1u << 21, 0, 8}, {1u << 21, 1, 8}});
  check({{u32_max, u32_max - 1, 8}, {u32_max, u32_max, 8}});
  assert(select({{10, 20, 8}, {10, 20, 8, 10, 20, 8}, {10, 20, 8}}).at(realm(10, 20)) == 8);
  assert(select({{10, 20, 8}, {10, 20, 8, 10, 20, 9}, {10, 20, 8}}).empty());

  std::uint32_t random = 12345;
  const auto next = [&]() { return random = random * 1664525u + 1013904223u; };
  for (std::uint32_t trial = 0; trial < 100; ++trial) {
    Frontiers frontiers(next() % 5 + 1);
    for (auto &frontier : frontiers)
      for (std::uint32_t point = 0; point < 12; ++point) {
        if (next() % 5 == 0)
          continue;
        const auto counter = next() % 3 == 0 ? next() % 20 + 1 : 8;
        frontier.insert(frontier.end(), {point % 3, point / 3, counter});
      }
    check(frontiers);
  }

  Frontiers large(8);
  for (auto &frontier : large)
    for (std::uint32_t point = 0; point < 10000; ++point)
      frontier.insert(frontier.end(), {point, u32_max - point, 8});
  assert(select(large).size() == 10000);
}
