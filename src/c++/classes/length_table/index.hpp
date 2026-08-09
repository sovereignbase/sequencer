#pragma once
#include "../../declarations/projector/index.hpp"
#include <cstdint>
#include <vector>
class LengthTable {

private:
  std::vector<uint32_t> checkpoints;

public:
  inline void adjust(bool remove, std::uint32_t after_index,
                     Projector *projector) noexcept {}

  [[nodiscard]] inline std::uint32_t closest(std::uint32_t index) noexcept {
    return (index / 20u) * 20u;
  }
};
