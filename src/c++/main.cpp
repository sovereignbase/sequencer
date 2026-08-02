/**
 * @file
 * @brief Exposes sequencer projectors through the WebAssembly C interface.
 *
 * The interface owns projector lifetimes and the shared zero-copy transfer
 * buffers. Sequence identifiers address optional registry slots: clearing a
 * sequence destroys its projector state, and later initialization reuses that
 * identifier before the registry grows. Runtime callers guarantee valid active
 * identifiers and valid projection frame indexes.
 */
#include "./algorithms/insert_strip/index.hpp"
#include "./algorithms/mask_strip/index.hpp"
#include "./auxiliary/run_projector_forward/index.hpp"
#include "./auxiliary/run_projector_to_frame_index/index.hpp"
#include "./auxiliary/run_projector_to_sequence_point/index.hpp"
#include "./classes/footage_span_buffer/index.hpp"
#include "./classes/frontier_buffer/index.hpp"
#include "./classes/strip_buffer/index.hpp"
#include "./declarations/projector/index.hpp"
#include <cstdint>
#include <limits>
#include <optional>
#include <variant>
#include <vector>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

static std::vector<std::optional<Projector>> projectors;
static std::vector<std::uint32_t> available_sequence_ids;
static StripBuffer strip_buffer;
static FrontierBuffer frontier_buffer;
static FootageSpanBuffer footage_span_buffer;
static constexpr std::uint32_t no_projection_frame_index =
    std::numeric_limits<std::uint32_t>::max();

