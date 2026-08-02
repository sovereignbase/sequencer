# Wasm Frame Resolution Fusion

Date: 2026-08-02

## Target

Reduce midpoint `__update` and `__delete` latency by removing a repeated
TypeScript-to-Wasm transition and native frame-resolution operation.

Relevant source locations:

- `src/c++/main.cpp`
- `src/typescript/wasm/index.ts`
- `src/typescript/algorithms/crud/update/index.ts`
- `src/typescript/algorithms/crud/delete/index.ts`

## Hypothesis

Both mutation paths called `get_footage_frame_index`, then immediately called
`write_strip_at_projection_frame_index_to_buffer` for the same Projection
index. Each native function positioned the Projector Gate with
`run_projector_to_frame_index` and resolved the same Strip. Returning the
already available Footage index from the buffer-write operation should remove
one Wasm boundary crossing, one native Gate resolution, one Strip lookup, and
one TypeScript wrapper call.

The expected effect was lower `__update` and `__delete` latency at every
Sequence length, no retained-memory change, and a small generated-code change.
The risks were an incorrect Footage offset after Gate movement and an ABI return
type mismatch. Public APIs, Sequence Coordinates, structural links, ordering,
and convergence rules were not changed.

No archived attempt described this exact current Wasm-boundary fusion. Older
archives concern a previous implementation architecture or different read and
hydration paths.

## Benchmark Environment

- Commit before the attempt: `38f5db5`
- Operating system: Windows
- CPU: Intel Core i5-10210U at 1.60 GHz
- Node.js: 24.16.0
- npm: 11.13.0
- Emscripten: 5.0.7
- CMake: 4.3.3
- Build preset: `wasm-release`
- TypeScript build: `tsdown`, target `es2024`
- Benchmark library: `tinybench` 6.1.2
- Power state, input data, warm-up procedure, sample counts, build flags, and
  benchmark implementation were unchanged between baseline and candidate.
- Competitor comparison is not applicable because the current benchmark suite
  contains no competing implementation.

The targeted benchmark reproduced the repository benchmark's state-pool,
warm-up, per-call timing, and midpoint mutation methodology at lengths 100,
10,000, and 1,000,000. Five independent Node.js processes were run serially for
each build. The decision uses the median of the five per-process medians and
Tukey IQR across those medians.

An earlier exploratory pass accidentally ran process pairs concurrently. Those
contaminated measurements were not used. Both baseline and candidate were then
rebuilt and measured serially with identical commands.

Commands:

```text
npm run build:wasm
npm run build
1..5 | ForEach-Object { node --experimental-strip-types temp/benchmark_frame_resolution.mjs }
node temp/measure_artifacts.mjs
```

## Raw Targeted Results

Each entry is `median µs / within-run standard deviation µs`.

| operation  |    length | baseline run 1 | baseline run 2 | baseline run 3 | baseline run 4 | baseline run 5 |
| ---------- | --------: | -------------: | -------------: | -------------: | -------------: | -------------: |
| `__update` |       100 |   3.50 / 2.969 |   3.70 / 2.733 |   3.90 / 2.784 |   4.00 / 8.217 |   6.80 / 7.059 |
| `__delete` |       100 |   2.70 / 3.975 |   2.80 / 5.098 |   2.90 / 5.303 |   2.70 / 5.957 |  5.40 / 55.553 |
| `__update` |    10,000 |   2.80 / 1.329 |   5.45 / 3.425 |   3.10 / 2.549 |   3.00 / 1.578 |   5.60 / 3.937 |
| `__delete` |    10,000 |   2.50 / 5.230 |   3.05 / 1.897 |   4.50 / 2.900 |   2.40 / 0.949 |   5.40 / 7.688 |
| `__update` | 1,000,000 |   9.40 / 4.405 |   6.95 / 2.798 |   7.35 / 1.539 |   9.65 / 5.613 |   8.20 / 0.629 |
| `__delete` | 1,000,000 |  9.45 / 10.381 |   7.25 / 3.920 |   7.20 / 0.786 |  12.75 / 6.444 |   7.95 / 0.908 |

| operation  |    length | candidate run 1 | candidate run 2 | candidate run 3 | candidate run 4 | candidate run 5 |
| ---------- | --------: | --------------: | --------------: | --------------: | --------------: | --------------: |
| `__update` |       100 |    3.30 / 1.937 |    3.20 / 2.435 |    3.40 / 2.290 |    3.40 / 3.558 |    3.20 / 1.902 |
| `__delete` |       100 |    2.60 / 3.724 |    4.50 / 7.847 |    2.70 / 3.764 |    2.70 / 4.639 |    2.60 / 4.590 |
| `__update` |    10,000 |    2.70 / 1.443 |    2.70 / 1.143 |    2.90 / 1.129 |    4.90 / 2.980 |    2.60 / 1.032 |
| `__delete` |    10,000 |    2.40 / 2.191 |    2.60 / 1.282 |    2.50 / 2.468 |    2.60 / 0.891 |    2.30 / 1.217 |
| `__update` | 1,000,000 |    7.35 / 2.596 |    6.55 / 0.359 |    7.55 / 0.453 |    6.75 / 2.103 |    6.70 / 2.167 |
| `__delete` | 1,000,000 |    7.25 / 0.939 |    6.95 / 0.654 |    7.35 / 1.755 |    7.70 / 0.406 |    7.25 / 1.650 |

