#include "../../src/c++/.auxiliary/stage_strip/index.hpp"
#include "../../src/c++/algorithms/initialize.hpp"
#include "../../src/c++/apply/insert/before/index.hpp"
#include "../../src/c++/apply/mask/index.hpp"
#include "../../src/c++/find/containing_strip_index/index.hpp"
#include "../../src/c++/find/projection_frame_index/index.hpp"
#include <algorithm>
#include <array>
#include <cassert>
#include <cstdint>
#include <string>
#include <vector>

struct Fixture {
  Projector projector;
  std::string footage;

  explicit Fixture(const std::uint32_t source_count = 1,
                   const std::uint32_t source_realm = 1000) {
    std::vector<std::array<std::uint32_t, 10>> snapshot;
    for (std::uint32_t index = 0; index < source_count; ++index) {
      snapshot.push_back({1, 3, source_realm + index, 9, 0,
                          0, 0, 0, u32_max, u32_max});
      footage += "abc";
    }
    initialize_projector(projector, snapshot, 1, 2, 3);
  }

  std::uint32_t before(const std::uint32_t target, const std::uint32_t realm,
                       const std::string &text, const std::uint32_t offset = 0) {
    auto dependency = projector.strip_start_of[target];
    dependency.counter_bits += offset;
    const auto incoming = stage_strip(
        projector, 0, static_cast<std::uint32_t>(text.size()), {realm, 8, 0},
        dependency, static_cast<std::uint32_t>(footage.size()));
    footage += text;
    const auto [frames, strips] = apply_left(projector, target, incoming, offset);
    const auto position = find_projection_frame_index_of(projector, incoming,
                                                          frames, strips);
    projector.gate_strip_index = incoming;
    projector.projection_frame_index = position;
    return incoming;
  }

  std::string read() {
    std::string result;
    for (std::uint32_t index = 0; index < projector.projection_frame_count; ++index) {
      find_strip_index_of(projector, index);
      const auto strip = projector.gate_strip_index;
      result += footage[projector.footage_frame_index_of[strip] + index -
                         projector.projection_frame_index];
    }
    return result;
  }

  void check_positions(const std::string &expected) {
    std::vector<std::uint32_t> starts(projector.strip_type_of.size());
    std::vector<std::uint32_t> structural_positions(starts.size());
    std::uint32_t position = 0;
    std::uint32_t structural_position = 0;
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      starts[strip] = position;
      structural_positions[strip] = structural_position++;
      position += projector.get_projected_strip_length(strip);
    }
    assert(position == expected.size());
    const auto check_jumps = [&] {
      for (std::uint32_t strip = 0; strip < starts.size(); ++strip) {
        const auto target = projector.right_jump_strip_index_of[strip];
        if (target == u32_max)
          continue;
        assert(projector.left_jump_strip_index_of[target] == strip);
        assert(projector.right_jump_length_of[strip] == starts[target] - starts[strip]);
        assert(projector.left_jump_length_of[target] == starts[target] - starts[strip]);
        const auto distance = structural_positions[target] - structural_positions[strip];
        assert(projector.right_jump_strip_count_of[strip] == distance);
        assert(projector.left_jump_strip_count_of[target] == distance);
      }
    };
    check_jumps();
    for (std::uint32_t query = 0; query < position * 4; ++query) {
      const auto frame = query * 7 % position;
      find_strip_index_of(projector, frame);
      const auto strip = projector.gate_strip_index;
      assert(projector.projection_frame_index == starts[strip]);
      assert(footage[projector.footage_frame_index_of[strip] + frame -
                      projector.projection_frame_index] == expected[frame]);
    }
    for (std::uint32_t strip = 0; strip < starts.size(); ++strip)
      assert(find_projection_frame_index_of(projector, strip, 0, 0) == starts[strip]);
    check_jumps();
  }
};

