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

constexpr Word lease_count = 64, lease_words = 4096;
std::vector<Word> arena(lease_count * lease_words);
std::array<std::vector<Word>, lease_count> large_inputs;
Word address(const void* pointer) { return Word(reinterpret_cast<std::uintptr_t>(pointer)); }
struct EntryView { Word tag, pointer, count, content; };
struct SpliceView { Word start, end, pointer, count; };
struct ArrayView { Word pointer, count; };
struct InsertionView { Word coordinates, pointer, count; };
struct Output {
  std::array<Word, 7> header{};
  Gossip entries;
  Result result;
  Sequence sequence;
  std::vector<Span> values, releases;
  std::vector<EntryView> gossip;
  std::vector<SpliceView> splices;
  std::vector<ArrayView> frontiers;
  std::vector<InsertionView> insertions;
  void expose(const Gossip& source) {
    gossip.clear();
    for (const auto& e : source) gossip.push_back(e.acknowledgement
      ? EntryView{1, address(e.frontier.data()), Word(e.frontier.size()), 0}
      : EntryView{0, address(&e.insertion.coordinates), 6, e.insertion.content});
  }
};
static_assert(sizeof(Span) == 12 && sizeof(EntryView) == 16 && sizeof(SpliceView) == 16);
std::array<Output, lease_count> outputs;
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
struct Reader {
  std::size_t position{};
  bool valid = true;
  Entry invalid() { valid = false; return {}; }
  Word word() {
    if (position >= input.size()) { valid = false; return 0; }
    return input[position++];
  }
  Gossip gossip(Word count) {
    if (count > input.size() - position) { valid = false; return {}; }
    Gossip entries;
    entries.reserve(count);
    for (Word i = 0; i < count && valid; ++i) entries.push_back(entry());
    return entries;
  }
  Entry entry() {
      const auto tag = word();
      const auto offset = word(), count = word(), content = word();
      if (offset > input.size() || count > input.size() - offset) return invalid();
      const auto data = input.subspan(offset, count);
      if (tag == 1) {
        if (!count || !(count & 1)) return invalid();
        return Entry::acknowledge({data.begin(), data.end()});
      }
      else if (tag == 0) {
        if (count != 6) return invalid();
        Coordinates c{data[0], data[1], data[2], data[3], data[4], std::bit_cast<std::int32_t>(data[5])};
        if (!c.diff || c.diff == std::numeric_limits<std::int32_t>::min()) return invalid();
        session_ids.insert(c.anchor_session);
        session_ids.insert(c.session);
        return Entry::insert({c, content});
      } else return invalid();
  }
  std::vector<Acknowledgement> frontiers(Word count) {
    if (count > input.size() - position) { valid = false; return {}; }
    std::vector<Acknowledgement> entries;
    for (Word n = 0; n < count && valid; ++n) {
      auto e = entry();
      if (!e.acknowledgement) { valid = false; return {}; }
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
void runtime_create(std::uint32_t id, std::uint32_t actor) {
  using namespace sequencer;
  if (projections.size() <= id) projections.resize(std::size_t(id) + 1);
  projections[id] = std::make_unique<Projection>(actor, next_session(), next_session());
}
void runtime_destroy(std::uint32_t id) {
  if (id < sequencer::projections.size()) sequencer::projections[id].reset();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t* runtime_dispatch(std::uint32_t lease, std::uint32_t operation, std::uint32_t id,
  std::uint32_t arg0, std::uint32_t arg1, std::uint32_t arg2, const std::uint32_t* pointer, std::uint32_t count) {
  using namespace sequencer;
  input = {pointer, count};
  auto& out = outputs[lease];
  out.header = {6, 0, 0, 0, 0, 0, 0};
  if (operation == 11) { runtime_destroy(id); return out.header.data(); }
  if (operation == 0) runtime_create(id, arg0);
  if (id >= projections.size() || !projections[id]) { out.header = {7, 0, 0, 1, 0, 0, 0}; return out.header.data(); }
  auto& p = *projections[id];
  p.released.clear();
  Word kind = 6;
  try {
    switch (operation) {
      case 0: {
        Reader r;
        const auto flag = r.word(), nf = r.word(), ni = r.word();
        auto f = r.frontiers(nf); auto g = r.gossip(ni);
        if (flag != 1 || !r.valid) { kind = 7; out.header[3] = 2; break; }
        for (const auto& e : g) {
          const auto c = e.insertion.coordinates;
          for (auto* clock : {&p.increase_clock, &p.decrease_clock})
            if ((*clock)[0] == c.session || (*clock)[0] == c.anchor_session) (*clock)[0] = next_session();
        }
        p.hydrate(g, f); break;
      }
      case 1: {
        Reader r;
        const auto n = r.word();
        out.result.changes.clear(); out.result.gossip.clear();
        kind = 4;
        for (Word i = 0; i < n; ++i) {
          const auto entry = r.entry();
          if (!r.valid) { kind = 0; break; }
          auto applied = p.apply({entry});
          out.result.changes.insert(out.result.changes.end(), std::make_move_iterator(applied.changes.begin()), std::make_move_iterator(applied.changes.end()));
          out.result.gossip.insert(out.result.gossip.end(), std::make_move_iterator(applied.gossip.begin()), std::make_move_iterator(applied.gossip.end()));
        }
        if (!r.valid) kind = 0;
        break;
      }
      case 2: out.entries = p.insert(arg0, arg1, arg2); kind = 2; break;
      case 3: out.header[3] = p.length(); kind = 1; break;
      case 4: {
        Reader r;
        const auto flag = r.word(), nf = r.word(), ni = r.word();
        auto f = r.frontiers(nf); auto g = r.gossip(ni);
        if (flag != 1 || !r.valid) { kind = 0; break; }
        out.result = p.merge(g, f); kind = 4; break;
      }
      case 5: out.entries = p.remove(arg0 == UINT32_MAX ? 0 : arg0, arg1 == UINT32_MAX ? std::int64_t(p.length()) - 1 : arg1); kind = 2; break;
      case 6: { Reader r; auto end = r.word(); out.entries = p.replace(arg0, arg1, arg2 == UINT32_MAX ? 0 : arg2, end == UINT32_MAX ? std::int64_t(p.length()) - 1 : end); kind = 2; break; }
      case 7: p.frontier.retire(arg0); break;
      case 8: out.sequence = p.sequence(); kind = 5; break;
      case 9: out.values = p.values(arg0, arg0); kind = 3; break;
      case 10: out.values = p.values(arg0 == UINT32_MAX ? 0 : arg0, arg1 == UINT32_MAX ? p.length() - 1 : arg1); kind = 3; break;
      default: kind = 7; out.header[3] = 2; break;
    }
  } catch (...) {
    kind = operation == 1 || operation == 4 ? 0 : 7;
    out.header[3] = 2;
  }
  out.releases.swap(p.released);
  out.header[0] = kind;
  out.header[1] = address(out.releases.data()); out.header[2] = Word(out.releases.size());
  switch (kind) {
    case 2:
      out.expose(out.entries);
      out.header[3] = address(out.gossip.data()); out.header[4] = Word(out.gossip.size()); break;
    case 3:
      out.header[3] = address(out.values.data()); out.header[4] = Word(out.values.size()); break;
    case 4:
      out.splices.clear();
      for (const auto& s : out.result.changes) out.splices.push_back({s.start, s.end, address(s.values.data()), Word(s.values.size())});
      out.expose(out.result.gossip);
      out.header[3] = address(out.splices.data()); out.header[4] = Word(out.splices.size());
      out.header[5] = address(out.gossip.data()); out.header[6] = Word(out.gossip.size()); break;
    case 5:
      out.frontiers.clear(); out.insertions.clear();
      for (const auto& f : out.sequence.frontiers) out.frontiers.push_back({address(f.data()), Word(f.size())});
      for (const auto& i : out.sequence.insertions) out.insertions.push_back({address(&i.coordinates), address(i.footage.data()), Word(i.footage.size())});
      out.header[3] = address(out.frontiers.data()); out.header[4] = Word(out.frontiers.size());
      out.header[5] = address(out.insertions.data()); out.header[6] = Word(out.insertions.size()); break;
  }
  return out.header.data();
}
}