## Targeted Comparison

| operation  |    length | baseline median µs | baseline IQR | candidate median µs | candidate IQR | absolute difference µs |       change |
| ---------- | --------: | -----------------: | -----------: | ------------------: | ------------: | ---------------------: | -----------: |
| `__update` |       100 |               3.90 |         1.80 |                3.30 |          0.20 |                  -0.60 | 15.4% faster |
| `__delete` |       100 |               2.80 |         1.45 |                2.70 |          1.00 |                  -0.10 |  3.6% faster |
| `__update` |    10,000 |               3.10 |         2.63 |                2.70 |          1.25 |                  -0.40 | 12.9% faster |
| `__delete` |    10,000 |               3.05 |         2.50 |                2.50 |          0.25 |                  -0.55 | 18.0% faster |
| `__update` | 1,000,000 |               8.20 |         2.38 |                6.75 |          0.83 |                  -1.45 | 17.7% faster |
| `__delete` | 1,000,000 |               7.95 |         3.88 |                7.25 |          0.43 |                  -0.70 |  8.8% faster |

All six affected rows improved. There are no competitor positions, ratios,
gaps, wins, or losses to report for this repository's current benchmark.

## Implementation

`write_strip_at_projection_frame_index_to_buffer` now returns the exact Footage
frame index computed from the Gate and containing Strip it already resolved.
The TypeScript adapter forwards that unsigned result. `__update` and `__delete`
use it instead of first calling `get_footage_frame_index` for the same
Projection position.

The public `__read` path still uses `get_footage_frame_index`; no public export
was removed or changed. No new state, allocation, cache, branch, coordinate, or
ordering rule was introduced.

## Artifact Sizes

| artifact             | measurement       | baseline bytes | candidate bytes | difference |  change |
| -------------------- | ----------------- | -------------: | --------------: | ---------: | ------: |
| raw Wasm             | raw               |         35,572 |          35,603 |        +31 | +0.087% |
| raw Wasm             | gzip              |         13,174 |          13,224 |        +50 | +0.380% |
| raw Wasm             | Brotli            |         10,588 |          10,536 |        -52 | -0.491% |
| Wasm glue and binary | raw               |         50,282 |          50,313 |        +31 | +0.062% |
| Wasm glue and binary | minified          |         48,478 |          48,518 |        +40 | +0.083% |
| Wasm glue and binary | minified + gzip   |         16,938 |          16,995 |        +57 | +0.337% |
| Wasm glue and binary | minified + Brotli |         13,710 |          13,731 |        +21 | +0.153% |
| ESM bundle           | raw               |         89,828 |          89,760 |        -68 | -0.076% |
| ESM bundle           | minified          |         53,177 |          53,198 |        +21 | +0.039% |
| ESM bundle           | minified + gzip   |         18,782 |          18,832 |        +50 | +0.266% |
| ESM bundle           | minified + Brotli |         15,267 |          15,317 |        +50 | +0.328% |
| CommonJS bundle      | raw               |         90,124 |          90,056 |        -68 | -0.075% |
| CommonJS bundle      | minified          |         55,605 |          55,582 |        -23 | -0.041% |
| CommonJS bundle      | minified + gzip   |         19,108 |          19,157 |        +49 | +0.256% |
| CommonJS bundle      | minified + Brotli |         15,582 |          15,585 |         +3 | +0.019% |

The generated Wasm ABI changed the existing buffer-write return from `void` to
`number`. Generated TypeScript no longer contains the redundant
`get_footage_frame_index` calls in `__update` or `__delete`. The native return
arithmetic accounts for the 31-byte raw Wasm increase. No retained runtime
memory or allocation was added; separate peak-memory measurement was therefore
not applicable to this no-state change.

## Verification

- `npm run test:unit`: 17 tests passed.
- `npm run test:convergence`: 7 tests passed.
- `npm run test`: 25 Vitest tests, five runtime targets, and 15 browser tests
  passed, including the stress convergence suite.
- `npm run build`: passed.
- `npm run bench`: passed and regenerated the complete README, JSON, and HTML
  benchmark reports.
- `npm run format`: passed after documentation was added.

## Final Decision

Retained.

The change removes duplicated work from both mutation hot paths and improved
every targeted row by 3.6% to 18.0%. Correctness, runtime portability, and
convergence remained green. The compressed-size cost is at most 57 bytes in the
measured artifacts, while raw distributed bundles shrink by 68 bytes. That
small generated-size tradeoff is justified by the reproducible latency gains
and the simpler TypeScript data flow.

Possible future work should profile other repeated Wasm transitions, especially
merge result projection, but must preserve pending-dependency Change semantics.
