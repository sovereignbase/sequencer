#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/merge.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include <algorithm>
#include <array>
#include <cassert>
#include <string>

using Words = std::array<std::uint32_t, 12>;

std::uint32_t merge(const std::uint32_t id, const Words &words,
                    const std::uint32_t footage) {
  sequencer::projection_buffer.resize(1);
  sequencer::projection_buffer.write_projection(0, words);
  const auto position = sequencer::merge_projection(id, footage);
  assert(sequencer::projection_buffer.get_word_count() == 0);
  sequencer::footage_span_buffer.clear();
  return position;
}

std::string read(const std::uint32_t id, const std::string &footage) {
  std::string result;
  const auto count = sequencer::get_projection_frame_count(id);
  for (std::uint32_t frame = 0; frame < count; ++frame)
    result += footage[sequencer::get_footage_frame_index(id, frame)];
  return result;
}

int main() {
  const Words parent{1, 3, 10, 20, 0, 0, 0, 0, 123, 456, 3, 0};
  const Words child{1, 2, 30, 40, 0, 10, 20, 3, 987, 654, 2, 3};
  const Words grandchild{1, 1, 50, 60, 0, 30, 40, 2, 333, 444, 1, 2};
  const std::array operations{parent, child, grandchild};
  constexpr std::array footage_starts{0u, 3u, 5u};
  std::array order{0u, 1u, 2u};
  do {
    const auto id = sequencer::initialize_projection();
    for (const auto operation : order)
      static_cast<void>(merge(id, operations[operation], footage_starts[operation]));
    assert(read(id, "abcXY!") == "abcXY!");
    assert(sequencer::projectors[id]->pending_table.is_empty());
    const auto known = sequencer::projectors[id]->strip_count;
    for (const auto operation : order)
      assert(merge(id, operations[operation], footage_starts[operation]) == u32_max);
    assert(sequencer::projectors[id]->strip_count == known);
    assert(read(id, "abcXY!") == "abcXY!");
    sequencer::clear_projection(id);
  } while (std::next_permutation(order.begin(), order.end()));

  for (const bool reverse : {false, true}) {
    const auto id = sequencer::initialize_projection();
    const Words smaller{0, 1, 10, 20, 0, 0, 0, 0, u32_max, u32_max, 1, 0};
    const Words larger{0, 1, 20, 20, 0, 0, 0, 0, u32_max, u32_max, 1, 0};
    static_cast<void>(merge(id, reverse ? larger : smaller, reverse ? 1 : 0));
    static_cast<void>(merge(id, reverse ? smaller : larger, reverse ? 0 : 1));
    assert(read(id, "ab") == "ba");
    sequencer::clear_projection(id);
  }

  const auto id = sequencer::initialize_projection();
  assert(merge(id, parent, 0) == 0);
  const Words mask{2, 1, 70, 80, 0, 10, 20, 1, u32_max, u32_max, 0, 1};
  assert(merge(id, mask, 0) == 1);
  assert(read(id, "abc") == "ac");
  assert(merge(id, mask, 0) == u32_max);
  const Words pending{3, 1, 90, 91, 0, 99, 98, 0, u32_max, u32_max, 1, 0};
  const auto known = sequencer::projectors[id]->strip_count;
  assert(merge(id, pending, 0) == u32_max);
  assert(sequencer::projectors[id]->strip_count == known);
  sequencer::clear_projection(id);

  for (const bool mask_pending : {false, true}) {
    const auto anchored_id = sequencer::initialize_projection();
    const Words inserted{0, 1, 30, 40, 0, 10, 20, 0, u32_max, u32_max, 1, 0};
    const Words anchored_mask{2, 3, 70, 80, 0, 10, 20, 0, u32_max, u32_max, 0, 0};
    assert(merge(anchored_id, inserted, 3) == u32_max);
    if (mask_pending)
      assert(merge(anchored_id, anchored_mask, 0) == u32_max);
    assert(merge(anchored_id, parent, 0) == 0);
    if (!mask_pending)
      assert(merge(anchored_id, anchored_mask, 0) == 1);
    assert(read(anchored_id, "abcX") == "X");
    assert(sequencer::projectors[anchored_id]->pending_table.is_empty());
    assert(merge(anchored_id, anchored_mask, 0) == u32_max);
    sequencer::clear_projection(anchored_id);
  }
}
