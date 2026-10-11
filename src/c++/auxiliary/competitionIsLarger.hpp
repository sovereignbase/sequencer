#pragma once
#include "../types/type.hpp"

namespace sequencer {
inline bool competition_is_larger(const Coordinates &a, const Coordinates &b) {
  return (a.diff < 0 && b.diff > 0) ||
         ((a.diff < 0) == (b.diff < 0) &&
          (a.session < b.session || (a.session == b.session && a.start < b.start)));
}
} // namespace sequencer
