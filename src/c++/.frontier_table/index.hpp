#pragma once

#include <cstdint>
#include <random>
#include <span>
#include <unordered_map>
#include <unordered_set>

/** Actor acknowledgement state used to select globally safe Mask sessions. */
class FrontierTable {
  std::unordered_set<std::uint32_t> actors;
  std::unordered_set<std::uint32_t> used_sessions;
  std::unordered_map<std::uint32_t,
                     std::unordered_map<std::uint32_t, std::uint32_t>> sessions;
  std::unordered_map<std::uint32_t,
                     std::unordered_map<std::uint32_t, std::uint32_t>> pending;
  std::unordered_map<std::uint32_t, std::uint32_t> mask_frontiers;
  std::unordered_map<std::uint32_t, std::uint32_t> compacted_frontiers;

public:
  void observe_actor(const std::uint32_t actor_id) {
    actors.insert(actor_id);
  }

  void observe_acknowledgement(
      const std::span<const std::uint32_t> frontier) {
    if (frontier.empty() || !actors.contains(frontier.front()))
      return;
    const auto actor_id = frontier.front();
    for (std::size_t index = 1; index + 1 < frontier.size(); index += 2) {
      sessions[frontier[index]][actor_id] = frontier[index + 1];
      used_sessions.insert(frontier[index]);
    }
  }

  void observe_mask(const std::uint32_t session_id,
                    const std::uint32_t prefix,
                    const std::uint32_t end) {
    used_sessions.insert(session_id);
    pending[session_id][prefix] = end;
    auto &frontier = mask_frontiers[session_id];
    auto &intervals = pending[session_id];
    while (true) {
      const auto next = intervals.find(frontier);
      if (next == intervals.end())
        break;
      frontier = next->second;
      intervals.erase(next);
    }
  }

  template <typename Visitor>
  void acknowledge(const std::uint32_t actor_id, Visitor &&visit) {
    visit(actor_id);
    for (const auto &[session_id, frontier] : mask_frontiers) {
      sessions[session_id][actor_id] = frontier;
      visit(session_id);
      visit(frontier);
    }
  }

  template <typename Begin, typename Word>
  void for_each_acknowledgement(Begin &&begin, Word &&word) const {
    for (const auto actor_id : actors) {
      std::uint32_t pair_count = 0;
      for (const auto &[session_id, actor_frontiers] : sessions)
        pair_count += actor_frontiers.contains(actor_id) ? 1u : 0u;
      begin(1 + pair_count * 2);
      word(actor_id);
      for (const auto &[session_id, actor_frontiers] : sessions) {
        const auto found = actor_frontiers.find(actor_id);
        if (found != actor_frontiers.end()) {
          word(session_id);
          word(found->second);
        }
      }
    }
  }

  [[nodiscard]] std::unordered_set<std::uint32_t>
  get_compactable_sessions() const {
    std::unordered_set<std::uint32_t> result;
    for (const auto &[session_id, frontiers] : sessions) {
      if (frontiers.size() != actors.size() || frontiers.empty())
        continue;
      const auto expected = frontiers.begin()->second;
      const auto compacted = compacted_frontiers.find(session_id);
      if (compacted != compacted_frontiers.end() &&
          expected <= compacted->second)
        continue;
      bool agreed = true;
      for (const auto &[actor, frontier] : frontiers)
        agreed = agreed && frontier == expected;
      if (agreed)
        result.insert(session_id);
    }
    return result;
  }

  void mark_compacted(
      const std::unordered_set<std::uint32_t> &compacted) {
    for (const auto session_id : compacted) {
      const auto session = sessions.find(session_id);
      if (session != sessions.end() && !session->second.empty())
        compacted_frontiers[session_id] = session->second.begin()->second;
    }
  }

  void free_compacted_sessions(
      const std::unordered_set<std::uint32_t> &compacted) {
    for (const auto session_id : compacted)
      free_compacted_session(session_id);
  }

  void free_compacted_session(const std::uint32_t session_id) {
    sessions.erase(session_id);
    pending.erase(session_id);
    mask_frontiers.erase(session_id);
    compacted_frontiers.erase(session_id);
  }

  [[nodiscard]] std::uint32_t get_safe_session_id() {
    std::uint32_t session_id = std::random_device{}();
    while (used_sessions.contains(session_id))
      session_id = std::random_device{}();
    used_sessions.insert(session_id);
    sessions.emplace(session_id,
                     std::unordered_map<std::uint32_t, std::uint32_t>{});
    return session_id;
  }
};
