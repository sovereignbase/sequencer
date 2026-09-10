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

Randomized Find lookup in both directions can be measured separately:

```powershell
em++ benchmarks/native/find.cpp -std=c++23 -O3 -msimd128 -sENVIRONMENT=node -sSINGLE_FILE=1 -sALLOW_MEMORY_GROWTH=1 -o temp/find-benchmark.cjs
node temp/find-benchmark.cjs
```

The Find workload includes Masks and zero-length anchors in 1,000- and
10,000-Strip projections. Initialization is excluded from timings. Each direction
warms up with 10,000 queries and reports the median of seven 50,000-query samples.
This measures lookup only, not insert/merge throughput or full CRDT behavior.

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

`before_insert` exercises head, body, and Strip-boundary insertion through
`apply_left`. It checks that split continuations do not compete with real
concurrent inserts, that placeholders retain Mask traversal links, and that
both directions of every maintained jump retain correct frame and Strip counts.
Concurrent same-anchor inserts are checked in every delivery permutation.

`after_insert` checks the resolved zero-anchor case of `apply_right`: the anchor
stays to the left, content retains a larger-split continuation, siblings descend
by SequencePoint, and the smallest sibling follows the preceding sibling's
descendants. Head, body, and empty-anchor cases retain reciprocal jumps and
correct Find results. This is not a complete public after-insert or merge test.

`read` checks single-frame lookup and batched visible ranges, including clipped
boundaries, noncontiguous Footage, Masks, placeholders, and detached pending
state. `test/unit/read_adapter.test.ts` separately checks the TypeScript tuple
contract and four-word transfer layout against a mocked native ABI, including
replacement of the WASM heap after allocation.

`snapshot` checks packed Footage order, retained soft-masked content, pending
inserts, and equality of visible values after hydration. The initialization
test requires materialized Masks to retain Footage positions; pending Mask
commands have no target Footage yet. `test/unit/snapshot_adapter.test.ts` checks
buffer copies, released slots, and heap replacement against a mocked ABI.

The following isolated bridge compiles the current snapshot, initialization,
read, and fragment-masking implementations into fresh WASM and runs the actual
TypeScript `create`, `snapshot`, and `values` functions against it:

```powershell
em++ test/c++/snapshot_bridge.cpp -std=c++23 -O2 -msimd128 --no-entry -sMODULARIZE=1 -sWASM_ASYNC_COMPILATION=0 -sENVIRONMENT=node -sSINGLE_FILE=1 -sALLOW_MEMORY_GROWTH=1 '-sEXPORTED_RUNTIME_METHODS=["HEAPU32"]' -o temp/snapshot-bridge.cjs
node test/wasm/run-snapshot.mjs
```

This tests a soft-masked split, released Footage slots, masked-only and
pending-only states, empty snapshots, and snapshot/hydration round trips.
Creation uses the production buffer-preparation and initialization exports,
including creating an empty Replica immediately after another Replica's
snapshot. `test/unit/create_adapter.test.ts` separately checks trusted buffer
transfer, heap replacement, Footage ownership, and the native release adapter.
The runner applies the same synchronous Emscripten factory normalization as
the production build. It does not replace the checked-in WASM artifact or
claim that the unfinished public remove/merge/compaction paths work.

The bridge also verifies that `snapshot`, `values`, `recover`, and
`acknowledge` leave their transfer buffers empty immediately on return,
including empty results. `transfer_buffers` covers native input consumption
and host-output clearing for all three buffer types.
`test/unit/buffer_lifecycle.test.ts` covers the adapter-side lifetime, including
compaction's transfer contract with a mocked native consumer, not GC semantics.

```powershell
foreach ($test in @('containment_table', 'pending_table', 'sequence_containment', 'projection_buffer', 'initialize', 'snapshot', 'insert_order', 'find', 'acknowledge', 'issue', 'mask_split', 'before_insert', 'after_insert', 'read', 'transfer_buffers')) {
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
