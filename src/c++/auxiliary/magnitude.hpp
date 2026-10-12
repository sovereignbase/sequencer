#pragma once
#include "../types/type.hpp"

namespace sequencer {
/** Obtains unsigned Frame extent without overflowing signed negation.
 * @param x Signed original or runtime Frame effect.
 * @return Absolute extent, computed through a widened intermediate.
 */
inline Word magnitude(std::int32_t x) { return x < 0 ? Word(-std::int64_t(x)) : Word(x); }
} // namespace sequencer
