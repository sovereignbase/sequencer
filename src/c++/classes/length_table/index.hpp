#pragma once
#include "../../declarations/projector/index.hpp"
#include <cstdint>
#include <vector>
class LengthTable {

private:
  std::vector<uint32_t> checkpoints;

public:
  inline void adjust(bool remove, std::uint32_t after_index,
                     std::uint32_t length, Projector *projector) noexcept {
    if (remove) {
      // Start from the checkpoint at/before after_index.
      // Walk projection forward by `length`,
      // updating affected checkpoints left -> right.
    } else {
      // Start from the checkpoint at/after the affected
      // range. Walk projection backward by `length`,
      // updating affected checkpoints right -> left.
    }
  }

  [[nodiscard]] inline std::uint32_t closest(std::uint32_t index) noexcept {
    return checkpoints[index / 20u];
  }
};
