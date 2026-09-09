#include "../../src/c++/algorithms/acknowledge.hpp"
#include "../../src/c++/algorithms/lifecycle.hpp"
#include "../../src/c++/algorithms/snapshot.hpp"
#include <algorithm>
#include <array>
#include <cassert>
#include <cstdint>
#include <vector>

using EncodedStrip = std::array<std::uint32_t, 10>;

EncodedStrip mask(const std::uint32_t realm, const std::uint32_t counter,
                  const std::uint32_t length, const std::uint32_t unix_bits = 7,
                  const bool pending = false) {
  return {pending ? 5u : 2u, length, realm, unix_bits, counter,
          99, 88, 77, u32_max, u32_max};
}

std::vector<SequencePoint> acknowledge(const std::uint32_t projection_id) {
  const auto count = sequencer::acknowledge_projection(projection_id);
  std::vector<SequencePoint> result;
  for (std::uint32_t index = 0; index < count; ++index)
    result.push_back(sequencer::sequence_point_buffer.read_sequence_point(index));
  std::sort(result.begin(), result.end());
  return result;
}

void check(const std::vector<EncodedStrip> &strips,
           std::vector<SequencePoint> expected) {
  sequencer::projection_buffer.resize(static_cast<std::uint32_t>(strips.size()));
  for (std::uint32_t index = 0; index < strips.size(); ++index)
    sequencer::projection_buffer.write_projection(index, strips[index]);
  const auto projection_id = sequencer::initialize_projection();
  std::sort(expected.begin(), expected.end());
  assert(acknowledge(projection_id) == expected);
  assert(acknowledge(projection_id) == expected);
  sequencer::snapshot_projection(projection_id);
  const auto restored_id = sequencer::initialize_projection();
  assert(acknowledge(restored_id) == expected);
  sequencer::clear_projection(restored_id);
  sequencer::clear_projection(projection_id);
}

int main() {
  check({}, {});
  check({{1, 4, 10, 7, 0, 0, 0, 0, u32_max, u32_max}}, {});
  check({mask(10, 0, 3)}, {{10, 7, 4}});
  check({mask(10, 4, 1), mask(10, 6, 2), mask(10, 0, 3)}, {{10, 7, 9}});
  check({mask(10, 0, 3), mask(10, 5, 1), mask(10, 7, 2)}, {});
  check({mask(10, 1, 4)}, {});
  check({mask(10, 0, 0)}, {{10, 7, 1}});
  check({mask(10, 0, 0), mask(10, 1, 2), mask(10, 4, 1)}, {{10, 7, 6}});
  check({mask(10, 0, 3), mask(266, 0, 1), mask(10, 0, 2, 8),
         mask(522, 1, 2), {1, 9, 11, 7, 0, 0, 0, 0, u32_max, u32_max}},
        {{10, 7, 4}, {10, 8, 3}, {266, 7, 2}});
  check({mask(10, 0, 3), mask(10, 4, 1, 7, true)}, {{10, 7, 6}});
  check({mask(10, 4, 2, 7, true)}, {});
  check({mask(10, 0, 3, 7, true)}, {{10, 7, 4}});
  check({mask(10, 0, u32_max - 1)}, {{10, 7, u32_max}});
  check({mask(10, 0, u32_max - 1), mask(10, u32_max, 0)}, {});
  check({}, {});
}
