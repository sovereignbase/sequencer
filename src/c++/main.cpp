/**
 * @file
 * @brief Exposes the Sequencer Projector through a WebAssembly C interface.
 *
 * Each active sequence identifier selects the Projector state of one Replica.
 * Clearing that state leaves a reusable registry slot, so a later
 * initialization can reuse the identifier before growing the registry.
 *
 * Strip, Frontier, and released Footage spans cross the application binary
 * interface through three shared transfer buffers. Their addresses expose
 * WebAssembly memory directly; callers must finish each read or write before an
 * operation that may replace or resize the corresponding buffer. Exported
 * operations rely on valid active identifiers and valid Projection frame
 * indexes supplied by the TypeScript boundary. Only visible updates issue new
 * Sequence Points; Masks transfer coordinates composed entirely of existing
 * points.
 */
#include "./algorithms/insert_strip/index.hpp"
#include "./algorithms/mask_strip/index.hpp"
#include "./auxiliary/run_projector_forward/index.hpp"
#include "./auxiliary/run_projector_to_frame_index/index.hpp"
#include "./classes/footage_span_buffer/index.hpp"
#include "./classes/frontier_buffer/index.hpp"
#include "./classes/strip_buffer/index.hpp"
#include "./declarations/projector/index.hpp"
#include <cstdint>
#include <limits>
#include <optional>
#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

/** @brief Registry slots containing the Projector of each active Replica. */
static std::vector<std::optional<Projector>> projectors;

/** @brief Cleared registry identifiers available for immediate reuse. */
static std::vector<std::uint32_t> available_sequence_ids;

/** @brief Shared fixed-width transfer buffer for one Strip. */
static StripBuffer strip_buffer;

/** @brief Shared variable-width transfer buffer for one Frontier. */
static FrontierBuffer frontier_buffer;

/** @brief Shared result buffer for ordered or released Footage spans. */
static FootageSpanBuffer footage_span_buffer;

/**
 * @brief ABI sentinel indicating that no Projection frame index was produced.
 */
static constexpr std::uint32_t no_projection_frame_index =
    std::numeric_limits<std::uint32_t>::max();

