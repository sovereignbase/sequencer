#include "./algorithms/lifecycle.hpp"
#include "./algorithms/create.hpp"
#include "./algorithms/snapshot.hpp"
#include "./algorithms/read.hpp"
#include "./algorithms/update.hpp"
#include "./algorithms/replace.hpp"
#include "./algorithms/ingest.hpp"
#include "./algorithms/frontier.hpp"
#include "./algorithms/garbage_collect.hpp"
#include "./algorithms/buffers.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

extern "C" {

EMSCRIPTEN_KEEPALIVE void clear_projection_buffer() noexcept {
  return sequencer::clear_projection_buffer();
}

EMSCRIPTEN_KEEPALIVE void clear_footage_span_buffer() noexcept {
  return sequencer::clear_footage_span_buffer();
}

EMSCRIPTEN_KEEPALIVE void clear_frontier_buffer() noexcept {
  return sequencer::clear_frontier_buffer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_projection_buffer(
    const std::uint32_t strip_count) noexcept {
  return sequencer::prepare_projection_buffer(strip_count);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_projection_buffer_pointer() noexcept {
  return sequencer::get_projection_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t get_projection_buffer_word_count() noexcept {
  return sequencer::get_projection_buffer_word_count();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t get_footage_span_buffer_count() noexcept {
  return sequencer::get_footage_span_buffer_count();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
create_projection(const std::uint32_t actor_id,
                  const std::uint32_t footage_length) noexcept {
  return sequencer::create_projection(actor_id, footage_length);
}

EMSCRIPTEN_KEEPALIVE void
clear_projection(const std::uint32_t projection_id) noexcept {
  return sequencer::clear_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE void
snapshot_projection(const std::uint32_t projection_id) noexcept {
  return sequencer::snapshot_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
get_projection_frame_count(const std::uint32_t projection_id) noexcept {
  return sequencer::get_projection_frame_count(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
get_footage_frame_index(const std::uint32_t projection_id,
                        const std::uint32_t projection_frame_index) noexcept {
  return sequencer::get_footage_frame_index(projection_id, projection_frame_index);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t write_projection_footage_spans_to_buffer(
    const std::uint32_t projection_id, const std::uint32_t start_index,
    const std::uint32_t end_index) noexcept {
  return sequencer::write_projection_footage_spans_to_buffer(
      projection_id, start_index, end_index);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t update_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint8_t operation_type, const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index = u32_max) noexcept {
  const auto position = sequencer::update_projection(
      projection_id, operation_index, operation_type, operation_length,
      footage_frame_index);
  return position;
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
ingest_projection(const std::uint32_t projection_id,
                  const std::uint32_t footage_frame_index,
                  const std::uint32_t footage_length) noexcept {
  return sequencer::ingest_projection(projection_id, footage_frame_index,
                                      footage_length);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t replace_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint32_t operation_length,
    const std::uint32_t footage_frame_index) noexcept {
  return sequencer::replace_projection(projection_id, operation_index,
                                       operation_length,
                                       footage_frame_index);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t remove_projection(
    const std::uint32_t projection_id, const std::uint32_t operation_index,
    const std::uint32_t operation_length) noexcept {
  return sequencer::remove_projection(projection_id, operation_index,
                                      operation_length);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
snapshot_frontiers(const std::uint32_t projection_id) noexcept {
  return sequencer::snapshot_frontiers(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *
get_frontier_buffer_pointer() noexcept {
  return sequencer::get_frontier_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *
get_cached_acknowledgement_pointer(
    const std::uint32_t projection_id) noexcept {
  return sequencer::cached_acknowledgement_pointer(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
get_cached_acknowledgement_word_count(
    const std::uint32_t projection_id) noexcept {
  return sequencer::cached_acknowledgement_word_count(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t get_frontier_buffer_word_count() noexcept {
  return sequencer::get_frontier_buffer_word_count();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_frontier_buffer(
    const std::uint32_t word_count) noexcept {
  return sequencer::prepare_frontier_buffer(word_count);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_footage_span_buffer_pointer() noexcept {
  return sequencer::get_footage_span_buffer_pointer();
}

}
