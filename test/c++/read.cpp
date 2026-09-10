#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include <array>
#include <cassert>
#include <cstdint>

int main() {
  auto &buffer = sequencer::projection_buffer;
  buffer.resize(9);
  buffer.write_projection(0, {1, 0, 10, 20, 0, 0, 0, 0, 2, u32_max});
  buffer.write_projection(1, {2, 3, 70, 80, 0, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(2, {0, 3, 10, 20, 1, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(3, {1, 0, 30, 40, 0, 0, 0, 0, 4, u32_max});
  buffer.write_projection(4, {1, 2, 30, 40, 1, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(5, {2, 2, 70, 80, 4, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(6, {1, 1, 50, 60, 0, 0, 0, 0, u32_max, u32_max});
  buffer.write_projection(7, {3, 2, 90, 91, 0, 99, 98, 0, u32_max, u32_max});
  buffer.write_projection(8, {5, 1, 70, 80, 7, 99, 98, 0, u32_max, u32_max});
  const auto projection_id = sequencer::initialize_projection();
  auto &projector = *sequencer::projectors[projection_id];
  projector.footage_frame_index_of[2] = 8;
  projector.footage_frame_index_of[4] = 2;
  projector.footage_frame_index_of[6] = 5;
  projector.footage_frame_index_of[7] = 11;
  constexpr std::array expected{8u, 9u, 10u, 2u, 3u, 5u};
  assert(sequencer::get_projection_frame_count(projection_id) == expected.size());
  for (std::uint32_t repeat = 0; repeat < 3; ++repeat)
    for (std::uint32_t start = 0; start <= expected.size(); ++start)
      for (std::uint32_t end = start; end <= expected.size(); ++end) {
        const auto count = sequencer::write_projection_footage_spans_to_buffer(
            projection_id, start, end);
        const auto words = sequencer::footage_span_buffer.get_memory_pointer();
        if (start == end) {
          assert(count == 0);
          assert(words == nullptr);
          continue;
        }
        assert(count != 0);
        auto position = start;
        for (std::uint32_t span = 0; span < count; ++span) {
          assert(words[span * 4] == position);
          assert(words[span * 4 + 2] != 0);
          assert(words[span * 4 + 3] == 0);
          for (std::uint32_t offset = 0; offset < words[span * 4 + 2]; ++offset) {
            assert(position < end);
            assert(words[span * 4 + 1] + offset == expected[position++]);
          }
        }
        assert(position == end);
        sequencer::footage_span_buffer.clear();
      }
  for (std::uint32_t frame = 0; frame < expected.size(); ++frame)
    assert(sequencer::get_footage_frame_index(projection_id, frame) == expected[frame]);
  assert(sequencer::write_projection_footage_spans_to_buffer(projection_id, 0, 6) == 3);
  sequencer::footage_span_buffer.clear();
  assert(sequencer::write_projection_footage_spans_to_buffer(projection_id, 2, 1) == 0);
  assert(sequencer::footage_span_buffer.get_memory_pointer() == nullptr);
  assert(sequencer::write_projection_footage_spans_to_buffer(projection_id, 0, 7) == 0);
  sequencer::clear_projection(projection_id);

  for (const auto type : {1u, 2u, 3u, 5u}) {
    buffer.resize(1);
    buffer.write_projection(0, {type, type == 1 ? 0u : 3u, 10, 20, 0,
                                99, 98, 0, u32_max, u32_max});
    const auto empty_id = sequencer::initialize_projection();
    assert(sequencer::get_projection_frame_count(empty_id) == 0);
    assert(sequencer::write_projection_footage_spans_to_buffer(empty_id, 0, 0) == 0);
    assert(sequencer::write_projection_footage_spans_to_buffer(empty_id, 0, 1) == 0);
    sequencer::clear_projection(empty_id);
  }
  const auto empty_id = sequencer::initialize_projection();
  assert(sequencer::write_projection_footage_spans_to_buffer(empty_id, 0, 0) == 0);
  sequencer::clear_projection(empty_id);
}
