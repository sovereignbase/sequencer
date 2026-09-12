#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/update.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include <algorithm>
#include <cassert>
#include <cstdio>
#include <vector>

int main() {
  const auto id = sequencer::initialize_projection();
  auto &projector = *sequencer::projectors[id];
  std::vector<std::uint32_t> expected;
  std::uint32_t footage = 0;
  const auto insert = [&](const std::uint32_t position) {
    const bool tail = !expected.empty() && position == expected.size();
    assert(sequencer::update_projection(id, tail ? position - 1 : position,
                                       tail ? 1 : 0, 1, footage) == position);
    sequencer::projection_buffer.clear();
    expected.insert(expected.begin() + position, footage++);
  };
  const auto remove = [&](const std::uint32_t position) {
    const auto actual = sequencer::update_projection(id, position, 2, 1);
    assert(actual != u32_max);
    sequencer::projection_buffer.clear();
    sequencer::footage_span_buffer.clear();
    expected.erase(expected.begin() + position);
  };
  const auto check = [&]() {
    std::vector<std::uint32_t> starts(projector.strip_count);
    std::vector<std::uint32_t> ranks(starts.size());
    std::uint32_t frames = 0;
    std::uint32_t rank = 0;
    std::uint32_t jumps = 0;
    std::uint32_t maximum_gap = 0;
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      starts[strip] = frames;
      ranks[strip] = rank++;
      frames += projector.get_projected_strip_length(strip);
    }
    assert(frames == expected.size());
    assert(rank == projector.materialized_strip_count);
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      const auto right = projector.right_jump_strip_index_of[strip];
      if (right == u32_max)
        continue;
      ++jumps;
      assert(projector.left_jump_strip_index_of[right] == strip);
      assert(projector.right_jump_length_of[strip] == starts[right] - starts[strip]);
      assert(projector.left_jump_length_of[right] == starts[right] - starts[strip]);
      assert(projector.right_jump_strip_count_of[strip] == ranks[right] - ranks[strip]);
      assert(projector.left_jump_strip_count_of[right] == ranks[right] - ranks[strip]);
      maximum_gap = std::max(maximum_gap, ranks[right] - ranks[strip]);
    }
    assert(jumps != 0);
    assert(maximum_gap <= 2 * static_cast<std::uint32_t>(std::sqrt(rank) + 0.5));
    for (std::uint32_t query = 0; query < expected.size(); ++query) {
      const auto position = query * 7919 % expected.size();
      assert(sequencer::get_footage_frame_index(id, position) == expected[position]);
    }
    std::printf("strips=%u jumps=%u maximum_gap=%u\n", rank, jumps, maximum_gap);
  };
  for (std::uint32_t edit = 0; edit < 4096; ++edit)
    insert(edit % 2 == 0 ? 0 : expected.size());
  check();
  check();
  for (std::uint32_t cycle = 0; cycle < 8; ++cycle) {
    for (std::uint32_t edit = 0; edit < 256; ++edit) {
      const auto position = (edit * 7919 + cycle * 17) % expected.size();
      remove(position);
      insert(position);
    }
    check();
  }
  for (std::uint32_t edit = 0; edit < 2048; ++edit) {
    remove(0);
    if (edit % 256 == 255)
      check();
  }
  sequencer::clear_projection(id);
}
