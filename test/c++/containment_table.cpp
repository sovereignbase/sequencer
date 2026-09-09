#include "../../src/c++/.containment_table/index.hpp"
#include <cassert>
#include <cstdint>
#include <utility>

int main() {
  const std::pair<std::uint32_t, std::uint32_t> absent{u32_max, u32_max};
  ContainmentTable table(8);
  assert(table.get({7, 1, 0}) == absent);
  table.set({7, 1, 10}, 3, 91);
  assert((table.get({7, 1, 10}) == std::pair{91u, 0u}));
  assert((table.get({7, 1, 12}) == std::pair{91u, 2u}));
  assert(table.get({7, 1, 9}) == absent);
  assert((table.get({7, 1, 13}) == std::pair{91u, 3u}));
  assert(table.get({7, 1, 14}) == absent);
  table.set({7, 1, 30}, 4, 0);
  table.set({7, 1, 20}, 2, 82);
  table.set({7, 1, 10}, 2, 73);
  assert((table.get({7, 1, 10}) == std::pair{73u, 0u}));
  assert((table.get({7, 1, 12}) == std::pair{73u, 2u}));
  assert(table.get({7, 1, 13}) == absent);
  assert((table.get({7, 1, 21}) == std::pair{82u, 1u}));
  assert((table.get({7, 1, 33}) == std::pair{0u, 3u}));
  assert(!table.erase({7, 1, 11}));
  assert(table.erase({7, 1, 20}));
  assert(table.get({7, 1, 20}) == absent);

  ContainmentTable batch(2);
  for (std::uint32_t realm_id = 0; realm_id < 80; ++realm_id) {
    batch.set({7, realm_id, 20}, 7, realm_id * 2, true);
    batch.set({7, realm_id, 0}, 3, realm_id * 2 + 1, true);
  }
  batch.sort_realms();
  for (std::uint32_t realm_id = 0; realm_id < 80; ++realm_id) {
    assert((batch.get({7, realm_id, 26}) ==
            std::pair{realm_id * 2, 6u}));
    assert((batch.get({7, realm_id, 2}) ==
            std::pair{realm_id * 2 + 1, 2u}));
    assert((batch.get({7, realm_id, 3}) ==
            std::pair{realm_id * 2 + 1, 3u}));
    assert(batch.get({7, realm_id, 4}) == absent);
  }
  for (std::uint32_t realm_id = 0; realm_id < 80; realm_id += 2) {
    assert(batch.erase({7, realm_id, 0}));
    assert(batch.erase({7, realm_id, 20}));
  }
  for (std::uint32_t realm_id = 1; realm_id < 80; realm_id += 2) {
    assert((batch.get({7, realm_id, 26}) ==
            std::pair{realm_id * 2, 6u}));
    assert(batch.erase({7, realm_id, 0}));
    assert(batch.erase({7, realm_id, 20}));
  }
  assert(batch.is_empty());
  batch.set({7, 1, u32_max - 2}, 2, 0);
  assert((batch.get({7, 1, u32_max}) == std::pair{0u, 2u}));
}
