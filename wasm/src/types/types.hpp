#pragma once
#include <cstddef>
#include <cstdint>

struct Key {
  std::uint32_t a, b, c, d;

  bool operator==(const Key &other) const {
    return a == other.a && b == other.b && c == other.c && d == other.d;
  }
};

struct KeyHash {
  std::size_t operator()(const Key &k) const {
    std::uint64_t x = (std::uint64_t(k.a) << 32) | k.b;
    std::uint64_t y = (std::uint64_t(k.c) << 32) | k.d;
    x ^= y + 0x9e3779b97f4a7c15ULL + (x << 6) + (x >> 2);
    return std::size_t(x);
  }
};

struct Item {
  Key id;
  Item *previous;
  Item *next;
};

struct State {
  std::uint32_t size;
  std::uint32_t index;
  Item *first;
  Item *current;
  Item *last;
};