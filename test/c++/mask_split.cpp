#include "../../src/c++/.auxiliary/insert_between/index.hpp"
#include "../../src/c++/.auxiliary/stage_strip/index.hpp"
#include "../../src/c++/algorithms/initialize.hpp"
#include "../../src/c++/apply/insert/index.hpp"
#include "../../src/c++/find/containing_strip_index/index.hpp"
#include <array>
#include <cassert>
#include <cstdint>
#include <string>

struct Fixture {
  Projector projector;
  std::string footage{"abcdXY!"};

  Fixture() {
    const std::array<std::uint32_t, 10> source{
        1, 4, 100, 200, 0, 0, 0, 0, u32_max, u32_max};
    initialize_projector(projector, {&source, 1}, 1, 2, 3);
  }

  std::uint32_t insert(const std::uint32_t left, const std::uint32_t right,
                       const std::uint32_t length, const std::uint32_t footage_index,
                       const SequencePoint dependency) {
    const auto strip = stage_strip(projector, 1, length,
                                   {300, 400, footage_index * 4}, dependency,
                                   footage_index);
    insert_between(projector, left, strip, right);
    projector.projection_frame_count += length;
    return strip;
  }

  std::string read() const {
    std::string result;
    std::uint32_t count = 0;
    std::uint32_t previous = u32_max;
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      assert(++count <= projector.materialized_strip_count);
      assert(projector.left_strip_index_of[strip] == previous);
      if (projector.get_projected_strip_length(strip) != 0)
        result += footage.substr(projector.footage_frame_index_of[strip],
                                 projector.strip_length_of[strip]);
      previous = strip;
    }
    assert(count == projector.materialized_strip_count);
    assert(previous == projector.tail_strip_index);
    assert(result.size() == projector.projection_frame_count);
    return result;
  }

  std::uint32_t mask(const std::uint32_t length) {
    return stage_strip(projector, 2, length, {500, 600, 0}, {100, 200, 0});
  }
};

int main() {
  Fixture complete;
  const auto suffix = split_strip(complete.projector, 0, 0);
  assert(complete.projector.strip_length_of[0] == 0);
  assert(complete.projector.strip_type_of[0] == 1);
  assert(complete.projector.larger_split_strip_index_of[0] == suffix);
  assert((complete.projector.strip_start_of[suffix] == SequencePoint{100, 200, 1}));
  assert((complete.projector.containment_table.get({100, 200, 0}) ==
          std::pair{0u, 0u}));
  assert((complete.projector.containment_table.get({100, 200, 1}) ==
          std::pair{suffix, 0u}));
  assert(complete.projector.footage_frame_index_of[suffix] == 0);
  assert(complete.read() == "abcd");
  find_strip_index_of(complete.projector, 0);
  assert(complete.projector.gate_strip_index == suffix);
  const auto inserted = complete.insert(0, suffix, 2, 4, {100, 200, 0});
  complete.insert(suffix, u32_max, 1, 6, {90, 80, 70});
  assert(complete.read() == "XYabcd!");
  const auto command = complete.mask(4);
  const auto counts = apply_insert(complete.projector, 0, command, 0);
  assert(counts.first == -4);
  assert(complete.projector.strip_type_of[0] == 1);
  assert(complete.projector.larger_split_strip_index_of[0] == suffix);
  assert(complete.projector.strip_type_of[inserted] == 1);
  assert(complete.read() == "XY!");
  assert(apply_insert(complete.projector, 0, command, 0).first == 0);
  assert(complete.read() == "XY!");

  Fixture fragmented;
  const auto first = split_strip(fragmented.projector, 0, 0);
  const auto second = split_strip(fragmented.projector, first, 2);
  fragmented.insert(first, second, 2, 4, {100, 200, 3});
  assert(fragmented.read() == "abXYcd");
  const auto partial = fragmented.mask(3);
  assert(apply_insert(fragmented.projector, 0, partial, 0).first == -3);
  assert(fragmented.projector.strip_type_of[0] == 1);
  assert(fragmented.read() == "XYd");
  assert(fragmented.projector.strip_length_of[partial] == 3);
  assert((fragmented.projector.strip_start_of[partial] == SequencePoint{500, 600, 0}));
  assert(fragmented.projector.larger_split_strip_index_of[partial] == u32_max);
  assert(std::count(fragmented.projector.strip_type_of.begin(),
                    fragmented.projector.strip_type_of.end(), 2) == 1);
  assert(apply_insert(fragmented.projector, 0, partial, 0).first == 0);
  assert(fragmented.read() == "XYd");

  Fixture incomplete;
  const auto oversized = incomplete.mask(5);
  const auto original_count = incomplete.projector.strip_type_of.size();
  assert(apply_insert(incomplete.projector, 0, oversized, 0).first == 0);
  assert(incomplete.read() == "abcd");
  assert(incomplete.projector.strip_type_of.size() == original_count);
  assert(incomplete.projector.left_strip_index_of[oversized] == oversized);
  assert(incomplete.projector.mask_footage_spans.empty());

  Fixture offset_mask;
  const auto offset_suffix = split_strip(offset_mask.projector, 0, 2);
  offset_mask.insert(0, offset_suffix, 2, 4, {100, 200, 2});
  const auto offset_command = offset_mask.mask(2);
  offset_mask.projector.previous_strip_end_of[offset_command] = {100, 200, 1};
  assert(apply_insert(offset_mask.projector, 0, offset_command, 1).first == -2);
  assert(offset_mask.read() == "aXYd");
  assert(offset_mask.projector.strip_length_of[offset_command] == 2);

  Fixture placeholders;
  const auto middle = split_strip(placeholders.projector, 0, 0);
  const auto content = split_strip(placeholders.projector, middle, 0);
  assert(placeholders.projector.larger_split_strip_index_of[0] == middle);
  assert(placeholders.projector.larger_split_strip_index_of[middle] == content);
  const auto head_mask = placeholders.mask(1);
  assert(apply_insert(placeholders.projector, 0, head_mask, 0).first == -1);
  assert(placeholders.projector.strip_type_of[0] == 1);
  assert(placeholders.projector.strip_type_of[middle] == 1);
  assert(placeholders.read() == "bcd");

  Fixture boundary;
  const auto anchor = split_strip(boundary.projector, 0, 2);
  const auto boundary_content = split_strip(boundary.projector, anchor, 0);
  boundary.insert(anchor, boundary_content, 2, 4, {100, 200, 3});
  const auto boundary_mask = boundary.mask(1);
  assert(apply_insert(boundary.projector, 0, boundary_mask, 2).first == -1);
  assert(boundary.projector.strip_type_of[anchor] == 1);
  assert(boundary.read() == "abXYd");

  Projector without_footage;
  const std::array<std::uint32_t, 10> masked_source{
      2, 3, 500, 600, 0, 100, 200, 0, u32_max, u32_max};
  initialize_projector(without_footage, {&masked_source, 1}, 1, 2, 3);
  assert(without_footage.footage_frame_index_of[0] == 0);
  without_footage.footage_frame_index_of[0] = u32_max;
  for (const auto type : {0u, 1u}) {
    const auto inserted_strip = stage_strip(without_footage, type, 1,
                                            {700, 800, type * 2}, {500, 600, 1}, type);
    assert(apply_insert(without_footage, 0, inserted_strip, 1).first == 1);
    assert(without_footage.strip_length_of[0] == 3);
    assert(without_footage.larger_split_strip_index_of[0] == u32_max);
    assert(without_footage.footage_frame_index_of[0] == u32_max);
  }
}
