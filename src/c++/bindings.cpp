#include "class.hpp"
#include <algorithm>
#include <bit>
#include <limits>
#include <memory>
#include <span>
#include <unordered_set>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

namespace sequencer {
namespace {
std::vector<std::unique_ptr<Projection>> projections;
std::span<const Word> input;

std::vector<Word> input_buffer;
Word address(const void *pointer) { return Word(reinterpret_cast<std::uintptr_t>(pointer)); }
struct EntryView {
  Word tag, pointer, count, content;
};
struct SpliceView {
  Word start, end, pointer, count;
};
struct Output {
  std::array<Word, 11> header{};
  Gossip entries;
  Result result;
  Sequence sequence;
  std::vector<Span> values, releases;
  std::vector<Span> copies;
  std::vector<ContentAppend> appends;
  std::vector<EntryView> gossip;
  std::vector<SpliceView> splices;
  void expose(const Gossip &source) {
    gossip.clear();
    for (const auto &e : source)
      gossip.push_back(
          e.acknowledgement
              ? EntryView{1, address(e.frontier.data()), Word(e.frontier.size()), 0}
              : EntryView{0, address(&e.insertion.coordinates), 6, e.insertion.content});
  }
};
static_assert(sizeof(Span) == 12 && sizeof(EntryView) == 16 && sizeof(SpliceView) == 16);
Output out;
std::unordered_set<Word> session_ids;
Word random_state = 0x9e3779b9;
Word next_session() {
  Word id;
  do {
    random_state ^= random_state << 13;
    random_state ^= random_state >> 17;
    random_state ^= random_state << 5;
    id = random_state;
  } while (!id || session_ids.contains(id));
  return id;
}
struct Reader {
  std::size_t position{};
  bool valid = true;
  Entry invalid() {
    valid = false;
    return {};
  }
  Word word() {
    if (position >= input.size()) {
      valid = false;
      return 0;
    }
    return input[position++];
  }
  Entry entry() {
    const auto tag = word();
    const auto offset = word(), count = word(), content = word();
    if (offset > input.size() || count > input.size() - offset)
      return invalid();
    const auto data = input.subspan(offset, count);
    if (tag == 1) {
      if (!count || !(count & 1))
        return invalid();
      return Entry::acknowledge({data.begin(), data.end()});
    } else if (tag == 0) {
      if (count != 6)
        return invalid();
      Coordinates c{data[0], data[1], data[2],
                    data[3], data[4], std::bit_cast<std::int32_t>(data[5])};
      if (!c.diff || c.diff == std::numeric_limits<std::int32_t>::min())
        return invalid();
      session_ids.insert(c.anchor_session);
      session_ids.insert(c.session);
      return Entry::insert({c, content});
    } else
      return invalid();
  }
  std::pair<Gossip, std::vector<Acknowledgement>> sequence(Word content) {
    Gossip insertions;
    std::vector<Acknowledgement> frontiers;
    if (input.empty())
      return {std::move(insertions), std::move(frontiers)};
    const auto end = word();
    if (!end || end > input.size() || (input.size() - end) % 6) {
      valid = false;
      return {};
    }
    while (position < end) {
      const auto count = word();
      if (!count || !(count & 1) || count > end - position) {
        valid = false;
        return {};
      }
      frontiers.emplace_back(input.begin() + position, input.begin() + position + count);
      position += count;
    }
    insertions.reserve((input.size() - end) / 6);
    Word offset = 0;
    while (position < input.size()) {
      const auto data = input.subspan(position, 6);
      Coordinates c{data[0], data[1], data[2],
                    data[3], data[4], std::bit_cast<std::int32_t>(data[5])};
      if (!c.diff || c.diff == std::numeric_limits<std::int32_t>::min()) {
        valid = false;
        return {};
      }
      session_ids.insert(c.anchor_session);
      session_ids.insert(c.session);
      insertions.push_back(
          Entry::insert({c, c.diff > 0 ? content + Word(insertions.size()) : 0, offset}));
      if (c.diff > 0)
        offset += Word(c.diff);
      position += 6;
    }
    return {std::move(insertions), std::move(frontiers)};
  }
};
} // namespace
} // namespace sequencer

