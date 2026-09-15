# Experiment 12 — current lifecycle measurements

Date: 2026-09-15. Release WASM, one run, 16 warmup cycles, variable lengths.

| Operation | 100 average | 1,000 average |
| --- | ---: | ---: |
| tailInsert | 13.098 µs | 10.904 µs |
| headInsert | 13.386 µs | 18.743 µs |
| headRemove | 25.096 µs | 168.794 µs |
| tailRemove | 19.586 µs | 166.204 µs |
| randomFind | 4.965 µs | 37.237 µs |
| randomRemove | 23.183 µs | 89.185 µs |
| randomReplace | 37.011 µs | 86.746 µs |
| randomInsert | 12.294 µs | 48.275 µs |
| randomIngest | 66.182 µs | 89.148 µs |

At 100 -> 0, create was 3.363 ms and 1,100 Deltas remained. At the 1,000
peak, create was 51.708 ms; at 1,000 -> 0 it was 80.212 ms and 11,647 Deltas
remained. Individual latency maxima also exceed 100 µs. The final target is not
met: retained causal history makes scale-down traversal and create grow beyond
visible distance.

Raw run: `temp/lifecycle-1000-current.{json,md}` (diagnostic, not a release
benchmark claim).
