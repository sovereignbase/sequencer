#include "class.hpp"
#include <algorithm>
#include <bit>
#include <memory>
#include <limits>
#include <unordered_set>
#include <span>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <pthread.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

namespace sequencer {
namespace {
std::vector<std::unique_ptr<Projection>> projections;
std::span<const Word> input;
std::vector<Word> output;
constexpr Word lease_count = 64, lease_words = 4096;
std::vector<Word> arena(lease_count * lease_words);
std::array<std::vector<Word>, lease_count> large_inputs, outputs;
std::unordered_set<Word> session_ids;
Word random_state = 0x9e3779b9;
Word next_session() {
  Word id;
  do {
    random_state ^= random_state << 13;
    random_state ^= random_state >> 17;
    random_state ^= random_state << 5;
    id = random_state;
  } while (!id || !session_ids.insert(id).second);
  return id;
}
void coordinates(const Coordinates& c) {
  output.insert(output.end(), {c.anchor_session, c.anchor_start, c.anchor_diff, c.session, c.start, std::bit_cast<Word>(c.diff)});
}
void spans(const std::vector<Span>& entries) {
  output.push_back(Word(entries.size()));
  for (const auto& s : entries) output.insert(output.end(), {s.content, s.start, s.count});
}
void gossip(const Gossip& entries) {
  output.push_back(Word(entries.size()));
  for (const auto& e : entries) {
    output.push_back(e.acknowledgement ? 1 : 0);
    if (e.acknowledgement) {
      output.push_back(Word(e.frontier.size()));
      output.insert(output.end(), e.frontier.begin(), e.frontier.end());
    } else { coordinates(e.insertion.coordinates); output.push_back(e.insertion.content); }
  }
}
void result(const Result& r) {
  output.push_back(Word(r.changes.size()));
  for (const auto& c : r.changes) { output.push_back(c.start); output.push_back(c.end); spans(c.values); }
  gossip(r.gossip);
}
struct Reader {
  std::size_t position{};
  Word word() {
    if (position >= input.size()) throw std::runtime_error("Truncated numeric input");
    return input[position++];
  }
  Gossip gossip(Word count) {
    if (count > input.size() - position) throw std::runtime_error("Invalid gossip count");
    Gossip entries;
    entries.reserve(count);
    for (Word i = 0; i < count; ++i) entries.push_back(entry());
    return entries;
  }
  Entry entry() {
      const auto tag = word();
      const auto offset = word(), count = word(), content = word();
      if (offset > input.size() || count > input.size() - offset) throw std::runtime_error("Invalid input span");
      const auto data = input.subspan(offset, count);
      if (tag == 1) {
        if (!count || !(count & 1)) throw std::runtime_error("Invalid acknowledgement");
        return Entry::acknowledge({data.begin(), data.end()});
      }
      else if (tag == 0) {
        if (count != 6) throw std::runtime_error("Invalid insertion width");
        Coordinates c{data[0], data[1], data[2], data[3], data[4], std::bit_cast<std::int32_t>(data[5])};
        if (!c.diff || c.diff == std::numeric_limits<std::int32_t>::min()) throw std::runtime_error("Invalid insertion coordinates");
        session_ids.insert(c.anchor_session);
        session_ids.insert(c.session);
        return Entry::insert({c, content});
      } else throw std::runtime_error("Invalid gossip entry");
  }
  std::vector<Acknowledgement> frontiers(Word count) {
    if (count > input.size() - position) throw std::runtime_error("Invalid frontier count");
    std::vector<Acknowledgement> entries;
    for (Word n = 0; n < count; ++n) {
      auto e = entry();
      if (!e.acknowledgement) throw std::runtime_error("Invalid frontier entry");
      entries.push_back(std::move(e.frontier));
    }
    return entries;
  }
};
}
}

