#include "../../src/c++/.auxiliary/stage_strip/index.hpp"
#include "../../src/c++/.auxiliary/split_strip/index.hpp"
#include <cassert>

int main() {
  Projector projector;
  for (std::uint32_t strip = 0; strip < 1024; ++strip) {
    const auto *storage = projector.strip_storage.get();
    const auto capacity = projector.strip_capacity;
    assert(stage_strip(projector, 1, 8, {10, 20, strip * 9},
                       {30, 40, strip}, strip * 8, strip) == strip);
    assert(projector.strip_count == strip + 1);
    if (strip < capacity)
      assert(projector.strip_storage.get() == storage);
    else
      assert(projector.strip_capacity == std::max(64u, capacity * 2));
    for (std::uint32_t previous = 0; previous <= strip; ++previous) {
      assert(projector.strip_type_of[previous] == 1);
      assert(projector.initial_length_of[previous] == 8);
      assert(projector.fragment_length_of[previous] == 8);
      assert(projector.dependency_prefix_of[previous] == previous);
      assert((projector.strip_start_of[previous] == SequencePoint{10, 20, previous * 9}));
      assert((projector.previous_strip_end_of[previous] == SequencePoint{30, 40, previous}));
      assert(projector.left_strip_index_of[previous] == previous);
      assert(projector.right_strip_index_of[previous] == previous);
      assert(projector.larger_split_strip_index_of[previous] == u32_max);
      assert(projector.smaller_competitor_strip_index_of[previous] == u32_max);
      assert(projector.left_jump_strip_index_of[previous] == u32_max);
      assert(projector.right_jump_strip_index_of[previous] == u32_max);
      assert(projector.left_jump_strip_count_of[previous] == 0);
      assert(projector.right_jump_strip_count_of[previous] == 0);
      assert(projector.left_jump_length_of[previous] == 0);
      assert(projector.right_jump_length_of[previous] == 0);
      assert(projector.footage_frame_index_of[previous] == previous * 8);
    }
  }
  projector.left_strip_index_of[0] = u32_max;
  projector.right_strip_index_of[0] = u32_max;
  projector.head_strip_index = projector.tail_strip_index = 0;
  projector.materialized_strip_count = 1;
  projector.right_jump_length_of[0] = 123;
  const auto suffix = split_strip(projector, 0, 3);
  assert(suffix == 1024);
  assert(projector.strip_capacity == 2048);
  assert(projector.fragment_length_of[0] == 3);
  assert(projector.fragment_length_of[suffix] == 5);
  assert(projector.footage_frame_index_of[suffix] == 3);
  assert(projector.right_jump_length_of[0] == 123);
  assert(projector.containment_table.get({10, 20, 8}).first == 0);
  auto moved = std::move(projector);
  assert(moved.fragment_length_of[suffix] == 5);
  assert(stage_strip(moved, 1, 1, {100, 200, 0}, {0, 0, 0}, 8192) == 1025);
}
