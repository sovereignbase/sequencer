/**
 * @file
 * @brief Exposes the Sequencer Projector through a WebAssembly C interface.
 *
 * Each active sequence identifier selects the Projector state of one Replica.
 * Clearing that state leaves a reusable registry slot, so a later
 * initialization can reuse the identifier before growing the registry.
 *
 * Strip, Frontier, and ordered Footage spans cross the application binary
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
#include "./auxiliary/run_projector_to_frame_index/index.hpp"
#include "./auxiliary/run_projector_to_strip/index.hpp"
#include "./classes/footage_span_buffer/index.hpp"
#include "./classes/frontier_buffer/index.hpp"
#include "./classes/strip_buffer/index.hpp"
#include "./declarations/projector/index.hpp"
#include "./declarations/sentinels/index.hpp"
#include "./fast_paths/first_insert_fast_path/index.hpp"
#include "./fast_paths/root_insert_fast_path/index.hpp"
#include <algorithm>
#include <cstdint>
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

/** @brief Current Stable Position in structural Snapshot traversal. */
static std::uint32_t structural_cursor;

/** @brief First Stable Position of the active circular Snapshot traversal. */
static std::uint32_t structural_start;

/** @brief Split fragments already combined into the active Snapshot. */
static std::vector<bool> structural_skipped_strips;

static inline void write_structural_strip(Projector *projector,
                                          const std::uint32_t strip_index) {
  Strip strip = projector->strips[strip_index];
  std::uint32_t frame_count = projector->length[strip_index];
  while (strip.larger_sibling_frames_strip_index != u32_max) {
    const std::uint32_t sibling_strip_index =
        strip.larger_sibling_frames_strip_index;
    const Strip &sibling = projector->strips[sibling_strip_index];
    structural_skipped_strips[sibling_strip_index] = true;
    frame_count += projector->length[sibling_strip_index];
    strip.larger_sibling_frames_strip_index =
        sibling.larger_sibling_frames_strip_index;
  }
  strip_buffer.write_strip(strip, frame_count);
}

/** @brief Current Stable Position in self-linked Pending traversal. */
static std::uint32_t pending_cursor;

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
 * @post Strip storage, dense links, indexes, and the Projection are empty.
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
  const Strip &strip = projector->strips[projector->gate_strip_index];

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
  if (projector.structural_root_strip_index == u32_max)
    return 0;

  const std::uint32_t first_position = projector.structural_root_strip_index;
  std::uint32_t position = first_position;
  do {
    const Strip &strip = projector.strips[position];
    footage_span_buffer.write_span(strip.footage_frame_index,
                                   projector.length[position]);
    position = projector.right[position];
  } while (position != first_position);

  return footage_span_buffer.get_span_count();
}

