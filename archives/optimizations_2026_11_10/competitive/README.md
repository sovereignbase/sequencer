# Smaller runtime state and endpoint lookup

Baseline: `e13815837934e5a6814fa7744ffbcaac7526a9e6`. Measurements started on
10 November and verification continued on 11 November 2026. Node 24.16.0,
V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U.
Emscripten 7.0.0, CMake 4.4.5, Release/LTO, SIMD, bulk memory and Wasm exceptions.
Compiler flags and repository workloads are unchanged.

## Changes

- Store materialization flags in existing Insertion padding. The record remains
  36 bytes; the Strip arena falls from 86 to 84 bytes per capacity slot. Two
  flag pointers and two growth copies disappear.
- Remove the cross-call jump-boundary fields. Jump repair uses the linked
  predecessor; its cached left boundary had no remaining consumer. Subtree
  traversal needs the right boundary only while its own indexed span is active,
  so that endpoint is now local to the walk. Position lookup no longer maintains
  the discarded state. This removes another eight bytes from each Projection.
- Resolve an intact visible head directly when its insertion boundary is already
  known. Hidden removal boundaries retain their existing selection rules.
- Resolve a Frame inside the known visible tail directly. Its first insertion
  boundary retains the existing hidden-history resolution.
- Share numeric result readers instead of constructing closures for each native
  result. Keep the direct one-span slice in the return path for short reads.
- Expose structural words as `ReadonlyArray<number>` and remove `U32List`.
  The type-only change emitted byte-identical JavaScript; existing unknown-input
  typed-array compatibility remains unchanged.

No snapshot word, Gossip coordinate, Acknowledgement, compaction rule or Footage
ownership rule changes. Hot traversal fields remain in separate SoA lanes.
Normalized TypeScript/C++ source falls from 184,212 to 182,310 bytes;
nonblank source lines change from 4,441 to 4,400, including comments.

## Prepend

Twelve counterbalanced measured rounds after four warmup rounds. All builds first
construct the same mixed two-peer history; its snapshots and values must agree.
Independent named callers measure the distributed ESM. A second byte-identical
baseline is the A/A control. Fixture creation, JS process garbage collection,
result checks and destruction are outside timing. Mixed fixtures contain 100
or 20,000 authored groups of 32 Frames plus replicated replacements.

Values below are median (IQR), in ns. Read-plus-prepend rows time both API calls.

| Groups | Work               |            Baseline |         A/A control |           Candidate |  Change |
| -----: | ------------------ | ------------------: | ------------------: | ------------------: | ------: |
|    100 | prepend            |      282.45 (35.81) |       252.5 (35.12) |      208.42 (56.12) | -26.21% |
|    100 | readTail+prepend   |      366.43 (46.09) |      395.13 (80.73) |      241.69 (67.06) | -34.04% |
|    100 | readRandom+prepend |    2,177.3 (343.67) |   1,920.86 (275.38) |   1,319.62 (186.94) | -39.39% |
| 20,000 | prepend            |     526.05 (215.96) |      472.2 (223.74) |      393.2 (489.83) | -25.25% |
| 20,000 | readTail+prepend   |     670.14 (620.45) |     672.94 (281.78) |     631.32 (339.04) |  -5.79% |
| 20,000 | readRandom+prepend | 4,704.08 (1,211.21) | 4,582.51 (2,049.99) | 3,272.86 (1,616.52) | -30.42% |

An earlier guard warmed only the baseline with the fixture-building history and
showed large differences between two identical baseline builds. Those observations
are retained locally but are not used as performance evidence. The table above
uses equal fixture construction and warmup for every build.

## Many live Projections

Three runs at 1,000 and 10,000 simultaneously live instances, one Wasm runtime per
sample and no peer. Medians below use 10,000 instances. Native numbers are live
allocator usage, including overhead and the amortized handle table. JavaScript
heap deltas follow explicit JS process garbage collection and include numeric
Footage. The instance container is excluded. Shared reserved Wasm capacity is not
added to live allocation, and these are not process RSS measurements.

| Shape     | Native B/instance before → after | JS heap B/instance before → after | Combined KiB/instance before → after |
| --------- | -------------------------------: | --------------------------------: | -----------------------------------: |
| empty     |                  278.55 → 262.56 |                   241.12 → 241.27 |                          0.51 → 0.49 |
| single    |                  558.56 → 542.56 |                   445.79 → 446.18 |                          0.98 → 0.97 |
| sequence8 |                  558.56 → 542.56 |                    417.87 → 420.4 |                          0.95 → 0.94 |
| tuple8    |              1,406.62 → 1,390.66 |                   422.48 → 421.85 |                          1.79 → 1.77 |
| edited8   |              3,593.79 → 3,511.93 |               1,123.01 → 1,123.19 |                          4.61 → 4.53 |

## Artifacts

The same Terser three-pass settings, gzip level 9 and Node Brotli defaults are
used before and after. Byte counts include the inline Wasm module.

