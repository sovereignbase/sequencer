# Large UTF-16 Footage

Baseline: `d8816d7`, version 1.2.6. The three fresh complete baseline runs include
lifecycle, throughput and tuples, with unchanged production workloads. Frozen
sources and raw reports are under `temp/optimization_2026_11_19/baseline*`.

The [November 20 checkpoint](details.zip 'checkpoint.md') records the final selected build,
complete five-pair comparison, rejected follow-up optimizations and residual
regressions. The universal 10% latency target remains unmet; the checkpoint
retains the measured large-text gains without the rejected experiments.

The external 6,000-character comparison reports 21 ms for bulk string insertion
versus yjs at 3 ms, 15 ms for bulk insertion/deletion versus ywasm at 4 ms, and
15 ms for concurrent bulk insertion versus yjs/ywasm at 1 ms. These are historical
results read from `crdt-benchmarks/ANALYSIS.md`, not measurements of this change.
That adapter splits insertion/replacement text and joins visible arrays. It is
unchanged by this investigation.

## Hypothesis

Retain immutable string Footage, concatenate native spans for text reads and
export, and materialize UTF-16 arrays only when requested. Numeric replication
coordinates and ordering remain native. Large text avoids a character-slot array
on insertion, hydration, text replication and text reads. Array APIs retain their
default result types; optional text Splices and reads use an explicit flag.

Immutable Footage also avoids copy-on-write when masking a small range. One bit
in the existing Insertion flags identifies immutable text; the wasm32 Insertion
remains 36 B. Native positive fragments identify masked snapshot gaps, which are
emitted as missing spans. No JavaScript mask map or pending structure is added.
Mixed array suffixes materialize an array and restore any previously masked
slots. Footage values never enter Wasm memory.

## Verification and measurements

The latest implementation passes all 303 tests with 100% TypeScript coverage
and the test-project typecheck. The packaged API passes 120 local compatibility
checks across Node ESM/CJS, Bun, Deno, Edge, workerd, Chromium and WebKit.
Firefox is excluded from this local run; its CI entry remains enabled. New checks include exact array/text snapshot
equivalence after deterministic edits, incomplete acknowledgements, UTF-16
surrogates and NUL, tuple versions, reordered replay and safe binding updates
after an encoding failure. Existing expectations are unchanged.

The dedicated `benchmark/text` suite measures large insertion/replacement,
whole and partial removal, replication, hydration, indexed/range reads and both
snapshot formats. It retains default array-result replay separately, so the
cost of explicitly materializing character arrays is visible. The final
[large-string results](details.zip 'large-context.md') and [complete public-API comparison](details.zip 'final-performance.md')
retain every timing, including slower results.

The target is lower latency and retained memory. The initial slowdown limit was
5%; the continuation on November 20 permits up to 10%. Bundle size is not an
acceptance criterion. Earlier tables retain their original thresholds.

Snapshot hydration keeps its existing split-by-default behavior. The fourth
constructor argument enables string retention; `merge(snapshot, true)` retains
strings and requests string Splices. This avoids adding deferred conversion work
to existing applications that read arrays. Direct string input remains immutable
regardless of the snapshot setting.

The [five-pair large-string comparison](details.zip 'large-opt-in.md') uses separate fresh
processes for array and string representations. Both builds execute the same
benchmark with the same sizes, warmup and operation counts. Earlier mixed-mode
runs gave the candidate twice as many runtime-factory resets as the baseline;
the separate-process comparison controls this difference without changing timed
work. Earlier samples remain documented rather than being discarded.

String-to-array output conversion is intentional work on the new string path.
For example, default `apply()` materializes character slots for string Gossip,
where array Gossip can return its existing array directly. The table includes
these costs. Use `apply(gossip, true)` for text Splices and
`values(undefined, undefined, true)` for text output; the no-regression guard
compares the existing array API against the same existing array API.

## Initial guard and follow-ups

