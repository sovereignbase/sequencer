#pragma once

#include <algorithm>
#include <cstdint>
#include <span>
#include <vector>

/** Reusable Uint32 transfer storage for acknowledgements and GC input. */
class FrontierBuffer {
  std::vector<std::uint32_t> words;
  std::size_t count{0};

public:
  void clear() noexcept { count = 0; }
  void resize(const std::uint32_t word_count) {
    if (word_count > words.size())
      words.resize(word_count);
    else if (word_count > count)
      std::fill(words.begin() + count, words.begin() + word_count, 0);
    count = word_count;
  }
  void push(const std::uint32_t word) {
    if (count == words.size())
      words.push_back(word);
    else
      words[count] = word;
    ++count;
  }
  [[nodiscard]] std::span<const std::uint32_t> read() noexcept {
    const std::span<const std::uint32_t> result{words.data(), count};
    count = 0;
    return result;
  }
  [[nodiscard]] std::uint32_t size() const noexcept {
    return static_cast<std::uint32_t>(count);
  }
  [[nodiscard]] std::uint32_t *data() noexcept {
    return count == 0 ? nullptr : words.data();
  }
};
