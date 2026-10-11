#pragma once
#include "../../types/type.hpp"
#include <algorithm>
#include <cstddef>
#include <cstring>
#include <memory>

namespace sequencer {
class StripStorage {
  enum Field : Word {
    Start,
    Effect,
    Flags,
    Left,
    Right,
    Competitor,
    Fragment,
    LeftJump,
    RightJump,
    LeftFrames,
    LeftStrips,
    RightFrames,
    RightStrips,
    Fields
  };
  std::unique_ptr<std::byte[]> storage;
  Word count{}, capacity{};

  Insertion *identities() const { return reinterpret_cast<Insertion *>(storage.get()); }
  Word *lane(Field field) const {
    return reinterpret_cast<Word *>(storage.get() + sizeof(Insertion) * capacity) +
           field * capacity;
  }

public:
  class Flag {
    Word &bits;
    Word mask;

  public:
    Flag(Word &bits, Word mask) : bits(bits), mask(mask) {}
    operator bool() const { return (bits & mask) != 0; }
    Flag &operator=(bool value) {
      bits = value ? bits | mask : bits & ~mask;
      return *this;
    }
    Flag &operator=(const Flag &value) { return *this = bool(value); }
  };
  struct View {
    Coordinates &coordinates;
    Word &content;
    Word &fragment_start;
    std::int32_t &fragment_diff;
    Flag fragmented, offset;
    Index &left;
    Index &right;
    Index &competitor;
    Index &fragment;
    Index &left_jump;
    Index &right_jump;
    Word &left_jump_frames;
    Word &left_jump_strips;
    Word &right_jump_frames;
    Word &right_jump_strips;
    std::int32_t effect() const { return fragment_diff; }
    operator Strip() const {
      return {coordinates,
              content,
              fragment_start,
              fragment_diff,
              bool(fragmented),
              bool(offset),
              left,
              right,
              competitor,
              fragment,
              left_jump,
              right_jump,
              left_jump_frames,
              left_jump_strips,
              right_jump_frames,
              right_jump_strips};
    }
  };

  StripStorage() {
    reserve(64);
    append({});
  }
  Word size() const { return count; }
  void reserve(Word requested) {
    if (requested <= capacity)
      return;
    const auto next = std::max(requested, capacity * 2);
    auto grown = std::make_unique_for_overwrite<std::byte[]>(
        (sizeof(Insertion) + Fields * sizeof(Word)) * next);
    if (count) {
      std::memcpy(grown.get(), identities(), count * sizeof(Insertion));
      auto *hot = reinterpret_cast<Word *>(grown.get() + sizeof(Insertion) * next);
      for (Word field = 0; field < Fields; ++field)
        std::memcpy(hot + field * next, lane(Field(field)), count * sizeof(Word));
    }
    storage = std::move(grown);
    capacity = next;
  }
  Index append(Insertion insertion) {
    if (count == capacity)
      reserve(count + 1);
    const auto index = count++;
    std::construct_at(identities() + index, insertion);
    for (Word field = 0; field < Fields; ++field)
      std::construct_at(lane(Field(field)) + index, Word(0));
    lane(Effect)[index] = std::bit_cast<Word>(insertion.coordinates.diff);
    return index;
  }
  [[gnu::always_inline]] View operator[](Index index) const {
    auto &identity = identities()[index];
    return {identity.coordinates,        identity.content,
            lane(Start)[index],          reinterpret_cast<std::int32_t *>(lane(Effect))[index],
            Flag(lane(Flags)[index], 1), Flag(lane(Flags)[index], 2),
            lane(Left)[index],           lane(Right)[index],
            lane(Competitor)[index],     lane(Fragment)[index],
            lane(LeftJump)[index],       lane(RightJump)[index],
            lane(LeftFrames)[index],     lane(LeftStrips)[index],
            lane(RightFrames)[index],    lane(RightStrips)[index]};
  }
};
} // namespace sequencer
