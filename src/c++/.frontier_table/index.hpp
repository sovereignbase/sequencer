#pragma once

#include <algorithm>
#include <cstdint>
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#include <random>
#endif
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
  std::unordered_set<std::uint32_t> changed_sessions;

public:
  void observe_actor(const std::uint32_t actor_id) {
    actors.insert(actor_id);
    // Insert clocks and Mask clocks share Clock's actor lane. Never allocate a
    // Mask session that is already a known Insert-clock actor.
    used_sessions.insert(actor_id);
  }

  void observe_acknowledgement(
      const std::span<const std::uint32_t> frontier) {
    if (frontier.empty() || !actors.contains(frontier.front()))
      return;
    const auto actor_id = frontier.front();
    for (std::size_t index = 1; index + 1 < frontier.size(); index += 2) {
      auto &known = sessions[frontier[index]][actor_id];
      known = std::max(known, frontier[index + 1]);
      used_sessions.insert(frontier[index]);
    }
  }

  void observe_mask(const std::uint32_t session_id,
                    const std::uint32_t prefix,
                    const std::uint32_t end) {
    used_sessions.insert(session_id);
    pending[session_id][prefix] = end;
    auto &frontier = mask_frontiers[session_id];
    const auto previous = frontier;
    auto &intervals = pending[session_id];
    while (true) {
      const auto next = intervals.find(frontier);
      if (next == intervals.end())
        break;
      frontier = next->second;
      intervals.erase(next);
    }
    if (frontier != previous)
      changed_sessions.insert(session_id);
  }

  template <typename Visitor>
  void acknowledge_all(const std::uint32_t actor_id, Visitor &&visit) {
    for (const auto &[session_id, frontier] : mask_frontiers) {
      sessions[session_id][actor_id] = frontier;
      visit(session_id, frontier);
    }
    changed_sessions.clear();
  }

  template <typename Visitor>
  void acknowledge_changed(const std::uint32_t actor_id, Visitor &&visit) {
    for (const auto session_id : changed_sessions) {
      const auto frontier = mask_frontiers.find(session_id);
      if (frontier == mask_frontiers.end())
        continue;
      sessions[session_id][actor_id] = frontier->second;
      visit(session_id, frontier->second);
    }
    changed_sessions.clear();
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
      const auto known = mask_frontiers.find(session_id);
      if (known == mask_frontiers.end())
        continue;
      bool complete = true;
      for (const auto &[actor, frontier] : frontiers)
        complete = complete && frontier >= known->second;
      if (complete)
        result.insert(session_id);
    }
    return result;
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
    changed_sessions.erase(session_id);
  }

  [[nodiscard]] std::uint32_t
  get_safe_session_id(const std::uint32_t actor_id) {
#ifdef __EMSCRIPTEN__
    const auto entropy = static_cast<std::uint32_t>(EM_ASM_INT({
      const word = new Uint32Array(1);
      globalThis.crypto.getRandomValues(word);
      return word[0];
    }));
#else
    const auto entropy = std::random_device{}();
#endif
    // This bijective actor mix keeps distinct actors distinct even when two
    // isolated hosts expose the same entropy stream. Cryptographic host
    // entropy still rotates the session when an actor is recreated.
    auto actor_mix = actor_id;
    actor_mix ^= actor_mix >> 16;
    actor_mix *= 0x7feb352du;
    actor_mix ^= actor_mix >> 15;
    actor_mix *= 0x846ca68bu;
    actor_mix ^= actor_mix >> 16;
    auto session_id = entropy ^ actor_mix;
    while (used_sessions.contains(session_id))
      session_id += 0x9e3779b9u;
    used_sessions.insert(session_id);
    sessions.emplace(session_id,
                     std::unordered_map<std::uint32_t, std::uint32_t>{});
    return session_id;
  }
};
