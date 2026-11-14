#include "class.hpp"
#include <algorithm>

namespace sequencer {
Traversal::Block Traversal::block(Word at) const {
  const auto id = data[capacity + at];
  const auto &record = records()[id];
  return {data[at], record.first, record.last, record.count, id};
}
void Traversal::block(Word at, const Block &value) {
  data[at] = value.frames;
  data[capacity + at] = value.id;
  records()[value.id] = {value.first, value.last, value.count, at};
}
void Traversal::move(Word destination, Word source) {
  const auto id = data[capacity + source];
  data[destination] = data[source];
  data[capacity + destination] = id;
  records()[id].ordinal = destination;
}
void Traversal::clear(Word start, Word count) {
  const auto first = std::min(count, capacity - start);
  std::fill_n(data + start, first, Word(0));
  std::fill_n(data, count - first, Word(0));
}
void Traversal::rebuild() {
  std::fill_n(data + TraversalLayout::columns * capacity,
              TraversalLayout::supers(capacity) + TraversalLayout::tops(capacity), Word(0));
  rebuild(0, capacity);
}
void Traversal::rebuild(Word start, Word count) {
  auto *supers = data + TraversalLayout::columns * capacity;
  auto *tops = supers + TraversalLayout::supers(capacity);
  while (count) {
    const auto group = start / 16;
    Word sum = 0;
    for (Word at = group * 16; at < std::min(capacity, group * 16 + 16); ++at)
      sum += data[at];
    tops[group / 16] += sum - supers[group];
    supers[group] = sum;
    const auto step = std::min(count, std::min(capacity - start, 16 - start % 16));
    start = (start + step) & (capacity - 1);
    count -= step;
  }
}
void Traversal::grow(Strips &strips) {
  const auto next_capacity = TraversalLayout::capacity(strips.capacity);
  if (!next_capacity)
    return;
  auto *next = reinterpret_cast<Word *>(strips.identity + strips.capacity) +
               Strips::lanes * strips.capacity + TraversalLayout::header;
  if (next == data)
    return;
  const auto *previous = data;
  const auto previous_capacity = capacity;
  const auto previous_state = data ? metadata() : Metadata{};
  data = next;
  capacity = next_capacity;
  metadata() = {previous_state.count, previous_state.count, 0, 0};
  if (!previous_state.count)
    return;
  std::fill_n(data, capacity, Word(0));
  std::memcpy(records(), previous + 2 * previous_capacity, previous_state.count * sizeof(Record));
  auto at = previous_state.head;
  for (Word i = 0; i < previous_state.count; ++i) {
    const auto id = previous[previous_capacity + at];
    data[i] = previous[at];
    data[capacity + i] = id;
    records()[id].ordinal = i;
    at = (at + 1) & (previous_capacity - 1);
    if (at == previous_state.gap)
      at = (at + previous_capacity - previous_state.count) & (previous_capacity - 1);
  }
  rebuild();
}
void Traversal::prepare(Strips &strips, Index first, Word linked) {
  if (linked > 8 && !metadata().count)
    build(strips, first, linked);
}
std::pair<Index, Index> Traversal::build(Strips &strips, Index first, Word linked) {
  if (capacity)
    metadata() = {};
  Index visible_head = none, visible_tail = none;
  if (linked <= 8) {
    for (auto node = first; node; node = strips.right[node])
      if (strips.fragment_diff[node] > 0) {
        if (!visible_head)
          visible_head = node;
        visible_tail = node;
      }
    return {visible_head, visible_tail};
  }
  std::fill_n(data, capacity, Word(0));
  const auto width = TraversalLayout::width(linked);
  for (auto node = first; node;) {
    Block entry{0, node, node, 0, metadata().count};
    while (node && entry.count < width) {
      strips.block_root[node] = entry.id;
      const auto frames = Word(std::max(0, strips.fragment_diff[node]));
      entry.frames += frames;
      if (frames) {
        if (!visible_head)
          visible_head = node;
        visible_tail = node;
      }
      entry.last = node;
      ++entry.count;
      node = strips.right[node];
    }
    block(metadata().count++, entry);
  }
  metadata().gap = metadata().count;
  rebuild();
  return {visible_head, visible_tail};
}
Word Traversal::prefix(Word end) const {
  const auto *supers = data + TraversalLayout::columns * capacity;
  const auto *tops = supers + TraversalLayout::supers(capacity);
  Word result = 0;
  for (Word at = 0; at < end / 256; ++at)
    result += tops[at];
  for (Word at = (end / 256) * 16; at < end / 16; ++at)
    result += supers[at];
  for (Word at = end - end % 16; at < end; ++at)
    result += data[at];
  return result;
}
void Traversal::add(Word at, Word delta) {
  data[at] += delta;
  auto *supers = data + TraversalLayout::columns * capacity;
  supers[at / 16] += delta;
  supers[TraversalLayout::supers(capacity) + at / 256] += delta;
  if (at < metadata().head)
    metadata().before += delta;
}
void Traversal::update(const Strips &strips, Index node, std::int32_t previous) {
  if (capacity && metadata().count)
    add(records()[strips.block_root[node]].ordinal,
        Word(std::max(0, strips.fragment_diff[node])) - Word(std::max(0, previous)));
}
void Traversal::split(Strips &strips, Index first, Index incoming) {
  const auto id = strips.block_root[incoming];
  const auto at = records()[id].ordinal;
  auto left = block(at);
  const auto left_count = left.count / 2;
  auto right_first = left.first;
  for (Word i = 0; i < left_count; ++i)
    right_first = strips.right[right_first];
  Block right{0, right_first, left.last, left.count - left_count, metadata().count};
  for (auto node = right.first;; node = strips.right[node]) {
    strips.block_root[node] = right.id;
    right.frames += Word(std::max(0, strips.fragment_diff[node]));
    if (node == right.last)
      break;
  }
  left.count = left_count;
  left.last = strips.left[right.first];
  left.frames -= right.frames;
  block(at, left);
  auto &state = metadata();
  const auto mask = capacity - 1, position = (at + 1) & mask;
  const auto available = capacity - state.count;
  const auto gap = state.gap, end = (gap + available) & mask;
  const auto left_distance = (gap - position) & mask;
  const auto right_distance = (position - end) & mask;
  // Circular movement keeps both endpoints and repeated interior edits near the free rows.
  if (left_distance <= right_distance) {
    for (Word i = 0; i < left_distance; ++i)
      move((end - i - 1) & mask, (state.gap - i - 1) & mask);
    state.gap = position;
    clear(position, std::min(left_distance, available));
    rebuild(position, left_distance);
    rebuild((end - left_distance) & mask, left_distance);
  } else {
    for (Word i = 0; i < right_distance; ++i)
      move((state.gap + i) & mask, (end + i) & mask);
    state.gap = (state.gap + right_distance) & mask;
    const auto cleared = std::min(right_distance, available);
    clear((position - cleared) & mask, cleared);
    rebuild(end, right_distance);
    rebuild(gap, right_distance);
  }
  const auto added = state.gap;
  block(added, right);
  state.gap = (state.gap + 1) & mask;
  ++state.count;
  state.head = records()[strips.block_root[first]].ordinal;
  rebuild(at, 1);
  if (at / 16 != added / 16)
    rebuild(added, 1);
  state.before = prefix(state.head);
}
void Traversal::insert(Strips &strips, Index first, Word linked, Index incoming, Word transferred) {
  if (linked <= 8 || !metadata().count)
    return;
  if (linked == 257 || linked == 1025 || linked == 4097) {
    build(strips, first, linked);
    return;
  }
  const auto neighbor = strips.left[incoming] ? strips.left[incoming] : strips.right[incoming];
  const auto id = strips.block_root[neighbor];
  auto &record = records()[id];
  const auto at = record.ordinal;
  if (strips.right[incoming] == record.first)
    record.first = incoming;
  if (strips.left[incoming] == record.last)
    record.last = incoming;
  const auto count = ++record.count;
  const auto delta = Word(std::max(0, strips.fragment_diff[incoming])) - transferred;
  if (delta)
    add(at, delta);
  strips.block_root[incoming] = id;
  if (count > TraversalLayout::width(linked))
    split(strips, first, incoming);
}
Word Traversal::position(const Strips &strips, Index first, Index node, Word frames) const {
  Word result = 0;
  auto cursor = first;
  if (capacity && metadata().count) {
    const auto &record = records()[strips.block_root[node]];
    const auto at = record.ordinal;
    result = prefix(at) - metadata().before;
    if (at < metadata().head)
      result += frames;
    cursor = record.first;
  }
  while (cursor != node) {
    result += Word(std::max(0, strips.fragment_diff[cursor]));
    cursor = strips.right[cursor];
  }
  return result;
}
std::pair<Index, Word> Traversal::find(const Strips &strips, Index first, Word position,
                                       Word frames) const {
  auto cursor = first;
  auto remaining = position;
  Index last = none;
  if (capacity && metadata().count) {
    const auto before = metadata().before;
    remaining = position < frames - before ? position + before : position - (frames - before);
    const auto *supers = data + TraversalLayout::columns * capacity;
    const auto *tops = supers + TraversalLayout::supers(capacity);
    Word group = 0;
    while (group < TraversalLayout::tops(capacity) && remaining >= tops[group])
      remaining -= tops[group++];
    if (group == TraversalLayout::tops(capacity))
      return {none, 0};
    Word super = group * 16;
    while (super < TraversalLayout::supers(capacity) && remaining >= supers[super])
      remaining -= supers[super++];
    Word at = super * 16;
    while (at < capacity && remaining >= data[at])
      remaining -= data[at++];
    if (at == capacity)
      return {none, 0};
    const auto &record = records()[data[capacity + at]];
    cursor = record.first;
    last = record.last;
  }
  while (cursor) {
    const auto frames = Word(std::max(0, strips.fragment_diff[cursor]));
    if (remaining < frames)
      return {cursor, position - remaining};
    remaining -= frames;
    if (cursor == last)
      break;
    cursor = strips.right[cursor];
  }
  return {none, 0};
}
} // namespace sequencer
