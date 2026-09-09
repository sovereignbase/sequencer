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
#include "./.buffers/footage_span_buffer/index.hpp"
#include "./.buffers/projection_buffer/index.hpp"
#include "./.buffers/sequence_point_buffer/index.hpp"
#include "./.declarations/projector/index.hpp"
#include "./.declarations/sentinels/index.hpp"
#include "./apply/insert/index.hpp"
#include "./apply/mask/index.hpp"
#include "./apply/root/index.hpp"
#include "./find/containing_strip_index/index.hpp"
#include "./find/projection_frame_index/index.hpp"
#include <algorithm>
#include <chrono>
#include <cstdint>
#include <optional>
#include <random>
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
static std::vector<std::uint32_t> available_projection_ids;

/** @brief Shared result buffer for ordered or released Footage spans. */
static FootageSpanBuffer footage_span_buffer;

/** @brief Shared dense snapshot in resolved projection order. */
static ProjectionBuffer projection_buffer;

/** @brief Shared variable-width transfer buffer for one Frontier. */
static SequencePointBuffer sequence_point_buffer;

static const std::uint32_t realm_crypto_random_bits = std::random_device{}();

static const std::uint32_t realm_unix_lower_bits = static_cast<std::uint32_t>(
    std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch())
        .count());

extern "C" {

EMSCRIPTEN_KEEPALIVE std::uint32_t initialize_projection() noexcept {
  std::uint32_t projection_id;
  if (available_projection_ids.empty()) {
    projection_id = static_cast<std::uint32_t>(projectors.size());
    projectors.emplace_back(std::in_place);
  } else {
    projection_id = available_projection_ids.back();
    available_projection_ids.pop_back();
    projectors[projection_id].emplace();
  }
  // CHECK IF A TRUSTED DELTA WAS PROVIDED
  const auto projection = projection_buffer.read_buffer();
  if (!projection.empty()) {
    Projector &projector = *projectors[projection_id];
    // Prepare memory
    const auto strip_count = static_cast<std::uint32_t>(projection.size());
    projector.strip_type_of.reserve(strip_count);
    projector.strip_length_of.reserve(strip_count);
    projector.strip_start_of.reserve(strip_count);
    projector.previous_strip_end_of.reserve(strip_count);
    projector.larger_split_strip_index_of.reserve(strip_count);
    projector.larger_competitor_strip_index_of.reserve(strip_count);
    projector.left_strip_index_of.reserve(strip_count);
    projector.right_strip_index_of.reserve(strip_count);
    projector.footage_frame_index_of.reserve(strip_count);
    projector.left_jump_strip_index_of.assign(strip_count, u32_max);
    projector.right_jump_strip_index_of.assign(strip_count, u32_max);
    projector.left_jump_strip_count_of.resize(strip_count);
    projector.right_jump_strip_count_of.resize(strip_count);
    projector.left_jump_length_of.resize(strip_count);
    projector.right_jump_length_of.resize(strip_count);
    projector.materialized_strip_count = strip_count;

    // Calculate ideal jump distance.
    const std::uint32_t optimal_jump_distance = static_cast<std::uint32_t>(
        std::sqrt(projector.materialized_strip_count) + 0.5);

    for (std::uint32_t strip_index = 0; strip_index < strip_count;
         ++strip_index) {
      const auto &strip = projection[strip_index];
      const SequencePoint strip_start{strip[2], strip[3], strip[4]};
      projector.strip_type_of.push_back(static_cast<std::uint8_t>(strip[0]));
      projector.strip_length_of.push_back(strip[1]);
      projector.strip_start_of.push_back(strip_start);
      projector.previous_strip_end_of.push_back({strip[5], strip[6], strip[7]});
      projector.larger_split_strip_index_of.push_back(strip[8]);
      projector.larger_competitor_strip_index_of.push_back(strip[9]);
      projector.left_strip_index_of.push_back(
          strip_index == 0 ? u32_max : strip_index - 1);
      projector.right_strip_index_of.push_back(
          strip_index + 1 == strip_count ? u32_max : strip_index + 1);
      projector.footage_frame_index_of.push_back(
          strip[0] == 2 ? u32_max : projector.projection_frame_count);
      if (strip[0] != 2)
        projector.projection_frame_count += strip[1];
      if (strip[1] != 0)
        projector.containment_index.set(strip_start, strip[1], strip_index,
                                        true);
      if (strip_start.crypto_random_bits == realm_crypto_random_bits &&
          strip_start.unix_lower_bits == realm_unix_lower_bits)
        projector.operation_count =
            std::max(projector.operation_count,
                     strip_start.counter_bits + std::max(strip[1], 1u));
    }

    projector.containment_index.sort_realms();
    projector.head_strip_index = 0;
    projector.gate_strip_index = 0;
    projector.tail_strip_index = strip_count - 1;
    projector.materialized_strip_count = strip_count;
  }
  return projection_id;
}

EMSCRIPTEN_KEEPALIVE void
clear_projection(const std::uint32_t projection_id) noexcept {
  // Ignore an already cleared registry slot.
  if (!projectors[projection_id])
    return;

  // Destroy the Projector and publish its reusable identifier.
  projectors[projection_id].reset();
  available_projection_ids.push_back(projection_id);
}

EMSCRIPTEN_KEEPALIVE void
snapshot_projection(const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];
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
get_projection_frame_count(const std::uint32_t projection_id) noexcept {
  // Read the materialized Projection length directly.
  return projectors[projection_id]->projection_frame_count;
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
get_footage_frame_index(const std::uint32_t projection_id,
                        const std::uint32_t projection_frame_index) noexcept {
  // Position the Gate at the visible containing Strip.
  Projector &projector = *projectors[projection_id];
  find_strip_index_of(projector, projection_frame_index);

  // Translate the Projection offset through the Strip's Footage mapping.
  return projector.footage_frame_index_of[projector.gate_strip_index] +
         projection_frame_index - projector.projection_frame_index;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EMSCRIPTEN_KEEPALIVE std::uint32_t update_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint8_t operation_type, const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index = u32_max) noexcept {
  Projector &projector = *projectors[projection_id];
  find_strip_index_of(projector, operation_index);
  const std::uint32_t containing_strip_index = projector.gate_strip_index;
  const std::uint32_t offset =
      operation_index - projector.projection_frame_index;

  const std::uint32_t incoming_strip_index = projector.strip_type_of.size();
  projector.strip_type_of.push_back(operation_type);
  projector.strip_length_of.push_back(operation_length);
  const SequencePoint strip_start = {realm_crypto_random_bits,
                                     realm_unix_lower_bits,
                                     projector.operation_count};
  projector.strip_start_of.push_back(strip_start);
  SequencePoint previous_strip_end =
      projector.strip_start_of[containing_strip_index];
  previous_strip_end.counter_bits += offset;
  projector.previous_strip_end_of.push_back(previous_strip_end);

  projector.larger_competitor_strip_index_of.push_back(u32_max);
  projector.larger_split_strip_index_of.push_back(u32_max);
  projector.right_strip_index_of.push_back(incoming_strip_index);
  projector.left_strip_index_of.push_back(incoming_strip_index);
  projector.left_jump_strip_index_of.push_back(u32_max);
  projector.left_jump_strip_count_of.push_back(0);
  projector.left_jump_length_of.push_back(0);
  projector.right_jump_strip_index_of.push_back(u32_max);
  projector.right_jump_strip_count_of.push_back(0);
  projector.right_jump_length_of.push_back(0);
  projector.footage_frame_index_of.push_back(footage_frame_index);

  projector.containment_index.set(strip_start, operation_length,
                                  incoming_strip_index);

  projector.operation_count++;

  if (operation_type == 0) {
    projection_buffer.resize(1);
    projection_buffer.write_projection(
        0, {projector.strip_type_of[incoming_strip_index],
            projector.strip_length_of[incoming_strip_index],
            strip_start.crypto_random_bits, strip_start.unix_lower_bits,
            strip_start.counter_bits, previous_strip_end.crypto_random_bits,
            previous_strip_end.unix_lower_bits, previous_strip_end.counter_bits,
            0, 0});
    return apply_root(projector, incoming_strip_index);
  }

  std::int32_t frame_count_diff;
  std::int32_t strip_count_diff;
  if (operation_type == 1)
    std::tie(frame_count_diff, strip_count_diff) = apply_insert(
        projector, containing_strip_index, incoming_strip_index, offset);
  else if (operation_type == 2)
    std::tie(frame_count_diff, strip_count_diff) = apply_mask(
        projector, containing_strip_index, incoming_strip_index, offset);
  else
    return u32_max;
  // FIND NEAREST LEFT AND RIGHT JUMPS
  std::uint32_t left_cursor = incoming_strip_index;
  std::uint32_t right_cursor = incoming_strip_index;

  bool left_jump_found = false;
  bool right_jump_found = false;

  while (!left_jump_found || !right_jump_found) {
    if (!left_jump_found) {
      left_cursor = projector.left_strip_index_of[left_cursor];
      left_jump_found =
          left_cursor == projector.head_strip_index ||
          projector.right_jump_strip_index_of[left_cursor] != u32_max;
    }

    if (!right_jump_found) {
      right_cursor = projector.right_strip_index_of[right_cursor];
      right_jump_found =
          right_cursor == projector.tail_strip_index ||
          projector.left_jump_strip_index_of[right_cursor] != u32_max;
    }
  }

  // UPDATE NEAREST LEFT JUMP
  if (projector.right_jump_strip_index_of[left_cursor] != u32_max) {
    projector.right_jump_length_of[left_cursor] += frame_count_diff;
    projector.right_jump_strip_count_of[left_cursor] += strip_count_diff;
  }

  // UPDATE NEAREST RIGHT JUMP
  if (projector.left_jump_strip_index_of[right_cursor] != u32_max) {
    projector.left_jump_length_of[right_cursor] += frame_count_diff;
    projector.left_jump_strip_count_of[right_cursor] += strip_count_diff;
  }

  projection_buffer.resize(1);
  projection_buffer.write_projection(
      0, {projector.strip_type_of[incoming_strip_index],
          projector.strip_length_of[incoming_strip_index],
          strip_start.crypto_random_bits, strip_start.unix_lower_bits,
          strip_start.counter_bits, previous_strip_end.crypto_random_bits,
          previous_strip_end.unix_lower_bits, previous_strip_end.counter_bits,
          0, 0});
  return operation_index;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MERGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EMSCRIPTEN_KEEPALIVE std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 const std::uint32_t footage_frame_index) noexcept {

  const auto projection = projection_buffer.read_buffer();
  if (projection.empty())
    return;

  Projector &projector = *projectors[projection_id];

  for ()

    const std::uint32_t incoming_strip_index =
        strip_buffer.read_strip(projector);

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
      projector.previous_strip_end_of[incoming_strip_index]);

  // If gate strip is not containing strip
  if (offset == u32_max) {
    // try resolving containing strip from containment index
    std::tie(containing_strip_index, offset) = projector.containment_index.get(
        projector.previous_strip_end_of[incoming_strip_index]);

    // If resolving failed return u32_max sentinel
    if (containing_strip_index == u32_max)
      return u32_max
  }

  std::int32_t frame_count_diff;
  std::int32_t strip_count_diff;
  if (operation_type == 1)
    std::tie(frame_count_diff, strip_count_diff) = apply_insert(
        projector, containing_strip_index, incoming_strip_index, offset);
  else if (operation_type == 2)
    std::tie(frame_count_diff, strip_count_diff) = apply_mask(
        projector, containing_strip_index, incoming_strip_index, offset);
  else
    return u32_max;

  return find_projection_frame_index_of(projector, incoming_strip_index,
                                        frame_count_diff, strip_count_diff)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ACKNOWLEDGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EMSCRIPTEN_KEEPALIVE std::uint32_t
acknowledge_projection(const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];

  sequence_point_buffer.clear();
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
    sequence_point_buffer.write_frontier(frontier);
  return sequence_point_buffer.get_frontier_count();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPACTION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief Release Footage covered by acknowledged Masks.
 *
 * For every Frontier entry, Masks in the same Realm at or below its counter
 * report their consumer-owned Footage spans. Every Mask, coordinate, and
 * structural link remains materialized as permanent dependency data.
 *
 * @param projection_id Identifier of the active sequence to collect.
 * @return Number of released Footage spans written to the result buffer.
 * @pre `projection_id` identifies an active Projector.
 * @pre FrontierBuffer contains at most one selected point per represented
 * Realm, derived from the required Replica Frontiers.
 * @post Projector state and retained Strip metadata are unchanged.
 */
EMSCRIPTEN_KEEPALIVE std::uint32_t
compact_projection(const std::uint32_t projection_id) noexcept {
  const Projector &projector = *projectors[projection_id];
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
           frontier_index < sequence_point_buffer.get_frontier_count();
           ++frontier_index) {
        const SequencePoint frontier =
            sequence_point_buffer.read_frontier(frontier_index);
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
// IO HELPPERS
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
get_acknowledgement_sequence_point_buffer_pointer() noexcept {
  // Expose the current shared Frontier transfer storage.
  return sequence_point_buffer.get_memory_pointer();
}

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
EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_compaction_sequence_point_buffer(
    const std::uint32_t frontier_count) noexcept {
  // Allocate the exact writable Frontier transfer span.
  sequence_point_buffer.resize(frontier_count);
  return sequence_point_buffer.get_memory_pointer();
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