extern "C" {

/**
 * @brief Create an empty Projector for one Replica.
 *
 * A cleared registry slot is reused before a new slot is appended. The returned
 * identifier remains assigned to this Replica until `clear_sequence` releases
 * it.
 *
 * @return Registry identifier of the initialized Sequence state.
 * @post The returned identifier selects an active Projector with an empty
 * retained Sequence and empty Projection.
 * @post The Projector's first, Gate, and last starts contain the Root.
 * @complexity Amortized O(1) time.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t initialize_sequence() noexcept {
  // Grow the registry only when no cleared identifier is available.
  if (available_sequence_ids.empty()) {
    projectors.emplace_back(std::in_place);
    return static_cast<std::uint32_t>(projectors.size() - 1);
  }

  // Reactivate the most recently cleared registry slot.
  const std::uint32_t sequence_id = available_sequence_ids.back();
  available_sequence_ids.pop_back();
  projectors[sequence_id].emplace();
  return sequence_id;
}

/**
 * @brief Destroy one Replica's Projector and release its identifier for reuse.
 *
 * Materialized and pending Strips are destroyed with the Projector. Shared
 * transfer buffers are unaffected. Repeated clearing of the same identifier
 * has no effect and does not enqueue the identifier twice.
 *
 * @param sequence_id Identifier of the sequence to clear.
 * @pre `sequence_id < projectors.size()`.
 * @post The registry slot is inactive and available to `initialize_sequence`.
 */
EMSCRIPTEN_KEEPALIVE void
clear_sequence(const std::uint32_t sequence_id) noexcept {
  // Ignore an already cleared registry slot.
  if (!projectors[sequence_id])
    return;

  // Destroy the Projector and publish its reusable identifier.
  projectors[sequence_id].reset();
  available_sequence_ids.push_back(sequence_id);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// READS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Return the Frame count of one Replica's Projection.
 *
 * @param sequence_id Identifier of the active sequence.
 * @return Number of visible Frames in its current Projection.
 * @pre `sequence_id` identifies an active Projector.
 * @complexity O(1) time and O(1) space.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
get_projection_frame_count(const std::uint32_t sequence_id) noexcept {
  // Read the materialized Projection length directly.
  return projectors[sequence_id]->projection_frame_count;
}

/**
 * @brief Resolve a Projection frame index to its Footage frame index.
 *
 * The Gate is moved to the visible Strip containing the requested Frame. Its
 * offset within that Strip is then applied to the Strip's Footage start.
 *
 * @param sequence_id Identifier of the active sequence.
 * @param projection_frame_index Visible frame index to resolve.
 * @return Corresponding frame index in the Strip's Footage.
 * @pre `sequence_id` identifies an active Projector.
 * @pre `projection_frame_index < get_projection_frame_count(sequence_id)`.
 * @post The Projector Gate describes the containing Strip.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
get_footage_frame_index(const std::uint32_t sequence_id,
                        const std::uint32_t projection_frame_index) noexcept {
  // Position the Gate at the visible containing Strip.
  Projector *projector = &*projectors[sequence_id];
  run_projector_to_frame_index(projector, projection_frame_index);
  const Strip &strip = *projector->strip_index.get(projector->gate_strip_start);

  // Translate the Projection offset through the Strip's Footage mapping.
  return strip.footage_frame_index + projection_frame_index -
         projector->gate_projection_frame_index;
}

/**
 * @brief Write every retained Footage span in structural Sequence order.
 *
 * Visible Strips and Masks contribute their stable Footage ranges equally.
 * Pending Strips are excluded because they have not joined the retained
 * structural chain.
 *
 * @param sequence_id Identifier of the active sequence to recover.
 * @return Number of Footage spans written to FootageSpanBuffer.
 * @pre `sequence_id` identifies an active Projector.
 * @post FootageSpanBuffer contains one range per materialized Strip in
 * structural Sequence order.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_recovery_footage_spans_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  Projector &projector = *projectors[sequence_id];
  footage_span_buffer.clear();
  if (projector.strip_index.is_empty())
    return 0;

  SequencePoint strip_start = projector.first_strip_start;
  while (true) {
    const Strip &strip = *projector.strip_index.get(strip_start);
    footage_span_buffer.write_span(strip.footage_frame_index,
                                   strip.frame_count);
    if (strip.next_strip_start == unlinked_strip_start)
      break;
    strip_start = strip.next_strip_start;
  }

  return footage_span_buffer.get_span_count();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MERGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Integrate the Strip currently encoded in StripBuffer into a Replica.
 *
 * A Reel crosses this interface one Strip at a time; locally issued Strips use
 * the same integration path. The incoming Sequence Coordinate is resolved
 * against the retained Sequence. A Mask's `previous_strip_start` names the
 * indexed start of its containing Strip and its `this_strip_start` names the
 * first masked Frame point within that Strip. Only visible updates issue new
 * Sequence Points; Masks reuse existing points.
 * If its previous point is not materialized, the Strip remains pending under
 * that exact dependency. A Mask is accepted only when its complete Frame Span
 * fits within one visible Strip; a Mask targeting another Mask or extending
 * beyond its containing Strip is discarded without retention. A visible Strip
 * is inserted after the located Frame. Concurrent visible successors are
 * ordered by `this_strip_start`: ascending after a non-Root point and
 * descending after the Root. This direction is derived during placement and
 * adds no flag, auxiliary index, or retained ordering metadata.
 *
 * @param sequence_id Identifier of the sequence receiving the buffered strip.
 * @return Projection frame index at which the incoming Strip begins. For a
 * Mask, the index is measured before its Frame Span leaves the Projection.
 * `no_projection_frame_index` means the Strip remained pending or was
 * discarded.
 * @pre `sequence_id` identifies an active Projector.
 * @pre StripBuffer contains one valid transferable Strip representation.
 * @post Every accepted Strip is linked into retained Sequence order.
 * @post A visible insertion resolves pending dependencies made satisfiable by
 * its newly materialized start; applying a Mask does not traverse pending
 * indexes.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
merge_strip_into_sequence(const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  const std::uint32_t *words = strip_buffer.get_memory_pointer();
  const SequencePoint previous_strip_end{
      .crypto_random_bits = words[6],
      .unix_lower_bits = words[7],
      .counter_bits = words[8],
  };
  const std::uint32_t containing_position =
      projector->hash_table.get(previous_strip_end);
  const std::size_t previous_strip_count = projector->strips.size();
  const std::uint32_t stable_position =
      strip_buffer.read_strip(projector->strips, projector->hash_table);

  if (projector->strips.size() == previous_strip_count)
    return no_projection_frame_index;

  projector->left.push_back(stable_position);
  projector->right.push_back(stable_position);
  const Strip &incoming_strip = projector->strips[stable_position];

  if (containing_position == HashTable<>::no_stable_position) {
    if (incoming_strip.is_masked > 0)
      projector->pending_masks.set(previous_strip_end,
                                   incoming_strip.frame_count,
                                   stable_position);
    else
      projector->pending_inserts.set(previous_strip_end,
                                     incoming_strip.frame_count,
                                     stable_position);
    return no_projection_frame_index;
  }

  return incoming_strip.is_masked > 0
             ? mask_strip(projector, containing_position, stable_position)
             : insert_strip(projector, containing_position, stable_position);
}

/**
 * @brief Resolve every staged dependency reachable from Root.
 *
 * Root-visible Strips seed ordinary native insertion. `insert_strip` then
 * drains pending insertions and Masks for each newly materialized Frame Span.
 * Entries whose dependency remains absent stay in their pending index.
 *
 * @param sequence_id Identifier of the sequence whose staged graph is resolved.
 * @pre `sequence_id` identifies an active Projector.
 */
EMSCRIPTEN_KEEPALIVE void
resolve_pending(const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  const SequencePoint root{};

  while (const Strip *root_strip = projector->pending_inserts.get(root)) {
    const Strip root_strip_copy = *root_strip;
    projector->pending_inserts.remove(root);
    if (projector->strip_index.get(
            root_strip_copy.coordinate.this_strip_start) != nullptr)
      continue;
    static_cast<void>(insert_strip(projector, nullptr, 0, root_strip_copy));
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ACKNOWLEDGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Return the current shared Frontier buffer address.
 *
 * Each three-word entry is one Sequence Point in the current Frontier. Its Unix
 * and random components identify a Realm; its counter is the greatest locally
 * materialized Strip start in that Realm.
 *
 * @return Pointer to the first Frontier entry, or `nullptr` when empty.
 * @note The address remains valid only until another operation resizes or
 * rewrites FrontierBuffer.
 * @see FrontierBuffer
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *
get_acknowledgement_frontier_buffer_pointer() noexcept {
  // Expose the current shared Frontier transfer storage.
  return frontier_buffer.get_memory_pointer();
}

/**
 * @brief Materialize one Replica's Frontier in the shared buffer.
 *
 * StripIndex writes the greatest materialized Strip start of every represented
 * Realm directly to FrontierBuffer. Visible Strips and Masks contribute
 * equally: acknowledgement concerns materialized Sequence state, while Mask
 * eligibility is decided during garbage collection. Entry order is unspecified.
 *
 * @param sequence_id Identifier of the active sequence to acknowledge.
 * @return Number of Realm entries written to the Frontier buffer.
 * @pre `sequence_id` identifies an active Projector.
 * @post FrontierBuffer contains exactly one Sequence Point for every Realm
 * represented by a materialized Strip in this Replica.
 * @complexity O(c) time and O(r) retained output space, where c is the realm
 * table capacity and r is its occupied realm count.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_acknowledgement_frontier_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  // Replace the shared buffer with this Replica's Frontier.
  const Projector *projector = &*projectors[sequence_id];
  projector->strip_index.write_acknowledgement_frontier(
      &frontier_buffer, projector->last_strip_start);
  return frontier_buffer.get_frontier_count();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GARBAGE COLLECTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Prepare FrontierBuffer to receive a garbage-collection Frontier.
 *
 * The returned memory contains `frontier_count` writable three-word entries.
 * The caller fills those entries with the Realm-wise least points selected
 * across the participating Replica Frontiers. Preparing the buffer may change
 * its address, so callers must use this return value rather than a previously
 * observed pointer.
 *
 * @param frontier_count Number of Realm entries in the selected Frontier.
 * @return Pointer to the first writable Frontier word, or `nullptr` for zero.
 * @post FrontierBuffer has space for exactly `frontier_count` complete entries.
 * @note Every prepared word must be initialized before collection begins.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_garbage_collection_frontier_buffer(
    const std::uint32_t frontier_count) noexcept {
  // Allocate the exact writable Frontier transfer span.
  frontier_buffer.resize(frontier_count);
  return frontier_buffer.get_memory_pointer();
}

/**
 * @brief Return the shared Footage-span buffer.
 *
 * Every result entry is `(footage_frame_index, frame_count)`. The address may
 * change whenever another garbage collection rewrites FootageSpanBuffer.
 *
 * @return Pointer to the first span, or `nullptr` when empty.
 * @note The buffer describes only the most recent operation that populated it.
 * @see FootageSpanBuffer
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *get_footage_span_buffer_pointer() noexcept {
  // Expose Footage spans written by the most recent operation.
  return footage_span_buffer.get_memory_pointer();
}

/**
 * @brief Release Footage covered by acknowledged Masks.
 *
 * For every Frontier entry, Masks in the same Realm at or below its counter
 * report their consumer-owned Footage spans. Every Mask, coordinate, and
 * structural link remains materialized as permanent dependency data.
 *
 * @param sequence_id Identifier of the active sequence to collect.
 * @return Number of released Footage spans written to the result buffer.
 * @pre `sequence_id` identifies an active Projector.
 * @pre FrontierBuffer contains at most one selected point per represented
 * Realm, derived from the required Replica Frontiers.
 * @post Projector state and retained Strip metadata are unchanged.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
garbage_collect_sequence(const std::uint32_t sequence_id) noexcept {
  // Apply the prepared Frontier and replace the released Footage spans.
  Projector &projector = *projectors[sequence_id];
  projector.strip_index.garbage_collect(frontier_buffer, footage_span_buffer);
  return footage_span_buffer.get_span_count();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SEMANTIC STRIP WRITES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Write the Strip containing a Projection frame index to StripBuffer.
 *
 * @param sequence_id Identifier of the active sequence.
 * @param projection_frame_index Visible frame index whose strip is written.
 * @pre `sequence_id` identifies an active Projector.
 * @pre `projection_frame_index < get_projection_frame_count(sequence_id)`.
 * @return Footage frame index corresponding to `projection_frame_index`.
 * @post StripBuffer contains the transferable fields of the containing Strip,
 * and the Projector Gate describes that Strip.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
write_strip_at_projection_frame_index_to_buffer(
    const std::uint32_t sequence_id,
    const std::uint32_t projection_frame_index) noexcept {
  // Position the Gate and encode its containing Strip.
  Projector *projector = &*projectors[sequence_id];
  run_projector_to_frame_index(projector, projection_frame_index);
  const Strip &strip = *projector->strip_index.get(projector->gate_strip_start);
  strip_buffer.write_strip(strip);
  // Return exact footage_frame_index of projection_frame_index.
  return strip.footage_frame_index + projection_frame_index -
         projector->gate_projection_frame_index;
}

/**
 * @brief Write the first retained Strip of a Sequence to StripBuffer.
 *
 * Retained traversal includes visible Strips and Masks. On success, the Gate is
 * positioned at the written Strip and at Projection frame index zero. An empty
 * Sequence leaves both the Gate and StripBuffer unchanged.
 *
 * @param sequence_id Identifier of the active sequence.
 * @retval 1 A Strip was written.
 * @retval 0 The retained Sequence is empty.
 * @pre `sequence_id` identifies an active Projector.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_first_structural_strip_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  // Reject an empty retained Sequence without changing shared state.
  Projector *projector = &*projectors[sequence_id];
  if (projector->strip_index.is_empty())
    return 0;

  // Position the Gate at the first retained Strip and encode it.
  projector->gate_strip_start = projector->first_strip_start;
  projector->gate_projection_frame_index = 0;
  strip_buffer.write_strip(
      *projector->strip_index.get(projector->gate_strip_start));
  return 1;
}

/**
 * @brief Advance retained traversal and write the next Strip to StripBuffer.
 *
 * A Mask is traversed and transferred like any retained Strip but contributes
 * no Frames to the Gate's Projection position.
 *
 * @param sequence_id Identifier of the active sequence.
 * @retval 1 The succeeding Strip was written and became the Gate Strip.
 * @retval 0 The Gate already identifies the last retained Strip; the Gate and
 * StripBuffer remain unchanged.
 * @pre `sequence_id` identifies an active Projector.
 * @pre A successful first retained Strip write positioned the Projector Gate.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_next_structural_strip_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  // Resolve the current Gate Strip and stop at the retained tail.
  Projector *projector = &*projectors[sequence_id];
  const Strip *current_strip =
      projector->strip_index.get(projector->gate_strip_start);
  if (current_strip->next_strip_start == unlinked_strip_start)
    return 0;

  // Advance the Gate once and encode the succeeding Strip.
  strip_buffer.write_strip(run_projector_forward(projector, current_strip));
  return 1;
}

/**
 * @brief Write the first pending Snapshot Strip to StripBuffer.
 * @param sequence_id Identifier of the active sequence.
 * @retval 1 A pending insertion or Mask was written.
 * @retval 0 Both pending indexes are empty.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
write_first_pending_strip_to_buffer(const std::uint32_t sequence_id) noexcept {
  Projector &projector = *projectors[sequence_id];
  pending_strip_kind = 0;
  const Strip *strip = projector.pending_inserts.first(pending_strip_cursor);
  if (strip == nullptr) {
    pending_strip_kind = 1;
    strip = projector.pending_masks.first(pending_strip_cursor);
  }
  if (strip == nullptr)
    return 0;
  strip_buffer.write_strip(*strip);
  return 1;
}

/**
 * @brief Advance the pending Snapshot traversal and write its next Strip.
 * @param sequence_id Identifier of the active sequence.
 * @retval 1 Another pending insertion or Mask was written.
 * @retval 0 Both pending indexes have been exhausted.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
write_next_pending_strip_to_buffer(const std::uint32_t sequence_id) noexcept {
  Projector &projector = *projectors[sequence_id];
  const Strip *strip =
      pending_strip_kind == 0
          ? projector.pending_inserts.next(pending_strip_cursor)
          : projector.pending_masks.next(pending_strip_cursor);
  if (strip == nullptr && pending_strip_kind == 0) {
    pending_strip_kind = 1;
    strip = projector.pending_masks.first(pending_strip_cursor);
  }
  if (strip == nullptr)
    return 0;
  strip_buffer.write_strip(*strip);
  return 1;
}

/**
 * @brief Return the mutable address of the shared nine-word StripBuffer.
 *
 * @return Pointer to the first transferable `std::uint32_t` word.
 * @note The address remains valid for the lifetime of the module, but every
 * StripBuffer read or write may replace its contents.
 * @see StripBuffer
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *get_strip_buffer_pointer() noexcept {
  // Expose the fixed shared Strip transfer storage.
  return strip_buffer.get_memory_pointer();
}
} // extern "C"
