#pragma once
#include <algorithm>
#include <array>
#include <bit>
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <memory>
#include <optional>
#include <vector>

namespace sequencer {
/** Unsigned wasm32 lane used for coordinates, lengths, tokens and addresses. */
using Word = std::uint32_t;
/** Stable Strip arena index; distinct from a Projection position or logical time. */
using Index = Word;
/** Absent Strip link, backed by a zero-initialized sentinel arena entry. */
constexpr Index none = 0;

/** Canonical six-word Insertion coordinates; runtime fragmentation leaves these intact. */
struct Coordinates {
  Word anchor_session{} /**< Session of the canonical anchoring Insertion. */,
      anchor_start{} /**< Start identifying the canonical anchoring Insertion. */,
      anchor_diff{} /**< Logical boundary within that Insertion, not a visible index. */,
      session{} /**< Session that authored this Insertion. */,
      start{} /**< Start identifying this Insertion within its Session. */;
  /** Positive authored Frame length, or negative original removal length. */
  std::int32_t diff{};
  /** Tests for the virtual root.
   * @return Whether the anchor triple is (0, 0, 0).
   */
  bool birth() const { return !(anchor_session | anchor_start | anchor_diff); }
  /** Recognizes positive logical continuation without a new zero reservation.
   * @return Whether same-Session identity begins at the parent's anchored endpoint.
   */
  bool extension() const {
    return diff > 0 && session == anchor_session && start == anchor_start + anchor_diff;
  }
};
static_assert(sizeof(Coordinates) == 6 * sizeof(Word));
/** Packs a canonical identity without hashing or truncating either coordinate.
 * @param session Authoring Session.
 * @param start Logical start within that Session.
 * @return Exact identity key; the anchor is deliberately excluded.
 */
inline std::uint64_t identity(Word session, Word start) {
  return (std::uint64_t(session) << 32) | start;
}
/** Native Insertion plus an opaque JavaScript Footage reference. */
struct Insertion {
  /** Historical anchor, canonical identity and original Frame effect. */
  Coordinates coordinates;
  /** JavaScript binding token; zero means no content binding. */
  Word content{};
  /** Origin of this Insertion's original Frame coordinates in the bound Footage. */
  Word content_start{};
  /** Physical Footage extent; compacted original coordinates may contain omitted intervals. */
  Word content_length : 31 = coordinates.diff > 0 ? Word(coordinates.diff) : 0;
  /** Whether Footage is privately writable; false requests copy-on-write before masking. */
  Word content_owned : 1 {};
};
static_assert(sizeof(Insertion) == 9 * sizeof(Word));
/** Half-open original Frame interval retained in a compacted Footage binding. */
struct FrameRange {
  Word start{} /**< First original Frame coordinate. */,
      count{} /**< Retained contiguous Frame count. */;
};
/** Packed Footage layout of one canonical positive Insertion. */
struct ContentRanges {
  Word session{} /**< Positive Insertion's authoring Session. */,
      start{} /**< Positive Insertion's canonical start. */,
      base{} /**< First packed slot in the JavaScript Footage binding. */;
  /** Retained original intervals in increasing coordinate order. */
  std::vector<FrameRange> frames;
};
/** Actor ID followed by removal Session/frontier pairs. */
using Acknowledgement = std::vector<Word>;
/** Discriminated Gossip entry; only the selected Insertion or frontier is meaningful. */
struct Entry {
  /** Selects the frontier payload instead of an Insertion. */
  bool acknowledgement{};
  /** Canonical operation when acknowledgement is false. */
  Insertion insertion{};
  /** Actor Acknowledgement when acknowledgement is true. */
  Acknowledgement frontier;
  /** Creates an operation entry.
   * @param i Canonical Insertion and its binding reference.
   * @return Insertion-tagged entry.
   */
  static Entry insert(Insertion i) { return {false, i, {}}; }
  /** Creates a Acknowledgement entry, retaining its numeric storage.
   * @param a Actor ID and removal Session/frontier pairs.
   * @return Acknowledgement-tagged entry.
   */
  static Entry acknowledge(Acknowledgement a) { return {true, {}, std::move(a)}; }
};
/** Ordered operations and Acknowledgements transported between replicas. */
using Gossip = std::vector<Entry>;
/** JavaScript Footage slice; no application values enter WASM. */
struct Span {
  Word content{} /**< Per-Projection JavaScript binding token. */,
      start{} /**< First content-array slot. */,
      count{} /**< Frame count; zero in a release request means the whole binding. */;
};
/** Deferred content concatenation accompanying an Insertion extension. */
struct ContentAppend {
  Word target{} /**< Existing Insertion's content binding. */,
      source{} /**< Incoming suffix binding. */, start{} /**< First suffix slot in source. */,
      count{} /**< Suffix Frame count. */,
      at{} /**< Physical target Footage length before extension. */,
      base{} /**< Target Insertion's content-array origin before copy-on-write. */;
};
/** Consumer-visible mutation; the removal end is exclusive. */
struct Splice {
  Word start{} /**< First affected Projection position. */,
      end{} /**< Exclusive removal boundary, equal to start for insertion. */;
  /** Inserted Footage span; omitted for a removal-only Splice. */
  std::optional<Span> values;
};
/** Output of applying operations against a live Projection. */
struct Result {
  /** Splices applied in order; each uses the Projection left by preceding Splices. */
  std::vector<Splice> changes;
  /** Acknowledgements generated while integrating reducing Insertions. */
  Gossip gossip;
};
/** Retained numeric history and ordered Footage spans for snapshot export. */
struct Sequence {
  /** Plain or compact metadata, including retained Acknowledgements. */
  std::vector<Word> words;
  /** Positive original Frame spans in exported Insertion order. */
  std::vector<Span> footage;
  /** Candidate root for sharing one complete Footage span; never serialized. */
  Index shared_root{};
};

/**
 * Strip materialization in one arena with separate traversal lanes (SoA).
 * Canonical coordinates and binding references remain grouped as Insertions;
 * hot fragment/link fields use indexed lanes. Growth preserves indices, not pointers.
 */
struct Strips {
  /** Owning allocation containing identities, twelve word lanes and two flag lanes. */
  std::unique_ptr<std::byte[]> memory;
  Word count{} /**< Allocated slots, including the absent-link sentinel. */,
      capacity{} /**< Slots available in each lane. */;
  /** Canonical coordinates and binding references, repeated across an Insertion's fragments. */
  Insertion *identity{};
  /** First original Frame coordinate represented by each Strip. */
  Word *fragment_start{};
  /** Current signed effect; overlaps can leave a mask with zero visible effect. */
  std::int32_t *fragment_diff{};
  Index *left{} /**< Previous Strip in Structural Order. */,
      *right{} /**< Next Strip in Structural Order. */,
      *competitor{} /**< Next smaller sibling using the exact same anchor triple. */,
      *fragment{} /**< Next materialized fragment of the same canonical Insertion. */,
      *left_jump{} /**< Left endpoint of a bidirectional traversal jump. */,
      *right_jump{} /**< Right endpoint of a bidirectional traversal jump. */;
  Word *left_jump_frames{} /**< Visible distance to the left jump endpoint. */,
      *left_jump_strips{} /**< Structural steps to the left jump endpoint. */,
      *right_jump_frames{} /**< Visible distance to the right jump endpoint. */,
      *right_jump_strips{} /**< Structural steps to the right jump endpoint. */;
  std::uint8_t *fragmented{} /**< Whether materialization has diverged from one intact Strip. */,
      *offset{} /**< Whether this Strip represents an offset fragment or consumed mask prefix. */;

