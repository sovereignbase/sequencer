#include "../../src/c++/algorithms/initialize.hpp"
#include "../../src/c++/find/containing_strip_index/index.hpp"
#include "../../src/c++/find/projection_frame_index/index.hpp"
#include <algorithm>
#include <array>
#include <chrono>
#include <cstdint>
#include <cstdio>
#include <vector>

int main() {
  std::uint64_t checksum = 0;
  constexpr std::uint32_t query_count = 50000;
  for (const auto strip_count : {1000u, 10000u}) {
    std::vector<std::array<std::uint32_t, 12>> snapshot;
    snapshot.reserve(strip_count);
    for (std::uint32_t strip = 0; strip < strip_count; ++strip)
      snapshot.push_back({strip % 7 == 0 ? 2u : 1u,
                          strip % 13 == 0 ? 0u : strip % 5 + 1,
                          strip % 7 == 0 ? 7u : 5u, 6, strip * 8,
                          90, 80, 0, u32_max, u32_max,
                          strip % 7 == 0 || strip % 13 == 0 ? 0u : strip % 5 + 1, 0});
    for (const bool inverse : {false, true}) {
      Projector projector;
      initialize_projector(projector, snapshot, 1, 2, 3);
      std::uint32_t random_state = 123456789;
      const auto query = [&] {
        random_state = random_state * 1664525u + 1013904223u;
        if (inverse) {
          checksum += find_projection_frame_index_of(
              projector, random_state % strip_count, 0, 0);
        } else {
          find_strip_index_of(projector,
                              random_state % projector.projection_frame_count);
          checksum += projector.gate_strip_index;
        }
      };
      for (std::uint32_t warmup = 0; warmup < 10000; ++warmup)
        query();
      std::array<double, 7> samples;
      for (auto &sample : samples) {
        const auto start = std::chrono::steady_clock::now();
        for (std::uint32_t index = 0; index < query_count; ++index)
          query();
        sample = std::chrono::duration<double, std::nano>(
                     std::chrono::steady_clock::now() - start).count() /
                 query_count;
      }
      std::sort(samples.begin(), samples.end());
      std::printf("strips=%u direction=%s ns/query=%.2f\n", strip_count,
                  inverse ? "strip-to-frame" : "frame-to-strip", samples[3]);
    }
  }
  std::printf("checksum=%llu\n", static_cast<unsigned long long>(checksum));
}
