#pragma once
#include <cstdint>
#include <limits>

/**
 * @brief Shared sentinel for unavailable unsigned 32-bit values.
 *
 * Every sentinel-bearing domain reserves the maximum unsigned 32-bit value.
 * No file or class defines a domain-specific alias for this value.
 */
inline constexpr std::uint32_t u32_max =
    std::numeric_limits<std::uint32_t>::max();
