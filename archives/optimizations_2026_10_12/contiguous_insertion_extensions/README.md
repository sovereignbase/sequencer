# Contiguous insertion extensions: rejected experiment

Baseline: `53cc499` (`chore: decide on what to do next`).

The six-word suffix identifies a continuation by a positive diff, matching
insertion/anchor Sessions, and `start == anchorStart + anchorDiff`. Local insert
consumes the preceding reserved endpoint and advances the increasing clock by
only the new Frame count. Endpoint descendants precede the continuation, as they
would inside an insertion originally authored with the larger diff.

The experiment kept one canonical insertion, reused its contiguous tail fragment,
and appended Footage to a private JavaScript array. Shared snapshots trigger a
copy before subsequent append. Content values never enter WebAssembly. Native
numeric append directives only move JS-owned content references. No public word,
extension boundary list, worker, or SharedArrayBuffer was added.

## Decision and correctness

**Rejected. Do not use this patch as a completed runtime change.**

Ten focused public API tests passed: same-session append, previous snapshots,
out-of-order delivery, duplicates, endpoint competitors, prefix merge, fragmented
roots, mask concurrency, compaction/hydration, and batched consumer splices.
Existing generative tests exposed stale traversal gates and mask splice positions;
the minimized reproductions were corrected, but the final candidate was not
accepted or fully verified because of the independent compaction counterexample.
No tests or expectations were weakened.

The current Sequence compaction rewrites the positive diff to the number of
surviving Frames. This loses the root's original logical clock extent:

1. Root `[0,0,0,100,0,2]` with `['a','b']`.
2. Suffix `[100,0,2,100,2,2]` with `['c','d']`.
3. Remove `a`, acknowledge, and export.
4. Snapshot contains `[0,0,0,100,0,3]` with `['b','c','d']`.
5. Replaying the suffix incorrectly adds another `d`.
6. Alternatively, the next suffix `[100,0,4,100,4,1]` with `['e']` stays pending
   indefinitely because the receiver only knows an extent of 3.

Ignoring partially overlapping suffixes would address step 5 but would not fix
step 6. These cases reject the coordinate formation tested here; they do not prove that
the requested six-word representation is impossible. In particular, a suffix
anchored at 3 with insertion start 4 is different from this experiment's suffix
anchored at 4 with insertion start 4. The anchor diff and insertion start must not
be conflated. The experiment did not establish the final algebra between clock
reservation, anchor offsets, and compaction. No seventh word or operation-boundary
list has been justified.

`reproduce.mjs` runs both counterexamples through the candidate public API.
`experiment.patch` preserves the source experiment and focused tests; generated
WASM is intentionally omitted. Apply only to an isolated checkout of the baseline
and run `npm run build` to investigate it.

## Measurements (rejected candidate, not production performance)

Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel i5-10210U.
Emscripten 5.0.7, Release, -O3, LTO, SIMD, bulk memory, synchronous single-file WASM.

Fresh full lifecycle and throughput baseline: 3 runs, strip counts 100/1,000/10,000.
A complete candidate suite comparison was not
performed after correctness failed; no claim of regression-free performance is
made. Compression and clock randomness affect serialized byte counts; targeted
baseline/candidate timing distributions also include cold compilation and warmup.

The five-sample targeted workload appends 6,000 one-Frame Insertions, applies their
Gossip to another Projection, exports/hydrates the Sequence, performs 6,000 indexed
reads, and materializes all values 100 times. Apply includes structuredClone and
is not a measurement of native apply alone. Medians in milliseconds:

| Operation | Baseline | Rejected candidate |
| --------- | -------: | -----------------: |
| insert    |  22.0354 |             6.8339 |
| apply     | 136.1739 |            37.9291 |
| sequence  |   7.8948 |             0.0088 |
| create    |   13.331 |             0.0577 |
| read      |  10.2716 |             0.4287 |
| values    |  72.6722 |             7.3506 |

The retained insertion count fell from 6,000 to 1 in this append-only workload.
Snapshot JSON fell from 240,886–276,883 bytes to 24,035–24,036 bytes.
This supports continuing investigation of the representation, not accepting an
incorrect implementation.

Bundle bytes (same build/compression):

| Artifact | Baseline | Rejected candidate |     Difference |
| -------- | -------: | -----------------: | -------------: |
| ESM raw  |   109835 |             114950 | +5115 (+4.66%) |
| gzip     |    37330 |              38322 |  +992 (+2.66%) |
| Brotli   |    31252 |              32034 |  +782 (+2.50%) |

No measured heap claim is made. The common append path removes per-operation
arena nodes, containment inserts, and linked traversal. Its primary improvement
is algorithmic. No SIMD, ILP, or MLP transformation is claimed: one root/fragment
makes those walks unnecessary. Fragment propagation still follows a dependent
chain; footage append is scalar reference movement in JS. Final-WASM inspection
and full-suite candidate acceptance were stopped after the convergence failure.

Commands:

```powershell
node --expose-gc benchmark/index.ts --runs 3 --max-strips 10000 --output temp/strip-runs/baseline.json
node --expose-gc temp/strip-runs/measure.mjs temp/strip-runs/baseline-dist/index.js temp/strip-runs/target-baseline.json
node --expose-gc temp/strip-runs/measure.mjs dist/index.js temp/strip-runs/target-candidate.json
npx vitest run --coverage.enabled=false
```

All failed-suite logs and minimized traversal reproductions remain in
`temp/strip-runs`. The experimental changes were restored to the baseline after
recording these findings.