The [initial complete guard](details.zip 'initial-complete-performance.md'), three matched pairs,
has 40 of 409 non-length median timings over 5% faster and 132 over 5% slower.
It is not accepted. All 96 native-memory and encoded-size rows match. Source
freezes `native-only` and `js-only` isolate native and JS changes for ordinary
array inputs; they are diagnostics, not alternative public implementations.
Their [48-row comparison](details.zip 'isolate.md') also retains an identical-code control.

The [input/flag follow-up](details.zip 'refine.md') measures baseline, identical control,
original candidate, cached input Footage and relocated native text flags.
Caching input Footage has no every-pair slowdown over 5% in its three-pair
comparison; moving the flag has six. The relocation is reverted. This does
not replace the complete-suite guard.

CPU sampling of 65,536-code-unit array replay found work in JS input application,
native application and Splice assembly, rather than a native character scan.
Baseline samples attributed 34% of sampled apply stacks to the JS apply body,
25% to native apply and 14% to result assembly; the pre-opt-in build gave 34%,
25% and 17%. These are sample proportions, not latency comparisons. The earlier
large replay difference was not evidence of a 56% native slowdown.

Text snapshot compaction now appends retained ranges rather than calling the
span writer for every retained code unit. The ordinary array prefix loop is
unchanged; only the text range path calls `append_text_spans`.

The [five-pair Splice follow-up](details.zip 'splices.md') rejects extracting Splice collection
into a helper: its 15,000-Strip duplicate apply is +6.72% in every pair. The
parent has no every-pair slowdown over 5% in that selected comparison (nine
medians improve over 5%, three worsen over 5%). The helper is absent from the
retained candidate. This subset still does not establish complete acceptance.

The [opt-in complete guard](details.zip 'complete-performance.md') has 104 of 409 non-length
median timings above +5% against the primary baseline and 68 against its
unchanged control. Baseline versus control itself has 101 such medians, including
one every-pair loss, so a single positive median is not accepted as proof of a
runtime regression. The [longer-warmup control](details.zip 'steady.md') and
[interleaved control](details.zip 'interleaved.md') retain every selected measurement.

Extracting JS text append into a helper was [inconclusive](details.zip 'append-steady.md') and
is reverted. Native insertion sampling instead found 33–34% in anchor placement
and 25–30% in `Projection::insert`, with little JS time in this case. Inspecting
the final Wasm showed that initializing a dynamic string flag in the aggregate
removed several SIMD metadata loads/stores. Zero-initializing before allocation
and setting the bit on the allocated text identity restores that lowering.
The immutable-text metadata still fits the original 36-byte Insertion.

The JS append helper remains absent. Moving a string check within the snapshot
sharing condition was inconclusive. Shared-array eligibility is now decided in
the native result: immutable text receives no mutable Footage-state pointer.
The JS array-sharing condition is again identical to its original form. Tuple
Versions retain the text marker in their trailing padding byte and remain 40 B;
one-slot local, replayed and hydrated string snapshots exercise this contract.

Returning early from generic snapshot handling and extracting a dedicated JS
snapshot reader did not establish a stable gain; both are reverted. Small
snapshot profiles put about 40–47% of samples in JS result assembly. Bytecode
inspection then identified the native-error method lookup's callback capturing
the operation: V8 created a function context on entry, including successful
calls. Replacing that callback with a failure-only property loop removes the
context creation, reduces `readResult` bytecode from 2,554 to 2,508 bytes and
keeps the existing error messages. The latest
[27-row interleaved control](details.zip 'context-interleaved.md') puts the small snapshot
median at +0.76%; no selected row is over +5% in every pair. The complete final
guard remains separate.

Build settings are unchanged: Emscripten 7.0.0, LLVM 24, Binaryen 133,
CMake 4.4.5, Release `-O3`, LTO, `-msimd128`, bulk memory and Wasm exceptions.
The text optimization removes character-array construction and copies; it does
not move characters into Wasm. No new character SIMD kernel is claimed. The
fragment cursor is dependent, so no independent memory streams or additional
MLP are assumed. The generated metadata SIMD instructions were inspected in
`text-context.wat`: function 53 retains SIMD metadata loads/stores, while
function 45 contains the outlined dependent span walk. The final raw module is
90,620 bytes; no per-character span-helper call was reintroduced.