extern "C" {
#ifdef __EMSCRIPTEN__
// The dedicated worker is the sole C++ heap owner. Shared memory exposes only
// leased numeric regions to JS; no other thread enters the native allocator.
int pthread_mutex_lock(pthread_mutex_t*) { return 0; }
int pthread_mutex_unlock(pthread_mutex_t*) { return 0; }
#endif
EMSCRIPTEN_KEEPALIVE void runtime_seed(std::uint32_t seed) { sequencer::random_state = seed ? seed : 1; }
EMSCRIPTEN_KEEPALIVE std::uint32_t* runtime_arena_pointer() { return sequencer::arena.data(); }
EMSCRIPTEN_KEEPALIVE std::uint32_t* runtime_reserve(std::uint32_t lease, std::uint32_t count) {
  using namespace sequencer;
  if (count <= lease_words) return arena.data() + lease * lease_words;
  large_inputs[lease].resize(count);
  return large_inputs[lease].data();
}
EMSCRIPTEN_KEEPALIVE void runtime_create(std::uint32_t id, std::uint32_t actor, std::uint32_t increase, std::uint32_t decrease) {
  using namespace sequencer;
  if (projections.size() <= id) projections.resize(std::size_t(id) + 1);
  projections[id] = std::make_unique<Projection>(actor, increase ? increase : next_session(), decrease ? decrease : next_session());
  if (increase) session_ids.insert(increase);
  if (decrease) session_ids.insert(decrease);
}
EMSCRIPTEN_KEEPALIVE void runtime_destroy(std::uint32_t id) {
  if (id < sequencer::projections.size()) sequencer::projections[id].reset();
}
EMSCRIPTEN_KEEPALIVE std::uint32_t* runtime_output_pointer(std::uint32_t lease) { return sequencer::outputs[lease].data(); }
EMSCRIPTEN_KEEPALIVE std::uint32_t runtime_output_count(std::uint32_t lease) { return std::uint32_t(sequencer::outputs[lease].size()); }
EMSCRIPTEN_KEEPALIVE void runtime_execute(std::uint32_t operation, std::uint32_t id, std::uint32_t arg0, std::uint32_t arg1, std::uint32_t arg2) {
  using namespace sequencer;
  output.clear();
  if (operation == 11) { runtime_destroy(id); output.insert(output.end(), {6, 0}); return; }
  if (id >= projections.size() || !projections[id]) { output.insert(output.end(), {7, 0, 1}); return; }
  auto& p = *projections[id];
  p.released.clear();
  Word kind = 6;
  try {
    // Output starts with operation data; release spans are prepended afterwards.
    switch (operation) {
      case 0: {
        Reader r;
        if (r.word() != 1) throw std::runtime_error("Invalid sequence");
        const auto nf = r.word(), ni = r.word();
        auto f = r.frontiers(nf); auto g = r.gossip(ni);
        for (const auto& e : g) {
          const auto c = e.insertion.coordinates;
          for (auto* clock : {&p.increase_clock, &p.decrease_clock})
            if ((*clock)[0] == c.session || (*clock)[0] == c.anchor_session) (*clock)[0] = next_session();
        }
        p.hydrate(g, f); break;
      }
      case 1: {
        Reader r;
        const auto count = r.word();
        Result combined;
        for (Word n = 0; n < count; ++n) {
          auto applied = p.apply({r.entry()});
          combined.changes.insert(combined.changes.end(), std::make_move_iterator(applied.changes.begin()), std::make_move_iterator(applied.changes.end()));
          combined.gossip.insert(combined.gossip.end(), std::make_move_iterator(applied.gossip.begin()), std::make_move_iterator(applied.gossip.end()));
        }
        result(combined); kind = 4; break;
      }
      case 2: gossip(p.insert(arg0, arg1, arg2)); kind = 2; break;
      case 3: output.push_back(p.length()); kind = 1; break;
      case 4: {
        Reader r;
        if (r.word() != 1) throw std::runtime_error("Invalid sequence");
        const auto nf = r.word(), ni = r.word();
        auto f = r.frontiers(nf); auto g = r.gossip(ni);
        result(p.merge(g, f)); kind = 4; break;
      }
      case 5: gossip(p.remove(arg0 == UINT32_MAX ? 0 : arg0, arg1 == UINT32_MAX ? std::int64_t(p.length()) - 1 : arg1)); kind = 2; break;
      case 6: { Reader r; auto end = r.word(); gossip(p.replace(arg0, arg1, arg2 == UINT32_MAX ? 0 : arg2, end == UINT32_MAX ? std::int64_t(p.length()) - 1 : end)); kind = 2; break; }
      case 7: p.frontier.retire(arg0); break;
      case 8: {
        const auto s = p.sequence();
        output.push_back(Word(s.frontiers.size()));
        for (const auto& a : s.frontiers) { output.push_back(Word(a.size())); output.insert(output.end(), a.begin(), a.end()); }
        output.push_back(Word(s.insertions.size()));
        for (const auto& i : s.insertions) { coordinates(i.coordinates); spans(i.footage); }
        kind = 5; break;
      }
      case 9: spans(p.values(arg0, arg0)); kind = 3; break;
      case 10: spans(p.values(arg0 == UINT32_MAX ? 0 : arg0, arg1 == UINT32_MAX ? p.length() - 1 : arg1)); kind = 3; break;
      default: throw std::runtime_error("Unknown operation");
    }
  } catch (const std::exception&) {
    // Invalid remote data is undefined; trusted calls surface a runtime error.
    output.clear();
    kind = operation == 1 || operation == 4 ? 0 : 7;
    if (kind == 7) output.push_back(2);
  }
  std::vector<Word> header{kind, Word(p.released.size())};
  for (const auto& s : p.released) header.insert(header.end(), {s.content, s.start, s.count});
  output.insert(output.begin(), header.begin(), header.end());
}
EMSCRIPTEN_KEEPALIVE void runtime_dispatch(std::uint32_t lease, std::uint32_t operation, std::uint32_t id,
  std::uint32_t arg0, std::uint32_t arg1, std::uint32_t arg2, const std::uint32_t* pointer, std::uint32_t count) {
  using namespace sequencer;
  input = {pointer, count};
  output.swap(outputs[lease]);
  if (operation == 0) runtime_create(id, arg0, 0, 0);
  runtime_execute(operation, id, arg0, arg1, arg2);
  output.swap(outputs[lease]);
}
}
