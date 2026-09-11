#include "../../src/c++/algorithms/initialize.hpp"
#include "../../src/c++/find/containing_strip_index/index.hpp"
#include "../../src/c++/find/projection_frame_index/index.hpp"
#include <cassert>
#include <cstdio>
#include <vector>

int main() {
  for (const bool with_masks : {false, true}) {
    std::vector<std::array<std::uint32_t, 12>> snapshot;
    std::vector<std::uint32_t> starts;
    std::vector<std::uint32_t> containing;
    std::uint32_t length = 0;
    for (std::uint32_t strip_index = 0; strip_index < 64; ++strip_index) {
      const bool masked = with_masks && strip_index % 7 == 0;
      const auto strip_length = strip_index % 5 + 1;
      snapshot.push_back({masked ? 2u : 1u, strip_length, 10, 20,
                          strip_index * 8, 90, 80, 0, u32_max, u32_max,
                          masked ? 0u : strip_length, 0});
      starts.push_back(length);
      if (!masked) {
        length += strip_length;
        containing.insert(containing.end(), strip_length, strip_index);
      }
    }
    Projector projector;
    initialize_projector(projector, snapshot, 1, 2, 3);
    assert(projector.projection_frame_count == length);
    for (std::uint32_t query = 0; query < length * 4; ++query) {
      const auto frame = query * 37 % length;
      find_strip_index_of(projector, frame);
      if (projector.gate_strip_index != containing[frame])
        std::fprintf(stderr, "masks=%d frame=%u expected=%u actual=%u\n",
                     with_masks, frame, containing[frame],
                     projector.gate_strip_index);
      assert(projector.gate_strip_index == containing[frame]);
      assert(projector.projection_frame_index == starts[containing[frame]]);
    }
    for (std::uint32_t query = 0; query < 256; ++query) {
      const auto strip_index = query * 19 % snapshot.size();
      assert(find_projection_frame_index_of(projector, strip_index, 0, 0) ==
             starts[strip_index]);
    }
  }
}
