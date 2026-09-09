#include "../../src/c++/.declarations/projector/index.hpp"
#include <algorithm>
#include <array>
#include <cassert>
#include <cstdint>
#include <vector>

int main() {
  PendingTable index;
  assert(index.is_empty());
  assert(index.values().empty());
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

  auto pending_values = index.values();
  std::sort(pending_values.begin(), pending_values.end());
  assert((pending_values ==
          std::vector<std::uint32_t>{7, 8, 40, 50, 60, 70, 90}));
  assert(index.values().size() == 7);

  assert(!index.is_empty());
  assert((index.get({1, 2, 10}, 4) == std::vector<std::uint32_t>{7, 8, 40}));
  assert((index.get({1, 2, 10}, 5) == std::vector<std::uint32_t>{7, 8, 40, 50}));
  assert((index.get({1, 2, 10}, 0) == std::vector<std::uint32_t>{7, 8}));
  assert(index.take({1, 2, 11}, 0).empty());
  assert(!index.erase({1, 2, 10}, 99));
  assert(index.erase({1, 2, 10}, 7));
  assert(!index.erase({1, 2, 10}, 7));
  assert((index.get({1, 2, 10}, 1) == std::vector<std::uint32_t>{8}));
  assert((index.take({1, 2, 10}, 0) == std::vector<std::uint32_t>{8}));
  assert((index.take({1, 2, 10}, 4) == std::vector<std::uint32_t>{40}));
  assert(index.take({1, 2, 10}, 4).empty());
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
  assert((index.get({1, 2, u32_max - 1}, 0) ==
          std::vector<std::uint32_t>{101}));
  assert((index.get({1, 2, u32_max - 1}, 1) ==
          std::vector<std::uint32_t>{101, 100}));
  assert((index.take({1, 2, u32_max - 1}, 1) ==
          std::vector<std::uint32_t>{101, 100}));
  index.set({1, 2, u32_max}, 100);
  assert((index.take({1, 2, u32_max}, 0) ==
          std::vector<std::uint32_t>{100}));
  assert((index.take({1, 2, 0}, 1) == std::vector<std::uint32_t>{102}));
  assert((index.take({1, 3, 0}, 1) == std::vector<std::uint32_t>{103}));
  assert(index.is_empty());

  Projector projector;
  projector.pending_table.set({5, 6, 12}, 3);
  assert((projector.pending_table.take({5, 6, 10}, 5) ==
          std::vector<std::uint32_t>{3}));
  projector.pending_table.set({7, 8, 20}, 4);
  assert((projector.pending_table.take({7, 8, 20}, 1) ==
          std::vector<std::uint32_t>{4}));
  assert(projector.pending_table.is_empty());

  PendingTable batch(8);
  batch.set({7, 1, 30}, 30, true);
  batch.set({7, 1, 10}, 10, true);
  batch.set({7, 1, 30}, 31, true);
  batch.set({7, 1, 20}, 20, true);
  batch.set({7, 1, 10}, 11, true);
  batch.sort_realms();
  auto matches = batch.get({7, 1, 10}, 21);
  std::sort(matches.begin(), matches.end());
  assert((matches == std::vector<std::uint32_t>{10, 11, 20, 30, 31}));
  batch.set({7, 1, 10}, 10);
  assert(batch.values().size() == 5);
  assert(batch.erase({7, 1, 10}));
  assert(!batch.erase({7, 1, 10}));
  assert(batch.get({7, 1, 10}, 1).empty());
  assert(batch.values().size() == 3);
  assert(batch.take({7, 1, 20}, 11).size() == 3);
  assert(batch.is_empty());
  assert(batch.values().empty());

  PendingTable growing(2);
  for (std::uint32_t realm_id = 0; realm_id < 80; ++realm_id) {
    growing.set({7, realm_id, 10}, realm_id * 2);
    growing.set({7, realm_id, 10}, realm_id * 2 + 1);
  }
  assert(growing.values().size() == 160);
  for (std::uint32_t realm_id = 0; realm_id < 80; realm_id += 2)
    assert(growing.erase({7, realm_id, 10}));
  for (std::uint32_t realm_id = 1; realm_id < 80; realm_id += 2) {
    assert((growing.get({7, realm_id, 10}, 1) ==
            std::vector<std::uint32_t>{realm_id * 2, realm_id * 2 + 1}));
    assert(growing.take({7, realm_id, 10}, 1).size() == 2);
  }
  assert(growing.is_empty());
  growing.set({7, 0, 10}, 42);
  assert((growing.values() == std::vector<std::uint32_t>{42}));

  for (std::uint32_t layout = 0; layout < 512; ++layout) {
    const std::array<SequencePoint, 3> points{{
        {layout & 7, 1, 10},
        {(layout >> 3) & 7, 2, 10},
        {(layout >> 6) & 7, 3, 10},
    }};
    std::array<std::uint32_t, 3> order{0, 1, 2};
    do {
      PendingTable clustered(8);
      std::array<bool, 3> present{true, true, true};
      for (const auto &point : points) {
        clustered.set(point, 5);
        clustered.set(point, 6);
      }
      for (const auto removed : order) {
        assert(clustered.erase(points[removed], 5));
        assert((clustered.get(points[removed], 1) ==
                std::vector<std::uint32_t>{6}));
        assert(clustered.erase(points[removed], 6));
        present[removed] = false;
        assert(!clustered.erase(points[removed]));
        for (std::uint32_t point_index = 0; point_index < points.size();
             ++point_index)
          assert(!clustered.get(points[point_index], 1).empty() ==
                 present[point_index]);
      }
      assert(clustered.is_empty());
    } while (std::next_permutation(order.begin(), order.end()));
  }
}
