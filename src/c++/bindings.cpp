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
  std::array<Word, 12> header{};
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
Word registered_session{}, registered_anchor{};
void register_sessions(const Coordinates &c) {
  if (c.session != registered_session) {
    session_ids.insert(c.session);
    registered_session = c.session;
  }
  if (c.anchor_session != registered_anchor) {
    session_ids.insert(c.anchor_session);
    registered_anchor = c.anchor_session;
  }
}
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
  Word bindings{};
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
  Word snapshot_word() {
    const auto value = word();
    if (value != 0x3fffffffu)
      return value;
    const auto low = word(), high = word();
    if ((low | high) > 0xffffu)
      valid = false;
    return low | (high << 16);
  }
  Word session() {
    const auto low = word(), high = word();
    if ((low | high) > 0xffffu)
      valid = false;
    return low | (high << 16);
  }
  Coordinates snapshot_coordinates(const Coordinates &previous) {
    const auto control = word();
    if (control > 0x3fffffffu)
      valid = false;
    Coordinates c;
    c.session = control & 1 ? session() : previous.session;
    c.anchor_session = control & 2 ? session() : c.session;
    c.start =
        control & 4 ? snapshot_word()
        : c.session != previous.session
            ? 0
            : previous.start + (previous.diff < 0 ? Word(-previous.diff) : Word(previous.diff)) + 1;
    c.anchor_start = control & 8 ? snapshot_word() : control >> 6;
    c.anchor_diff = control & 16 ? snapshot_word() : 1;
    if (control & 32) {
      const auto diff = snapshot_word();
      c.diff = std::bit_cast<std::int32_t>((diff >> 1) ^ (0u - (diff & 1)));
    } else
      c.diff = 1;
    return c;
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
      register_sessions(c);
      return Entry::insert({c, content});
    } else
      return invalid();
  }
  std::pair<Gossip, std::vector<Acknowledgement>> sequence(Word content) {
    Gossip insertions;
    std::vector<Acknowledgement> frontiers;
    if (input.empty())
      return {std::move(insertions), std::move(frontiers)};
    auto end = word();
    const auto packed = end == 0;
    Word records = 0;
    if (packed) {
      end = word();
      records = word();
    }
    if (end < position || end > input.size() ||
        (packed ? records > input.size() - end : (input.size() - end) % 6 != 0)) {
      valid = false;
      return {};
    }
    while (position < end) {
      const auto count = word();
      if (!count || !(count & 1) || count > end - position) {
        valid = false;
        return {};
      }
      if (packed) {
        auto &a = frontiers.emplace_back();
        a.reserve(count);
        for (Word i = 0; i < count; ++i)
          a.push_back(snapshot_word());
        if (!valid || position > end) {
          valid = false;
          return {};
        }
      } else {
        frontiers.emplace_back(input.begin() + position, input.begin() + position + count);
        position += count;
      }
    }
    if (!packed)
      records = Word((input.size() - end) / 6);
    insertions.reserve(records);
    Word offset = 0;
    Coordinates previous;
    for (Word i = 0; i < records; ++i) {
      Coordinates c;
      if (packed)
        c = snapshot_coordinates(previous);
      else {
        const auto data = input.subspan(position, 6);
        c = {data[0], data[1], data[2], data[3], data[4], std::bit_cast<std::int32_t>(data[5])};
        position += 6;
      }
      if (!valid || !c.diff || c.diff == std::numeric_limits<std::int32_t>::min()) {
        valid = false;
        return {};
      }
      register_sessions(c);
      insertions.push_back(Entry::insert({c, c.diff > 0 ? content + bindings++ : 0, offset}));
      if (c.diff > 0)
        offset += Word(c.diff);
      previous = c;
    }
    if (position != input.size()) {
      valid = false;
      return {};
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
      out.header[11] = r.bindings;
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
        out.header[11] = std::max(out.header[11], entry.insertion.content);
        p.apply(std::span(&entry, 1), out.result);
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
      out.header[11] = r.bindings;
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
      p.values(arg0 == UINT32_MAX ? 0 : arg0, arg1 == UINT32_MAX ? p.length() - 1 : arg1,
               out.values);
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
      out.splices.push_back(
          {s.start, s.end, s.values ? address(&*s.values) : 0, Word(s.values.has_value())});
    out.expose(out.result.gossip);
    out.header[3] = address(out.splices.data());
    out.header[4] = Word(out.splices.size());
    out.header[5] = address(out.gossip.data());
    out.header[6] = Word(out.gossip.size());
    break;
  case 5:
    if (out.sequence.footage.size() == 1 && out.sequence.shared_root) {
      const auto root = out.sequence.shared_root;
      const auto &source = p.strips.identity[root];
      const auto span = out.sequence.footage[0];
      if (span.content == source.content && span.start == source.content_start &&
          span.count == Word(source.coordinates.diff))
        for (auto i = root; i; i = p.strips.fragment[i])
          p.strips.identity[i].content_owned = false;
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
