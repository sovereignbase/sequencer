#pragma once
#include "../../types/type.hpp"
#include <span>

namespace sequencer {
/** Bounds-checked byte reader; each instance owns only its snapshot Session dictionary. */
template <bool Dictionary = false> class WordsReader {
  std::span<const std::uint8_t> bytes;
  std::vector<Word> sessions;
  Word previous_session{}, previous_start{}, previous_size{};

public:
  std::size_t position{};
  bool valid = true;
  explicit WordsReader(std::span<const std::uint8_t> input) : bytes(input) {}
  std::size_t remaining() const { return bytes.size() - position; }
  std::uint8_t byte() {
    if (!remaining()) {
      valid = false;
      return 0;
    }
    return bytes[position++];
  }
  Word uint() {
    Word value = 0;
    for (Word shift = 0; shift <= 28; shift += 7) {
      const auto part = byte();
      if (shift == 28 && part > 15) {
        valid = false;
        return 0;
      }
      value |= Word(part & 127) << shift;
      if (!(part & 128))
        return value;
    }
    valid = false;
    return 0;
  }
  Word session() {
    if constexpr (Dictionary) {
      const auto index = uint();
      if (index) {
        if (index > sessions.size()) {
          valid = false;
          return 0;
        }
        return sessions[index - 1];
      }
    }
    if (remaining() < sizeof(Word)) {
      valid = false;
      return 0;
    }
    Word value;
    std::memcpy(&value, bytes.data() + position, sizeof(value));
    position += sizeof(value);
    if constexpr (Dictionary)
      sessions.push_back(value);
    return value;
  }
  Coordinates coordinates() {
    const auto control = byte();
    Coordinates c;
    c.session = control & 1 ? session() : previous_session;
    if ((control & 64) && (control & 2))
      valid = false;
    c.anchor_session = control & 64 ? 0 : control & 2 ? session() : c.session;
    const auto anchor = Dictionary && c.anchor_session == previous_session ? previous_start : 0;
    const auto anchor_delta = control & 8 ? uint() : 0;
    c.anchor_start =
        anchor + (Dictionary ? (anchor_delta >> 1) ^ (0u - (anchor_delta & 1)) : anchor_delta);
    c.anchor_diff = control & 16 ? uint() : control & 64 ? 0 : 1;
    const auto predicted =
        Dictionary ? c.session == previous_session ? previous_start + previous_size + 1 : 0
        : !c.birth() && c.anchor_session == c.session ? c.anchor_start + c.anchor_diff + 1
                                                      : 0;
    const auto delta = control & 4 ? uint() : 0;
    c.start = predicted + ((delta >> 1) ^ (0u - (delta & 1)));
    const auto size = control & 32 ? uint() : 1;
    if (!size || size > Word(INT32_MAX))
      valid = false;
    c.diff = std::bit_cast<std::int32_t>(control & 128 ? 0u - size : size);
    previous_session = c.session;
    previous_start = c.start;
    previous_size = size;
    return c;
  }
  /** Reads the reversed footer and excludes it from subsequent field bounds. */
  Word records() {
    Word value = 0;
    for (Word shift = 0; shift <= 28; shift += 7) {
      if (bytes.empty()) {
        valid = false;
        return 0;
      }
      const auto part = bytes.back();
      bytes = bytes.first(bytes.size() - 1);
      if (shift == 28 && part > 15) {
        valid = false;
        return 0;
      }
      value |= Word(part & 127) << shift;
      if (!(part & 128))
        return value;
    }
    valid = false;
    return 0;
  }
};
} // namespace sequencer
