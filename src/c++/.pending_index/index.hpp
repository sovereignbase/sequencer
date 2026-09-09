/**
 * @file
 * @brief Indexes pending Strips by their missing previous Strip end.
 *
 * Dependency points are ordered by Realm and counter. Each point retains all
 * waiting Strip indices; Strip storage remains Projector-owned.
 */
#pragma once

#include "../.declarations/sequence_point/index.hpp"
#include <algorithm>
#include <cstdint>
#include <map>
#include <vector>

class PendingIndex {
  std::map<SequencePoint, std::vector<std::uint32_t>> pending_strips;

  [[nodiscard]] static bool
  is_in_span(const SequencePoint &point, const SequencePoint &strip_start,
             const std::uint32_t strip_length) noexcept {
    return point.crypto_random_bits == strip_start.crypto_random_bits &&
           point.unix_lower_bits == strip_start.unix_lower_bits &&
           point.counter_bits >= strip_start.counter_bits &&
           point.counter_bits - strip_start.counter_bits < strip_length;
  }

public:
  /**
   * @brief Register a Strip waiting for the exact previous Strip end.
   * @note Repeated registration of the same point and Strip is a no-op.
   * @complexity O(log p + w) for p dependency points and w waiters at the point.
   */
  void set(const SequencePoint &previous_strip_end,
           const std::uint32_t strip_index) {
    auto &strips = pending_strips[previous_strip_end];
    if (std::find(strips.begin(), strips.end(), strip_index) == strips.end())
      strips.push_back(strip_index);
  }

  /**
   * @brief Return all Strips waiting on points covered by an arriving Strip.
   * @note The range is [strip_start, strip_start + strip_length) within one
   * Realm, without counter wraparound. A zero length returns no Strips.
   * @note Results follow dependency order, then registration order per point.
   * @complexity O(log p + k) for p dependency points and k returned Strips.
   */
  [[nodiscard]] std::vector<std::uint32_t>
  get(const SequencePoint &strip_start,
      const std::uint32_t strip_length) const {
    std::vector<std::uint32_t> result;
    if (strip_length == 0)
      return result;

    for (auto entry = pending_strips.lower_bound(strip_start);
         entry != pending_strips.end() &&
         is_in_span(entry->first, strip_start, strip_length);
         ++entry)
      result.insert(result.end(), entry->second.begin(), entry->second.end());
    return result;
  }

  /**
   * @brief Return and remove all waiters in the same half-open range as get.
   * @note Removal completes before the caller processes the returned Strips,
   * allowing newly materialized Strips to release further dependencies.
   * @complexity O(log p + k) for p dependency points and k returned Strips.
   */
  [[nodiscard]] std::vector<std::uint32_t>
  take(const SequencePoint &strip_start, const std::uint32_t strip_length) {
    auto result = get(strip_start, strip_length);
    if (result.empty())
      return result;

    auto entry = pending_strips.lower_bound(strip_start);
    while (entry != pending_strips.end() &&
           is_in_span(entry->first, strip_start, strip_length))
      entry = pending_strips.erase(entry);
    return result;
  }

  /**
   * @brief Remove one waiting Strip without removing other waiters.
   * @return Whether the point and Strip registration existed.
   * @complexity O(log p + w) for p dependency points and w waiters at the point.
   */
  bool erase(const SequencePoint &previous_strip_end,
             const std::uint32_t strip_index) noexcept {
    const auto entry = pending_strips.find(previous_strip_end);
    if (entry == pending_strips.end())
      return false;

    auto &strips = entry->second;
    const auto strip = std::find(strips.begin(), strips.end(), strip_index);
    if (strip == strips.end())
      return false;

    strips.erase(strip);
    if (strips.empty())
      pending_strips.erase(entry);
    return true;
  }

  /**
   * @brief List every pending Strip without resolving any dependency.
   * @note The result has no ordering guarantee and leaves the index unchanged.
   * @complexity O(k) for k pending Strips.
   */
  [[nodiscard]] std::vector<std::uint32_t> get_all() const {
    std::vector<std::uint32_t> result;
    for (const auto &entry : pending_strips)
      result.insert(result.end(), entry.second.begin(), entry.second.end());
    return result;
  }

  /** @brief Report whether no Strips are waiting for dependencies. */
  [[nodiscard]] bool is_empty() const noexcept {
    return pending_strips.empty();
  }
};
