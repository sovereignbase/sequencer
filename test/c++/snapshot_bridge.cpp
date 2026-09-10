#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include "../../src/c++/algorithms/buffers.hpp"
#include "../../src/c++/algorithms/acknowledge.hpp"
#include "../../src/c++/.auxiliary/stage_strip/index.hpp"
#include "../../src/c++/apply/mask/index.hpp"
#include <emscripten/emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE void clear_projection_buffer() {
  return sequencer::clear_projection_buffer();
}

EMSCRIPTEN_KEEPALIVE void clear_footage_span_buffer() {
  return sequencer::clear_footage_span_buffer();
}

EMSCRIPTEN_KEEPALIVE void clear_sequence_point_buffer() {
  return sequencer::clear_sequence_point_buffer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t acknowledge_projection(std::uint32_t projection_id) {
  return sequencer::acknowledge_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_acknowledgement_sequence_point_buffer_pointer() {
  return sequencer::get_acknowledgement_sequence_point_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t write_recovery_footage_spans_to_buffer(std::uint32_t projection_id) {
  return sequencer::write_recovery_footage_spans_to_buffer(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *prepare_projection_buffer(std::uint32_t count) {
  return sequencer::prepare_projection_buffer(count);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t initialize_projection() {
  return sequencer::initialize_projection();
}

EMSCRIPTEN_KEEPALIVE void clear_projection(std::uint32_t projection_id) {
  return sequencer::clear_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE void mask_test_projection(std::uint32_t projection_id) {
  auto &projector = *sequencer::projectors[projection_id];
  const auto command = stage_strip(projector, 2, 2, {70, 80, 0}, {10, 20, 0});
  static_cast<void>(apply_mask(projector, 0, command, 1));
}

EMSCRIPTEN_KEEPALIVE void snapshot_projection(std::uint32_t projection_id) {
  return sequencer::snapshot_projection(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_projection_buffer_pointer() {
  return sequencer::get_projection_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t get_projection_buffer_word_count() {
  return sequencer::get_projection_buffer_word_count();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t get_footage_span_buffer_count() {
  return sequencer::get_footage_span_buffer_count();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_footage_span_buffer_pointer() {
  return sequencer::get_footage_span_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t *get_strip_buffer_pointer() {
  return sequencer::get_strip_buffer_pointer();
}

EMSCRIPTEN_KEEPALIVE std::uint32_t get_projection_frame_count(std::uint32_t projection_id) {
  return sequencer::get_projection_frame_count(projection_id);
}

EMSCRIPTEN_KEEPALIVE std::uint32_t write_projection_footage_spans_to_buffer(
    std::uint32_t projection_id, std::uint32_t start, std::uint32_t end) {
  return sequencer::write_projection_footage_spans_to_buffer(projection_id, start, end);
}

}
