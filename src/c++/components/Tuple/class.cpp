#include "class.hpp"

namespace sequencer {
Tuple::Tuple(Word capacity) : capacity(capacity) {
  if (capacity != UINT32_MAX)
    slots.resize(capacity);
}
Tuple::Slot &Tuple::slot(Word at) {
  if (capacity != UINT32_MAX)
    return slots[at];
  const auto number = at / page_size;
  auto page = page_index.get(number, 0);
  if (!page) {
    pages.push_back({number});
    page = Word(pages.size());
    page_index.set({0, 0, 0, number, 0, 0}, page);
  }
  return pages[page - 1].slots[at % page_size];
}
const Tuple::Slot *Tuple::find_slot(Word at) const {
  if (capacity != UINT32_MAX)
    return at < capacity ? &slots[at] : nullptr;
  const auto page = page_index.get(at / page_size, 0);
  return page ? &pages[page - 1].slots[at % page_size] : nullptr;
}
void Tuple::share(Word content, Word count) {
  auto index = binding_index.get(content, 0);
  if (!index) {
    index = Word(bindings.size()) + 1;
    bindings.push_back({});
    binding_index.set({0, 0, 0, content, 0, 0}, index);
  }
  bindings[index - 1] = {count, count, false};
}
Index Tuple::winner(Word at) const {
  const auto *entry = find_slot(at);
  return entry ? entry->winner : none;
}
bool Tuple::valid(const Coordinates &c, const ContainmentTable &containment) const {
  if (!c.session || c.start > UINT32_MAX - 2 || c.anchor_diff == UINT32_MAX ||
      (capacity != UINT32_MAX && c.anchor_diff >= capacity))
    return false;
  if (c.diff == 1)
    return !(c.anchor_session | c.anchor_start);
  if (c.diff != -1 || !c.anchor_session)
    return false;
  const auto target = containment.get(c.anchor_session, c.anchor_start);
  return !target || (versions[target].coordinates.diff == 1 &&
                     versions[target].coordinates.anchor_diff == c.anchor_diff);
}
Index Tuple::add(Insertion insertion, bool shared) {
  const auto index = Word(versions.size());
  versions.push_back(
      {insertion.coordinates, insertion.content, insertion.content_start, 0, false, shared});
  const auto &c = insertion.coordinates;
  if (c.diff > 0) {
    auto &entry = slot(c.anchor_diff);
    versions[index].next = entry.head;
    versions[index].active = true;
    entry.head = index;
    if (!entry.winner ||
        identity(c.session, c.start) > identity(versions[entry.winner].coordinates.session,
                                                versions[entry.winner].coordinates.start))
      entry.winner = index;
  }
  return index;
}
void Tuple::erase(Index target, std::vector<Span> &released, std::vector<Span> &copied) {
  auto &version = versions[target];
  if (!version.active)
    return;
  version.active = false;
  auto &entry = slot(version.coordinates.anchor_diff);
  // Unlink removed candidates so future edits scan only active conflicts.
  auto *link = &entry.head;
  while (*link != target)
    link = &versions[*link].next;
  *link = version.next;
  if (entry.winner == target) {
    entry.winner = entry.head;
    for (auto i = entry.head; i; i = versions[i].next) {
      const auto &a = versions[i].coordinates;
      const auto &b = versions[entry.winner].coordinates;
      if (identity(a.session, a.start) > identity(b.session, b.start))
        entry.winner = i;
    }
  }
  const auto token = version.content;
  if (!version.shared) {
    if (token)
      released.push_back({token, 0, 0});
    version.content = 0;
    return;
  }
  auto &binding = bindings[binding_index.get(token, 0) - 1];
  if (--binding.references == 0) {
    released.push_back({token, 0, 0});
  } else {
    if (!binding.owned) {
      copied.push_back({token, 0, binding.extent});
      binding.owned = true;
    }
    released.push_back({token, version.content_start, 1});
  }
  version.content = 0;
}
std::vector<Word> Tuple::occupied(Word start, Word end) const {
  std::vector<Word> result;
  if (start > end)
    return result;
  if (std::uint64_t(end) - start < page_size) {
    for (Word at = start; at <= end; ++at)
      if (const auto *entry = find_slot(at); entry && entry->head)
        result.push_back(at);
  } else if (capacity != UINT32_MAX) {
    for (Word at = start; at < capacity && at <= end; ++at)
      if (slots[at].head)
        result.push_back(at);
  } else {
    for (const auto &page : pages) {
      const auto base = page.number * page_size;
      if (base > end || std::uint64_t(base) + page_size <= start)
        continue;
      for (Word offset = 0; offset < page_size; ++offset) {
        const auto at = base + offset;
        if (at >= start && at <= end && page.slots[offset].head)
          result.push_back(at);
      }
    }
  }
  return result;
}
Span Tuple::value(Word at) const {
  const auto index = winner(at);
  if (!index)
    return {0, 0, 1};
  const auto &insertion = versions[index];
  return {insertion.content, insertion.content_start, 1};
}
} // namespace sequencer
