#pragma once

#include "../.declarations/clock/index.hpp"
#include "../.declarations/sentinels/index.hpp"
#include <cstdint>
#include <unordered_map>

/** Maps an operation's exact insert clock to its owning origin Strip. */
class ContainmentTable {
  std::unordered_map<std::uint32_t,
                     std::unordered_map<std::uint32_t, std::uint32_t>> actors;

public:
  [[nodiscard]] bool has(const Clock clock) const noexcept {
    const auto actor = actors.find(clock.actor);
    return actor != actors.end() && actor->second.contains(clock.time);
  }

  [[nodiscard]] std::uint32_t get(const Clock clock) const noexcept {
    const auto actor = actors.find(clock.actor);
    if (actor == actors.end())
      return u32_max;
    const auto strip = actor->second.find(clock.time);
    return strip == actor->second.end() ? u32_max : strip->second;
  }

  void set(const Clock clock, const std::uint32_t strip_index) {
    actors[clock.actor][clock.time] = strip_index;
  }

  bool erase(const Clock clock) noexcept {
    const auto actor = actors.find(clock.actor);
    if (actor == actors.end() || actor->second.erase(clock.time) == 0)
      return false;
    if (actor->second.empty())
      actors.erase(actor);
    return true;
  }
};
