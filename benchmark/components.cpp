#include "../src/c++/algorithms/initialize.hpp"
#include "../src/c++/.auxiliary/stage_strip/index.hpp"
#include "../src/c++/apply/insert/index.hpp"
#include <emscripten/emscripten.h>
#include <algorithm>
#include <cassert>
#include <cstdio>
#include <cstdlib>
#include <vector>

using Row = std::array<std::uint32_t, 12>;

static void report(const char *name, std::vector<double> &times) {
  std::sort(times.begin(), times.end());
  double total = 0;
  for (const auto time : times)
    total += time;
  std::printf("{\"component\":\"%s\",\"samples\":%zu,\"mean_ns\":%.1f,"
              "\"median_ns\":%.1f,\"p95_ns\":%.1f,\"max_ns\":%.1f}\n",
              name, times.size(), total / times.size(), times[times.size() / 2],
              times[times.size() * 95 / 100], times.back());
}

int main(int argc, char **argv) {
  const auto count = argc > 1 ? std::strtoul(argv[1], nullptr, 10) : 100000u;
  const auto samples = std::min<std::uint32_t>(8192, count);
  std::vector<Row> snapshot(count);
  for (std::uint32_t strip = 0; strip < count; ++strip)
    snapshot[strip] = {1, 8, 10, 20, strip * 9, strip == 0 ? 0u : 10u,
                       strip == 0 ? 0u : 20u, strip == 0 ? 0u : strip * 9 - 1,
                       u32_max, u32_max, 8, strip == 0 ? 0u : 8u};
  Projector projector;
  initialize_projector(projector, snapshot, 1000, 20, 20);
  std::vector<double> stage(samples), apply(samples), find(samples), clock(samples);
  for (std::uint32_t sample = 0; sample < samples + 1024; ++sample) {
    const auto containing = projector.tail_strip_index;
    const auto offset = projector.fragment_length_of[containing];
    auto dependency = projector.fragment_start(containing);
    dependency.counter_bits += offset;
    const auto before = emscripten_get_now();
    const auto incoming = stage_strip(projector, 1, 1, {1000, 20, sample * 2},
                                      dependency, count * 8 + sample, offset);
    const auto staged = emscripten_get_now();
    const auto difference = apply_insert(projector, containing, incoming, offset);
    const auto applied = emscripten_get_now();
    const auto position = find_projection_frame_index_of(
        projector, incoming, difference.first, difference.second);
    const auto found = emscripten_get_now();
    assert(position == count * 8 + sample);
    projector.gate_strip_index = incoming;
    projector.projection_frame_index = position;
    if (sample >= 1024) {
      stage[sample - 1024] = (staged - before) * 1e6;
      apply[sample - 1024] = (applied - staged) * 1e6;
      find[sample - 1024] = (found - applied) * 1e6;
    }
  }
  std::vector<double> split(samples);
  for (std::uint32_t sample = 0; sample < samples; ++sample) {
    const auto before = emscripten_get_now();
    const auto after = emscripten_get_now();
    clock[sample] = (after - before) * 1e6;
    const auto start = emscripten_get_now();
    const auto suffix = split_strip(projector, sample, 4);
    split[sample] = (emscripten_get_now() - start) * 1e6;
    assert(projector.fragment_length_of[suffix] == 4);
  }
  report("clock_pair", clock);
  report("stage_strip", stage);
  report("apply_insert", apply);
  report("find_projection_frame_index_of", find);
  report("split_strip", split);
}
