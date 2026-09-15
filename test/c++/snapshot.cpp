#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include "../../src/c++/algorithms/update.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include "../../src/c++/algorithms/buffers.hpp"
#include "../../src/c++/.auxiliary/split_strip/index.hpp"
#include <cassert>

int main() {
  auto &buffer = sequencer::projection_buffer;
  const auto input = sequencer::prepare_projection_buffer(3);
  assert(input == sequencer::get_projection_buffer_pointer());
  assert(sequencer::get_projection_buffer_word_count() == 36);
  buffer.write_projection(0, {0, 5, 10, 20, 0, 0, 0, 0, 2, 1, 5, 0});
  buffer.write_projection(1, {1, 4, 10, 20, 10, 10, 20, 4, u32_max, u32_max, 4, 0});
  buffer.write_projection(2, {1, 3, 10, 20, 20, 10, 20, 10, u32_max, u32_max, 3, 0});
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
  const auto snapshot_view = buffer.read_buffer();
  const std::vector snapshot(snapshot_view.begin(), snapshot_view.end());
  sequencer::footage_span_buffer.clear();
  assert(snapshot.size() == 3);
  assert(snapshot[0][4] == 20);
  assert(snapshot[1][4] == 0);
  assert(snapshot[2][4] == 10);
  assert(snapshot[1][8] == 0);
  assert(snapshot[1][9] == 2);

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
  sequencer::clear_projection(restored_id);
  const auto empty_id = sequencer::initialize_projection();
  sequencer::snapshot_projection(empty_id);
  assert(buffer.read_buffer().empty());
  assert(sequencer::footage_span_buffer.get_span_count() == 0);
  sequencer::clear_projection(empty_id);

  buffer.resize(1);
  buffer.write_projection(0, {1, 3, 10, 20, 0, 0, 0, 0, u32_max, u32_max, 3, 0});
  const auto split_id = sequencer::initialize_projection();
  const auto suffix = split_strip(*sequencer::projectors[split_id], 0, 0);
  assert(suffix == 1);
  sequencer::snapshot_projection(split_id);
  const auto split_snapshot_view = buffer.read_buffer();
  const std::vector split_snapshot(split_snapshot_view.begin(), split_snapshot_view.end());
  sequencer::footage_span_buffer.clear();
  assert(split_snapshot.size() == 2);
  assert(split_snapshot[0][1] == 3);
  assert(split_snapshot[0][10] == 0);
  assert(split_snapshot[0][4] == 0);
  assert(split_snapshot[0][8] == 1);
  assert(split_snapshot[1][1] == 0);
  assert(split_snapshot[1][10] == 3);
  assert(split_snapshot[1][4] == u32_max);
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

  buffer.resize(1);
  buffer.write_projection(0, {1, 6, 10, 20, 0, 0, 0, 0, u32_max, u32_max, 6, 0});
  const auto retained_id = sequencer::initialize_projection();
  assert(sequencer::update_projection(retained_id, 1, 2, 2) == 1);
  buffer.clear();
  sequencer::footage_span_buffer.clear();
  auto &retained = *sequencer::projectors[retained_id];
  for (auto strip = retained.head_strip_index; strip != u32_max;
       strip = retained.right_strip_index_of[strip]) {
    assert(retained.strip_type_of[strip] <= 2);
    if (retained.strip_type_of[strip] == 2)
      continue;
    const auto offset = retained.fragment_offset(strip);
    retained.footage_frame_index_of[strip] = offset == 0 ? 7 : offset == 1 ? 3 : 0;
    assert(retained.masked_of[strip] == (offset == 1));
  }
  const std::vector<char> source{'d', 'e', 'f', 'b', 'c', '?', '?', 'a'};
  const std::vector<char> visible{'a', 'd', 'e', 'f'};
  for (std::uint32_t frame = 0; frame < visible.size(); ++frame)
    assert(source[sequencer::get_footage_frame_index(retained_id, frame)] == visible[frame]);
  sequencer::snapshot_projection(retained_id);
  assert(sequencer::get_footage_span_buffer_count() == 3);
  const auto spans = sequencer::get_footage_span_buffer_pointer();
  assert(spans[0] == 0 && spans[1] == 7 && spans[2] == 1 && spans[3] == 0);
  assert(spans[4] == 1 && spans[5] == 3 && spans[6] == 2 && spans[7] == 1);
  assert(spans[8] == 1 && spans[9] == 0 && spans[10] == 3 && spans[11] == 0);
  std::vector<char> packed;
  for (std::uint32_t span = 0; span < 3; ++span)
    for (std::uint32_t offset = 0; offset < spans[span * 4 + 2]; ++offset)
      packed.push_back(source[spans[span * 4 + 1] + offset]);
  assert((packed == std::vector<char>{'a', 'b', 'c', 'd', 'e', 'f'}));
  sequencer::clear_footage_span_buffer();
  const auto restored_retained_id = sequencer::initialize_projection();
  assert(sequencer::get_projection_frame_count(restored_retained_id) == visible.size());
  for (std::uint32_t frame = 0; frame < visible.size(); ++frame)
    assert(packed[sequencer::get_footage_frame_index(restored_retained_id, frame)] == visible[frame]);
  sequencer::clear_projection(restored_retained_id);
  sequencer::clear_projection(retained_id);
}
