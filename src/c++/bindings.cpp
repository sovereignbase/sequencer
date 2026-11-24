/**
 * @file
 * Synchronous wasm32 ABI: numeric input, borrowed output views and opaque Footage tokens.
 */
#include "class.hpp"
#include "components/Batch/class.hpp"
#include "components/Words/reader.hpp"
#include "components/Words/writer.hpp"
#include <algorithm>
#include <bit>
#include <limits>
#include <memory>
#include <span>
#include <unordered_set>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <malloc.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

namespace sequencer {
// All Projection handles use one non-reentrant ABI and consume these before returning to JS.
std::vector<Span> released, copied;
std::vector<ContentAppend> appended;
namespace {
// Native handles match JavaScript binding-table indices. Reused handles receive new history.
std::vector<std::unique_ptr<Projection>> projections;
std::span<const Word> input;

// One retained input buffer and Output serve non-reentrant synchronous calls.
// Every returned pointer is borrowed until the next operation mutates its storage.
// The caller overwrites the next input; growth need not retain or initialize old words.
std::unique_ptr<Word[]> input_buffer;
Word input_capacity{};
Word address(const void *pointer) { return Word(reinterpret_cast<std::uintptr_t>(pointer)); }
// Output descriptors carry byte pointers; input payloads follow their record headers.
struct EntryView {
  Word tag, pointer, count, content;
};
struct Output {
  // [kind, releasePtr, releaseCount, primaryPtr, primaryCount, secondaryPtr,
  // secondaryCount, appendPtr, appendCount, copyPtr, copyCount, bindings].
  // The final lane is hydration's positive-root count or apply's highest consumed token.
  std::array<Word, 12> header{};
  Gossip entries;
  Result result;
  Sequence sequence;
  std::vector<Span> values;
  std::vector<EntryView> gossip;
  std::vector<std::uint8_t> bytes;
  // Descriptor pointers refer to source storage; source must outlive JavaScript consumption.
  void expose(const Gossip &source, bool tuple = false) {
    gossip.clear();
    for (const auto &e : source)
      gossip.push_back(e.acknowledgement_count
                           ? EntryView{1, address(e.frontier.data()), e.acknowledgement_count, 0}
                           : EntryView{tuple ? 2u : 0u, address(&e.insertion.coordinates),
                                       tuple ? e.insertion.content_start : 6u,
                                       e.insertion.content});
  }
  void expose_binary(const Gossip &source, bool tuple) {
    // Byte output tags: 3 Insertion, 4 ACK, 5 tuple Insertion with an offset prefix.
    bytes.clear();
    gossip.clear();
    for (std::size_t i = 0; i < source.size(); ++i) {
      const auto &e = source[i];
      // Tuple Footage offsets are ABI fields, separate from the encoded coordinates.
      while (bytes.size() & 3)
        bytes.push_back(0);
      auto begin = Word(bytes.size());
      const auto acknowledgement = e.acknowledgement_count != 0;
      if (tuple && !acknowledgement) {
        const auto offset = e.insertion.content_start;
        bytes.resize(bytes.size() + sizeof(offset));
        std::memcpy(bytes.data() + begin, &offset, sizeof(offset));
        begin += sizeof(offset);
      }
      WordsWriter<> writer(bytes);
      if (acknowledgement) {
        const auto actor = e.frontier[0];
        writer.uint(actor);
        for (;;) {
          if (source[i].acknowledgement_count == 3) {
            const auto session = source[i].frontier[1];
            writer.session(session);
            writer.uint(source[i].frontier[2]);
          }
          if (i + 1 == source.size() || !source[i + 1].acknowledgement_count ||
              source[i + 1].frontier[0] != actor)
            break;
          ++i;
        }
      } else {
        auto end = i;
        while (end < source.size() && !source[end].acknowledgement_count &&
               source[end].insertion.coordinates.diff < 0)
          ++end;
        if (end - i > 1 && end < source.size() && source[end].acknowledgement_count == 3 &&
            source[end].frontier[1] == source[end - 1].insertion.coordinates.session &&
            source[end].frontier[2] == source[end - 1].insertion.coordinates.start -
                                           source[end - 1].insertion.coordinates.diff) {
          writer.byte(255);
          writer.byte(1);
          writer.uint(Word(end - i));
          writer.uint(source[end].frontier[0]);
          WordsWriter<true> batch(bytes);
          for (; i < end; ++i)
            batch.append(source[i].insertion.coordinates);
        } else {
          const auto &c = e.insertion.coordinates;
          const auto combined = c.diff < 0 && i + 1 < source.size() &&
                                source[i + 1].acknowledgement_count == 3 &&
                                source[i + 1].frontier[1] == c.session &&
                                source[i + 1].frontier[2] == c.start - c.diff;
          if (combined)
            writer.byte(255);
          writer.append(e.insertion.coordinates);
          if (combined)
            writer.uint(source[++i].frontier[0]);
        }
      }
      gossip.push_back({acknowledgement ? 4u
                        : tuple         ? 5u
                                        : 3u,
                        begin, Word(bytes.size()) - begin,
                        acknowledgement ? 0 : e.insertion.content});
    }
    // Growth is complete before offsets become borrowed pointers.
    const auto base = address(bytes.data());
    for (auto &entry : gossip)
      entry.pointer += base;
  }
  /** Publishes deferred Footage updates for the current synchronous call. */
  [[gnu::always_inline]] void expose_effects() {
    header[1] = address(released.data());
    header[2] = Word(released.size());
    header[7] = address(appended.data());
    header[8] = Word(appended.size());
    header[9] = address(copied.data());
    header[10] = Word(copied.size());
  }
  /** Publishes visible changes and acknowledgement Gossip. */
  [[gnu::always_inline]] void expose_result(bool binary, bool tuple) {
    if (binary)
      expose_binary(result.gossip, tuple);
    else
      expose(result.gossip, tuple);
    header[3] = address(result.changes.data());
    header[4] = Word(result.changes.size());
    header[5] = address(gossip.data());
    header[6] = Word(gossip.size());
  }
};
static_assert(sizeof(Span) == 12 && sizeof(EntryView) == 16 && sizeof(Splice) == 20);
Output out;
std::vector<Word> decoded_acknowledgement;
std::unordered_set<Word> session_ids;
// Last-seen caching avoids repeated hash inserts in same-Session document runs.
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
// Zero belongs to the virtual root; imported Session identities cannot seed new local clocks.
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
// Bounds-checked numeric reader. Tuple and Frame semantics remain native;
// JavaScript only validates external value types before uint32 conversion.
struct Reader {
  std::size_t position{};
  Word bindings{};
  bool valid = true;
  bool tuple = false;
  Word capacity = UINT32_MAX, extent = 0;
  std::pair<Insertion, std::span<const Word>> invalid() {
    valid = false;
    return {};
  }
  /** Replays one shared coordinate stream against independent Footage bindings. */
  [[gnu::noinline]] void edit_batch(Projection &projection, Result &result, bool binary,
                                    Word &consumed) {
    const auto tag = word(), size = word(), content = word(), extent = word();
    const auto words = (std::uint64_t(size) + 3) / 4;
    if (!valid || size < 3 || words > input.size() - position) {
      valid = false;
      return;
    }
    const std::span bytes(reinterpret_cast<const std::uint8_t *>(input.data() + position), size);
    position += std::size_t(words);
    WordsReader<> header(bytes);
    const auto marker = header.byte(), format = header.byte();
    if (marker != 255 || (format != 4 && format != 5)) {
      valid = false;
      return;
    }
    const auto packed = header.uint(), positives = packed >> 2, used = packed & 3;
    std::array<Word, 2> authors{};
    for (Word sign = 0; sign < 2; ++sign)
      if (used & (Word(1) << sign)) {
        authors[sign] = header.session();
        if (!authors[sign])
          header.valid = false;
      }
    const auto reports = header.uint();
    if (!header.valid || reports > header.remaining()) {
      valid = false;
      return;
    }
    for (Word i = 0; i < reports; ++i) {
      const auto count = header.uint();
      if (!header.valid || !count || !(count & 1) || count > header.remaining()) {
        valid = false;
        return;
      }
      decoded_acknowledgement.clear();
      decoded_acknowledgement.push_back(header.uint());
      for (Word at = 1; at < count; at += 2) {
        decoded_acknowledgement.push_back(header.session());
        decoded_acknowledgement.push_back(header.uint());
      }
      if (!header.valid) {
        valid = false;
        return;
      }
      projection.frontier.observe(decoded_acknowledgement);
    }
    BatchReader reader(bytes.subspan(header.position), authors);
    const auto records = reader.records();
    if (!reader.valid || positives > records || (positives && !(used & 1)) ||
        (records > positives && !(used & 2)) || records > std::vector<Insertion>{}.max_size()) {
      valid = false;
      return;
    }
    Word offset = 0, bindings = 0, positive = 0;
    for (Word i = 0; i < records; ++i) {
      const auto c = reader.coordinates(records - i);
      if (!reader.valid || (format == 5 && c.diff > 0 && c.diff != 1) ||
          (c.diff > 0 && (positive == positives || Word(c.diff) > UINT32_MAX - offset)) ||
          (projection.tuple && !projection.tuple->valid(c, projection.containment))) {
        valid = false;
        return;
      }
      Insertion insertion{c, 0, format == 5 && tag == 8 ? 0 : offset};
      insertion.footage_state = FootageState::Retained;
      insertion.string_content = tag == 8;
      if (c.diff > 0) {
        ++positive;
        if (offset < extent) {
          insertion.content = content + bindings++;
          consumed = std::max(consumed, insertion.content);
        }
        offset += Word(c.diff);
      }
      register_sessions(c);
      projection.apply(insertion, result, binary);
    }
    valid = reader.valid && !reader.remaining() && positive == positives;
    if (valid)
      for (Word at = bindings; at < std::min(positives, extent); ++at)
        released.push_back({content + at, 0, 0});
  }
  /** Applies one byte packet containing only masks and their author's final frontier. */
  void removal_batch(Projection &projection, Result &result, bool binary) {
    const auto size = input[position + 1];
    const auto words = (std::uint64_t(size) + 3) / 4;
    if (words > input.size() - position - 3) {
      valid = false;
      return;
    }
    const auto *bytes = reinterpret_cast<const std::uint8_t *>(input.data() + position + 3);
    position += 3 + std::size_t(words);
    WordsReader<true> reader({bytes, size});
    reader.position = 2;
    reader.compact = true;
    const auto count = reader.uint(), actor = reader.uint();
    if (!reader.valid || !count || count > std::vector<Insertion>{}.max_size()) {
      valid = false;
      return;
    }
    Coordinates last;
    for (Word i = 0; i < count; ++i) {
      const auto c = reader.coordinates(count - i);
      if (!reader.valid || c.diff >= 0 ||
          (projection.tuple && !projection.tuple->valid(c, projection.containment))) {
        valid = false;
        return;
      }
      register_sessions(c);
      projection.apply({c, 0}, result, binary);
      last = c;
    }
    valid = reader.valid && !reader.remaining();
    if (valid) {
      const std::array frontier{actor, last.session, last.start - last.diff};
      projection.frontier.observe(frontier);
    }
  }
  Word word() {
    if (position >= input.size()) {
      valid = false;
      return 0;
    }
    return input[position++];
  }
  // Compact lanes fit V8 small integers; an escape retains the full uint32 bit pattern.
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
  // Six control bits mark explicit fields; higher bits inline a 24-bit anchorStart.
  // Omitted fields are predictions, never new canonical coordinates.
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
  // A rejected descriptor stops application at this entry while preserving its valid prefix.
  // Acknowledgements borrow the input until the current synchronous call returns.
  std::pair<Insertion, std::span<const Word>> entry() {
    const auto tag = word();
    const auto count = word(), content = word();
    // Byte input tags: 4 array Insertion, 5 text Insertion, 6 ACK; count is bytes.
    if (tag >= 4 && tag <= 6) {
      const auto words = (std::uint64_t(count) + 3) / 4;
      if (words > input.size() - position)
        return invalid();
      const auto *bytes = reinterpret_cast<const std::uint8_t *>(input.data() + position);
      WordsReader<> reader({bytes, count});
      position += std::size_t(words);
      if (tag == 6) {
        if (!count)
          return invalid();
        decoded_acknowledgement.clear();
        decoded_acknowledgement.push_back(reader.uint());
        while (reader.valid && reader.remaining()) {
          decoded_acknowledgement.push_back(reader.session());
          decoded_acknowledgement.push_back(reader.uint());
        }
        if (!reader.valid)
          return invalid();
        return {{}, decoded_acknowledgement};
      }
      const auto combined = count && bytes[0] == 255;
      reader.position = combined;
      const auto c = reader.coordinates();
      if (combined) {
        if (c.diff >= 0)
          return invalid();
        const auto actor = reader.uint();
        decoded_acknowledgement = {actor, c.session, c.start - c.diff};
      }
      if (!reader.valid || reader.remaining())
        return invalid();
      register_sessions(c);
      Insertion insertion{c, content};
      insertion.footage_state = FootageState::Retained;
      insertion.string_content = tag == 5;
      return {insertion,
              combined ? std::span<const Word>(decoded_acknowledgement) : std::span<const Word>{}};
    }
    if (count > input.size() - position)
      return invalid();
    const auto data = input.subspan(position, count);
    position += count;
    if (tag == 1) {
      if (!count || !(count & 1))
        return invalid();
      return {{}, data};
    } else if (tag == 0 || tag == 3) {
      if (count != 6)
        return invalid();
      Coordinates c{data[0], data[1], data[2],
                    data[3], data[4], std::bit_cast<std::int32_t>(data[5])};
      if (!c.diff || c.diff == std::numeric_limits<std::int32_t>::min())
        return invalid();
      register_sessions(c);
      Insertion insertion{c, content};
      insertion.footage_state = FootageState::Retained;
      if (tag == 3) [[unlikely]]
        insertion.string_content = true;
      return {insertion, {}};
    } else
      return invalid();
  }
  bool append_coordinates(const Coordinates &c, Word content, Word &offset,
                          std::vector<Insertion> &insertions) {
    if (!valid || !c.diff || c.diff == std::numeric_limits<std::int32_t>::min() ||
        (tuple && ((c.diff > 0 && c.anchor_diff >= extent) || (c.diff != 1 && c.diff != -1) ||
                   (c.diff > 0 && (c.anchor_session | c.anchor_start))))) {
      valid = false;
      return false;
    }
    register_sessions(c);
    insertions.push_back({c, c.diff > 0 ? content + bindings++ : 0, offset});
    insertions.back().footage_state = FootageState::Retained;
    if (c.diff > 0)
      offset += Word(c.diff);
    return true;
  }
  std::pair<std::vector<Insertion>, std::vector<Acknowledgement>> binary_sequence(Word content) {
    std::vector<Insertion> insertions;
    std::vector<Acknowledgement> frontiers;
    if (input.empty() || input[0] > (input.size() - 1) * sizeof(Word)) {
      valid = false;
      return {};
    }
    if (!input[0])
      return {};
    WordsReader<true> reader({reinterpret_cast<const std::uint8_t *>(input.data() + 1), input[0]});
    const auto records = reader.records();
    const auto header = reader.byte();
    tuple = header & 128;
    reader.compact = (header & 63) == 3;
    if (((header & 63) != 1 && !reader.compact) || (!tuple && (header & 64))) {
      valid = false;
      return {};
    }
    if (tuple) {
      if (header & 64)
        capacity = extent = reader.uint();
      else
        extent = reader.uint();
    }
    const auto actors = reader.uint();
    if (!reader.valid || actors > reader.remaining()) {
      valid = false;
      return {};
    }
    for (Word i = 0; i < actors; ++i) {
      const auto count = reader.uint();
      if (!reader.valid || !count || !(count & 1) || count > reader.remaining()) {
        valid = false;
        return {};
      }
      auto &a = frontiers.emplace_back();
      a.reserve(count);
      a.push_back(reader.uint());
      for (Word n = 1; n < count; n += 2) {
        a.push_back(reader.session());
        a.push_back(reader.uint());
      }
    }
    if (!reader.valid || (!reader.compact && records > reader.remaining()) ||
        records > insertions.max_size()) {
      valid = false;
      return {};
    }
    insertions.reserve(records);
    Word offset = 0;
    for (Word i = 0; i < records; ++i) {
      const auto c = reader.coordinates(records - i);
      valid = reader.valid;
      if (!append_coordinates(c, content, offset, insertions))
        return {};
    }
    if (!reader.valid || reader.remaining()) {
      valid = false;
      return {};
    }
    return {std::move(insertions), std::move(frontiers)};
  }
  std::pair<std::vector<Insertion>, std::vector<Acknowledgement>> sequence(Word content,
                                                                           bool binary = false) {
    if (binary)
      return binary_sequence(content);
    std::vector<Insertion> insertions;
    std::vector<Acknowledgement> frontiers;
    if (input.empty())
      return {std::move(insertions), std::move(frontiers)};
    if (input[0] == UINT32_MAX) {
      tuple = true;
      if (input.size() < 5 || input[1] != 1) {
        valid = false;
        return {};
      }
      capacity = input[2];
      extent = input[3];
      if (capacity != UINT32_MAX && extent != capacity) {
        valid = false;
        return {};
      }
      input = input.subspan(4);
    }
    auto end = word();
    // Plain metadata begins with the ACK end offset; zero introduces the compact header.
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
    // Footage is one flat JS array. Only positive roots receive distinct tokens,
    // and their content_start advances by each original positive Frame extent.
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
      if (!append_coordinates(c, content, offset, insertions))
        return {};
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
#ifdef __EMSCRIPTEN__
/** Returns live allocator bytes, excluding unused linear-memory capacity. */
EMSCRIPTEN_KEEPALIVE std::uint32_t runtime_allocated() { return mallinfo().uordblks; }
#endif
/** Seeds the local Session generator once per module.
 * @param seed JavaScript entropy; zero maps to a nonzero generator state.
 */
EMSCRIPTEN_KEEPALIVE void runtime_seed(std::uint32_t seed) {
  sequencer::random_state = seed ? seed : 1;
}
/** Reserves writable numeric input; memory growth may invalidate the previous heap view.
 * @param count Required word count, not bytes.
 * @return Borrowed input buffer for the next dispatch.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *runtime_reserve(std::uint32_t count) {
  using namespace sequencer;
  if (input_capacity < count) {
    const auto capacity = std::max(count, input_capacity * 2);
    input_buffer = std::make_unique_for_overwrite<Word[]>(capacity);
    input_capacity = capacity;
  }
  return input_buffer.get();
}
/** Allocates independent native history in the shared module.
 * @param id JavaScript-assigned Projection handle.
 * @param actor Actor used for Acknowledgements.
 * @param tuple Whether indices identify stable registers.
 * @param capacity Fixed register count, or UINT32_MAX for dynamic growth.
 */
EMSCRIPTEN_KEEPALIVE [[gnu::noinline]] void runtime_create(std::uint32_t id, std::uint32_t actor,
                                                           bool tuple, std::uint32_t capacity) {
  using namespace sequencer;
  if (projections.size() <= id)
    projections.resize(std::size_t(id) + 1);
  projections[id] =
      std::make_unique<Projection>(actor, next_session(), next_session(), tuple, capacity);
}
/** Releases the native history at a handle, including its pending dependencies.
 * @param id Handle to release; absent handles are harmless.
 */
void runtime_destroy(std::uint32_t id) {
  if (id < sequencer::projections.size())
    sequencer::projections[id].reset();
}

/** Opens temporary replication output for one Projection. */
EMSCRIPTEN_KEEPALIVE std::uint32_t runtime_batch_begin(std::uint32_t id) {
  using namespace sequencer;
  try {
    const auto &p = *projections[id];
    return address(new Batch(id, p.increase_clock[0], p.decrease_clock[0]));
  } catch (...) {
    return UINT32_MAX;
  }
}
/** Authors one edit; returns one when no Footage updates need consumption. */
EMSCRIPTEN_KEEPALIVE std::uint32_t runtime_batch_edit(std::uint32_t handle, std::uint32_t operation,
                                                      std::uint32_t count, std::uint32_t content,
                                                      std::uint32_t start, std::uint32_t end) {
  using namespace sequencer;
  released.clear();
  copied.clear();
  appended.clear();
  try {
    auto &batch = *reinterpret_cast<Batch *>(handle);
    auto &p = *projections[batch.projection];
    const auto text = bool(count & 0x80000000u);
    count &= 0x7fffffffu;
    if (operation == 2) {
      if (p.tuple && count > 1)
        batch.append(p.insert_batch(count, content, start, text));
      else
        batch.append(p.insert(count, content, start, text).coordinates);
    } else if (operation == 5)
      batch.append(p.remove(start == UINT32_MAX ? 0 : start,
                            end == UINT32_MAX ? std::int64_t(p.length()) - 1 : end));
    else
      batch.append(p.replace(count, content, start == UINT32_MAX ? 0 : start,
                             end == UINT32_MAX ? std::int64_t(p.length()) - 1 : end, text));
    if (released.empty() && copied.empty() && appended.empty())
      return 1;
    out.header = {6};
    out.expose_effects();
    return address(out.header.data());
  } catch (...) {
    return 0;
  }
}
/** Returns two borrowed byte spans, or discards output after a callback failure. */
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_batch_end(std::uint32_t handle, bool commit) {
  using namespace sequencer;
  const std::unique_ptr<Batch> batch(reinterpret_cast<Batch *>(handle));
  if (!commit)
    return nullptr;
  try {
    out.header = {};
    if (!batch->empty()) {
      batch->finish(out.sequence.bytes);
      out.bytes.swap(batch->bytes);
      out.header = {address(out.sequence.bytes.data()), Word(out.sequence.bytes.size()),
                    address(out.bytes.data()), Word(out.bytes.size())};
    }
    return out.header.data();
  } catch (...) {
    return nullptr;
  }
}

/** Applies one staged batch packet without entering general operation dispatch. */
EMSCRIPTEN_KEEPALIVE const std::uint32_t *
runtime_apply_batch(std::uint32_t id, std::uint32_t pointer, std::uint32_t count, bool binary) {
  using namespace sequencer;
  input = {reinterpret_cast<const Word *>(pointer), count};
  auto &p = *projections[id];
  released.clear();
  copied.clear();
  appended.clear();
  out.result.changes.clear();
  out.result.gossip.clear();
  out.header = {4};
  try {
    Reader reader;
    reader.word();
    reader.edit_batch(p, out.result, binary, out.header[11]);
    if (!reader.valid)
      out.header[0] = 0;
    else
      out.expose_result(binary, bool(p.tuple));
  } catch (...) {
    out.header[0] = 0;
  }
  out.expose_effects();
  return out.header.data();
}

/** Executes a general operation and exposes output until the next native call.
 * @param operation Dispatch opcode; bit 7 requests byte metadata output.
 * @param id Live Projection handle, or the handle to create or destroy.
 * @param arg0 First operation-specific scalar.
 * @param arg1 Second scalar, including the first content token for snapshot input.
 * @param arg2 Third scalar, including snapshot shape, text and byte-input flags.
 * @param input_or_end Numeric input address, or the inclusive replacement end.
 * @param count Input word count.
 * @return Twelve-word output header with byte pointers and element counts.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *runtime_dispatch(std::uint32_t operation, std::uint32_t id,
                                                     std::uint32_t arg0, std::uint32_t arg1,
                                                     std::uint32_t arg2, std::uint32_t input_or_end,
                                                     std::uint32_t count) {
  using namespace sequencer;
  const auto binary = bool(operation & 128);
  operation &= 127;
  input = {count ? reinterpret_cast<const Word *>(input_or_end) : nullptr, count};
  // Result kinds: 0 rejected, 2 Gossip, 4 Result,
  // 5 Sequence, 6 void, 7 local operation error.
  out.header = {6, 0, 0, 0, 0, 0, 0};
  if (operation == 11) {
    runtime_destroy(id);
    return out.header.data();
  }
  bool configured = false, tuple_enabled = false;
  Word tuple_capacity = UINT32_MAX;
  if (operation == 0) {
    if (arg2 & 2) {
      configured = true;
      tuple_enabled = input[0] != 0;
      tuple_capacity = input[1];
      input = input.subspan(2);
    } else if (input.size() >= 4 && input[0] == UINT32_MAX) {
      tuple_enabled = true;
      tuple_capacity = input[2];
    } else if ((arg2 & 8) && input.size() >= 2 && input[0] &&
               input[0] <= (input.size() - 1) * sizeof(Word)) {
      WordsReader<> reader({reinterpret_cast<const std::uint8_t *>(input.data() + 1), input[0]});
      const auto header = reader.byte();
      tuple_enabled = header & 128;
      if (tuple_enabled && (header & 64))
        tuple_capacity = reader.uint();
    }
    runtime_create(id, arg0, tuple_enabled, tuple_capacity);
  }
  if (id >= projections.size() || !projections[id]) {
    out.header = {7, 0, 0, 1, 0, 0, 0};
    return out.header.data();
  }
  auto &p = *projections[id];
  released.clear();
  appended.clear();
  copied.clear();
  Word kind = 6;
  try {
    switch (operation) {
    case 0: {
      Reader r;
      auto [g, f] = r.sequence(arg1, arg2 & 8);
      if (!(arg2 & 1) || !r.valid ||
          (configured && ((r.tuple && (!tuple_enabled || r.capacity != tuple_capacity)) ||
                          (!r.tuple && !g.empty() && tuple_enabled))) ||
          (!configured && r.tuple != bool(p.tuple))) {
        kind = 7;
        out.header[3] = 2;
        break;
      }
      out.header[11] = r.bindings;
      if (arg2 & 4)
        for (auto &insertion : g)
          insertion.string_content = true;
      // Hydrated identities must not collide with freshly selected authoring clocks.
      for (const auto &e : g) {
        const auto c = e.coordinates;
        for (auto *clock : {&p.increase_clock, &p.decrease_clock})
          if ((*clock)[0] == c.session || (*clock)[0] == c.anchor_session)
            (*clock)[0] = next_session();
      }
      if (p.tuple && r.tuple)
        p.frame_count = r.extent;
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
        if (r.position < input.size() && (input[r.position] == 7 || input[r.position] == 8)) {
          r.edit_batch(p, out.result, binary, out.header[11]);
          if (!r.valid) {
            kind = 0;
            break;
          }
          continue;
        }
        if (input.size() - r.position >= 4 && (input[r.position] == 4 || input[r.position] == 5) &&
            input[r.position + 1] >= 2 && (input[r.position + 3] & 65535) == 511) {
          r.removal_batch(p, out.result, binary);
          if (!r.valid) {
            kind = 0;
            break;
          }
          continue;
        }
        const auto [insertion, acknowledgement] = r.entry();
        if (!r.valid || (p.tuple && insertion.coordinates.diff &&
                         !p.tuple->valid(insertion.coordinates, p.containment))) {
          kind = 0;
          break;
        }
        // JS can discard bindings allocated for entries after the rejected prefix.
        out.header[11] = std::max(out.header[11], insertion.content);
        if (insertion.coordinates.diff)
          p.apply(insertion, out.result, binary);
        if (!acknowledgement.empty())
          p.frontier.observe(acknowledgement);
      }
      if (!r.valid)
        kind = 0;
      break;
    }
    case 4: {
      Reader r;
      auto [g, f] = r.sequence(arg1, arg2 & 8);
      if (((arg2 & ~8u) != 1 && (arg2 & ~8u) != 5) || !r.valid || r.tuple != bool(p.tuple) ||
          (r.tuple && r.capacity != p.tuple->capacity)) {
        kind = 0;
        break;
      }
      if (p.tuple) {
        for (const auto &entry : g)
          if (!p.tuple->valid(entry.coordinates, p.containment))
            r.valid = false;
        if (!r.valid) {
          kind = 0;
          break;
        }
      }
      out.header[11] = r.bindings;
      if (arg2 & 4)
        for (auto &insertion : g)
          insertion.string_content = true;
      out.result = p.merge(g, f, binary);
      if (p.tuple)
        p.frame_count = std::max(p.frame_count, r.extent);
      kind = 4;
      break;
    }
    case 5:
      out.entries = p.remove(arg0 == UINT32_MAX ? 0 : arg0,
                             arg1 == UINT32_MAX ? std::int64_t(p.length()) - 1 : arg1);
      kind = 2;
      break;
    case 6: {
      out.entries =
          p.replace(arg0 & 0x7fffffffu, arg1, arg2 == UINT32_MAX ? 0 : arg2,
                    input_or_end == UINT32_MAX ? std::int64_t(p.length()) - 1 : input_or_end,
                    arg0 & 0x80000000u);
      kind = 2;
      break;
    }
    case 7:
      p.frontier.retire(arg0);
      break;
    case 8:
      p.sequence(out.sequence, binary);
      kind = 5;
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
  out.header[0] = kind;
  out.expose_effects();
  switch (kind) {
  case 2:
    if (binary)
      out.expose_binary(out.entries, bool(p.tuple));
    else
      out.expose(out.entries, bool(p.tuple));
    out.header[3] = address(out.gossip.data());
    out.header[4] = Word(out.gossip.size());
    break;
  case 4:
    out.expose_result(binary, bool(p.tuple));
    break;
  case 5:
    if (out.sequence.footage.size() == 1 && out.sequence.shared_root) {
      const auto root = out.sequence.shared_root;
      const auto span = out.sequence.footage[0];
      if (p.tuple) {
        auto &version = p.tuple->versions[root - 1];
        if (version.content && !version.string_content) {
          if (version.shared) {
            auto &binding = p.tuple->bindings[p.tuple->binding_index.get(version.content, 0) - 1];
            binding.owned = false;
            out.header[11] = address(&binding.footage_state);
          } else
            out.header[11] = address(&version.footage_state);
        }
      } else {
        auto &source = p.strips.identity[root];
        if (span.content == source.content && !source.string_content) {
          out.header[11] = address(&source.footage_state);
          // JS may expose a full array only at offset zero. Revoke write ownership
          // before it marks the binding shared, including compacted root spans.
          if (!span.start)
            for (auto i = root; i; i = p.strips.fragment[i])
              p.strips.identity[i].content_owned = false;
        }
      }
    }
    out.header[3] =
        binary ? address(out.sequence.bytes.data()) : address(out.sequence.words.data());
    out.header[4] = binary ? Word(out.sequence.bytes.size()) : Word(out.sequence.words.size());
    out.header[5] = address(out.sequence.footage.data());
    out.header[6] = Word(out.sequence.footage.size());
    break;
  }
  return out.header.data();
}
/** Reads maintained visible length through the dedicated scalar path.
 * @param id Live handle; the JavaScript wrapper excludes destroyed instances.
 * @return Visible Frame count.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t runtime_length(std::uint32_t id) {
  return sequencer::projections[id]->length();
}
} // extern "C"
namespace {
/** Authors local positive Frames without general result descriptors.
 * @param id Live Projection handle.
 * @param count Positive Frame count; its high bit marks immutable UTF-16 input.
 * @param content JavaScript token for the incoming Footage.
 * @param at Visible insertion boundary.
 * @return Coordinates or a byte pointer/count, plus append target, endpoint and content origin.
 */
template <bool Binary>
const std::uint32_t *insert_result(std::uint32_t id, std::uint32_t count, std::uint32_t content,
                                   std::uint32_t at) {
  using namespace sequencer;
  auto &p = *projections[id];
  appended.clear();
  released.clear();
  copied.clear();
  const auto text = bool(count & 0x80000000u);
  count &= 0x7fffffffu;
  if (p.tuple && count > 1) {
    out.entries = p.insert_batch(count, content, at, text);
    if constexpr (Binary)
      out.expose_binary(out.entries, true);
    else
      out.expose(out.entries, true);
    out.header = {2, 0, 0, address(out.gossip.data()), Word(out.gossip.size())};
    static std::array<Word, 9> tuple_result;
    tuple_result[6] = UINT32_MAX;
    tuple_result[7] = address(out.header.data());
    return tuple_result.data();
  }
  const auto insertion = p.insert(count, content, at, text);
  static std::array<Word, 9> result;
  if constexpr (Binary) {
    out.bytes.clear();
    WordsWriter<> writer(out.bytes);
    writer.append(insertion.coordinates);
    result[0] = address(out.bytes.data());
    result[1] = Word(out.bytes.size());
  } else {
    const auto coordinates = std::bit_cast<std::array<Word, 6>>(insertion.coordinates);
    std::copy(coordinates.begin(), coordinates.end(), result.begin());
  }
  result[6] = 0;
  if (!appended.empty()) {
    const auto &append = appended.back();
    result[6] = append.target;
    result[7] = append.at;
    result[8] = append.base;
  }
  return result.data();
}
} // namespace
extern "C" {
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_insert(std::uint32_t id, std::uint32_t count,
                                                         std::uint32_t content, std::uint32_t at) {
  return insert_result<false>(id, count, content, at);
}
/** Authors the same local Insertion with byte metadata in its borrowed result. */
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_insert_binary(std::uint32_t id,
                                                                std::uint32_t count,
                                                                std::uint32_t content,
                                                                std::uint32_t at) {
  return insert_result<true>(id, count, content, at);
}
/** Resolves one visible Frame without materializing a span vector.
 * @param id Live Projection handle.
 * @param at Requested visible position.
 * @return Borrowed [content token, content slot], or nullptr outside the Projection.
 */
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_value(std::uint32_t id, std::uint32_t at) {
  using namespace sequencer;
  auto &p = *projections[id];
  if (at >= p.length())
    return nullptr;
  if (p.tuple) {
    static Span tuple_value;
    tuple_value = p.tuple->value(at);
    return &tuple_value.content;
  }
  const auto frame = p.find_frame(at);
  static std::array<Word, 2> value;
  value = {p.strips.identity[p.gate].content, p.strips.identity[p.gate].content_start + frame};
  return value.data();
}
/** Resolves a visible range without mutation output or input descriptors.
 * @param id Live Projection handle.
 * @param start First included position.
 * @param end Last included position, or UINT32_MAX for the visible end.
 * @return Borrowed [span pointer, span count], or nullptr on native failure.
 */
EMSCRIPTEN_KEEPALIVE const std::uint32_t *runtime_values(std::uint32_t id, std::uint32_t start,
                                                         std::uint32_t end) {
  using namespace sequencer;
  auto &p = *projections[id];
  try {
    p.values(start == UINT32_MAX ? 0 : start, end == UINT32_MAX ? p.length() - 1 : end, out.values);
    static std::array<Word, 2> values;
    values = {address(out.values.data()), Word(out.values.size())};
    return values.data();
  } catch (...) {
    return nullptr;
  }
}
}
