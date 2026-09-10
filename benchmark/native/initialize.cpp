#include "../../src/c++/.buffers/projection_buffer/index.hpp"
#include "../../src/c++/algorithms/initialize.hpp"
#include <algorithm>
#include <array>
#include <chrono>
#include <cstdint>
#include <cstdio>

int main() {
  std::uint64_t checksum = 0;
  for (const std::uint32_t strip_count : {1000u, 10000u}) {
    ProjectionBuffer buffer(strip_count);
    for (std::uint32_t strip_index = 0; strip_index < strip_count;
         ++strip_index) {
      const auto type = strip_index % 11 == 0 ? 2u : strip_index % 2;
      buffer.write_projection(
          strip_index,
          {type + (strip_index >= strip_count * 9 / 10 ? 3u : 0u),
           strip_index % 7 + 1, type == 2 ? 7u : 5u, 6,
           strip_index * 16, 90, 91, strip_index % 97, u32_max, u32_max});
    }
    const auto snapshot = buffer.read_buffer();
    const auto repetitions = 500000 / strip_count;
    std::array<double, 7> samples;
    for (auto &sample : samples) {
      const auto start = std::chrono::steady_clock::now();
      for (std::uint32_t iteration = 0; iteration < repetitions; ++iteration) {
        Projector projector;
        initialize_projector(projector, snapshot, 5, 7, 6);
        checksum += projector.projection_frame_count;
        checksum += projector.containment_table.get({5, 6, 16}).first;
      }
      const auto elapsed = std::chrono::steady_clock::now() - start;
      sample = std::chrono::duration<double, std::nano>(elapsed).count() /
               (repetitions * strip_count);
    }
    std::sort(samples.begin(), samples.end());
    std::printf("strips=%u pending=10%% ns/strip=%.2f Mstrips/s=%.2f\n",
                strip_count, samples[3], 1000.0 / samples[3]);
  }
  std::printf("checksum=%llu\n", static_cast<unsigned long long>(checksum));
  return 0;
}