/**
 * @brief Write Footage spans for one half-open visible Projection range.
 *
 * Traversal starts at the Gate-selected containing Strip, clips the first and
 * last visible spans to `[start_index, end_index)`, and skips Masks without
 * advancing the visible Projection position.
 *
 * @param sequence_id Identifier of the active sequence.
 * @param start_index First visible Projection Frame to include.
 * @param end_index Boundary after the final visible Frame.
 * @return Number of ordered Footage spans written to FootageSpanBuffer.
 * @pre `0 <= start_index <= end_index <= projection_frame_count`.
 * @post Concatenating the reported Footage ranges yields exactly the requested
 * visible Projection range.
 * @complexity Linear in the structural Strips crossed by the selected range,
 * after bounded Gate positioning.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_projection_footage_spans_to_buffer(
    const std::uint32_t sequence_id, const std::uint32_t start_index,
    const std::uint32_t end_index) noexcept {
  Projector *projector = &*projectors[sequence_id];
  footage_span_buffer.clear();
  if (start_index == end_index)
    return 0;

  run_projector_to_frame_index(projector, start_index);
  std::uint32_t position = projector->gate_strip_index;
  std::uint32_t projection_frame_index = projector->gate_projection_frame_index;
  while (projection_frame_index < end_index) {
    const Strip &strip = projector->strips[position];
    if (strip.is_masked == 0) {
      const std::uint32_t span_start =
          projection_frame_index < start_index
              ? start_index - projection_frame_index
              : 0;
      const std::uint32_t span_end = std::min(
          projector->length[position], end_index - projection_frame_index);
      footage_span_buffer.write_span(strip.footage_frame_index + span_start,
                                     span_end - span_start);
      projection_frame_index += projector->length[position];
    }
    position = projector->right[position];
  }
  return footage_span_buffer.get_span_count();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MERGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Stage the buffered Strip for Initial Projection Resolution.
 * @param sequence_id Identifier of the receiving sequence.
 * @return Appended Stable Position, or `u32_max` for a duplicate.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
stage_strip(const std::uint32_t sequence_id) noexcept {
  return strip_buffer.read_strip(&*projectors[sequence_id]);
}

/**
 * @brief Integrate the Strip currently encoded in StripBuffer into a Replica.
 *
 * A Delta crosses this interface one Strip at a time; locally issued Strips use
 * the same path. StripBuffer appends the Strip directly to Projector storage
 * and HashTable indexes visible Frame containment. Duplicate transfer metadata
 * is dropped before dense storage grows.
 *
 * Every new Strip initially receives self-links. If the Projector has no
 * initial Projection or the referenced containment is absent or still Pending,
 * the Strip remains staged and no Projection index is returned. Otherwise a
 * visible Strip is integrated through `insert_strip`; a Mask resolves its first
 * existing Frame and is integrated through `mask_strip`. Sibling order is
 * handled centrally by `insert_between` using `is_inverse`.
 *
 * @param sequence_id Identifier of the sequence receiving the buffered strip.
 * @param projection_frame_index Known local Projection position, or `u32_max`
 * when a remote merge must locate it.
 * @return Projection frame index at which the incoming Strip begins. For a
 * Mask, the index is measured before its Frame Span leaves the Projection.
 * `u32_max` means the Strip was a duplicate or remains
 * Pending/staged.
 * @pre `sequence_id` identifies an active Projector.
 * @pre StripBuffer contains one valid transferable Strip representation.
 * @post An immediately materializable Strip joins Structural Order; otherwise
 * a newly retained Strip remains self-linked.
 * @note A supplied Projection index selects the direct local fast path.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t merge_strip_into_sequence(
    const std::uint32_t sequence_id,
    std::uint32_t projection_frame_index = u32_max) noexcept {
  Projector *projector = &*projectors[sequence_id];

  const std::uint32_t strip_index = strip_buffer.read_strip(projector);

  if (strip_index == u32_max)
    return u32_max;

  Strip *incoming_strip = &projector->strips[strip_index];

  if (incoming_strip->is_inverse == 1) {
    if (incoming_strip->is_masked == 1)
      return u32_max;
    root_insert_fast_path(projector, incoming_strip, projection_frame_index);
  }

  std::uint32_t containing_strip_index;
  if (projection_frame_index != u32_max) {
    run_projector_to_frame_index(projector, projection_frame_index);
    containing_strip_index = projector->gate_strip_index;
  } else {
    const auto containing = run_projector_to_strip(
        incoming_strip.is_masked != 0
            ? &incoming_strip.coordinate.this_strip_start
            : &incoming_strip.coordinate.previous_strip_end,
        projector);
    projection_frame_index = containing.first;
    containing_strip_index = containing.second;
    if (containing_strip_index == u32_max)
      return u32_max;
  }
  const std::uint32_t offset =
      projection_frame_index - projector->gate_projection_frame_index;

  if (incoming_strip.is_masked != 0) {
    projection_frame_index =
        mask_strip(projector, containing_strip_index, strip_index, offset,
                   projection_frame_index);
    projector->strips[strip_index].is_resolved = 1;
  } else {
    projection_frame_index =
        insert_strip(projector, containing_strip_index, strip_index, offset,
                     projection_frame_index);
  }
  return projection_frame_index;
}

/**
 * @brief Build the first Projection from all currently staged Strips.
 *
 * Initial Root Candidates seed a sentinel-free circular Structural Order.
 * Reachable visible and Mask dependencies are materialized through the ordinary
 * algorithms; unresolved entries remain self-linked.
 *
 * @param sequence_id Identifier of the sequence whose staged graph is resolved.
 * @pre `sequence_id` identifies an active Projector.
 */
