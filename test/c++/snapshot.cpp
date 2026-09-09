#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include "../../src/c++/.auxiliary/split_strip/index.hpp"
#include <cassert>

int main() {
  auto &buffer = sequencer::projection_buffer;
  buffer.resize(5);
  buffer.write_projection(0, {0, 5, 10, 20, 0, 0, 0, 0, 2, 1});
  buffer.write_projection(1, {1, 4, 10, 20, 10, 10, 20, 4, u32_max, u32_max});
  buffer.write_projection(2, {1, 3, 10, 20, 20, 10, 20, 10, u32_max, u32_max});
  buffer.write_projection(3, {3, 2, 30, 40, 0, 90, 80, 0, u32_max, u32_max});
  buffer.write_projection(4, {5, 2, 50, 60, 0, 90, 80, 1, u32_max, u32_max});
  const auto projection_id = sequencer::initialize_projection();
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
  sequencer::clear_projection(empty_id);

  buffer.resize(1);
  buffer.write_projection(0, {1, 3, 10, 20, 0, 0, 0, 0, u32_max, u32_max});
  const auto split_id = sequencer::initialize_projection();
  const auto suffix = split_strip(*sequencer::projectors[split_id], 0, 0);
  assert(suffix == 1);
  sequencer::snapshot_projection(split_id);
  const auto split_snapshot = buffer.read_buffer();
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
}
