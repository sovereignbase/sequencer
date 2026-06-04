struct Key {
  std::uint32_t a;
  std::uint32_t b;
  std::uint32_t c;
  std::uint32_t d;
  bool operator==(const Key &other) const {
    return a == other.a && b == other.b && c == other.c && d == other.d;
  }
};

struct KeyHash {
  std::size_t operator()(const Key &k) const {
    std::uint64_t x = (std::uint64_t(k.a) << 32) | std::uint64_t(k.b);
    std::uint64_t y = (std::uint64_t(k.c) << 32) | std::uint64_t(k.d);
    x ^= y + 0x9e3779b97f4a7c15ULL + (x << 6) + (x >> 2);
    return std::size_t(x);
  }
};