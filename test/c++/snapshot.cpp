#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include "../../src/c++/algorithms/buffers.hpp"
#include "../../src/c++/.auxiliary/split_strip/index.hpp"
#include <cassert>

int main() {
  auto &buffer = sequencer::projection_buffer;
  const auto input = sequencer::prepare_projection_buffer(5);
  assert(input == sequencer::get_projection_buffer_pointer());
  assert(sequencer::get_projection_buffer_word_count() == 50);
  buffer.write_projection(0, {0, 5, 10, 20, 0, 0, 0, 0, 2, 1});
  buffer.write_projection(1, {1, 4, 10, 20, 10, 10, 20, 4, u32_max, u32_max});
  buffer.write_projection(2, {1, 3, 10, 20, 20, 10, 20, 10, u32_max, u32_max});
  buffer.write_projection(3, {3, 2, 30, 40, 0, 90, 80, 0, u32_max, u32_max});
  buffer.write_projection(4, {5, 2, 50, 60, 0, 90, 80, 1, u32_max, u32_max});
  const auto projection_id = sequencer::initialize_projection();
  assert(sequencer::get_projection_buffer_word_count() == 0);
  auto &projector = *sequencer::projectors[projection_id];
  projector.head_strip_index = 2;
  projector.tail_strip_index = 1;
  projector.left_strip_index_of[2] = u32_max;
  projector.right_strip_index_of[2] = 0;
  projector.left_strip_index_of[0] = 2;
  projector.right_strip_index_of[0] = 1;
  projector.left_strip_index_of[1] = 0;
  projector.right_strip_index_of[1] = u32_max;
  sequencer::snapshot_projection(projection_id);
  const auto snapshot = buffer.read_buffer();
  sequencer::footage_span_buffer.clear();
  assert(snapshot.size() == 5);
  assert(snapshot[0][4] == 20);
  assert(snapshot[1][4] == 0);
  assert(snapshot[2][4] == 10);
  assert(snapshot[1][8] == 0);
  assert(snapshot[1][9] == 2);
  assert(snapshot[3][0] >= 3 && snapshot[4][0] >= 3);
  assert(projector.pending_table.values().size() == 2);

  sequencer::clear_projection(projection_id);
  sequencer::clear_projection(projection_id);
  buffer.resize(snapshot.size());
  for (std::uint32_t strip_index = 0; strip_index < snapshot.size();
       ++strip_index)
    buffer.write_projection(strip_index, snapshot[strip_index]);
  const auto restored_id = sequencer::initialize_projection();
  assert(restored_id == projection_id);
  const auto &restored = *sequencer::projectors[restored_id];
  assert(restored.projection_frame_count == 12);
  assert(restored.pending_table.values().size() == 2);
  assert((restored.containment_table.get({30, 40, 0}) == std::pair{3u, 0u}));
  assert((restored.containment_table.get({50, 60, 0}) == std::pair{4u, 0u}));
  sequencer::clear_projection(restored_id);
  const auto empty_id = sequencer::initialize_projection();
  sequencer::snapshot_projection(empty_id);
  assert(buffer.read_buffer().empty());
  assert(sequencer::footage_span_buffer.get_span_count() == 0);
  sequencer::clear_projection(empty_id);

  buffer.resize(1);
  buffer.write_projection(0, {1, 3, 10, 20, 0, 0, 0, 0, u32_max, u32_max});
  const auto split_id = sequencer::initialize_projection();
  const auto suffix = split_strip(*sequencer::projectors[split_id], 0, 0);
  assert(suffix == 1);
  sequencer::snapshot_projection(split_id);
  const auto split_snapshot = buffer.read_buffer();
  sequencer::footage_span_buffer.clear();
  assert(split_snapshot.size() == 2);
  assert(split_snapshot[0][1] == 0);
  assert(split_snapshot[0][4] == 0);
  assert(split_snapshot[0][8] == 1);
  assert(split_snapshot[1][1] == 3);
  assert(split_snapshot[1][4] == 1);
  assert(split_snapshot[1][8] == u32_max);
  buffer.resize(2);
  buffer.write_projection(0, split_snapshot[0]);
  buffer.write_projection(1, split_snapshot[1]);
  sequencer::clear_projection(split_id);
  const auto split_restored_id = sequencer::initialize_projection();
  const auto &split_restored = *sequencer::projectors[split_restored_id];
  assert(split_restored.projection_frame_count == 3);
  assert(split_restored.gate_strip_index == 1);
  assert(split_restored.larger_split_strip_index_of[0] == 1);
  assert((split_restored.containment_table.get({10, 20, 0}) == std::pair{0u, 0u}));
  assert(split_restored.footage_frame_index_of[0] == 0);
  assert(split_restored.footage_frame_index_of[1] == 0);
  sequencer::clear_projection(split_restored_id);

  buffer.resize(8);
  buffer.write_projection(0, {2, 2, 70, 80, 0, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(1, {1, 0, 10, 20, 0, 0, 0, 0, 2, u32_max});
  buffer.write_projection(2, {1, 3, 10, 20, 1, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(3, {2, 2, 70, 80, 3, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(4, {0, 1, 30, 40, 0, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(5, {3, 2, 90, 91, 0, 99, 98, 0, u32_max, u32_max});
  buffer.write_projection(6, {4, 1, 90, 91, 3, 99, 98, 0, u32_max, u32_max});
  buffer.write_projection(7, {5, 2, 70, 80, 6, 99, 98, 0, u32_max, u32_max});
  const auto retained_id = sequencer::initialize_projection();
  auto &retained = *sequencer::projectors[retained_id];
  retained.footage_frame_index_of = {8, 4, 4, 0, 11, 2, 7, u32_max};
  const std::vector<char> source{'X', 'Y', 'p', 'q', 'a', 'b', 'c', 'r',
                                 'H', 'I', '?', 'd'};
  std::vector<char> original_view;
  for (std::uint32_t frame = 0; frame < retained.projection_frame_count; ++frame)
    original_view.push_back(source[sequencer::get_footage_frame_index(retained_id, frame)]);
  assert((original_view == std::vector<char>{'a', 'b', 'c', 'd'}));
  sequencer::snapshot_projection(retained_id);
  assert(sequencer::get_projection_buffer_word_count() == 80);
  assert(sequencer::get_footage_span_buffer_count() == 6);
  const auto spans = sequencer::get_footage_span_buffer_pointer();
  assert(spans[0] == 0 && spans[1] == 8 && spans[2] == 2 && spans[3] == 1);
  assert(spans[4] == 0 && spans[5] == 4 && spans[6] == 3 && spans[7] == 0);
  assert(spans[8] == 3 && spans[9] == 0 && spans[10] == 2 && spans[11] == 1);
  assert(spans[12] == 3 && spans[13] == 11 && spans[14] == 1 && spans[15] == 0);
  std::vector<char> packed;
  for (std::uint32_t span = 0; span < 6; ++span) {
    if (span >= 4)
      assert(spans[span * 4] == u32_max && spans[span * 4 + 3] == 0);
    for (std::uint32_t offset = 0; offset < spans[span * 4 + 2]; ++offset)
      packed.push_back(source[spans[span * 4 + 1] + offset]);
  }
  assert(packed.size() == 11);
  sequencer::clear_footage_span_buffer();
  const auto retained_restored_id = sequencer::initialize_projection();
  const auto &original_retained = *sequencer::projectors[retained_id];
  const auto &retained_restored = *sequencer::projectors[retained_restored_id];
  assert(retained_restored.projection_frame_count == original_view.size());
  for (std::uint32_t frame = 0; frame < original_view.size(); ++frame)
    assert(packed[sequencer::get_footage_frame_index(retained_restored_id, frame)] ==
           original_view[frame]);
  for (std::uint32_t strip = 0; strip < 8; ++strip) {
    const auto point = retained_restored.strip_start_of[strip];
    const auto original_strip = original_retained.containment_table.get(point).first;
    assert(original_strip != u32_max);
    if (strip >= 5 && retained_restored.strip_type_of[strip] == 2) {
      assert(retained_restored.footage_frame_index_of[strip] == u32_max);
      continue;
    }
    for (std::uint32_t offset = 0; offset < retained_restored.strip_length_of[strip]; ++offset)
      assert(packed[retained_restored.footage_frame_index_of[strip] + offset] ==
             source[original_retained.footage_frame_index_of[original_strip] + offset]);
  }
  sequencer::clear_projection(retained_id);
  sequencer::clear_projection(retained_restored_id);
}
