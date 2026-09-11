#include "../../src/c++/.auxiliary/stage_strip/index.hpp"
#include "../../src/c++/algorithms/initialize.hpp"
#include "../../src/c++/apply/insert/after/index.hpp"
#include "../../src/c++/apply/insert/index.hpp"
#include "../../src/c++/find/containing_strip_index/index.hpp"
#include "../../src/c++/find/projection_frame_index/index.hpp"
#include <algorithm>
#include <array>
#include <cassert>
#include <string>
#include <vector>

struct Fixture {
  Projector projector;
  std::string footage;

  explicit Fixture(const std::uint32_t count = 1, const bool empty = false) {
    std::vector<std::array<std::uint32_t, 12>> strips;
    for (std::uint32_t index = 0; index < count; ++index) {
      strips.push_back({1, empty ? 0u : 3u, 1000 + index, 9, 0,
                        0, 0, 0, u32_max, u32_max, empty ? 0u : 3u, 0});
      if (!empty)
        footage += "abc";
    }
    initialize_projector(projector, strips, 1, 2, 3);
  }

  std::uint32_t after_anchor(const std::uint32_t target,
                             const std::uint32_t realm,
                             const std::string &text) {
    const auto incoming = stage_strip(
        projector, 1, static_cast<std::uint32_t>(text.size()), {realm, 8, 0},
        projector.strip_start_of[target], static_cast<std::uint32_t>(footage.size()));
    footage += text;
    const auto [frames, strips] = insert_after(projector, target, incoming, 0);
    assert(frames == static_cast<std::int32_t>(text.size()));
    const auto position = find_projection_frame_index_of(projector, incoming, frames, strips);
    projector.gate_strip_index = incoming;
    projector.projection_frame_index = position;
    return incoming;
  }

  void check(const std::string &expected) {
    std::vector<std::uint32_t> starts(projector.strip_type_of.size());
    std::vector<std::uint32_t> positions(starts.size());
    std::uint32_t previous = u32_max;
    std::uint32_t frame = 0;
    std::uint32_t position = 0;
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      assert(projector.left_strip_index_of[strip] == previous);
      starts[strip] = frame;
      positions[strip] = position++;
      frame += projector.get_projected_strip_length(strip);
      previous = strip;
    }
    assert(previous == projector.tail_strip_index);
    assert(position == projector.materialized_strip_count);
    assert(frame == expected.size());
    assert(frame == projector.projection_frame_count);
    for (std::uint32_t strip = 0; strip < starts.size(); ++strip) {
      const auto target = projector.right_jump_strip_index_of[strip];
      if (target == u32_max)
        continue;
      assert(projector.left_jump_strip_index_of[target] == strip);
      assert(projector.right_jump_length_of[strip] == starts[target] - starts[strip]);
      assert(projector.left_jump_length_of[target] == starts[target] - starts[strip]);
      assert(projector.right_jump_strip_count_of[strip] == positions[target] - positions[strip]);
      assert(projector.left_jump_strip_count_of[target] == positions[target] - positions[strip]);
    }
    for (std::uint32_t query = 0; query < frame * 3; ++query) {
      const auto index = query * 7 % frame;
      find_strip_index_of(projector, index);
      const auto strip = projector.gate_strip_index;
      assert(projector.projection_frame_index == starts[strip]);
      assert(footage[projector.footage_frame_index_of[strip] + index - starts[strip]] == expected[index]);
    }
    for (std::uint32_t strip = 0; strip < starts.size(); ++strip)
      assert(find_projection_frame_index_of(projector, strip, 0, 0) == starts[strip]);
  }
};

int main() {
  Fixture empty(1, true);
  const auto first = empty.after_anchor(0, 100, "X");
  assert(empty.projector.head_strip_index == 0);
  assert(empty.projector.right_strip_index_of[0] == first);
  assert(empty.projector.larger_split_strip_index_of[0] == u32_max);
  assert(empty.projector.materialized_strip_count == 2);
  empty.check("X");

  for (const auto count : {1u, 2u, 10u, 64u})
    for (std::uint32_t target = 0; target < count; ++target) {
      Fixture boundary(count);
      auto expected = boundary.footage;
      expected.insert(target * 3, "X");
      const auto inserted = boundary.after_anchor(target, 100, "X");
      const auto suffix = boundary.projector.larger_split_strip_index_of[target];
      assert(suffix != u32_max);
      assert(boundary.projector.fragment_length_of[target] == 0);
      assert(boundary.projector.is_fragment(suffix));
      assert(boundary.projector.initial_length_of[target] == 3);
      assert(boundary.projector.fragment_length_of[suffix] == 3);
      assert(boundary.projector.footage_frame_index_of[suffix] == target * 3);
      assert(boundary.projector.right_strip_index_of[target] == inserted);
      assert(boundary.projector.smaller_competitor_strip_index_of[inserted] == u32_max);
      boundary.check(expected);
    }

  for (const auto empty_anchor : {false, true}) {
    std::array<std::uint32_t, 3> order{0, 1, 2};
    do {
      Fixture concurrent(1, empty_anchor);
      std::array<std::uint32_t, 3> siblings{};
      for (const auto actor : order)
        siblings[actor] = concurrent.after_anchor(
            0, 100 + actor, std::string(1, static_cast<char>('A' + actor)));
      concurrent.check(empty_anchor ? "CBA" : "CBAabc");
      assert(concurrent.projector.smaller_competitor_strip_index_of[siblings[2]] == siblings[1]);
      assert(concurrent.projector.smaller_competitor_strip_index_of[siblings[1]] == siblings[0]);
      assert(concurrent.projector.smaller_competitor_strip_index_of[siblings[0]] == u32_max);
      for (const auto actor : order)
        concurrent.after_anchor(siblings[actor], 200 + actor,
                                 std::string(1, static_cast<char>('a' + actor)));
      concurrent.after_anchor(0, 90, "Z");
      concurrent.check(empty_anchor ? "cCbBaAZ" : "cCbBaAZabc");
    } while (std::next_permutation(order.begin(), order.end()));
  }

  Fixture causal;
  const auto parent = causal.after_anchor(0, 100, "X");
  causal.after_anchor(parent, 50, "Y");
  causal.check("YXabc");
  const auto command = stage_strip(causal.projector, 2, 3, {2000, 8, 0},
                                   causal.projector.strip_start_of[0]);
  assert(apply_insert(causal.projector, 0, command, 0).first == -3);
  assert(causal.projector.projection_frame_count == 2);
  std::string visible;
  for (auto strip = causal.projector.head_strip_index; strip != u32_max;
       strip = causal.projector.right_strip_index_of[strip])
    if (causal.projector.get_projected_strip_length(strip) != 0)
      visible += causal.footage.substr(causal.projector.footage_frame_index_of[strip],
                                       causal.projector.fragment_length_of[strip]);
  assert(visible == "YX");
}
