#include "../../src/c++/algorithms/update.hpp"
#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/merge.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include <cassert>

int main() {
  const auto id = sequencer::initialize_projection();
  assert(sequencer::update_projection(id, 0, 0, 4, 0) == 0);
  auto &projector = *sequencer::projectors[id];
  const auto issued = sequencer::projection_buffer.read_buffer();
  const auto start = projector.strip_start_of[0];
  assert(issued[0][1] == 4 && issued[0][10] == 4);
  assert(sequencer::update_projection(id, 0, 0, 1, 4) == 0);
  sequencer::projection_buffer.clear();
  assert(sequencer::update_projection(id, 3, 0, 1, 5) == 3);
  sequencer::projection_buffer.clear();
  assert(sequencer::update_projection(id, 2, 2, 1) != u32_max);
  const auto mask = sequencer::projection_buffer.read_buffer();
  assert(mask[0][1] == 1 && mask[0][10] == 0 && mask[0][11] == 1);
  assert(mask[0][8] == u32_max);
  assert(projector.initial_length_of[0] == 4);
  for (std::uint32_t offset = 0; offset <= 4; ++offset) {
    auto point = start;
    point.counter_bits += offset;
    assert((projector.containment_table.get(point) == std::pair{0u, offset}));
  }
  assert(projector.containment_table.get({u32_max, u32_max, u32_max}).first == u32_max);
  std::uint32_t length = 0;
  for (std::uint32_t fragment = 0; fragment != u32_max;
       fragment = projector.larger_split_strip_index_of[fragment]) {
    if (fragment != 0) {
      assert(projector.is_fragment(fragment));
      assert(projector.initial_length_of[fragment] == 0);
      assert(projector.dependency_origin(fragment) == start);
    }
    length += projector.fragment_length_of[fragment];
  }
  assert(length == 4);
  const auto visible_length = projector.projection_frame_count;
  sequencer::snapshot_projection(id);
  sequencer::footage_span_buffer.clear();
  const auto restored_id = sequencer::initialize_projection();
  auto &restored = *sequencer::projectors[restored_id];
  const auto source = restored.containment_table.get(start).first;
  assert(source != u32_max && restored.initial_length_of[source] == 4);
  assert(restored.projection_frame_count == visible_length);
  sequencer::clear_projection(restored_id);
  sequencer::clear_projection(id);
}
