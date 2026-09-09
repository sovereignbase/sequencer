#include "../../src/c++/.buffers/projection_buffer/index.hpp"
#include "../../src/c++/algorithms/initialize.hpp"
#include <cassert>
#include <cstdint>
#include <vector>

int main() {
  for (const std::uint32_t materialized_count : {0u, 1u, 11u}) {
    ProjectionBuffer buffer(materialized_count + 3);
    for (std::uint32_t strip_index = 0;
         strip_index < materialized_count + 3; ++strip_index) {
      const auto type = strip_index % 3;
      buffer.write_projection(
          strip_index,
          {type + (strip_index >= materialized_count ? 3u : 0u),
           strip_index + 1, type == 2 ? 7u : 5u, 6, strip_index * 16,
           90, 91, 92, u32_max, u32_max});
    }
    const auto projection = buffer.read_buffer();
    Projector projector;
    initialize_projector(projector, projection, 5, 7, 6);
    assert(projector.materialized_strip_count == materialized_count);
    assert(projector.strip_type_of.size() == projection.size());
    assert(projector.pending_table.values().size() == 3);
    assert(projector.head_strip_index ==
           (materialized_count == 0 ? u32_max : 0));
    assert(projector.tail_strip_index ==
           (materialized_count == 0 ? u32_max : materialized_count - 1));
    assert(projector.gate_strip_index == projector.head_strip_index);

    std::uint32_t projection_length = 0;
    std::uint32_t footage_length = 0;
    std::uint32_t insert_counter = 0;
    std::uint32_t mask_counter = 0;
    for (std::uint32_t strip_index = 0; strip_index < projection.size();
         ++strip_index) {
      const auto type = strip_index % 3;
      const auto length = strip_index + 1;
      const auto point = projector.strip_start_of[strip_index];
      assert(projector.strip_type_of[strip_index] == type);
      assert((projector.containment_table.get(point) ==
              std::pair{strip_index, 0u}));
      assert((projector.containment_table.get(
                  {point.crypto_random_bits, point.unix_lower_bits,
                   point.counter_bits + length}) ==
              std::pair{strip_index, length}));
      assert(projector.containment_table.get(
                 {point.crypto_random_bits, point.unix_lower_bits,
                  point.counter_bits + length + 1}).first == u32_max);

      if (type == 2) {
        assert(projector.footage_frame_index_of[strip_index] == u32_max);
        mask_counter = point.counter_bits + length + 1;
      } else {
        assert(projector.footage_frame_index_of[strip_index] == footage_length);
        footage_length += length;
        insert_counter = point.counter_bits + length + 1;
      }

      if (strip_index >= materialized_count) {
        assert(projector.left_strip_index_of[strip_index] == strip_index);
        assert(projector.right_strip_index_of[strip_index] == strip_index);
        assert(projector.left_jump_strip_index_of[strip_index] == u32_max);
        assert(projector.right_jump_strip_index_of[strip_index] == u32_max);
      } else if (type != 2) {
        projection_length += length;
      }
    }
    assert(projector.projection_frame_count == projection_length);
    assert(projector.operation_count == insert_counter);
    assert(projector.mask_operation_count == mask_counter);
    assert(projector.pending_table.get({90, 91, 92}, 1).size() == 3);

    for (std::uint32_t strip_index = 0; strip_index < materialized_count;
         ++strip_index) {
      const auto target = projector.right_jump_strip_index_of[strip_index];
      if (target == u32_max)
        continue;
      assert(target < materialized_count);
      assert(projector.left_jump_strip_index_of[target] == strip_index);
      assert(projector.right_jump_strip_count_of[strip_index] ==
             target - strip_index);
      std::uint32_t distance = 0;
      for (auto cursor = strip_index; cursor < target; ++cursor)
        if (projector.strip_type_of[cursor] != 2)
          distance += projector.strip_length_of[cursor];
      assert(projector.right_jump_length_of[strip_index] == distance);
      assert(projector.left_jump_length_of[target] == distance);
    }
  }

  Projector empty;
  initialize_projector(empty, {}, 5, 7, 6);
  assert(empty.head_strip_index == u32_max);
  assert(empty.gate_strip_index == u32_max);
  assert(empty.projection_frame_count == 0);
  assert(empty.containment_table.is_empty());
  assert(empty.pending_table.is_empty());

  ProjectionBuffer masked(2);
  masked.write_projection(0, {2, 3, 7, 6, 0, 8, 9, 10, u32_max, u32_max});
  masked.write_projection(1, {1, 4, 5, 6, 10, 7, 6, 2, u32_max, u32_max});
  Projector leading_mask;
  initialize_projector(leading_mask, masked.read_buffer(), 5, 7, 6);
  assert(leading_mask.head_strip_index == 0);
  assert(leading_mask.gate_strip_index == 1);
  assert(leading_mask.projection_frame_count == 4);
  assert(leading_mask.operation_count == 15);
  assert(leading_mask.mask_operation_count == 4);

  ProjectionBuffer anchored(4);
  anchored.write_projection(0, {1, 3, 5, 6, 0, 0, 0, 0, u32_max, u32_max});
  anchored.write_projection(1, {1, 0, 5, 6, 4, 5, 6, 3, u32_max, u32_max});
  anchored.write_projection(2, {3, 2, 5, 6, 5, 90, 91, 0, u32_max, u32_max});
  anchored.write_projection(3, {5, 3, 7, 6, 0, 90, 91, 1, u32_max, u32_max});
  Projector reserved;
  initialize_projector(reserved, anchored.read_buffer(), 5, 7, 6);
  assert(reserved.projection_frame_count == 3);
  assert(reserved.operation_count == 8);
  assert(reserved.mask_operation_count == 4);
  assert((reserved.containment_table.get({5, 6, 0}) == std::pair{0u, 0u}));
  assert((reserved.containment_table.get({5, 6, 3}) == std::pair{0u, 3u}));
  assert((reserved.containment_table.get({5, 6, 4}) == std::pair{1u, 0u}));
  assert((reserved.containment_table.get({5, 6, 7}) == std::pair{2u, 2u}));
  assert(reserved.containment_table.get({5, 6, 8}).first == u32_max);
  assert(reserved.footage_frame_index_of[1] == 3);
  assert(reserved.footage_frame_index_of[2] == 3);
}