## Retained heap after recreation

Three fresh processes per build and shape retain 64 independent Projections.
Each starts with a unique 262,144-code-unit ASCII string, optionally removes
all but a 1,024-code-unit prefix, exports a string snapshot, destroys the
original and hydrates one replacement. Original inputs and snapshots leave
scope before three explicit JS process garbage collections. Values and lengths
are checked. These are medians of JS heap deltas per retained Projection,
excluding native allocations and process RSS.

| Recreated document              | Before JS heap B | After JS heap B |  Change |
| ------------------------------- | ---------------: | --------------: | ------: |
| Full 262,144 code units         |     2,098,652.25 |     263,564.125 | -87.44% |
| Retained 1,024-code-unit prefix |        10,063.25 |       2,658.625 | -73.58% |

The first lazy-string build retained about 263,749 B for the small prefix:
its slice kept the original large backing alive. Short snapshot strings are
now detached when their source exceeds twice their retained length. This is
measured behavior on Node 24.16.0/V8; the diagnostic does not infer the physical
string layout from logical code-unit estimates. The unshrunk fast path retains
its original string without copying. Final raw samples are `retained-final.json`
under the temporary round directory; `retained-text-memory.mjs` is the collector.

## Final regression decision

Five complete matched runs give 67 of 409 non-length timing medians more than
5% faster and 75 more than 5% slower. These raw medians are **not all within 5%**.
All 96 memory/storage rows match. The three every-pair primary losses were
rechecked with unchanged production workloads and timing settings against both
the baseline and its identical-runtime control:

| Case                   | Complete guard | Follow-up / baseline | Identical control / baseline | Follow-up / control |
| ---------------------- | -------------: | -------------------: | ---------------------------: | ------------------: |
| 25,000 / apply.remove  |        +20.74% |               -5.45% |                       +6.76% |             -11.44% |
| 1,000 / insert.middle  |        +12.36% |               +3.40% |                       -0.12% |              +3.52% |
| 100 / values.sameIndex |        +18.07% |               +6.02% |                       +5.54% |              +0.46% |

The [28-row follow-up](details.zip 'final-control.md') has no every-pair slowdown above 5%
against either baseline copy. Medians and paired IQR remain visible. It uses the
original 64-call warmup, 10,000-call cap and 100 ms duration limit. Slower rows
change across independent cohorts, including the unchanged controls; no
repeatable above-5% loss was established for the existing array API.

The new text suite separately flagged the 1,024-code-unit array append batch
at +8.29% in its first five-pair comparison. The [complete small-array control](details.zip 'small-array-control.md')
rechecks all 19 operations with the same workload. Append is +5.77% by the ratio
of medians, +0.05% by the median paired change, with an 11.13-point paired IQR.
It is not slower by 5% in every pair against either baseline copy. This is
retained as an uncertainty, rather than silently dropped or called a speedup.

String-to-array conversions are a different, newly supported representation
choice, not an unchanged-array-API speedup. At 1,048,576 code units, text-mode
indexed reads are +8.82% against prebuilt array input, and explicit array output
is substantially slower because character slots must be created. Text mode is
intended for callers retaining text through edits, replication and snapshots.
The full table reports these costs alongside its bulk improvements.

## Final large-text results

Five fresh process pairs, median API time; repeated ASCII payload. Preparation,
validation, transport encoding and explicit JS process garbage collection are
outside API intervals. The append and concurrent cases force a character read
before timing ends, so their comparisons include rope access.