  /** Initializes slot zero so absent links may safely read zero-valued lanes. */
  Strips() { append({}); }
  /** Grows every lane together, preserving initialized slots and stable indices.
   * @param next Required arena capacity; existing capacity is retained when sufficient.
   */
  void reserve(Word next) {
    if (next <= capacity)
      return;
    constexpr Word lanes = 12;
    auto grown = std::make_unique_for_overwrite<std::byte[]>(
        (sizeof(Insertion) + lanes * sizeof(Word) + 2) * next);
    auto *identities = reinterpret_cast<Insertion *>(grown.get());
    auto *fields = reinterpret_cast<Word *>(identities + next);
    auto *bits = reinterpret_cast<std::uint8_t *>(fields + lanes * next);
    // Copy only constructed slots. Lane spacing changes with capacity, so one
    // whole-allocation memcpy would place every traversal field incorrectly.
    if (count) {
      std::memcpy(identities, identity, count * sizeof(Insertion));
      auto *old = reinterpret_cast<Word *>(identity + capacity);
      for (Word field = 0; field < lanes; ++field)
        std::memcpy(fields + field * next, old + field * capacity, count * sizeof(Word));
      std::memcpy(bits, fragmented, count);
      std::memcpy(bits + next, offset, count);
    }
    // Every cached lane pointer belongs to the new allocation after this commit.
    memory = std::move(grown);
    capacity = next;
    identity = identities;
    fragment_start = fields;
    fragment_diff = reinterpret_cast<std::int32_t *>(fields + next);
    left = fields + 2 * next;
    right = fields + 3 * next;
    competitor = fields + 4 * next;
    fragment = fields + 5 * next;
    left_jump = fields + 6 * next;
    right_jump = fields + 7 * next;
    left_jump_frames = fields + 8 * next;
    left_jump_strips = fields + 9 * next;
    right_jump_frames = fields + 10 * next;
    right_jump_strips = fields + 11 * next;
    fragmented = bits;
    offset = bits + next;
  }
  /** Adds an unlinked Strip initialized with its original signed Frame effect.
   * @param insertion Canonical Insertion and binding reference.
   * @return Stable arena index, unaffected by subsequent growth.
   */
  Index append(Insertion insertion) {
    constexpr Word lanes = 12;
    if (count == capacity)
      reserve(std::max(Word(8), capacity * 2));
    const auto index = count++;
    std::construct_at(identity + index, insertion);
    auto *fields = reinterpret_cast<Word *>(identity + capacity);
    for (Word field = 0; field < lanes; ++field)
      std::construct_at(fields + field * capacity + index, Word(0));
    std::construct_at(fragmented + index, std::uint8_t(0));
    std::construct_at(offset + index, std::uint8_t(0));
    fragment_diff[index] = insertion.coordinates.diff;
    return index;
  }
};
} // namespace sequencer
