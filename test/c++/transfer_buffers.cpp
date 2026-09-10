#include "../../src/c++/algorithms/buffers.hpp"
#include <cassert>
#include <vector>

int main() {
  for (const auto count : {0u, 1u, 32u}) {
    auto *projection = sequencer::prepare_projection_buffer(count);
    for (std::uint32_t word = 0; word < count * 10; ++word)
      projection[word] = word;
    const auto input = sequencer::projection_buffer.read_buffer();
    assert(input.size() == count);
    assert(sequencer::get_projection_buffer_word_count() == 0);
    assert(sequencer::get_projection_buffer_pointer() == nullptr);
    assert(sequencer::projection_buffer.read_buffer().empty());
    for (std::uint32_t strip = 0; strip < count; ++strip)
      for (std::uint32_t word = 0; word < 10; ++word)
        assert(input[strip][word] == strip * 10 + word);

    static_cast<void>(sequencer::prepare_projection_buffer(count));
    sequencer::clear_projection_buffer();
    assert(sequencer::get_projection_buffer_word_count() == 0);
    assert(sequencer::get_projection_buffer_pointer() == nullptr);

    for (std::uint32_t span = 0; span < count; ++span)
      sequencer::footage_span_buffer.write_span(span, span * 2, 2, span % 2);
    assert(sequencer::get_footage_span_buffer_count() == count);
    const auto spans = sequencer::get_footage_span_buffer_pointer();
    std::vector<std::uint32_t> copied;
    for (std::uint32_t word = 0; word < count * 4; ++word)
      copied.push_back(spans[word]);
    sequencer::clear_footage_span_buffer();
    assert(sequencer::get_footage_span_buffer_count() == 0);
    assert(sequencer::get_footage_span_buffer_pointer() == nullptr);
    for (std::uint32_t span = 0; span < count; ++span)
      assert(copied[span * 4 + 1] == span * 2);

    auto *frontier = sequencer::prepare_compaction_sequence_point_buffer(count);
    for (std::uint32_t word = 0; word < count * 3; ++word)
      frontier[word] = word;
    const auto frontiers = sequencer::sequence_point_buffer.read_buffer();
    assert(frontiers.size() == count * 3);
    assert(sequencer::sequence_point_buffer.get_sequence_point_count() == 0);
    assert(sequencer::get_acknowledgement_sequence_point_buffer_pointer() == nullptr);
    assert(sequencer::sequence_point_buffer.read_buffer().empty());
    for (std::uint32_t word = 0; word < count * 3; ++word)
      assert(frontiers[word] == word);
    static_cast<void>(sequencer::prepare_compaction_sequence_point_buffer(count));
    sequencer::clear_sequence_point_buffer();
    assert(sequencer::sequence_point_buffer.get_sequence_point_count() == 0);
    assert(sequencer::get_acknowledgement_sequence_point_buffer_pointer() == nullptr);
  }
}
