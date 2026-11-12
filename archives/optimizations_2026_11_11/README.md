# Smaller snapshot input and direct range reads

## Checkpoint, 12 November

The retained build is `endpointjump`. It combines the earlier snapshot, runtime,
Footage and tuple changes with the measured hidden-endpoint traversal change.
The rebuilt ESM and embedded Wasm match the frozen, measured artifacts exactly.
All 276 tests pass with 100% TypeScript coverage; both type checks and all 112
executed compatibility checks pass. Public API and compaction expectations are
unchanged. Normal three-run README reports are refreshed, and TypeScript and C++
references build without warnings. Doxygen documents the anonymous Entry union's
fields directly on Entry; the compiled union layout is unchanged.

The complete five-run comparison includes every timing and space row. Of 102
earlier timing regressions, 96 shrink and 88 become improvements against the
original build. Eight earlier improvements change sign. The all-row objective
remains unfinished; the [goal assessment](recoveryendpoint-historical-goal.md)
records the remaining work. No new optimization experiments continue past this
checkpoint.

## Earlier measurements

The continued optimization work is recorded in [recovery.md](recovery.md),
with [inline Acknowledgements](inline_acknowledgements.md) and the measured
[Gossip output reuse experiment](reused_output.md), followed by
[deferred anchor lookup](deferred_anchor.md) and the rejected
[ownership flag unification](unified_ownership.md), and the
[empty replacement lifetime fix and rejected scalar-input experiment](scalar_replacement.md),
[Footage copy experiments](private_footage_copy.md) and
[snapshot copying](snapshot_copy.md), [tuple Version storage](tuple_storage.md)
and [subsequent runtime experiments](runtime_experiments.md), including the
[rejected Splice packing experiment](splice_span.md) and the retained
[hidden endpoint traversal change](hidden_endpoints.md). The final checkpoint's
[historical goal assessment](recoveryendpoint-historical-goal.md) records which
earlier gains survive and which regressions remain. The tables below describe
the earlier checkpoint in this round. [Measurement-window drift](measurement_environment.md)
explains why older absolute timings cannot substitute for the fresh matched runs.

Baseline: `1c0a007fc041db016a20a1f9bba2fb97979bd1a2`. The earlier
`e13815837934e5a6814fa7744ffbcaac7526a9e6` build is measured again to check
whether the previous round's gains survive. Measurements are from 11 November
2026: Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U
@ 1.60GHz, Emscripten 7.0.0 and CMake 4.4.5. Release/LTO, Wasm SIMD, bulk
memory and Wasm exceptions remain enabled; compiler flags are unchanged.

The requested improvement on every row is **not established**. Checkpoint
creation and range reads improve, while the complete suite still contains
slower medians and losses of earlier gains. The follow-up measurements distinguish
repeatable benefits from inconclusive differences; they do not discard slower
observations. No external workload or competitor was rerun.

## Changes

- Give `values()` a direct native range export. It returns just the borrowed span
  pointer and count, without input reservation, the operation switch, mutation
  descriptors or deferred Footage processing. Remove the old operation and result
  kind. Empty output returns immediately; the one-span slice stays inline.
- Read snapshot Insertions into a contiguous `vector<Insertion>`. Records shrink
  from 52 to 36 bytes on wasm32, removing the unused per-entry ACK vector and tag.
  Snapshot frontiers remain separate. Remove the unused generic native apply
  overloads; hydration and merge use the same single-Insertion algorithm.
- During hydration, keep the last resolved fragment in the existing unused
  right-jump distance lane. No jump pointers exist yet. Clear each temporary value
  before building that Strip's outgoing jump. This removes the temporary fragment
  hash table, its allocations and lookups without adding per-instance state.
- Grow numeric input storage without preserving or zeroing its overwritten words.
  JavaScript writes every descriptor and every numeric word the native Reader can
  consume. Rejected descriptors are still completely written; their unused
  payload is never read.
- Use the native ACK count to skip constructing an unused empty array. Increase
  bounded snapshot concatenation batches from 4,096 to 16,384 source spans,
  reducing repeated prefix copies on large fragmented exports.
- Share the twelve public methods' cold error construction in `errors/class.ts`.
  Remove the unused native allocating range overload as well. Existing library
  errors, public call names, messages and original causes are preserved.

No public signature, wire word, Footage ownership rule, ordering rule, Actor
membership rule or acknowledged-compaction invariant changes. The SoA lanes and
previous endpoint lookups remain. No per-Projection cache or field is added.

## Performance

Five complete runs of **each** original, baseline and candidate build, alternating
the three-build order. All use matching fixed native Session entropy and the same
five workload seeds. The default workloads, call limits and checkpoints are
unchanged. [All 424 timing and 96 memory/storage rows](performance.md) include
medians, IQRs and paired percentage changes against both earlier builds.

- All twelve checkpoint constructor medians improve against baseline, by
  **15.5–49.7%**. The earlier checkpoint constructor regressions against original
  become improvements in this comparison.
- The empty checkpoint's `values()` latency falls **85.4%**. Its residual median
  is still **16.5%** above original, versus **697.5%** above original at baseline.
