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
#include "./.auxiliary/strip_contains_previous_strip_end/index.hpp"
#include "./.buffer/strip_buffer/index.hpp"
#include "./.buffers/footage_span_buffer/index.hpp"
#include "./.buffers/frontier_buffer/index.hpp"
#include "./.buffers/projection_buffer/index.hpp"
#include "./.declarations/projector/index.hpp"
#include "./.declarations/sentinels/index.hpp"
#include "./apply/root/index.hpp"
#include "./find/containing_strip_index/index.hpp"
#include "./find/projection_frame_index/index.hpp"
#include <algorithm>
#include <cstdint>
#include <optional>
#include <tuple>
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

/** @brief Shared dense snapshot in resolved projection order. */
static ProjectionBuffer projection_buffer;

extern "C" {

/**
 * @brief Create a Projector and consume an optional ordered snapshot.
 *
 * A cleared registry slot is reused before a new slot is appended. The returned
 * identifier remains assigned to this Replica until `clear_sequence` releases
 * it.
 *
 * @return Registry identifier of the initialized Sequence state.
 * @post An empty buffer leaves an empty Projector; otherwise the snapshot's
 * Strips, links, containment, Footage indices, and navigation are restored.
 * @post ProjectionBuffer is empty and no longer owns the snapshot allocation.
 * @complexity Expected O(n) restoration plus per-Realm containment sorting.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t initialize_sequence() noexcept {
  std::uint32_t sequence_id;
  if (available_sequence_ids.empty()) {
    sequence_id = static_cast<std::uint32_t>(projectors.size());
    projectors.emplace_back(std::in_place);
  } else {
    sequence_id = available_sequence_ids.back();
    available_sequence_ids.pop_back();
    projectors[sequence_id].emplace();
  }
  const auto projection = projection_buffer.read_buffer();
  if (!projection.empty())
    hydrate_projection(*projectors[sequence_id], projection);
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

/**
 * @brief Write ten words per Strip in right-link order into the empty buffer.

 * * @pre The active sequence's chain contains every stored Strip, starts at
 * head,
 * and ends at u32_max. The previous snapshot has been consumed.
 *
 * @complexity O(n) time and output space for n linked Strips, including Masks.
 */
EMSCRIPTEN_KEEPALIVE void
snapshot_projection(const std::uint32_t sequence_id) noexcept {
  const Projector &projector = *projectors[sequence_id];
  // Prepare pojection buffer
  const auto count = projector.strip_start_of.size();
  projection_buffer.resize(count);

  std::vector<std::uint32_t> projection_indices(count);
  std::uint32_t projection_strip_index = 0;

  // Encode ordered strip indices
  for (std::uint32_t strip_index = projector.head_strip_index;
       strip_index != u32_max;
       strip_index = projector.right_strip_index_of[strip_index])
    projection_indices[strip_index] = projection_strip_index++;

  projection_strip_index = 0;
  for (std::uint32_t strip_index = projector.head_strip_index;
       strip_index != u32_max;
       strip_index = projector.right_strip_index_of[strip_index]) {
    const auto &strip_start = projector.strip_start_of[strip_index];
    const auto &previous_strip_end =
        projector.previous_strip_end_of[strip_index];
    const auto larger_split_strip =
        projector.larger_split_strip_index_of[strip_index];
    const auto larger_competitor_strip =
        projector.larger_competitor_strip_index_of[strip_index];
    projection_buffer.write_projection(
        projection_strip_index++,
        {
            projector.strip_type_of[strip_index],
            projector.strip_length_of[strip_index],
            strip_start.crypto_random_bits,
            strip_start.unix_lower_bits,
            strip_start.counter_bits,
            previous_strip_end.crypto_random_bits,
            previous_strip_end.unix_lower_bits,
            previous_strip_end.counter_bits,
            larger_split_strip == u32_max
                ? u32_max
                : projection_indices[larger_split_strip],
            larger_competitor_strip == u32_max
                ? u32_max
                : projection_indices[larger_competitor_strip],
        });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// READS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EMSCRIPTEN_KEEPALIVE std::uint32_t
get_projection_frame_count(const std::uint32_t sequence_id) noexcept {
  // Read the materialized Projection length directly.
  return projectors[sequence_id]->projection_frame_count;
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
get_footage_frame_index(const std::uint32_t sequence_id,
                        const std::uint32_t projection_frame_index) noexcept {
  // Position the Gate at the visible containing Strip.
  Projector projector = &projectors[sequence_id];
  find_strip_index_of(projector, projection_frame_index);

  // Translate the Projection offset through the Strip's Footage mapping.
  return projecor.footage_frame_index_of[projector.gate_strip_index] +
         projection_frame_index - projector.projection_frame_index;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MERGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EMSCRIPTEN_KEEPALIVE std::uint32_t
merge_strip_into_sequence(const std::uint32_t sequence_id,
                          const std::uint32_t footage_frame_index) noexcept {
  Projector &projector = projectors[sequence_id];

  const std::uint32_t incoming_strip_index = strip_buffer.read_strip(projector);

  // Return early in case of a duplicate
  if (incoming_strip_index == u32_max)
    return u32_max;

  const std::uint32_t incoming_strip_type =
      projector.strip_type_of[incoming_strip_index];

  // Handle root inserts trough a fast path
  if (incoming_strip_type == 0)
    return apply_root(projector, incoming_strip_index);

  // Check if gate is at target
  std::uint32_t containing_strip_index = projector.gate_strip_index;
  std::uint32_t offset = strip_contains_previous_strip_end(
      projector.strip_start_of[containing_strip_index],
      projector.strip_length_of[containing_strip_index],
      projecor.previous_strip_end_of[incoming_strip_index]);

  // If gate strip is not containing strip
  if (offset == u32_max) {
    // try resolving containing strip from containment index
    std::tie(containing_strip_index, offset) = projector.containment_index.get(
        projector.previous_strip_end_of[incoming_strip_index]);

    // If resolving failed return u32_max sentinel
    if (containing_strip_index == u32_max)
      return u32_max
  }

  if (incoming_strip_type == 1)
    apply_insert(projector, containing_strip_index, incoming_strip_index,
                 offset);
  else if (incoming_strip_type == 2)
    apply_mask(projector, containing_strip_index, incoming_strip_index, offset);
  else
    return u32_max;

  return find_projection_frame_index_of(projector, incoming_strip_index);
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
 * @post FrontierBuffer has space for exactly `frontier_count` complete
 * entries.
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
 * @note The buffer describes only the most recent operation that populated
 * it.
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
 * Retained traversal includes visible Strips and Masks. On success, the Gate
 * is positioned at the written Strip and at Projection frame index zero. An
 * empty Sequence leaves both the Gate and StripBuffer unchanged.
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
