#pragma once

#include <compare>
#include <cstdint>

/** A stable operation clock: actor/session identifier and logical time. */
struct Clock {
  std::uint32_t actor;
  std::uint32_t time;

  [[nodiscard]] constexpr bool operator==(const Clock &) const noexcept = default;
  [[nodiscard]] constexpr auto operator<=>(const Clock &) const noexcept = default;
};

static_assert(sizeof(Clock) == 8);