- Two independent twelve-round public ESM guards reproduce short range-read
  improvements. Middle ranges improve **10.6–14.2%** for the 100-group fixture
  and **19.1–28.3%** for 20,000 groups.
- Two ten-round matched replication checks improve the duplicate medians.
  The corrected repetition pre-materializes duplicates outside timing; fresh
  insert/remove/replace results are mixed. These checks do not establish that
  every broader suite context improves.
- The full lifecycle retains its previous gains against original. Differences
  against baseline are mostly small; these aggregates do not establish the
  all-row acceptance condition.

The broad comparison has **166 timing medians over 5% faster and 109 over 5%
slower** than baseline. Twenty-two rows cross from an earlier improvement over
5% to a regression over 5% against original. Warm follow-up checks do not repeat
the large apparent apply/tuple losses, but some small scalar and lifetime costs
remain inconclusive. The [follow-up report](measurements.md) lists every slower
median over 5%, both read repetitions, A/A controls and rejected attempts. No
blanket “noise only” or universal performance claim follows from these data.

## Memory and disk

Snapshot input records use **30.8% less native temporary space** before allocator
overhead: 36 rather than 52 bytes each, saving 390.625 KiB for 25,000 Insertions.
The temporary fragment hash table also disappears; its fixture-dependent saving
is not included in that calculation. This is temporary hydration/merge storage,
not a reduction of every Projection's persistent footprint.

Three runs with both 1,000 and 10,000 simultaneously live Projections use one Wasm
instance and no peer per sample. The medians at 10,000 instances are below. Native
bytes include live allocator overhead and the amortized handle table. JavaScript
heap deltas follow explicit JS process garbage collection and include wrappers,
bindings and numeric Footage. The preallocated instance container is excluded.

| Shape                       | Native B/instance before → after | JS heap B/instance before → after |
| --------------------------- | -------------------------------: | --------------------------------: |
| Empty                       |                  262.56 → 262.56 |                   241.26 → 241.22 |
| One value                   |                  542.56 → 542.56 |                   445.88 → 448.23 |
| Eight sequence values       |                  542.56 → 542.56 |                   417.87 → 417.97 |
| Eight-field tuple           |              1,390.66 → 1,390.66 |                   422.39 → 422.52 |
| Eight values, each replaced |              3,511.93 → 3,511.93 |               1,123.14 → 1,123.23 |

Persistent native allocation is unchanged; the small JS heap differences are not
claimed as an optimization. Reserved Wasm capacity is separate and is not added
to these live-allocation estimates. These numbers are not process RSS.

All public snapshot schemas and encoded sizes are unchanged. Shape checks compare
192 exact canonical snapshot pairs over append, prepend, random and mixed edits,
four entropy seeds, two registered Actors, ACK exchange and reconstruction.
JSON, MessagePack, gzip and V8 serialization sizes agree. The complete suite also
retains its storage rows; rounding of allocator medians is visible separately.

## Source and artifacts

Handwritten TypeScript/C++ source, including comments and excluding generated
Wasm glue, falls from **182,310 to 181,138 normalized UTF-8 bytes** and from
**4,400 to 4,355 nonblank lines**. Both builds contain forty source files.

Identical build settings, Terser three-pass minification, gzip level 9 and Node's
default Brotli settings. All sizes below are bytes, including inline Wasm.

| Artifact | Encoding     |  Before |   After | Difference |
| -------- | ------------ | ------: | ------: | ---------: |
| ESM      | Raw          | 159,218 | 157,366 |     −1,852 |
| ESM      | Min          | 129,979 | 128,233 |     −1,746 |
| ESM      | Min + gzip   |  45,957 |  45,757 |       −200 |
| ESM      | Min + Brotli |  37,490 |  37,567 |        +77 |
| CommonJS | Raw          | 159,369 | 157,521 |     −1,848 |
| CommonJS | Min          | 131,141 | 129,276 |     −1,865 |
| CommonJS | Min + gzip   |  46,050 |  45,861 |       −189 |
| CommonJS | Min + Brotli |  37,641 |  37,645 |         +4 |
| Wasm     | Raw          |  95,249 |  94,116 |     −1,133 |
| Wasm     | gzip         |  38,199 |  37,934 |       −265 |
| Wasm     | Brotli       |  30,992 |  30,994 |         +2 |

The Brotli increases are real deterministic artifact regressions, not timing
noise. This is a smaller raw/minified/gzipped build, not a win in every encoding.

## Generated Wasm

The production-linked binary was extracted from each measured build's generated
glue and validated with `WebAssembly.validate`. Inspection used:

```powershell
& C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_11/baseline-memory.wasm -o temp/optimization_2026_11_11/baseline.wat
& C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_11/final-memory.wasm -o temp/optimization_2026_11_11/final.wat
```

