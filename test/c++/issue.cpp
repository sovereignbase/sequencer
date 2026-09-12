#include "../../src/c++/algorithms/issue.hpp"
#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include <cassert>
#include <cstdint>

void check_staged(const Projector &projector, const std::uint32_t strip_index,
                  const std::uint8_t type, const std::uint32_t length,
                  const std::uint32_t counter, const SequencePoint previous,
                  const std::uint32_t footage) {
  const auto start = projector.strip_start_of[strip_index];
  assert(start.crypto_random_bits == (type == 2
      ? projector.mask_session_crypto_random_bits
      : projector.insert_session_crypto_random_bits));
  assert(start.unix_lower_bits == projector.shared_session_unix_lower_bits);
  assert(start.counter_bits == counter);
  assert(projector.strip_type_of[strip_index] == type);
  assert(projector.initial_length_of[strip_index] == length);
  assert(projector.fragment_length_of[strip_index] == (type == 2 ? 0 : length));
  assert(projector.previous_strip_end_of[strip_index] == previous);
  assert(projector.footage_frame_index_of[strip_index] == footage);
  assert(projector.left_strip_index_of[strip_index] == strip_index);
  assert(projector.right_strip_index_of[strip_index] == strip_index);
  assert(projector.smaller_competitor_strip_index_of[strip_index] == u32_max);
  assert(projector.larger_split_strip_index_of[strip_index] == u32_max);
  assert(projector.left_jump_strip_index_of[strip_index] == u32_max);
  assert(projector.right_jump_strip_index_of[strip_index] == u32_max);
  assert(projector.left_jump_strip_count_of[strip_index] == 0);
  assert(projector.right_jump_strip_count_of[strip_index] == 0);
  assert(projector.left_jump_length_of[strip_index] == 0);
  assert(projector.right_jump_length_of[strip_index] == 0);
  assert((projector.containment_table.get(start) == std::pair{strip_index, 0u}));
  assert((projector.containment_table.get(
      {start.crypto_random_bits, start.unix_lower_bits, counter + length}) ==
      std::pair{strip_index, length}));
}

int main() {
  const SequencePoint dependency{90, 80, 70};
  const auto projection_id = sequencer::initialize_projection();
  auto &projector = *sequencer::projectors[projection_id];
  assert(sequencer::issue_strip(projector, 1, 3, dependency, 0) == 0);
  assert(sequencer::issue_strip(projector, 2, 2, dependency) == 1);
  assert(sequencer::issue_strip(projector, 0, 1, dependency, 3) == 2);
  assert(sequencer::issue_strip(projector, 2, 1, dependency) == 3);
  check_staged(projector, 0, 1, 3, 0, dependency, 0);
  check_staged(projector, 1, 2, 2, 0, dependency, u32_max);
  check_staged(projector, 2, 0, 1, 4, dependency, 3);
  check_staged(projector, 3, 2, 1, 3, dependency, u32_max);
  assert(projector.operation_count == 6);
  assert(projector.mask_operation_count == 5);
  assert(projector.materialized_strip_count == 0);
  assert(projector.projection_frame_count == 0);
  assert(projector.gate_strip_index == u32_max);
  assert(projector.head_strip_index == u32_max);
  assert(projector.tail_strip_index == u32_max);
  sequencer::clear_projection(projection_id);

  Projector invalid;
  assert(sequencer::issue_strip(invalid, 3, 1, dependency) == u32_max);
  assert(sequencer::issue_strip(invalid, 0, 0, dependency) == u32_max);
  assert(sequencer::issue_strip(invalid, 1, u32_max, dependency) == u32_max);
  assert((invalid.strip_count == 0));
  assert(invalid.containment_table.is_empty());
  assert(invalid.operation_count == 0);
  assert(invalid.mask_operation_count == 0);

  invalid.operation_count = u32_max - 2;
  assert(sequencer::issue_strip(invalid, 1, 1, dependency, 0) == 0);
  assert(invalid.operation_count == u32_max);
  assert(sequencer::issue_strip(invalid, 1, 1, dependency, 1) == u32_max);
  assert(invalid.strip_count == 1);
  assert(sequencer::issue_strip(invalid, 2, 1, dependency) == 1);
  assert(invalid.mask_operation_count == 2);
}
