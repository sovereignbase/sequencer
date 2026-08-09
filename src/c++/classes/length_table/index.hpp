#pragma once
#include "../../declarations/projector/index.hpp"
#include <cstdint>
#include <utility>
#include <vector>

class LengthTable {

private:
  std::vector<uint32_t> checkpoints;

public:
  inline void adjust_chekpoints(bool remove, std::uint32_t after_index,
                                std::uint32_t length,
                                Projector *projector) noexcept {
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

  [[nodiscard]] inline std::pair<std::uint32_t, bool>
  nearest_chekpoint(std::uint32_t index) const noexcept {
    const bool right = (index & 127u) > 64u;
    const std::uint32_t i = (index >> 7) + static_cast<std::uint32_t>(right);
    return {checkpoints[i], right};
  }
};