| Artifact  | Encoding    | Before B | After B | Difference B | Change |
| --------- | ----------- | -------: | ------: | -----------: | -----: |
| index.js  | rawBytes    |  159,827 | 159,218 |         -609 | -0.38% |
| index.js  | minBytes    |  130,538 | 129,979 |         -559 | -0.43% |
| index.js  | gzipBytes   |   46,273 |  45,957 |         -316 | -0.68% |
| index.js  | brotliBytes |   37,773 |  37,490 |         -283 | -0.75% |
| index.cjs | rawBytes    |  159,970 | 159,369 |         -601 | -0.38% |
| index.cjs | minBytes    |  131,599 | 131,141 |         -458 | -0.35% |
| index.cjs | gzipBytes   |   46,359 |  46,050 |         -309 | -0.67% |
| index.cjs | brotliBytes |   37,839 |  37,641 |         -198 | -0.52% |
| wasm      | rawBytes    |   95,831 |  95,249 |         -582 | -0.61% |
| wasm      | gzipBytes   |   38,502 |  38,199 |         -303 | -0.79% |
| wasm      | brotliBytes |   31,347 |  30,992 |         -355 | -1.13% |

## Complete comparisons

The [focused measurements](measurements.md) include the endpoint, reader,
replication and lifetime guards, their A/A controls and unresolved costs.
The [complete API comparison](performance.md) includes all 424 timing rows and
96 memory/storage rows from five matched input seeds, with medians, IQRs,
absolute differences and per-input paired percentage changes. Both builds use
fixed native Session seeds inside temporary measurement copies; the repository's
benchmark source is unchanged apart from the erased word type annotation.

The final endpoint candidate reuses the five unchanged baseline runs captured
interleaved with the preceding candidate. Five complete final candidate runs use
the same compiler, build, inputs and measurement settings. Counterbalanced public
ESM guards separately investigate the apparent regressions.

External workloads and competitors were not rerun. Their supplied results identify
optimization targets; no new first/second-place ranking is claimed. The earlier
JSON-runner timings are not mixed into this comparison.

The [rejected traversal indices](../traversal_attempts.md) explain why tree
variants are absent from the retained code. Extracting the one-span reader into
a shared function also produced substantial short-range regressions; the final
version keeps that slice directly in the result path.

## Verification

The existing 272 tests retain all expectations and 100% TypeScript statement,
branch, function and line coverage. An additional public-API comparison checks
192 exact snapshots across four Session seeds, append/prepend/random/mixed edits,
ACK exchange and reconstruction; final values and scalar reads match the array
model. The canonical snapshots and encoded representation remain unchanged.
Both TypeScript checks and 104 compatibility checks pass; Firefox is excluded
from this local run. TypeDoc is regenerated. C++ documentation generation stops
on existing undocumented parameter/return signatures; details are in the
[verification notes](measurements.md#validation-and-generated-reports).

Raw reports, frozen builds, profiles and reproduction controllers are retained
locally in `temp/optimization_2026_11_10_competitive/`. Main files are
`endreaders-*-matched-pair*.json`, `endreaders-prepend-guard.json`,
`endreaders-shapes.json` and `endreaders-memory.json`.

Reproduction uses the normal public API and existing commands:

```powershell
npm run build
npm run test:vitest
node --expose-gc benchmark/index.ts
node --expose-gc benchmark/tuple/index.ts
node --expose-gc archives/optimizations_2026_11_10/memory.ts src temp/allocation.json dist
```

## Generated code

No new SIMD, ILP or MLP transformation is claimed. Removing state, copies and
branches removes the work rather than vectorizing it. Dependent Strip walks
retain their existing jump algorithm; they do not become independent memory
streams. The final Wasm inspection and artifact hashes are recorded below.

Binaryen `wasm-dis` inspects both extracted modules. The symbol maps identify
`find_frame` as function 19, `subtree_end` as 38 and `Strips::reserve` as 71
in both builds. With five imported functions, their disassembly labels are
`$14`, `$33` and `$66`. The following counts are static instruction occurrences
in each emitted function body, not executed instructions per call.

| Function        | i32.load before → after | i32.store before → after | memory.copy before → after |
| --------------- | ----------------------: | -----------------------: | -------------------------: |
| find_frame      |               135 → 126 |                  51 → 48 |                      0 → 0 |
| subtree_end     |                 82 → 80 |                  53 → 45 |                      0 → 0 |
| Strips::reserve |                   7 → 5 |                  30 → 29 |                    15 → 13 |

`find_frame` contains a tail-range check and early return before the general
walk, using scalar integer loads/arithmetic and the existing gate updates.
`Strips::reserve` multiplies capacity by 84 instead of 86 and emits 13 copies
instead of 15: one identity copy and twelve word-lane copies. The removed
cross-call state no longer requires the previous loads/stores. The smaller
native binary confirms that the endpoint paths do not offset the removed code.

```powershell
wasm-dis baseline-memory.wasm -o baseline-final.wat
wasm-dis endreaders-memory.wasm -o endreaders-final.wat
```

- Wasm SHA-256: `3cc2f17cded2cc49df386a4504a05da0e2732eeaf8d2a447d1feb81de43b3724`.
- ESM SHA-256: `0d7276d76d6e8378b623d1ce9cf033a7877b4e02f2c4b5e0d8703057835e2d09`.