extern "C" {

/**
 * @brief Create an empty projector and return its stable sequence identifier.
 *
 * Cleared identifiers are reused before the projector registry is extended.
 *
 * @return Stable identifier of the initialized sequence.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t initialize_sequence() noexcept {
  if (available_sequence_ids.empty()) {
    projectors.emplace_back(std::in_place);
    return static_cast<std::uint32_t>(projectors.size() - 1);
  }

  const std::uint32_t sequence_id = available_sequence_ids.back();
  available_sequence_ids.pop_back();
  projectors[sequence_id].emplace();
  return sequence_id;
}

/**
 * @brief Destroy one projector while retaining its identifier for reuse.
 *
 * Repeated clearing of the same identifier has no effect.
 *
 * @param sequence_id Identifier of the sequence to clear.
 */
EMSCRIPTEN_KEEPALIVE void
clear_sequence(const std::uint32_t sequence_id) noexcept {
  if (!projectors[sequence_id])
    return;

  projectors[sequence_id].reset();
  available_sequence_ids.push_back(sequence_id);
}

/**
 * @brief Return the visible frame count of one sequence projection.
 *
 * @param sequence_id Identifier of the active sequence.
 * @return Number of frames in its current projection.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
get_projection_frame_count(const std::uint32_t sequence_id) noexcept {
  return projectors[sequence_id]->projection_frame_count;
}

/**
 * @brief Resolve a projection frame index to its footage frame index.
 *
 * @param sequence_id Identifier of the active sequence.
 * @param projection_frame_index Visible frame index to resolve.
 * @return Corresponding frame index in the strip's footage.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
get_footage_frame_index(const std::uint32_t sequence_id,
                        const std::uint32_t projection_frame_index) noexcept {
  Projector *projector = &*projectors[sequence_id];
  run_projector_to_frame_index(projector, projection_frame_index);
  const Strip &strip = *projector->strip_index.get(projector->gate_strip_start);
  return strip.footage_frame_index + projection_frame_index -
         projector->gate_projection_frame_index;
}

/**
 * @brief Write the strip containing a projection frame index to StripBuffer.
 *
 * @param sequence_id Identifier of the active sequence.
 * @param projection_frame_index Visible frame index whose strip is written.
 */
EMSCRIPTEN_KEEPALIVE void write_strip_at_projection_frame_index_to_buffer(
    const std::uint32_t sequence_id,
    const std::uint32_t projection_frame_index) noexcept {
  Projector *projector = &*projectors[sequence_id];
  run_projector_to_frame_index(projector, projection_frame_index);
  strip_buffer.write_strip(
      *projector->strip_index.get(projector->gate_strip_start));
}

/**
 * @brief Write the first structural strip of a sequence to StripBuffer.
 *
 * Structural traversal includes both visible and masked strips. On success,
 * the projector gate is positioned at the written strip and projection index
 * zero.
 *
 * @param sequence_id Identifier of the active sequence.
 * @return One when a strip was written; zero when the sequence is empty.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_first_structural_strip_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  if (projector->strip_index.is_empty())
    return 0;

  projector->gate_strip_start = projector->first_strip_start;
  projector->gate_projection_frame_index = 0;
  strip_buffer.write_strip(
      *projector->strip_index.get(projector->gate_strip_start));
  return 1;
}

/**
 * @brief Advance structural traversal and write the next strip to StripBuffer.
 *
 * @param sequence_id Identifier of the active sequence.
 * @return One when a successor was written; zero when the gate is at the last
 * structural strip.
 * @pre A successful first structural write positioned the projector gate.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_next_structural_strip_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  const Strip *current_strip =
      projector->strip_index.get(projector->gate_strip_start);
  if (current_strip->next_strip_start == unlinked_strip_start)
    return 0;

  strip_buffer.write_strip(run_projector_forward(projector, current_strip));
  return 1;
}

/**
 * @brief Return the mutable start address of the shared nine-word StripBuffer.
 *
 * @return Pointer to the first transferable std::uint32_t word.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *get_strip_buffer_pointer() noexcept {
  return strip_buffer.get_memory_pointer();
}

/**
 * @brief Return the current acknowledgement-frontier buffer address.
 *
 * Each entry is one SequencePoint whose Unix and random components identify a
 * realm and whose counter is the greatest locally observed indexed point in
 * that realm. The address may change whenever the buffer is rewritten.
 *
 * @return Pointer to the first realm frontier, or `nullptr` when empty.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *
get_acknowledgement_frontier_buffer_pointer() noexcept {
  return frontier_buffer.get_memory_pointer();
}

/**
 * @brief Write one sequence's realm-specific mask frontiers to the shared
 * acknowledgement buffer.
 *
 * StripIndex writes the final counter-ordered entry of every occupied realm
 * directly to FrontierBuffer. Mask semantics belong to garbage collection.
 *
 * @param sequence_id Identifier of the active sequence to acknowledge.
 * @return Number of SequencePoint entries written to the frontier buffer.
 * @complexity O(c) time and O(r) retained output space, where c is the realm
 * table capacity and r is its occupied realm count.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t write_acknowledgement_frontier_to_buffer(
    const std::uint32_t sequence_id) noexcept {
  projectors[sequence_id]->strip_index.write_acknowledgement_frontier(
      &frontier_buffer);
  return frontier_buffer.get_frontier_count();
}

/**
 * @brief Prepare the shared FrontierBuffer for selected GC frontiers.
 *
 * The returned memory contains `frontier_count` writable three-word entries.
 * Preparing the buffer may change its address, so callers must use this return
 * value rather than a previously observed pointer.
 *
 * @param frontier_count Number of selected realm frontiers to receive.
 * @return Pointer to the first writable frontier word, or `nullptr` for zero.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_garbage_collection_frontier_buffer(
    const std::uint32_t frontier_count) noexcept {
  frontier_buffer.resize(frontier_count);
  return frontier_buffer.get_memory_pointer();
}

/**
 * @brief Return the current garbage-collection footage-span buffer address.
 *
 * Every result entry is `(footage_frame_index, frame_count)`. The address may
 * change whenever another garbage collection rewrites the buffer.
 *
 * @return Pointer to the first released span, or `nullptr` when empty.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t *
get_garbage_collection_footage_span_buffer_pointer() noexcept {
  return footage_span_buffer.get_memory_pointer();
}

/**
 * @brief Permanently remove masks covered by the prepared realm frontiers.
 *
 * Structural unlinking and exact-key removal remain native. Released footage
 * spans are written to the shared FootageSpanBuffer for zero-copy processing
 * by the JavaScript owner.
 *
 * @param sequence_id Identifier of the active sequence to collect.
 * @return Number of released footage spans written to the result buffer.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
garbage_collect_sequence(const std::uint32_t sequence_id) noexcept {
  garbage_collect_masks(&*projectors[sequence_id], &frontier_buffer,
                        &footage_span_buffer);
  return footage_span_buffer.get_span_count();
}

/**
 * @brief Merge the strip currently encoded in StripBuffer into a sequence.
 *
 * If the coordinate's previous point is not materialized, the strip remains
 * pending under that exact dependency. A mask extending beyond the one strip
 * that contains its previous point is discarded without being retained.
 *
 * @param sequence_id Identifier of the sequence receiving the buffered strip.
 * @return Projection frame index at which the incoming strip begins. For a
 * mask, the index is measured before its frames leave the projection.
 * `no_projection_frame_index` means that the strip remained pending or was
 * discarded.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
merge_strip_into_sequence(const std::uint32_t sequence_id) noexcept {
  Projector *projector = &*projectors[sequence_id];
  const Strip incoming_strip = strip_buffer.read_strip();
  const SequencePoint &previous_strip_start =
      incoming_strip.coordinate.previous_strip_start;
  const auto containing_strip_result =
      run_projector_to_sequence_point(projector, &previous_strip_start);

  if (std::holds_alternative<bool>(containing_strip_result)) {
    if (incoming_strip.is_masked != 0)
      projector->pending_masks.set(previous_strip_start, incoming_strip);
    else
      projector->pending_inserts.set(previous_strip_start, incoming_strip);
    return no_projection_frame_index;
  }

  const auto [previous_strip, previous_strip_frame_offset] =
      std::get<0>(containing_strip_result);

  if (incoming_strip.is_masked != 0) {
    if (previous_strip->is_masked != 0 ||
        incoming_strip.frame_count >
            previous_strip->frame_count - previous_strip_frame_offset)
      return no_projection_frame_index;

    const std::uint32_t strip_projection_frame_index =
        projector->gate_projection_frame_index + previous_strip_frame_offset;
    mask_strip(projector, previous_strip, previous_strip_frame_offset,
               incoming_strip);
    return strip_projection_frame_index;
  }

  const std::uint32_t strip_projection_frame_index =
      projector->gate_projection_frame_index +
      (previous_strip->is_masked == 0 ? previous_strip_frame_offset + 1 : 0);
  insert_strip(projector, previous_strip, previous_strip_frame_offset,
               incoming_strip);
  return strip_projection_frame_index;
}
}
