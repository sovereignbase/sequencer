#pragma once
#include "../../types/type.hpp"
#include "../ContainmentTable/class.hpp"
#include <algorithm>
#include <span>
#include <unordered_map>

namespace sequencer {
/** Actor membership and equal complete Session frontiers governing whole-Session compaction. */
class FrontierTable {
  struct Session {
    Word id;
    std::unordered_map<Word, Word> claims;
  };
  // Hash membership supplies lookup; admission lists retain stable export order.
  std::vector<Word> actors;
  WordTable membership;
  Word active{};
  Word observed_actor{};
  bool observed{};
  std::vector<Session> sessions;
  WordTable session_index;

public:
  /** Observes an Actor's reported removal frontiers, admitting active Actors.
   * @param a Actor ID followed by Session/end pairs; retired Actors are ignored.
   */
  void observe(std::span<const Word> a) {
    if (a.empty())
      return;
    if (!observed || observed_actor != a[0]) {
      const auto member = membership.get(a[0]);
      if (member == 2)
        return;
      if (!member) {
        membership.set({.session = a[0]}, 1);
        actors.push_back(a[0]);
        ++active;
      }
      observed_actor = a[0];
      observed = true;
    }
    for (std::size_t i = 1; i + 1 < a.size(); i += 2) {
      auto index = !sessions.empty() && sessions.back().id == a[i] ? Word(sessions.size())
                                                                   : session_index.get(a[i]);
      if (!index) {
        index = Word(sessions.size()) + 1;
        session_index.set({.session = a[i]}, index);
        sessions.push_back({a[i], {}});
      }
      // Claims record reported frontiers, including a lower later report.
      // Actor/session ID overlap also admits a zero report.
      if (a[i + 1] > 0 || session_index.contains(a[0]))
        sessions[index - 1].claims[a[0]] = a[i + 1];
    }
  }
  /** Removes consensus membership and ignores future claims from this Actor.
   * @param actor Actor to retire for this table's lifetime; authored history is unaffected.
   */
  void retire(Word actor) {
    if (observed_actor == actor)
      observed = false;
    if (membership.get(actor) == 1)
      --active;
    membership.set({.session = actor}, 2);
    if (!active)
      actors.clear();
    for (auto &s : sessions)
      s.claims.erase(actor);
  }
  /** Finds whole-Session consensus across complete active membership.
   * @return Sessions with equal reported frontiers from every active Actor.
   */
  WordTable compactable() const {
    WordTable result;
    for (const auto &s : sessions) {
      // Agreement requires complete membership coverage, not merely equal present claims.
      if (s.claims.size() != active)
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
        result.set({.session = s.id}, 1);
    }
    return result;
  }
  /** Exports retained active membership and Acknowledgements.
   * @return Acknowledgements in Actor and Session admission order.
   */
  std::vector<Acknowledgement> frontiers() const {
    std::vector<Acknowledgement> result;
    for (auto actor : actors) {
      if (membership.get(actor) != 1)
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
