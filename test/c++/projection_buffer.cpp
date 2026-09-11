#include "../../src/c++/.buffers/projection_buffer/index.hpp"
#include <cassert>
#include <cstdint>

int main() {
  ProjectionBuffer buffer;
  assert(buffer.get_strip_count() == 0);
  assert(buffer.get_word_count() == 0);
  assert(buffer.get_memory_pointer() == nullptr);
  buffer.resize(3);
  const auto pointer = buffer.get_memory_pointer();
  for (std::uint32_t strip_index = 0; strip_index < 3; ++strip_index) {
    std::array<std::uint32_t, 12> words;
    for (std::uint32_t word_index = 0; word_index < 12; ++word_index)
      words[word_index] = 0x80000000u + strip_index * 12 + word_index;
    buffer.write_projection(strip_index, words);
  }
  const auto received = buffer.read_buffer();
  assert(received.front().data() == pointer);
  assert(buffer.get_memory_pointer() == nullptr);
  assert(buffer.read_buffer().empty());
  buffer.resize(5);
  for (std::uint32_t strip_index = 0; strip_index < 3; ++strip_index)
    for (std::uint32_t word_index = 0; word_index < 12; ++word_index)
      assert(received[strip_index][word_index] ==
             0x80000000u + strip_index * 12 + word_index);
  assert(buffer.get_word_count() == 60);
  buffer.clear();
  assert(buffer.get_strip_count() == 0);
  assert(buffer.get_memory_pointer() == nullptr);
}