| 1,048,576 UTF-16 code units               | Before array path | After string path |
| ----------------------------------------- | ----------------: | ----------------: |
| insert, including array split             |          3.630 ms |          0.468 µs |
| apply with matching output representation |          1.193 µs |          0.780 µs |
| four-peer concurrent apply and text read  |         67.067 ms |          1.358 ms |
| create from a string snapshot             |          3.232 ms |          1.058 µs |
| sequence(true), intact root               |         58.848 ms |          0.179 µs |
| estimated retained library memory         |     8,192.406 KiB |     2,048.406 KiB |
| insertion Gossip MessagePack              |     2,048.021 KiB |     1,024.021 KiB |

Snapshot MessagePack/gzip sizes already use string output in both builds and
remain unchanged. New Gossip sizes depend on payloads; repeated ASCII gives
approximately half the encoded bytes. The separate heap experiment above
measures retained JS heap after destruction and recreation, not process RSS.

## November 20 continuation

The accepted slowdown limit is now 10%. Indexed string reads at +8.82% fit this
limit; they are not reported as faster. The unchanged-array API still needs a
complete regression guard.

Further scalar-read experiments were discarded: `String.at`, a `charAt` branch,
an exported heap-view facade, moving the public catch boundary and forcing the
native locator inline did not establish a representative gain. No extra read
cache or per-Projection string-mode state is retained. An inline native cache
prefix passed the correctness suite, but its [five-pair complete comparison](details.zip 'gate-performance.md') had
38 non-length medians above +10%, versus 29 for its parent. It was reverted.

A clock-correlated V8 trace of the 25,000-Strip removal replay found no garbage
collection inside either measured burst. Separate optimization logs show
`readResult`, `apply` and the benchmark call closure tiering during bursts.
This supports investigating warmup sensitivity; it does not establish that
every slower result is noise.

The next candidate checks whether external Footage is a string only after
omitted Footage and arrays have been handled. The [five-pair input-kind control](details.zip 'kind-control.md')
keeps all 28 results, including its slower small range reads. It does not replace
the complete-suite comparison.

The [complete input-kind guard](details.zip 'kind-performance.md') retains 409 non-length
timings: 71 medians improve by more than 5%, 80 slow by more than 5%, and 37
slow by more than 10%. No timing exceeds +10% in every pair. All 96 memory and
encoded-size comparisons remain unchanged. These raw medians do not meet an
all-rows-within-10% claim.

The [warmed throughput follow-up](details.zip 'kind-warm.md') repeats all 27 throughput rows
above +10%, with the same fixtures and measurement limits but 10,000 warmup
calls for every build. Its largest candidate median slowdown is +8.80%; the
identical baseline control reaches +8.74%. The different warmup is explicit,
and paired dispersion remains visible. It diagnoses tiering sensitivity rather
than replacing the original guard.

The [empty-snapshot follow-up](details.zip 'empty-warm.md') measures six repeated public-API
cases. Ordinary empty snapshot creation is -3.74%, sequence -4.26% and values
+1.88%; fixed-tuple results range from -1.34% to +0.53%. Creation includes
destruction in this diagnostic, unlike the lifecycle's individual checkpoint
call. Its result is not substituted into the original table.

The [unchanged-warmup follow-up](details.zip 'kind-default.md') repeats the same 27 throughput
rows with the original 64 warmup calls. This retains a reproducible problem:
10,000 / create.empty is +24.69%, above +10% in all five pairs, while the
identical control is +1.68%. Other candidate medians over +10% include
100 / apply.remove (+19.23%) and 100 / remove.head (+40.66%). The 10% acceptance
criterion is therefore still unmet; the warmed results alone do not resolve it.

Generated-code inspection of `runtime_create` found 759 WAT lines, ten SIMD
operations, forty stores and thirty calls in both builds. After normalizing
function indices and call targets, the bodies are byte-identical. JS `create`
bytecode grows from 270 to 273 bytes, with no new function context or array
allocation; the three extra bytes are on the hydration-only path. A short CPU
sample includes both creation and JS process garbage collection but is too
small to attribute the regression reliably.

