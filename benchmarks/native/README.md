# Native foundation benchmarks

This benchmark compiles the current C++ initialization implementation directly.
It does not use the previously generated WASM module or `dist` and does not
measure end-to-end CRDT throughput.

## Run

From the repository root, with Clang and Emscripten available:

```powershell
clang++ -std=c++23 -O3 -DNDEBUG benchmarks/native/initialize.cpp -o temp/initialize-benchmark.exe
./temp/initialize-benchmark.exe
em++ benchmarks/native/initialize.cpp -std=c++23 -O3 -msimd128 -sENVIRONMENT=node -sSINGLE_FILE=1 -sALLOW_MEMORY_GROWTH=1 -o temp/initialize-benchmark.cjs
node temp/initialize-benchmark.cjs
```

The workload initializes and destroys fresh Projectors from 1,000- and
10,000-Strip snapshots. Ten percent of each snapshot is pending. Both inserts
and Masks are present, with two identity Realms and repeated pending dependency
points. Timing includes allocations, containment construction, pending grouping,
jump construction, and destruction, but excludes snapshot preparation.
Each reported value is the median of seven samples processing 500,000 Strips.
The checksum prevents unused initialization results from being discarded.

## Initial comparison

On 2026-09-09, two implementations with the same correctness fixes were compiled
into one `-O3 -msimd128` WASM module and run alternately in Node. The baseline used
`reserve` plus per-Strip `push_back`; the candidate sizes dense columns once and
writes by Strip index. After discarding the first warm-up pair, the three paired
measurements were:

| Strips | Baseline ns/Strip | Indexed writes ns/Strip |
| --- | --- | --- |
| 1,000 | 129.11 / 123.46 / 141.23 | 63.83 / 60.45 / 53.91 |
| 10,000 | 121.15 / 176.18 / 140.71 | 63.30 / 82.08 / 84.12 |

Median-of-medians speedups in this workload were approximately 2.14x and 1.71x.
Independent process timings varied substantially; these are local measurements,
not a general performance guarantee or a comparison with other CRDTs.

Emscripten's `-Rpass=loop-vectorize` output and generated assembly showed
four-lane vectorized initialization/copy loops and `v128` instructions. The
dependency-indexing loop itself was not automatically vectorized. No explicit
SIMD intrinsics or speculative prefetches were added.

```powershell
em++ benchmarks/native/initialize.cpp -std=c++23 -O3 -msimd128 -S -Rpass=loop-vectorize -Rpass-missed=loop-vectorize -o temp/initialize.s
```

## Focused correctness tests

These tests are independent of the unfinished exported update/merge/compaction
implementation and the TypeScript adapter migration. They must not be mistaken
for passing the full application suite.

`insert_order` checks descending sibling order, cross-Realm descendants, and
split continuations using the native insertion primitives. It enumerates all
1,680 dependency-preserving delivery orders for three offline writers with
three edits each and requires each writer's text to remain contiguous.
These are not end-to-end merge tests. `find` checks both lookup directions
against visible prefix sums, including structural Masks with zero projected
length, while retaining the existing adaptive jump strategy.

`sequence_containment` compares direct containment, indexed containment, and
pending range lookup against the same inclusive-boundary oracle. It includes
zero-length anchors and counters near `UINT32_MAX`. `acknowledge` checks complete
Mask Realms, missing intervals, Realm collisions, pending state, and snapshot
round trips. The encoded content length remains unchanged in every case.

`mask_split` covers empty-prefix split links, zero-content placeholder chains,
Mask traversal past unrelated inserts, partial masking, and repeated masking.
It tests the existing fragment-masking primitive, not the unfinished standalone
Mask-Strip materialization in the public update/merge path. `issue` checks local
insert/Mask counter separation, staging, and continued issuance after hydration.

```powershell
foreach ($test in @('containment_table', 'pending_table', 'sequence_containment', 'projection_buffer', 'initialize', 'snapshot', 'insert_order', 'find', 'acknowledge', 'issue', 'mask_split')) {
  clang++ -std=c++23 -Wall -Wextra -Wpedantic -Werror "test/c++/$test.cpp" -o "temp/$test-test.exe"
  if ($LASTEXITCODE -ne 0) { throw "Compilation failed: $test" }
  & "./temp/$test-test.exe"
  if ($LASTEXITCODE -ne 0) { throw "Test failed: $test" }
  em++ "test/c++/$test.cpp" -std=c++23 -O2 -msimd128 -sENVIRONMENT=node -sSINGLE_FILE=1 -sALLOW_MEMORY_GROWTH=1 -o "temp/$test-test.cjs"
  if ($LASTEXITCODE -ne 0) { throw "WASM compilation failed: $test" }
  node "temp/$test-test.cjs"
  if ($LASTEXITCODE -ne 0) { throw "WASM test failed: $test" }
}
```
