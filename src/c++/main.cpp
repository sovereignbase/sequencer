#include "./algorithms/lifecycle.hpp"
#include "./algorithms/snapshot.hpp"
#include "./algorithms/read.hpp"
#include "./algorithms/update.hpp"
#include "./algorithms/merge.hpp"
#include "./algorithms/acknowledge.hpp"
#include "./algorithms/compact.hpp"
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

EMSCRIPTEN_KEEPALIVE void clear_sequence_point_buffer() noexcept {
  return sequencer::clear_sequence_point_buffer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t write_recovery_footage_spans_to_buffer(
    const std::uint32_t projection_id) noexcept {
  return sequencer::write_recovery_footage_spans_to_buffer(projection_id);
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

EMSCRIPTEN_KEEPALIVE std::uint32_t initialize_projection() noexcept {
  return sequencer::initialize_projection();
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
  return sequencer::update_projection(projection_id, operation_index,
                                      operation_type, operation_length,
                                      footage_frame_index);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
merge_projection(const std::uint32_t projection_id,
                 const std::uint32_t footage_frame_index) noexcept {
  return sequencer::merge_projection(projection_id, footage_frame_index);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
acknowledge_projection(const std::uint32_t projection_id) noexcept {
  return sequencer::acknowledge_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t
compact_projection(const std::uint32_t projection_id) noexcept {
  return sequencer::compact_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *
get_acknowledgement_sequence_point_buffer_pointer() noexcept {
  return sequencer::get_acknowledgement_sequence_point_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_compaction_sequence_point_buffer(
    const std::uint32_t frontier_count) noexcept {
  return sequencer::prepare_compaction_sequence_point_buffer(frontier_count);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_footage_span_buffer_pointer() noexcept {
  return sequencer::get_footage_span_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_strip_buffer_pointer() noexcept {
  return sequencer::get_strip_buffer_pointer();
}

}