EMSCRIPTEN_KEEPALIVE void
resolve_initial_projection(const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  const std::uint32_t strip_count =
      static_cast<std::uint32_t>(projector->strips.size());

  std::uint32_t root_index = u32_max;
  for (std::uint32_t strip_index = 0; strip_index < strip_count;
       ++strip_index) {
    const Strip &strip = projector->strips[strip_index];
    if (strip.is_masked == 0 &&
        projector->hash_table.get(strip.coordinate.previous_strip_end).first ==
            u32_max &&
        (root_index == u32_max ||
         compare_sequence_points(
             &strip.coordinate.this_strip_start,
             &projector->strips[root_index].coordinate.this_strip_start) > 0))
      root_index = strip_index;
  }

  projector->projection_frame_count = projector->length[root_index];
  projector->structural_root_strip_index = root_index;
  projector->head_strip_index = root_index;
  projector->tail_strip_index = root_index;
  projector->gate_strip_index = root_index;
  projector->gate_projection_frame_index = 0;

  for (std::uint32_t strip_index = 0; strip_index < strip_count;
       ++strip_index) {
    const Strip &strip = projector->strips[strip_index];
    if (strip_index != root_index && strip.is_masked == 0 &&
        projector->hash_table.get(strip.coordinate.previous_strip_end).first ==
            u32_max) {
      static_cast<void>(insert_between(projector, projector->left[root_index],
                                       strip_index, root_index));
      projector->projection_frame_count += projector->length[strip_index];
    }
  }
  projector->tail_strip_index = projector->left[root_index];

  for (std::uint32_t strip_index = 0; strip_index < strip_count;
       ++strip_index) {
    if (strip_index == root_index ||
        projector->strips[strip_index].is_resolved != 0 ||
        projector->left[strip_index] != strip_index ||
        projector->right[strip_index] != strip_index)
      continue;

    const Strip strip = projector->strips[strip_index];
    const auto [projection_frame_index, containing_strip_index] =
        run_projector_to_strip(strip.is_masked != 0
                                   ? &strip.coordinate.this_strip_start
                                   : &strip.coordinate.previous_strip_end,
                               projector);
    if (containing_strip_index == u32_max)
      continue;
    const std::uint32_t offset =
        projection_frame_index - projector->gate_projection_frame_index;

    if (strip.is_masked != 0) {
      static_cast<void>(mask_strip(projector, containing_strip_index,
                                   strip_index, offset,
                                   projection_frame_index));
      projector->strips[strip_index].is_resolved = 1;
    } else {
      static_cast<void>(insert_strip(projector, containing_strip_index,
                                     strip_index, offset,
                                     projection_frame_index));
    }
  }

  if (projector->projection_frame_count == 0) {
    projector->head_strip_index = u32_max;
    projector->tail_strip_index = u32_max;
    projector->gate_strip_index = root_index;
    projector->gate_projection_frame_index = 0;
    return;
  }

  projector->gate_strip_index = projector->head_strip_index;
  projector->gate_projection_frame_index = 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ACKNOWLEDGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Return the current shared Frontier buffer address.
 *
 * Each three-word entry is one Sequence Point in the current Frontier. Its
 * crypto-random and Unix components identify a Realm; its counter is the
 * greatest locally materialized Strip start in that Realm.
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
 * Structural traversal writes the greatest materialized Strip start of every
 * represented Realm directly to FrontierBuffer. Visible Strips and Masks
 * contribute equally: acknowledgement concerns materialized Sequence state,
 * while Mask eligibility is decided during compaction. Entry order is
 * unspecified.
 *
 * @param sequence_id Identifier of the active sequence to acknowledge.
 * @return Number of Realm entries written to the Frontier buffer.
 * @pre `sequence_id` identifies an active Projector.
 * @post FrontierBuffer contains exactly one Sequence Point for every Realm
 * represented by a materialized Strip in this Replica.
 * @complexity O(sr) worst-case time and O(r) temporary/output space for s
 * structural Strips and r represented Realms.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_acknowledgement_frontier_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  const Projector &projector = *projectors[sequence_id];
  frontier_buffer.clear();
  if (projector.structural_root_strip_index == u32_max)
    return 0;

  std::vector<SequencePoint> frontiers;
  const std::uint32_t first_position = projector.structural_root_strip_index;
  std::uint32_t position = first_position;
  do {
    const SequencePoint &point =
        projector.strips[position].coordinate.this_strip_start;
    auto frontier = std::find_if(
        frontiers.begin(), frontiers.end(),
        [&point](const SequencePoint &candidate) noexcept {
          return candidate.crypto_random_bits == point.crypto_random_bits &&
                 candidate.unix_lower_bits == point.unix_lower_bits;
        });
    if (frontier == frontiers.end())
      frontiers.push_back(point);
    else if (frontier->counter_bits < point.counter_bits)
      *frontier = point;
    position = projector.right[position];
  } while (position != first_position);

  for (const SequencePoint &frontier : frontiers)
    frontier_buffer.write_frontier(frontier);
  return frontier_buffer.get_frontier_count();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPACTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Prepare FrontierBuffer to receive a compaction Frontier.
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
EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_compaction_frontier_buffer(
    const std::uint32_t frontier_count) noexcept {
  // Allocate the exact writable Frontier transfer span.
  frontier_buffer.resize(frontier_count);
  return frontier_buffer.get_memory_pointer();
}

/**
 * @brief Return the shared Footage-span buffer.
 *
 * Every result entry is `(footage_frame_index, frame_count)`. The address may
 * change whenever any range read, recovery, or collection rewrites
 * FootageSpanBuffer.
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
compact_sequence(const std::uint32_t sequence_id) noexcept {
  const Projector &projector = *projectors[sequence_id];
  footage_span_buffer.clear();
  if (projector.structural_root_strip_index == u32_max)
    return 0;

  const std::uint32_t first_position = projector.structural_root_strip_index;
  std::uint32_t position = first_position;
  do {
    const Strip &strip = projector.strips[position];
    if (strip.is_masked != 0) {
      const SequencePoint &point = strip.coordinate.this_strip_start;
      for (std::uint32_t frontier_index = 0;
           frontier_index < frontier_buffer.get_frontier_count();
           ++frontier_index) {
        const SequencePoint frontier =
            frontier_buffer.read_frontier(frontier_index);
        if (frontier.crypto_random_bits == point.crypto_random_bits &&
            frontier.unix_lower_bits == point.unix_lower_bits &&
            frontier.counter_bits >= point.counter_bits) {
          footage_span_buffer.write_span(strip.footage_frame_index,
                                         projector.length[position]);
          break;
        }
      }
    }
    position = projector.right[position];
  } while (position != first_position);
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
  const Strip &strip = projector->strips[projector->gate_strip_index];
  strip_buffer.write_strip(strip,
                           projector->length[projector->gate_strip_index]);
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
  if (projector->structural_root_strip_index == u32_max)
    return 0;

  structural_start = projector->structural_root_strip_index;
  structural_cursor = structural_start;
  structural_skipped_strips.assign(projector->strips.size(), false);
  projector->gate_strip_index = structural_start;
  projector->gate_projection_frame_index = 0;
  write_structural_strip(projector, structural_cursor);
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
 * @retval 0 The next dense link returns to the traversal start; the Gate and
 * StripBuffer remain unchanged.
 * @pre `sequence_id` identifies an active Projector.
 * @pre A successful first retained Strip write positioned the Projector Gate.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_next_structural_strip_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  const Strip &current_strip = projector->strips[structural_cursor];
  if (current_strip.is_masked == 0)
    projector->gate_projection_frame_index +=
        projector->length[structural_cursor];
  do
    structural_cursor = projector->right[structural_cursor];
  while (structural_cursor != structural_start &&
         structural_skipped_strips[structural_cursor]);
  if (structural_cursor == structural_start)
    return 0;
  projector->gate_strip_index = structural_cursor;
  write_structural_strip(projector, structural_cursor);
  return 1;
}

/**
 * @brief Write the first self-linked Pending Snapshot Strip to StripBuffer.
 * @param sequence_id Identifier of the active sequence.
 * @retval 1 A pending insertion or Mask was written.
 * @retval 0 No Pending Strip exists.
 * @pre `sequence_id` identifies an active Projector.
 * @post On success, `pending_cursor` identifies the written Stable Position.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
write_first_pending_strip_to_buffer(const std::uint32_t sequence_id) noexcept {
  Projector &projector = *projectors[sequence_id];
  const std::uint32_t materialized_single_position =
      projector.structural_root_strip_index;
  for (pending_cursor = 0; pending_cursor < projector.strips.size();
       ++pending_cursor)
    if (projector.left[pending_cursor] == pending_cursor &&
        projector.right[pending_cursor] == pending_cursor &&
        pending_cursor != materialized_single_position) {
      strip_buffer.write_strip(projector.strips[pending_cursor],
                               projector.length[pending_cursor]);
      return 1;
    }
  return 0;
}

/**
 * @brief Advance the pending Snapshot traversal and write its next Strip.
 * @param sequence_id Identifier of the active sequence.
 * @retval 1 Another pending insertion or Mask was written.
 * @retval 0 Dense storage contains no later self-linked Strip.
 * @pre A successful first Pending write initialized `pending_cursor`.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
write_next_pending_strip_to_buffer(const std::uint32_t sequence_id) noexcept {
  Projector &projector = *projectors[sequence_id];
  for (++pending_cursor; pending_cursor < projector.strips.size();
       ++pending_cursor)
    if (projector.left[pending_cursor] == pending_cursor &&
        projector.right[pending_cursor] == pending_cursor) {
      strip_buffer.write_strip(projector.strips[pending_cursor],
                               projector.length[pending_cursor]);
      return 1;
    }
  return 0;
}

/**
 * @brief Return the mutable address of the shared ten-word StripBuffer.
 *
 * @return Pointer to the first of ten `std::uint32_t` words.
 * @note The address remains valid for the lifetime of the module, but every
 * StripBuffer read or write may replace its contents.
 * @see StripBuffer
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *get_strip_buffer_pointer() noexcept {
  // Expose the fixed shared Strip transfer storage.
  return strip_buffer.get_memory_pointer();
}
} // extern "C"
