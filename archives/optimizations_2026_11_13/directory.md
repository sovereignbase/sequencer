# Contiguous traversal directory

Candidate against checkpoint `d3108d5`. The previous jump index retains six
per-Strip lanes and repairs intervals while locating or linking Strips. Mixed
two-author profiles attribute 33.8–48% of self samples in 6,000-edit replay to
position resolution. The hypothesis is to remove those dependent jump walks
and repair stores, retaining canonical history and Structural Order unchanged.

## Implementation

Two node lanes identify a block and its physical directory row. Five directory
columns retain visible weight, first/last node, node count and stable block
identity. Two levels of cached sums resolve positions; local structural walks
remain bounded by block width. Width grows from 8 to 16, 32 and 64 nodes as
history grows. A circular directory avoids moving unrelated rows during repeated
endpoint insertion. Splitting still moves the shorter directory side and rebuilds
sums, so random editing costs must be measured rather than inferred.

Directory storage occupies the end of the existing arena allocation. Growth
keeps the former arena alive until rows are rebased. Hydration builds the index
after linking history. Positive extent changes update weights; canonical
coordinates, mask semantics, competition, acknowledgements, snapshots, JS
Footage storage and the public API are unchanged.

The candidate deletes `linkJumps`, `patchJumps`, interval maintenance in subtree
discovery and distance repair in position lookup. No worker, cache of public
results, new dependency, wire field or additional owning allocation is added.

## Verification and measurement

All 276 existing tests pass unchanged, with 100% TypeScript statement, branch,
function and line coverage. All 192 canonical snapshot pairs match, including
JSON, MessagePack, gzip and V8 serialization sizes. Four Session entropy choices
cover append, prepend, random and mixed acknowledged histories, with compaction
and recreation. The [eight-author comparison](directory-concurrent.md) checks
insert/remove/replace, three delivery orders and duplicates through the public
API. Its 36 timing rows have 32 medians over 5% faster and none over 5% slower;
none is slower in all five pairs.

The [mixed replay comparison](directory-mixed.md) uses five matched rounds and
24 fresh receiving Projections per case. Six medians improve by 14.22–44.46%.
All input, canonical snapshot and value hashes match in every paired case. An
unchanged checkpoint copy is retained as an independent timing control.

[Native memory and artifacts](directory-space.md) quantify the tradeoff:
empty, single-content and edited-small Projections use 3.14%, 7.48% and 9.98%
less live native allocation. ESM gzip grows by 257 B (0.58%); raw Wasm grows by
1,630 B (1.79%). Snapshot bytes remain identical. These targeted results do not
establish complete-suite acceptance.

The [full guard](directory-performance.md) contains five complete lifecycle,
throughput and tuple suites per build, including an
[unchanged checkpoint copy](directory-aa-performance.md) and a
[second control comparison](directory-control-performance.md). Of 409 non-length
timing rows, 113 medians improve over 5% and 121 slow over 5%; 39 are slower in
every matched pair. The unchanged copy itself has 59 faster and 107 slower
medians over 5%, with 15 slower in every pair, so this is not a count of proven
regressions. Every row and sample remains visible.

The all-row condition is not met. Full lifecycle random apply, insert, remove,
replace and value improve by 65.69%, 63.41%, 65.35%, 57.75% and 82.73%.
Replicated tail replacement improves by 79.86–82.44% across throughput sizes.
Head insertion slows by 41.26%, head value by 24.65%; small ordinary Projections
under the tuple workload also show reproducible replacement losses. These
losses are not accepted as a tradeoff. Twenty live-native allocation rows
change; wire/storage rows remain identical.

The targeted head profile repeats the unchanged production head insert/value
cases at 25,000 starting Strips ten times. Timed-burst insert self samples are
96 for the checkpoint and 120 for the candidate. In the candidate, 16 samples
fall in directory insertion and 15 in directory lookup. The latter lookup is
avoidable: splitting the visible head at zero leaves a hidden old fragment as
the endpoint until generic endpoint repair discovers its visible successor.
An explicit head handoff during splitting, plus direct Frame ownership within
the known head, is the next candidate. The profile's short value bursts have
only 16/18 samples and are not used to infer precise value costs. Full raw
profiles and symbol maps are retained.

Status: frozen experiment, not accepted. Its source remains in the frozen
`directory-workspace`; the next candidate is measured separately.

## Final linked code

The extracted release module is `temp/optimization_2026_11_12/directory-memory.wasm`.
Emscripten 7.0.0, Clang 24 and Binaryen 133 use the same C++23, `-O3`, LTO,
SIMD, bulk-memory and Wasm exception flags as the checkpoint. Node and host
details are retained in each raw production report.

`wasm-dis` and the retained `directory-inspect.mjs` inspect the final linked
module, rather than compiler intermediates. `Traversal::find` contains six
static `v128.load` sites and 18 `i32x4.add` sites; inlined prefix sums in
`position_of` contain nine and 27. Build, grow and split maintenance contain
vector reductions too. These are static instruction sites, not dynamic counts.
The independent contiguous sums permit vector arithmetic. Within-block
structural walks remain dependent; no parallel pointer-chasing or measured
hardware MLP claim is made.

`find_frame` falls from 2,774 to 1,390 encoded body bytes, with 126 → 70 scalar
load sites and 48 → 8 scalar store sites. `position_of` has 96 → 39 scalar load
sites and 49 → 0 scalar store sites. Scalar counts exclude vector operations.
Inlining hydration into dispatch increases its body from 17,568 to 20,716 B;
the total raw module increase is included above.

## Reproduction

Raw builds, sources, module symbols, disassembly, verification logs, hashes and
all timing samples remain under `temp/optimization_2026_11_12`. That path is
continued to preserve the frozen paired builds across the date boundary.

```powershell
node scripts/run-tests.ts vitest --coverage
node --expose-gc temp/optimization_2026_11_12/shape-check.mjs directory
node temp/optimization_2026_11_12/production-control.mjs directory-mixed-control fixed-table,fixed-control,directory mixed-guard.mjs 5
node --expose-gc temp/optimization_2026_11_12/concurrent-guard.mjs directory-concurrent fixed-table,directory 5
node temp/optimization_2026_11_12/full.mjs fixed-table,fixed-control,directory 5 directoryfull
```

No external benchmark runner, adapter or competitor was executed or modified.
The supplied competitive results identify the target but do not prove a new
ranking; current external winner ratios are therefore not claimed.
