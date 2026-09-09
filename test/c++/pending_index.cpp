#include "../../src/c++/.declarations/projector/index.hpp"
#include <cassert>
#include <cstdint>
#include <vector>

int main() {
  PendingIndex index;
  assert(index.is_empty());
  assert(index.get({1, 2, 10}, 5).empty());
  assert(index.take({1, 2, 10}, 5).empty());
  assert(!index.erase({1, 2, 10}, 7));

  index.set({1, 2, 14}, 40);
  index.set({1, 2, 10}, 7);
  index.set({1, 2, 10}, 8);
  index.set({1, 2, 10}, 7);
  index.set({1, 2, 9}, 90);
  index.set({1, 2, 15}, 50);
  index.set({1, 3, 10}, 60);
  index.set({2, 2, 10}, 70);

  assert(!index.is_empty());
  assert((index.get({1, 2, 10}, 5) == std::vector<std::uint32_t>{7, 8, 40}));
  assert(index.get({1, 2, 10}, 0).empty());
  assert(index.take({1, 2, 10}, 0).empty());
  assert(!index.erase({1, 2, 10}, 99));
  assert(index.erase({1, 2, 10}, 7));
  assert(!index.erase({1, 2, 10}, 7));
  assert((index.get({1, 2, 10}, 1) == std::vector<std::uint32_t>{8}));
  assert((index.take({1, 2, 10}, 5) == std::vector<std::uint32_t>{8, 40}));
  assert(index.take({1, 2, 10}, 5).empty());
  assert((index.get({1, 2, 0}, 20) == std::vector<std::uint32_t>{90, 50}));
  assert((index.take({1, 3, 10}, 1) == std::vector<std::uint32_t>{60}));
  assert((index.take({2, 2, 10}, 1) == std::vector<std::uint32_t>{70}));
  assert(index.erase({1, 2, 9}, 90));
  assert(index.erase({1, 2, 15}, 50));
  assert(index.is_empty());

  index.set({1, 2, u32_max}, 100);
  index.set({1, 2, u32_max - 1}, 101);
  index.set({1, 2, 0}, 102);
  index.set({1, 3, 0}, 103);
  assert((index.get({1, 2, u32_max - 1}, 1) ==
          std::vector<std::uint32_t>{101}));
  assert((index.take({1, 2, u32_max - 1}, 2) ==
          std::vector<std::uint32_t>{101, 100}));
  index.set({1, 2, u32_max}, 100);
  assert((index.take({1, 2, u32_max}, 10) ==
          std::vector<std::uint32_t>{100}));
  assert((index.take({1, 2, 0}, 1) == std::vector<std::uint32_t>{102}));
  assert((index.take({1, 3, 0}, 1) == std::vector<std::uint32_t>{103}));
  assert(index.is_empty());

  Projector projector;
  projector.pending_index.set({5, 6, 12}, 3);
  assert((projector.pending_index.take({5, 6, 10}, 5) ==
          std::vector<std::uint32_t>{3}));
  projector.pending_index.set({7, 8, 20}, 4);
  assert((projector.pending_index.take({7, 8, 20}, 1) ==
          std::vector<std::uint32_t>{4}));
  assert(projector.pending_index.is_empty());
}
