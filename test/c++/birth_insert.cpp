#include "../../src/c++/algorithms/issue.hpp"
#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include "../../src/c++/apply/insert/birth/index.hpp"
#include "../../src/c++/apply/insert/after/index.hpp"
#include "../../src/c++/find/projection_frame_index/index.hpp"
#include <cassert>
#include <string>
#include <vector>

void check(const std::uint8_t type, const std::uint32_t length, const bool pending) {
  const auto projection_id = sequencer::initialize_projection();
  auto &projector = *sequencer::projectors[projection_id];
  std::string footage;
  if (pending) {
    const SequencePoint dependency{99, 98, 97};
    const SequencePoint start{sequencer::insert_realm_crypto_random_bits ^ 1u,
                              sequencer::shared_realm_unix_lower_bits, 0};
    const auto waiting = stage_strip(projector, 1, 2, start, dependency, 0);
    projector.pending_table.set(dependency, waiting);
    footage = "pq";
  }
  const auto incoming = sequencer::issue_strip(
      projector, type, length, {0, 0, 0}, static_cast<std::uint32_t>(footage.size()));
  assert(incoming == (pending ? 1u : 0u));
  footage += std::string(length, 'a');
  const auto before_counter = projector.operation_count;
  const auto [frames, strips] = insert_birth(projector, incoming);
  assert(frames == static_cast<std::int32_t>(length));
  assert(strips == 1);
  assert(projector.operation_count == before_counter);
  assert(projector.operation_count == length + 1);
  assert(projector.mask_operation_count == 0);
  assert(projector.head_strip_index == incoming);
  assert(projector.tail_strip_index == incoming);
  assert(projector.gate_strip_index == incoming);
  assert(projector.projection_frame_index == 0);
  assert(projector.left_strip_index_of[incoming] == u32_max);
  assert(projector.right_strip_index_of[incoming] == u32_max);
  assert(projector.left_jump_strip_index_of[incoming] == u32_max);
  assert(projector.right_jump_strip_index_of[incoming] == u32_max);
  assert(projector.materialized_strip_count == 1);
  if (pending) {
    assert(projector.left_strip_index_of[0] == 0);
    assert(projector.right_strip_index_of[0] == 0);
    assert(projector.pending_table.values() == std::vector<std::uint32_t>{0});
  }

  std::string expected(length, 'a');
  for (std::uint32_t edit = 0; edit < 64; ++edit) {
    const auto previous = projector.tail_strip_index;
    auto dependency = projector.strip_start_of[previous];
    const auto offset = projector.strip_length_of[previous];
    dependency.counter_bits += offset;
    const auto append_length = edit % 5 + 1;
    const auto append = sequencer::issue_strip(
        projector, 1, append_length, dependency, static_cast<std::uint32_t>(footage.size()));
    const auto [frame_diff, strip_diff] = insert_after(projector, previous, append, offset);
    const auto position = find_projection_frame_index_of(projector, append, frame_diff, strip_diff);
    assert(position == expected.size());
    projector.gate_strip_index = append;
    projector.projection_frame_index = position;
    const std::string text(append_length, static_cast<char>('A' + edit % 26));
    footage += text;
    expected += text;
    assert(projector.tail_strip_index == append);
    assert(projector.right_strip_index_of[append] == u32_max);
    assert(projector.strip_start_of[append].counter_bits == dependency.counter_bits + 1);
  }
  for (std::uint32_t frame = 0; frame < expected.size(); ++frame)
    assert(footage[sequencer::get_footage_frame_index(projection_id, frame)] == expected[frame]);
  for (auto strip = projector.head_strip_index; strip != u32_max;
       strip = projector.right_strip_index_of[strip]) {
    const auto point = projector.strip_start_of[strip];
    const auto count = projector.strip_length_of[strip];
    assert((projector.containment_table.get(point) == std::pair{strip, 0u}));
    assert((projector.containment_table.get({point.crypto_random_bits, point.unix_lower_bits,
                                           point.counter_bits + count}) == std::pair{strip, count}));
  }

  const auto counter = projector.operation_count;
  sequencer::snapshot_projection(projection_id);
  const auto span_count = sequencer::footage_span_buffer.get_span_count();
  const auto spans = sequencer::footage_span_buffer.get_memory_pointer();
  std::string packed;
  for (std::uint32_t span = 0; span < span_count; ++span)
    packed += footage.substr(spans[span * 4 + 1], spans[span * 4 + 2]);
  sequencer::footage_span_buffer.clear();
  const auto restored_id = sequencer::initialize_projection();
  auto &restored = *sequencer::projectors[restored_id];
  assert(restored.operation_count == counter);
  assert(restored.projection_frame_count == expected.size());
  assert(restored.pending_table.values().size() == (pending ? 1u : 0u));
  for (std::uint32_t frame = 0; frame < expected.size(); ++frame)
    assert(packed[sequencer::get_footage_frame_index(restored_id, frame)] == expected[frame]);
  const auto tail = restored.tail_strip_index;
  const auto tail_length = restored.strip_length_of[tail];
  auto dependency = restored.strip_start_of[tail];
  dependency.counter_bits += tail_length;
  const auto continued = sequencer::issue_strip(
      restored, 1, 1, dependency, static_cast<std::uint32_t>(packed.size()));
  assert(restored.strip_start_of[continued].counter_bits == counter);
  const auto [frame_diff, strip_diff] = insert_after(restored, tail, continued, tail_length);
  const auto position = find_projection_frame_index_of(restored, continued, frame_diff, strip_diff);
  assert(position == expected.size());
  restored.gate_strip_index = continued;
  restored.projection_frame_index = position;
  packed += '!';
  expected += '!';
  for (std::uint32_t frame = 0; frame < expected.size(); ++frame)
    assert(packed[sequencer::get_footage_frame_index(restored_id, frame)] == expected[frame]);
  sequencer::clear_projection(restored_id);
  sequencer::clear_projection(projection_id);
}

int main() {
  for (const auto type : {0u, 1u})
    for (const auto length : {1u, 3u, 64u})
      for (const auto pending : {false, true})
        check(static_cast<std::uint8_t>(type), length, pending);
}
