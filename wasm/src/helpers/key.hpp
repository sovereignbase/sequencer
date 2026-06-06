#pragma once

#include "../types/type.hpp"

bool key_is_less(Key left, Key right) {
  if (left.a != right.a)
    return left.a < right.a;
  if (left.b != right.b)
    return left.b < right.b;
  if (left.c != right.c)
    return left.c < right.c;
  return left.d < right.d;
}

bool key_is_zero(Key key) {
  return key.a == 0 && key.b == 0 && key.c == 0 && key.d == 0;
}

Key key_add(Key key, std::uint32_t offset) {
  std::uint64_t next = std::uint64_t(key.d) + offset;
  key.d = std::uint32_t(next);
  next = std::uint64_t(key.c) + (next >> 32);
  key.c = std::uint32_t(next);
  next = std::uint64_t(key.b) + (next >> 32);
  key.b = std::uint32_t(next);
  key.a = std::uint32_t(std::uint64_t(key.a) + (next >> 32));
  return key;
}