int main() {
  for (const auto source_realm : {1u, 1000u}) {
    Fixture first(1, source_realm);
    const auto inserted = first.before(0, 100, "X");
    assert(first.projector.head_strip_index == 0);
    assert(first.projector.strip_length_of[0] == 0);
    const auto suffix = first.projector.larger_split_strip_index_of[0];
    assert(suffix != u32_max);
    assert(first.projector.strip_start_of[suffix].counter_bits == 1);
    assert(first.projector.smaller_competitor_strip_index_of[inserted] == u32_max);
    assert(first.projector.right_strip_index_of[0] == inserted);
    assert(first.read() == "Xabc");
    first.before(inserted, 50, "Y");
    assert(first.read() == "YXabc");
  }

  std::array<std::uint32_t, 3> order{0, 1, 2};
  do {
    Fixture concurrent;
    std::array<std::uint32_t, 3> siblings{};
    for (const auto actor : order)
      siblings[actor] = concurrent.before(
          0, 100 + actor, std::string(1, static_cast<char>('A' + actor)));
    assert(concurrent.read() == "CBAabc");
    assert(concurrent.projector.smaller_competitor_strip_index_of[siblings[2]] ==
           siblings[1]);
    assert(concurrent.projector.smaller_competitor_strip_index_of[siblings[1]] ==
           siblings[0]);
    assert(concurrent.projector.smaller_competitor_strip_index_of[siblings[0]] ==
           u32_max);
    const auto mask = stage_strip(concurrent.projector, 2, 3, {2000, 8, 0},
                                   concurrent.projector.strip_start_of[0]);
    assert(apply_mask(concurrent.projector, 0, mask, 0).first == -3);
    assert(concurrent.projector.strip_type_of[siblings[0]] == 0);
    assert(concurrent.projector.strip_type_of[siblings[1]] == 0);
    assert(concurrent.projector.strip_type_of[siblings[2]] == 0);
  } while (std::next_permutation(order.begin(), order.end()));

  for (std::uint32_t offset = 1; offset <= 3; ++offset) {
    Fixture body;
    const auto inserted = body.before(0, 100, "X", offset);
    const auto placeholder = body.projector.larger_split_strip_index_of[0];
    assert(body.projector.strip_length_of[0] == offset - 1);
    assert(body.projector.strip_length_of[placeholder] == 0);
    assert(body.projector.strip_start_of[placeholder].counter_bits == offset);
    assert((body.projector.containment_table.get({1000, 9, offset}) ==
            std::pair{placeholder, 0u}));
    auto expected = std::string("abc");
    expected.insert(offset - 1, "X");
    assert(body.read() == expected);
    body.check_positions(expected);
    const auto mask = stage_strip(body.projector, 2, 3, {2000, 8, 0},
                                   body.projector.strip_start_of[0]);
    assert(apply_mask(body.projector, 0, mask, 0).first == -3);
    assert(body.projector.strip_type_of[inserted] == 0);
    assert(body.projector.strip_type_of[placeholder] == 1);
    assert(body.projector.projection_frame_count == 1);
  }

  do {
    Fixture body;
    for (const auto actor : order) {
      const auto [target, offset] = body.projector.containment_table.get({1000, 9, 2});
      body.before(target, 100 + actor,
                  std::string(1, static_cast<char>('A' + actor)), offset);
    }
    assert(body.read() == "aCBAbc");
    body.check_positions("aCBAbc");
  } while (std::next_permutation(order.begin(), order.end()));

  for (const auto source_count : {2u, 10u, 64u})
    for (std::uint32_t target = 0; target < source_count; ++target)
      for (const auto offset : {0u, 2u, 3u}) {
        Fixture boundary(source_count);
        std::string expected = boundary.footage;
        expected.insert(target * 3 + (offset == 0 ? 0 : offset - 1), "X");
        boundary.before(target, 100, "X", offset);
        assert(boundary.read() == expected);
        boundary.check_positions(expected);
      }
}