extern "C" {
EMSCRIPTEN_KEEPALIVE void runtime_seed(std::uint32_t seed) {
  sequencer::random_state = seed ? seed : 1;
}
EMSCRIPTEN_KEEPALIVE std::uint32_t *runtime_reserve(std::uint32_t count) {
  using namespace sequencer;
  if (input_buffer.size() < count)
    input_buffer.resize(count);
  return input_buffer.data();
}
void runtime_create(std::uint32_t id, std::uint32_t actor) {
  using namespace sequencer;
  if (projections.size() <= id)
    projections.resize(std::size_t(id) + 1);
  projections[id] = std::make_unique<Projection>(actor, next_session(), next_session());
}
void runtime_destroy(std::uint32_t id) {
  if (id < sequencer::projections.size())
    sequencer::projections[id].reset();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *
runtime_dispatch(std::uint32_t operation, std::uint32_t id, std::uint32_t arg0, std::uint32_t arg1,
                 std::uint32_t arg2, const std::uint32_t *pointer, std::uint32_t count) {
  using namespace sequencer;
  input = {pointer, count};
  out.header = {6, 0, 0, 0, 0, 0, 0};
  if (operation == 11) {
    runtime_destroy(id);
    return out.header.data();
  }
  if (operation == 0)
    runtime_create(id, arg0);
  if (id >= projections.size() || !projections[id]) {
    out.header = {7, 0, 0, 1, 0, 0, 0};
    return out.header.data();
  }
  auto &p = *projections[id];
  p.released.clear();
  p.appended.clear();
  p.copied.clear();
  Word kind = 6;
  try {
    switch (operation) {
    case 0: {
      Reader r;
      auto [g, f] = r.sequence(arg1);
      if (arg2 != 1 || !r.valid) {
        kind = 7;
        out.header[3] = 2;
        break;
      }
      for (const auto &e : g) {
        const auto c = e.insertion.coordinates;
        for (auto *clock : {&p.increase_clock, &p.decrease_clock})
          if ((*clock)[0] == c.session || (*clock)[0] == c.anchor_session)
            (*clock)[0] = next_session();
      }
      p.hydrate(g, f);
      break;
    }
    case 1: {
      Reader r;
      const auto n = r.word();
      out.result.changes.clear();
      out.result.gossip.clear();
      kind = 4;
      for (Word i = 0; i < n; ++i) {
        const auto entry = r.entry();
        if (!r.valid) {
          kind = 0;
          break;
        }
        auto applied = p.apply(std::span(&entry, 1));
        out.result.changes.insert(out.result.changes.end(),
                                  std::make_move_iterator(applied.changes.begin()),
                                  std::make_move_iterator(applied.changes.end()));
        out.result.gossip.insert(out.result.gossip.end(),
                                 std::make_move_iterator(applied.gossip.begin()),
                                 std::make_move_iterator(applied.gossip.end()));
      }
      if (!r.valid)
        kind = 0;
      break;
    }
    case 4: {
      Reader r;
      auto [g, f] = r.sequence(arg1);
      if (arg2 != 1 || !r.valid) {
        kind = 0;
        break;
      }
      out.result = p.merge(g, f);
      kind = 4;
      break;
    }
    case 5:
      out.entries = p.remove(arg0 == UINT32_MAX ? 0 : arg0,
                             arg1 == UINT32_MAX ? std::int64_t(p.length()) - 1 : arg1);
      kind = 2;
      break;
    case 6: {
      Reader r;
      auto end = r.word();
      out.entries = p.replace(arg0, arg1, arg2 == UINT32_MAX ? 0 : arg2,
                              end == UINT32_MAX ? std::int64_t(p.length()) - 1 : end);
      kind = 2;
      break;
    }
    case 7:
      p.frontier.retire(arg0);
      break;
    case 8:
      out.sequence = p.sequence();
      kind = 5;
      break;
    case 10:
      out.values =
          p.values(arg0 == UINT32_MAX ? 0 : arg0, arg1 == UINT32_MAX ? p.length() - 1 : arg1);
      kind = 3;
      break;
    default:
      kind = 7;
      out.header[3] = 2;
      break;
    }
  } catch (...) {
    kind = operation == 1 || operation == 4 ? 0 : 7;
    out.header[3] = 2;
  }
  out.releases.swap(p.released);
  out.appends.swap(p.appended);
  out.copies.swap(p.copied);
  out.header[0] = kind;
  out.header[1] = address(out.releases.data());
  out.header[2] = Word(out.releases.size());
  out.header[7] = address(out.appends.data());
  out.header[8] = Word(out.appends.size());
  out.header[9] = address(out.copies.data());
  out.header[10] = Word(out.copies.size());
  switch (kind) {
  case 2:
    out.expose(out.entries);
    out.header[3] = address(out.gossip.data());
    out.header[4] = Word(out.gossip.size());
    break;
  case 3:
    out.header[3] = address(out.values.data());
    out.header[4] = Word(out.values.size());
    break;
  case 4:
    out.splices.clear();
    for (const auto &s : out.result.changes)
      out.splices.push_back({s.start, s.end, address(s.values.data()), Word(s.values.size())});
    out.expose(out.result.gossip);
    out.header[3] = address(out.splices.data());
    out.header[4] = Word(out.splices.size());
    out.header[5] = address(out.gossip.data());
    out.header[6] = Word(out.gossip.size());
    break;
  case 5:
    if (out.sequence.footage.size() == 1) {
      const auto token = out.sequence.footage[0].content;
      for (auto at = out.sequence.words.empty() ? 0 : out.sequence.words[0];
           at < out.sequence.words.size(); at += 6) {
        if (std::bit_cast<std::int32_t>(out.sequence.words[at + 5]) <= 0)
          continue;
        const auto root = p.containment.get(out.sequence.words[at + 3], out.sequence.words[at + 4]);
        if (p.strips.identity[root].content != token)
          continue;
        const auto &source = p.strips.identity[root];
        if (out.sequence.footage[0].start != source.content_start ||
            out.sequence.footage[0].count != Word(source.coordinates.diff))
          break;
        for (auto i = root; i; i = p.strips.fragment[i])
          p.strips.identity[i].content_owned = false;
        break;
      }
    }
    out.header[3] = address(out.sequence.words.data());
    out.header[4] = Word(out.sequence.words.size());
    out.header[5] = address(out.sequence.footage.data());
    out.header[6] = Word(out.sequence.footage.size());
    break;
  }
  return out.header.data();
}
EMSCRIPTEN_KEEPALIVE std::uint32_t runtime_length(std::uint32_t id) {
  return sequencer::projections[id]->length();
}
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_insert(std::uint32_t id, std::uint32_t count,
                                                         std::uint32_t content, std::uint32_t at) {
  using namespace sequencer;
  auto &p = *projections[id];
  p.appended.clear();
  p.released.clear();
  p.copied.clear();
  const auto insertion = p.insert(count, content, at);
  static std::array<Word, 9> result;
  const auto coordinates = std::bit_cast<std::array<Word, 6>>(insertion.coordinates);
  std::copy(coordinates.begin(), coordinates.end(), result.begin());
  result[6] = 0;
  if (!p.appended.empty()) {
    const auto &append = p.appended.back();
    result[6] = append.target;
    result[7] = append.at;
    result[8] = append.base;
  }
  return result.data();
}
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_value(std::uint32_t id, std::uint32_t at) {
  using namespace sequencer;
  auto &p = *projections[id];
  if (at >= p.length())
    return nullptr;
  const auto frame = p.find_frame(at);
  static std::array<Word, 2> value;
  value = {p.strips.identity[p.gate].content, p.strips.identity[p.gate].content_start + frame};
  return value.data();
}
}
