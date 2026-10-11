#pragma once
#include "../../types/type.hpp"
#include <algorithm>
#include <unordered_map>
#include <unordered_set>

namespace sequencer {
// Membership lookups are hashed; export follows admission order.
class FrontierTable {
  struct Session {
    Word id;
    std::unordered_map<Word, Word> claims;
  };
  std::vector<Word> actors;
  std::unordered_set<Word> membership, retirees;
  std::vector<Session> sessions;
  std::unordered_map<Word, std::size_t> session_index;
public:
  void observe(const Acknowledgement& a) {
    if (a.empty() || retirees.contains(a[0])) return;
    if (membership.insert(a[0]).second) actors.push_back(a[0]);
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      auto [it, added] = session_index.try_emplace(a[i], sessions.size());
      if (added) sessions.push_back({a[i], {}});
      // Claims record reported receipt, including a lower later report.
      // Actor/session ID overlap also admits a zero report.
      if (session_index.contains(a[0]) || a[i + 1] > 0)
        sessions[it->second].claims[a[0]] = a[i + 1];
    }
  }
  void retire(Word actor) {
    retirees.insert(actor);
    membership.erase(actor);
    std::erase(actors, actor);
    for (auto& s : sessions) s.claims.erase(actor);
  }
  std::unordered_set<Word> compactable() const {
    std::unordered_set<Word> result;
    for (const auto& s : sessions) {
      if (s.claims.size() != actors.size()) continue;
      bool equal = true;
      if (!s.claims.empty()) {
        auto expected = s.claims.begin()->second;
        for (const auto& [actor, time] : s.claims) {
          (void)actor;
          if (time != expected) { equal = false; break; }
        }
      }
      if (equal) result.insert(s.id);
    }
    return result;
  }
  std::vector<Acknowledgement> frontiers() const {
    std::vector<Acknowledgement> result;
    for (auto actor : actors) {
      auto& a = result.emplace_back(Acknowledgement{actor});
      for (const auto& s : sessions) {
        auto it = s.claims.find(actor);
        if (it != s.claims.end()) { a.push_back(s.id); a.push_back(it->second); }
      }
    }
    return result;
  }
};
}