The matching linker symbol maps have five imported functions; disassembly indices
are native symbol indices minus five. Snapshot Reader moves from native index 76
to 74 (`$71` → `$69` in WAT), with its output-vector stride changing from 52 to
36 bytes. Hydration moves from 88 to 86 (`$83` → `$81`); its disassembly shrinks
from 3,122 to 2,794 lines. The unsigned-Index fragment-map instantiation disappears
from the symbol map. Other required dependency/frontier maps remain.

The dedicated `runtime_values` export is index 87 (`$82`), with the range loop
inlined into it. Final input reserve is index 90 (`$85`): allocate, replace the
pointer, free the old allocation, update capacity. Its growth has no memory copy
or fill. Baseline reserve instead calls the vector-resize helper, which retains
and initializes words. Existing fixed-record `v128.load`/`v128.store` transfers
remain; no new SIMD acceleration is claimed.

Removing the hash lookup and overwritten-input copies removes work rather than
creating independent traversals. A causal fragment walk still has load-to-load
dependencies; SIMD and MLP do not make that single walk parallel. Batching would
change the synchronous call contract. No extra unrolling or speculative ILP/MLP
state is added. Independent numeric transfers retain the existing compiler
vectorization. The measured improvements come from less dispatch, allocation and
data movement.

SHA-256 of measured artifacts:

| Build        | Wasm                                                               | Distributed ESM                                                    |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Baseline     | `3cc2f17cded2cc49df386a4504a05da0e2732eeaf8d2a447d1feb81de43b3724` | `0d7276d76d6e8378b623d1ce9cf033a7877b4e02f2c4b5e0d8703057835e2d09` |
| Candidate    | `6d32e5ab2b4536f6c51cf339387e772fc9249cd61065322fa99237d1f50dfc24` | `cd1ab119494e618d3f4f4fcf2000fa99b7da275fa1b5a8326e6cb7e32fb5a839` |
| Final source | `6d32e5ab2b4536f6c51cf339387e772fc9249cd61065322fa99237d1f50dfc24` | `7f78cb100dd5f46ec583226864f5f96f71c642fc4aa06f588354deeb0038df83` |

The frozen timing candidate precedes deletion of the unused native range overload
and relocation/renaming of the cold error helper. Rebuilding after deletion
produces byte-identical Wasm and glue. Removing the helper definition and
normalizing only its name makes both final ESM/CommonJS bundles exactly match the
measured ones. The artifact table uses the final source; the frozen candidate's
ESM raw/min/gzip/Brotli sizes were 157,301/128,233/45,766/37,624 bytes, and CommonJS
sizes were 157,456/129,211/45,852/37,639 bytes. Final tests and default three-run
benchmark reports are regenerated from the final source.

## Validation and reproduction

- 273 Vitest tests pass; TypeScript coverage is 100% statements, branches,
  functions and lines (455 statements, 292 branches, 34 functions, 407 lines).
- Both TypeScript checks pass.
- Prettier, clang-format and whitespace checks pass; TypeDoc is regenerated.
- 112 compatibility checks pass across Node ESM/CommonJS, Bun, Deno, Edge,
  workerd, Chromium and WebKit. Firefox is excluded locally, not removed from CI.
- Existing DM, convergence and unanimous-ACK mask-removal expectations are
  unchanged. One native-error test covers the new range export; a shared
  17,000-root snapshot case checks the larger concat batch on every runtime.
- The public snapshot/model comparison checks all 192 pairs outside timing.

Commands used from the repository root:

```powershell
npm run build
npm run typecheck
npm run typecheck:runtime
node scripts/run-tests.ts vitest --coverage
node scripts/run-tests.ts compatibility --test-skip-pattern=firefox
node temp/optimization_2026_11_11/full.mjs original,baseline,final 5 final
node --expose-gc temp/optimization_2026_11_11/read-guard.mjs final
node --expose-gc temp/optimization_2026_11_11/read-repeat.mjs final
node --expose-gc temp/optimization_2026_11_11/replication-guard.mjs
node --expose-gc temp/optimization_2026_11_11/lifetime-guard.mjs final
node --expose-gc temp/optimization_2026_11_11/tuple-guard.mjs
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_11/baseline-workspace/src temp/optimization_2026_11_11/baseline-memory.json temp/optimization_2026_11_11/baseline-workspace/dist
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_11/final-workspace/src temp/optimization_2026_11_11/final-memory.json temp/optimization_2026_11_11/final-workspace/dist
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_11/current-workspace/src temp/optimization_2026_11_11/current-memory.json temp/optimization_2026_11_11/current-workspace/dist
node temp/optimization_2026_11_11/verify-cleanup.mjs
node --expose-gc benchmark/index.ts
node --expose-gc benchmark/tuple/index.ts
```

The ignored round directory retains frozen source/build workspaces, raw samples,
profiles and controllers. The full controller runs each workspace's unchanged
main and tuple benchmark serially with `--runs 1`, alternates variant order, and
supplies the five matching `editing-pair-N` workload seeds. Only the temporary
factory's crypto seed is fixed: primary `0x13579bdf`, peer `0x2468ace1`. Normal
README reports use the repository defaults and three independent runs. Every
comparison value needed for review is preserved in the linked Markdown reports.
