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
struct Output {
  std::array<Word, 8> header{};
  Gossip entries;
  Result result;
  Sequence sequence;
  std::vector<Span> values, releases;
  std::vector<Word> buffer;
};
static_assert(sizeof(Span) == 12);
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
  } while (!id || !session_ids.insert(id).second);
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
  Gossip gossip(Word count) {
    if (count > input.size() - position) {
      valid = false;
      return {};
    }
    Gossip entries;
    entries.reserve(count);
    for (Word i = 0; i < count && valid; ++i)
      entries.push_back(entry());
    return entries;
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
  std::vector<Acknowledgement> frontiers(Word count) {
    if (count > input.size() - position) {
      valid = false;
      return {};
    }
    std::vector<Acknowledgement> entries;
    for (Word n = 0; n < count && valid; ++n) {
      auto e = entry();
      if (!e.acknowledgement) {
        valid = false;
        return {};
      }
      entries.push_back(std::move(e.frontier));
    }
    return entries;
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
                 std::uint32_t arg2, const std::uint32_t *pointer, std::uint32_t input_count) {
  using namespace sequencer;
  input = {pointer, input_count};
  out.header = {6, 0, 0, 0, 0, 0, 0, 8};
  if (operation == 11) {
    runtime_destroy(id);
    return out.header.data();
  }
  if (operation == 0)
    runtime_create(id, arg0);
  if (id >= projections.size() || !projections[id]) {
    out.header = {7, 0, 0, 1, 0, 0, 0, 8};
    return out.header.data();
  }
  auto &p = *projections[id];
  p.released.clear();
  Word kind = 6;
  try {
    switch (operation) {
    case 0: {
      Reader r;
      const auto flag = r.word(), nf = r.word(), ni = r.word();
      auto f = r.frontiers(nf);
      auto g = r.gossip(ni);
      if (flag != 1 || !r.valid) {
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
        auto applied = p.apply({entry});
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
    case 2:
      out.entries = p.insert(arg0, arg1, arg2);
      kind = 2;
      break;
    case 3:
      out.header[3] = p.length();
      kind = 1;
      break;
    case 4: {
      Reader r;
      const auto flag = r.word(), nf = r.word(), ni = r.word();
      auto f = r.frontiers(nf);
      auto g = r.gossip(ni);
      if (flag != 1 || !r.valid) {
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
    case 9:
      out.values = p.values(arg0, arg0);
      kind = 3;
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
  out.header[0] = kind;
  out.header[2] = Word(out.releases.size());
  const auto gossip_words = [](const Gossip &gossip) {
    Word count = Word(gossip.size()) * 4;
    for (const auto &e : gossip)
      count += e.acknowledgement ? Word(e.frontier.size()) : 6;
    return count;
  };
  Word count = 8 + Word(out.releases.size()) * 3;
  switch (kind) {
  case 2:
    count += gossip_words(out.entries);
    break;
  case 3:
    count += Word(out.values.size()) * 3;
    break;
  case 4:
    count += Word(out.result.changes.size()) * 4 + gossip_words(out.result.gossip);
    for (const auto &s : out.result.changes)
      count += Word(s.values.size()) * 3;
    break;
  case 5:
    count += Word(out.sequence.frontiers.size()) * 2 + Word(out.sequence.insertions.size()) * 9;
    for (const auto &f : out.sequence.frontiers)
      count += Word(f.size());
    for (const auto &i : out.sequence.insertions)
      count += Word(i.footage.size()) * 3;
    break;
  }
  out.buffer.resize(count);
  std::copy(out.header.begin(), out.header.end(), out.buffer.begin());
  auto *header = out.buffer.data();
  header[7] = count;
  Word position = 8;
  const auto append = [&](const void *data, Word words) {
    const auto pointer = position * 4;
    if (words)
      std::memcpy(header + position, data, words * sizeof(Word));
    position += words;
    return pointer;
  };
  const auto expose = [&](const Gossip &gossip) {
    const auto pointer = position * 4;
    auto *rows = header + position;
    position += Word(gossip.size()) * 4;
    for (const auto &e : gossip) {
      const auto n = e.acknowledgement ? Word(e.frontier.size()) : 6;
      rows[0] = e.acknowledgement;
      rows[1] = append(e.acknowledgement ? static_cast<const void *>(e.frontier.data())
                                         : &e.insertion.coordinates,
                       n);
      rows[2] = n;
      rows[3] = e.insertion.content;
      rows += 4;
    }
    return pointer;
  };
  header[1] = append(out.releases.data(), Word(out.releases.size()) * 3);
  switch (kind) {
  case 2:
    header[3] = expose(out.entries);
    header[4] = Word(out.entries.size());
    break;
  case 3:
    header[3] = append(out.values.data(), Word(out.values.size()) * 3);
    header[4] = Word(out.values.size());
    break;
  case 4:
    header[3] = position * 4;
    header[4] = Word(out.result.changes.size());
    position += header[4] * 4;
    for (Word i = 0; i < header[4]; ++i) {
      const auto &s = out.result.changes[i];
      auto *row = header + header[3] / 4 + i * 4;
      row[0] = s.start;
      row[1] = s.end;
      row[2] = append(s.values.data(), Word(s.values.size()) * 3);
      row[3] = Word(s.values.size());
    }
    header[5] = expose(out.result.gossip);
    header[6] = Word(out.result.gossip.size());
    break;
  case 5:
    header[3] = position * 4;
    header[4] = Word(out.sequence.frontiers.size());
    position += header[4] * 2;
    for (Word i = 0; i < header[4]; ++i) {
      const auto &f = out.sequence.frontiers[i];
      auto *row = header + header[3] / 4 + i * 2;
      row[0] = append(f.data(), Word(f.size()));
      row[1] = Word(f.size());
    }
    header[5] = position * 4;
    header[6] = Word(out.sequence.insertions.size());
    position += header[6] * 3;
    for (Word i = 0; i < header[6]; ++i) {
      const auto &insertion = out.sequence.insertions[i];
      auto *row = header + header[5] / 4 + i * 3;
      row[0] = append(&insertion.coordinates, 6);
      row[1] = append(insertion.footage.data(), Word(insertion.footage.size()) * 3);
      row[2] = Word(insertion.footage.size());
    }
    break;
  }
  return out.buffer.data();
}
}
