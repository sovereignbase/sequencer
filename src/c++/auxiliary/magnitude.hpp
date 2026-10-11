#pragma once
#include "../types/type.hpp"

namespace sequencer {
inline Word magnitude(std::int32_t x) { return x < 0 ? Word(-std::int64_t(x)) : Word(x); }
}
