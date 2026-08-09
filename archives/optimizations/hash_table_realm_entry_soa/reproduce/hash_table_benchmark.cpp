#include "../../../../src/c++/classes/hash_table/index.hpp"
#include <cstdint>
#include <memory>

#include <emscripten/emscripten.h>

static constexpr std::uint32_t crypto_random_bits = 0x1234'5600u;
static constexpr std::uint32_t unix_lower_bits = 0x89ab'cdefu;
static std::unique_ptr<HashTable> hash_table;
static std::uint32_t entry_count;

static inline SequencePoint point(const std::uint32_t counter_bits) noexcept {
  return {crypto_random_bits, unix_lower_bits, counter_bits};
}

extern "C" {

EMSCRIPTEN_KEEPALIVE std::uint32_t
populate(const std::uint32_t count) noexcept {
  hash_table = std::make_unique<HashTable>();
  entry_count = count;
  for (std::uint32_t index = 0; index < count; ++index)
    hash_table->set(point(index), 1u, index);
  return hash_table->get(point(count - 1u));
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
initialize_spaced(const std::uint32_t count) noexcept {
  hash_table = std::make_unique<HashTable>();
  entry_count = count;
  for (std::uint32_t index = 0; index < count; ++index)
    hash_table->set(point(index << 1), 1u, index);
  return hash_table->get(point((count - 1u) << 1));
}

EMSCRIPTEN_KEEPALIVE std::uint32_t insert_middle() noexcept {
  const std::uint32_t counter_bits = entry_count | 1u;
  hash_table->set(point(counter_bits), 1u, entry_count);
  return hash_table->get(point(counter_bits));
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
lookup_random_batch(const std::uint32_t iterations,
                    std::uint32_t random_state) noexcept {
  std::uint32_t checksum = 0;
  for (std::uint32_t iteration = 0; iteration < iterations; ++iteration) {
    random_state ^= random_state << 13;
    random_state ^= random_state >> 17;
    random_state ^= random_state << 5;
    checksum ^= hash_table->get(point(random_state % entry_count));
  }
  return checksum;
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
lookup_hot_batch(const std::uint32_t iterations) noexcept {
  std::uint32_t checksum = 0;
  const std::uint32_t first = entry_count >> 1;
  for (std::uint32_t iteration = 0; iteration < iterations; ++iteration)
    checksum ^= hash_table->get(point(first + (iteration & 15u)));
  return checksum;
}

}
