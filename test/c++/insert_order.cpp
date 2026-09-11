#include "../../src/c++/.auxiliary/insert_between/index.hpp"
#include "../../src/c++/.auxiliary/split_strip/index.hpp"
#include "../../src/c++/.auxiliary/stage_strip/index.hpp"
#include <array>
#include <cassert>
#include <cstdint>
#include <string>
#include <vector>

struct TextFixture {
  Projector projector;
  std::string footage;

  std::uint32_t stage(const SequencePoint start, const SequencePoint previous,
                      const std::string &text) {
    const auto strip_index = stage_strip(
        projector, 1, static_cast<std::uint32_t>(text.size()), start, previous,
        static_cast<std::uint32_t>(footage.size()),
        projector.containment_table.get(previous).second);
    footage += text;
    return strip_index;
  }

  TextFixture() {
    const auto root = stage({1, 0, 0}, {0, 0, 0}, "P\n");
    insert_between(projector, u32_max, root, u32_max);
  }

  std::uint32_t insert(const SequencePoint start, const SequencePoint previous,
                       const std::string &text) {
    const auto parent = projector.containment_table.get(previous).first;
    assert(parent != u32_max);
    const auto incoming = stage(start, previous, text);
    insert_between(projector, parent, incoming,
                   projector.right_strip_index_of[parent]);
    return incoming;
  }

  std::string read() const {
    std::string result;
    std::uint32_t count = 0;
    std::uint32_t previous = u32_max;
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      assert(++count <= projector.materialized_strip_count);
      assert(projector.left_strip_index_of[strip] == previous);
      result += footage.substr(projector.footage_frame_index_of[strip],
                               projector.fragment_length_of[strip]);
      previous = strip;
    }
    assert(count == projector.materialized_strip_count);
    assert(previous == projector.tail_strip_index);
    return result;
  }
};

void check_offline_order(const std::vector<std::uint32_t> &order) {
  TextFixture fixture;
  std::array<std::uint32_t, 3> issued{0, 0, 0};
  std::array<std::uint32_t, 3> roots{};
  for (const auto actor : order) {
    const auto counter = issued[actor] * 4;
    const auto realm = (actor + 1) * 100;
    const SequencePoint previous = counter == 0
                                       ? SequencePoint{1, 0, 2}
                                       : SequencePoint{realm, 0, counter - 1};
    const auto strip = fixture.insert(
        {realm, 0, counter}, previous,
        std::string(1, static_cast<char>('A' + actor)) +
            std::to_string(++issued[actor]) + "\n");
    if (counter == 0)
      roots[actor] = strip;
  }
  assert(fixture.read() == "P\nC1\nC2\nC3\nB1\nB2\nB3\nA1\nA2\nA3\n");
  assert(fixture.projector.smaller_competitor_strip_index_of[roots[2]] == roots[1]);
  assert(fixture.projector.smaller_competitor_strip_index_of[roots[1]] == roots[0]);
  assert(fixture.projector.smaller_competitor_strip_index_of[roots[0]] == u32_max);
}

void interleave(std::array<std::uint32_t, 3> &counts,
                std::vector<std::uint32_t> &order, std::uint32_t &cases) {
  if (order.size() == 9) {
    check_offline_order(order);
    ++cases;
    return;
  }
  for (std::uint32_t actor = 0; actor < counts.size(); ++actor) {
    if (counts[actor] == 3)
      continue;
    ++counts[actor];
    order.push_back(actor);
    interleave(counts, order, cases);
    order.pop_back();
    --counts[actor];
  }
}

int main() {
  std::array<std::uint32_t, 3> counts{0, 0, 0};
  std::vector<std::uint32_t> order;
  std::uint32_t cases = 0;
  interleave(counts, order, cases);
  assert(cases == 1680);

  TextFixture realtime;
  realtime.insert({300, 0, 0}, {1, 0, 2}, "A");
  realtime.insert({100, 0, 0}, {1, 0, 2}, "Z");
  realtime.insert({500, 0, 0}, {300, 0, 1}, "B");
  realtime.insert({600, 0, 0}, {500, 0, 1}, "C");
  realtime.insert({400, 0, 0}, {300, 0, 1}, "D");
  assert(realtime.read() == "P\nABCDZ");
  realtime.insert({200, 0, 0}, {1, 0, 2}, "E");
  assert(realtime.read() == "P\nABCDEZ");

  TextFixture split;
  const auto prefix = split.insert({300, 0, 0}, {1, 0, 1}, "abcd");
  const auto suffix = split_strip(split.projector, prefix, 2);
  assert(split.projector.tail_strip_index == suffix);
  assert(split.projector.smaller_competitor_strip_index_of[suffix] == u32_max);
  split.insert({400, 0, 0}, {300, 0, 1}, "X");
  split.insert({500, 0, 0}, {400, 0, 0}, "Y");
  split.insert({200, 0, 0}, {1, 0, 1}, "Z");
  assert(split.read() == "P\nabXYcdZ");

  TextFixture counter_order;
  counter_order.insert({100, 1, 10}, {1, 0, 1}, "A");
  counter_order.insert({100, 1, 30}, {1, 0, 1}, "C");
  counter_order.insert({100, 1, 20}, {1, 0, 1}, "B");
  counter_order.insert({100, 2, 0}, {1, 0, 1}, "D");
  assert(counter_order.read() == "P\nDCBA");
}