The [complete tuple repeat](details.zip 'tuple-final.md') retains all 80 rows. Its five
originally flagged rows range from -4.53% to +26.25%; for the last case,
100-index tuple creation, the identical control also slows +17.53%, leaving
+7.42% relative to that control. Newly flagged eight-index replacements were
rechecked using the existing `--sizes 8` option: [all twenty candidate medians](details.zip 'tuple-eight.md')
are within 10%. The ordinary replacement is -12.58%, static tuple +1.43%.

The [warmed complete lifecycle](details.zip 'lifecycle-warm.md') uses the same 25,000-Strip
growth and shrinkage with 10,000 warmup cycles per build. Original flagged
checkpoint sequence calls become -6.04% at 25,000 Strips and -0.91% at the
1,000-Strip shrinking checkpoint; empty checkpoint calls range from +0.79% to
+6.32%. Three different checkpoint medians exceed +10% in this cohort, and all
rows remain visible. Warmup sensitivity is not a claim that every default
checkpoint median is within the limit.

A [five-pair default-parameter experiment](details.zip 'default-retry.md') restores the old
constructor/function `.length` values by giving the new flags `false` defaults.
Empty creation improves to -3.84% versus baseline in that cohort, but six of
27 timing medians still exceed +10%; the unchanged candidate has three. The
experiment is not retained without a complete guard. Its unchanged candidate
also moves the earlier +24.69% empty-creation result to +8.36%, so the magnitude
is not stable across cohorts. Both source defaults are reverted. The first
attempt stopped because the frozen workspace lacked the newly shared reporting
module; that incomplete round is not treated as a completed comparison.

## Parent artifacts

Same build and Terser configuration: ESM, three compression passes, mangling;
gzip level 9. Bundle growth is recorded but is not an acceptance criterion.

| Artifact                   | Before B | After B |
| -------------------------- | -------: | ------: |
| Raw Wasm                   |   88,909 |  90,620 |
| Wasm with single-file glue |   99,334 | 101,159 |
| ESM bundle                 |  148,640 | 154,662 |
| Minified ESM               |  120,894 | 124,204 |
| Minified ESM gzip          |   43,934 |  45,029 |

The `text-context` ESM artifact is byte-identical to its measured
build: SHA-256 `53f95937c6e3d072a847cd3d88a72d95c8251cd59ba6b792813f381fd9673dda`.
The inline Wasm/glue SHA-256 is
`6e362767bb214423b76839a330ec8c24ebf97ba5f13fb4365e0fe44a0f5ec074`.

The retained `text-kind` input check shares that same Wasm. Rebuilding C++ and
TypeScript reproduces the measured ESM SHA-256
`2d1091e4bea04cb2e5c0687ce617c314bf5ac56ebaa84ed666ed326e07d4f33e`.

## Reproduction

Node 24.16.0, V8 13.6.233.17-node.49, win32 x64,
Intel Core i5-10210U at 1.60 GHz. Five alternating baseline/candidate process pairs
use seeds `editing-pair-0` through `editing-pair-4`. Frozen benchmark factories
use identical primary/peer Session seeds `0x13579bdf` and `0x2468ace1`.
Complete runs use the existing default lifecycle and throughput configuration,
one run per process, plus the tuple suite. The fresh full guard compares
`baseline` and `text-context`; raw outputs are `final-*-pairN.*` under the
round's temporary directory. Large-text raw outputs are `large-context-*`.

```powershell
npm run build
npm run typecheck
node scripts/run-tests.ts vitest --coverage
node scripts/run-tests.ts compatibility '--test-skip-pattern=^firefox$'
node --expose-gc benchmark/index.ts --runs 1 --seed editing-pair-0 --output <path>
node --expose-gc benchmark/tuple/index.ts --runs 1 --output <path>
node --expose-gc benchmark/text/index.ts --runs 5 --output <path>
```

The local browser exclusion is specific to this verification command and does
not change the compatibility matrix. No external competitor benchmark was run
or modified, so no new cross-library ranking is claimed.

## Archived files

[details.zip](details.zip) contains the original reports, source files and measurements
with their original directory structure. `MANIFEST.sha256` records every file hash.
Temporary workspace paths in historical reports identify provenance, not included directories.
