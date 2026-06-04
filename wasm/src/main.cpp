
#include <cstdint>

#include "unordered_map"

#include "./types/types.hpp"

static std::unordered_map<Key, State, KeyHash> instances;

extern "C" {
std::uint32_t read(std::uint32_t a, std::uint32_t b, std::uint32_t c,
                   std::uint32_t d, std::uint32_t index) {
auto it = instances.find(Key{a, b, c, d});

if (it == instances.end()) {
  return 0;
}
State& state = it->second;


}

void overwrite() { return; }

void merge(std::uint32_t a, std::uint32_t b, std::uint32_t c, std::uint32_t d,
           std::uint32_t length) {

  return;
}
}
