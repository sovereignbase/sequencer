#include "../../src/c++/algorithms/update.hpp"
#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/read.hpp"
#include <cassert>
#include <string>
#include <vector>

struct Fixture {
  std::uint32_t id;
  std::string footage;

  explicit Fixture(const std::uint32_t count = 0, const std::uint32_t type = 1) {
    sequencer::projection_buffer.resize(count);
    for (std::uint32_t strip = 0; strip < count; ++strip) {
      sequencer::projection_buffer.write_projection(
          strip, {type, 3, 10,
                  20, strip * 32,
                  0, 0, 0, u32_max, u32_max, (type == 2 || type == 5) ? 0u : 3, 0});
      if (type != 5)
        footage += "abc";
    }
    id = sequencer::initialize_projection();
  }

  ~Fixture() { sequencer::clear_projection(id); }

  std::array<std::uint32_t, 12> insert(const std::uint8_t type,
                                       const std::uint32_t target,
                                       const std::string &text,
                                       const std::uint32_t expected_position) {
    const auto position = sequencer::update_projection(
        id, target, type, static_cast<std::uint32_t>(text.size()),
        static_cast<std::uint32_t>(footage.size()));
    assert(position == expected_position);
    footage += text;
    const auto result = sequencer::projection_buffer.read_buffer();
    assert(result.size() == 1);
    assert(result[0][0] == type);
    assert(result[0][1] == text.size());
    assert(result[0][8] == u32_max && result[0][9] == u32_max);
    assert(sequencer::projection_buffer.get_word_count() == 0);
    return result[0];
  }

  void check(const std::string &expected) {
    auto &projector = *sequencer::projectors[id];
    assert(projector.projection_frame_count == expected.size());
    std::vector<std::uint32_t> starts(projector.strip_count);
    std::vector<std::uint32_t> positions(starts.size());
    std::uint32_t position = 0;
    std::uint32_t frame = 0;
    std::uint32_t previous = u32_max;
    for (auto strip = projector.head_strip_index; strip != u32_max;
         strip = projector.right_strip_index_of[strip]) {
      assert(projector.left_strip_index_of[strip] == previous);
      starts[strip] = frame;
      positions[strip] = position++;
      frame += projector.get_projected_strip_length(strip);
      previous = strip;
    }
    assert(frame == expected.size());
    assert(position == projector.materialized_strip_count);
    assert(previous == projector.tail_strip_index);
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
    for (std::uint32_t index = 0; index < expected.size(); ++index)
      assert(footage[sequencer::get_footage_frame_index(id, index)] == expected[index]);
  }
};

int main() {
  for (const auto count : {1u, 2u, 10u, 64u})
    for (std::uint32_t target = 0; target < count * 3; ++target)
      for (const auto requested : {1u, count * 3}) {
        Fixture fixture(count);
        auto expected = fixture.footage;
        const auto length = std::min(requested, 3 - target % 3);
        assert(sequencer::update_projection(fixture.id, target, 2, requested) == target);
        const auto result = sequencer::projection_buffer.read_buffer();
        assert(result.size() == 1);
        assert(result[0][0] == 2 && result[0][1] == length);
        assert(result[0][2] == sequencer::projectors[fixture.id]->mask_session_crypto_random_bits);
        assert(result[0][3] == sequencer::projectors[fixture.id]->shared_session_unix_lower_bits);
        assert(result[0][4] == 0);
        assert(result[0][7] == target / 3 * 32 + target % 3);
        assert(sequencer::footage_span_buffer.get_span_count() == 1);
        const auto spans = sequencer::footage_span_buffer.get_memory_pointer();
        assert(spans[0] == target && spans[1] == target);
        assert(spans[2] == length && spans[3] == 1);
        sequencer::footage_span_buffer.clear();
        assert(sequencer::projectors[fixture.id]->mask_operation_count == length + 1);
        expected.erase(target, length);
        fixture.check(expected);
      }

  for (const auto type : {0u, 1u}) {
    Fixture birth;
    const auto result = birth.insert(static_cast<std::uint8_t>(type), 0, "abc", 0);
    assert(result[4] == 0);
    assert(result[5] == 0 && result[6] == 0 && result[7] == 0);
    birth.check("abc");
    birth.insert(1, 2, "def", 3);
    birth.check("abcdef");
  }

  for (const auto count : {1u, 2u, 10u, 64u})
    for (std::uint32_t target = 0; target < count * 3; ++target)
      for (const auto type : {0u, 1u}) {
        Fixture fixture(count);
        auto expected = fixture.footage;
        const auto position = target + type;
        expected.insert(position, "XY");
        const auto result = fixture.insert(static_cast<std::uint8_t>(type), target, "XY", position);
        const auto source = target / 3;
        const auto offset = target % 3;
        const auto dependency = type == 0
                                    ? source * 32 + offset
                                    : (offset == 2 && source + 1 < count
                                           ? (source + 1) * 32
                                           : source * 32 + offset + 1);
        assert(result[7] == dependency);
        fixture.check(expected);
      }

  Fixture editing;
  std::string expected;
  for (std::uint32_t edit = 0; edit < 1024; ++edit) {
    const auto position = expected.empty() ? 0u : edit * 7u % (expected.size() + 1);
    const auto type = position == expected.size() && !expected.empty() ? 1u : 0u;
    const auto target = type == 1 ? position - 1 : position;
    const std::string text(1, static_cast<char>('a' + edit % 26));
    editing.insert(static_cast<std::uint8_t>(type), static_cast<std::uint32_t>(target),
                    text, static_cast<std::uint32_t>(position));
    expected.insert(position, text);
    editing.check(expected);
  }

  const auto &jumps = sequencer::projectors[editing.id]->right_jump_strip_index_of;
  assert(std::any_of(jumps.begin(), jumps.end(),
                     [](const auto target) { return target != u32_max; }));

  for (const auto type : {2u}) {
    Fixture retained(1, type);
    const auto original_head = sequencer::projectors[retained.id]->head_strip_index;
    retained.insert(0, 0, "X", 0);
    retained.check("X");
    auto &projector = *sequencer::projectors[retained.id];
    if (type == 2) {
      assert(projector.head_strip_index == original_head);
      assert(projector.strip_type_of[original_head] == 2);
      assert(projector.initial_length_of[original_head] == 3);
      assert(projector.fragment_length_of[original_head] == 0);
      assert(projector.larger_split_strip_index_of[original_head] == u32_max);
      assert(projector.footage_frame_index_of[original_head] == u32_max);
      assert(projector.materialized_strip_count == 2);
    }
  }

  Fixture empty;
  assert(sequencer::update_projection(empty.id, 0, 0, 0, 0) == u32_max);
  assert(sequencer::update_projection(empty.id, 0, 2, 1) == u32_max);
  assert(sequencer::update_projection(empty.id, 0, 3, 1) == u32_max);
  assert(sequencer::projectors[empty.id]->strip_count == 0);
  assert(sequencer::projection_buffer.get_word_count() == 0);
}
