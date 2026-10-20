#pragma once
#include "../../types/type.hpp"
#include <algorithm>
#include <unordered_map>
#include <unordered_set>

namespace sequencer {
/** Actor membership and equal complete Session frontiers governing whole-Session compaction. */
class FrontierTable {
  struct Session {
    Word id;
    std::unordered_map<Word, Word> claims;
  };
  // Hash membership supplies lookup; admission lists retain stable export order.
  std::vector<Word> actors;
  std::unordered_set<Word> membership, retirees;
  std::vector<Session> sessions;
  std::unordered_map<Word, std::size_t> session_index;

public:
  /** Observes an Actor's reported removal frontiers, admitting active Actors.
   * @param a Actor ID followed by Session/end pairs; retired Actors are ignored.
   */
  void observe(const Acknowledgement &a) {
    if (a.empty() || retirees.contains(a[0]))
      return;
    if (membership.insert(a[0]).second)
      actors.push_back(a[0]);
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      auto [it, added] = session_index.try_emplace(a[i], sessions.size());
      if (added)
        sessions.push_back({a[i], {}});
      // Claims record reported frontiers, including a lower later report.
      // Actor/session ID overlap also admits a zero report.
      if (session_index.contains(a[0]) || a[i + 1] > 0)
        sessions[it->second].claims[a[0]] = a[i + 1];
    }
  }
  /** Removes consensus membership and ignores future claims from this Actor.
   * @param actor Actor to retire for this table's lifetime; authored history is unaffected.
   */
  void retire(Word actor) {
    retirees.insert(actor);
    membership.erase(actor);
    if (membership.empty())
      actors.clear();
    for (auto &s : sessions)
      s.claims.erase(actor);
  }
  /** Finds whole-Session consensus across complete active membership.
   * @return Sessions with equal reported frontiers from every active Actor.
   */
  std::unordered_set<Word> compactable() const {
    std::unordered_set<Word> result;
    for (const auto &s : sessions) {
      // Agreement requires complete membership coverage, not merely equal present claims.
      if (s.claims.size() != membership.size())
        continue;
      bool equal = true;
      if (!s.claims.empty()) {
        auto expected = s.claims.begin()->second;
        for (const auto &[actor, time] : s.claims) {
          (void)actor;
          if (time != expected) {
            equal = false;
            break;
          }
        }
      }
      if (equal)
        result.insert(s.id);
    }
    return result;
  }
  /** Exports retained active membership and Acknowledgements.
   * @return Acknowledgements in Actor and Session admission order.
   */
  std::vector<Acknowledgement> frontiers() const {
    std::vector<Acknowledgement> result;
    for (auto actor : actors) {
      if (!membership.contains(actor))
        continue;
      auto &a = result.emplace_back(Acknowledgement{actor});
      for (const auto &s : sessions) {
        auto it = s.claims.find(actor);
        if (it != s.claims.end()) {
          a.push_back(s.id);
          a.push_back(it->second);
        }
      }
    }
    return result;
  }
};
} // namespace sequencer
