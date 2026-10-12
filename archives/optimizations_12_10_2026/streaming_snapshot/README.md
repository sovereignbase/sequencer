# Streaming snapshots and result allocation

## Measured outcome

The two warmed process pairs compare six runs per variant. Of 161 rows with
actual calls, 157 have lower median time. Four lifecycle rows have no calls and
are excluded from this count. All 18 apply rows improve except `apply.remove`
at the smallest checkpoint: +18.3%, with overlapping, widely dispersed samples.
[The final comparison](performance.md) preserves all median rows and IQR widths. This does not establish
that every method and document shape improved.

The final three isolated targeted pairs expose remaining read/create regressions,
particularly for two communicating actors. The targeted tables below retain these
unfavorable results remain part of the outcome. The target of improving every
method on every shape is still open. No overall “finished” performance claim is
made from the favorable full-suite rows alone.

For the same 6,000-operation documents, the storage results are deterministic:

| Document                     | 0.0.1 JSON bytes | Compact JSON bytes | Change |
| ---------------------------- | ---------------: | -----------------: | -----: |
| Append characters            |           24,031 |             24,031 |     0% |
| Prepend characters           |          240,884 |             77,157 | −68.0% |
| Random characters            |          239,216 |            100,738 | −57.9% |
| Random eight-character words |          415,334 |            298,913 | −28.0% |
| Mixed edits, retained masks  |          296,128 |            205,293 | −30.7% |
| Mixed edits, compaction      |           95,898 |             40,374 | −57.9% |
| Two communicating actors     |          236,835 |            166,994 | −29.5% |

Post-GC snapshot heap medians decrease approximately 15–60% in the non-append
scenarios. Heap deltas include runtime allocation and Footage behavior; they
are not proof of the same reduction in all live native document state.
The tables below include gzip, Brotli, V8 sizes and timing medians. The ESM grows
from 117,880 to 120,899 bytes; gzip grows from 39,268 to 39,754 bytes.

Baseline: npm 0.0.1, byte-identical to the ESM retained at
`../apply_pipeline/baseline/index.js`. Insertion extensions and the flat
`[words, footage]` snapshot are already present in that baseline.

The snapshot writer omits predictable fields while traversing native state.
The public snapshot remains two arrays. Generic Footage and ACKs remain included;
Gossip keeps its six-word coordinates. The first 63 retained records are promoted
once at the 64th record. Small surviving snapshots keep the plain representation.
See `../../../src/c++/auxiliary/snapshotWords.md` for the exact numeric format.

Export no longer allocates an insertion visitation hash node per root. Positive
canonical nodes are recognized by the existing offset flag; negative canonical
nodes with consumed prefixes are recognized through containment. Compaction,
anchor adjustment and live traversal retain their existing rules.

Native apply appends directly into the retained Result and stores each splice's
single span inline. Values reuses its native span vector. The JS result handler
avoids unrelated helpers for empty results and simple reads. Whole-binding cleanup
does not write array lengths on ordinary local mutations or reads.

Arena and containment initially allocate eight slots instead of 64. The arena's
slot width remains 86 bytes and the containment slot width 12 bytes. The initial
arena drops from 5,504 to 688 bytes; the first containment allocation drops from
768 to 96 bytes. This is a small-document saving, not a smaller per-slot layout for
large documents. WASM still uses ordinary synchronous memory.

`measure.mjs` authors 6,000 edits for append, prepend, random characters, random
eight-character words, mixed insert/remove/replace, mixed edits with compaction,
and two communicating actors. It measures the actual public API, validates JSON
and typed snapshot hydration, then checks future Gossip replay. Snapshot heap is
post-GC process heap delta, and WASM memory is allocated memory capacity. Neither
is an allocator-live-byte measurement. The append delta can be negative because
export replaces an overallocated private Footage array with a packed array.

The final measurements include inline Splices, the reusable values buffer and
conditional binding cleanup. Preliminary results are excluded from the final
comparison; their raw files and repeated per-process reports have been removed.

The complete suite has 165 compared rows: 48 lifecycle rows and 117 throughput
rows, covering all 39 throughput cases at three sizes. The initial three isolated
process pairs have two runs per process, fixed entropy, 2,048 calls and a disabled
time cutoff. Those preliminary process pairs are not the final comparison.
The later warmed comparison uses three runs, 8,192 calls, 2,048 warmup calls, and
the same disabled time cutoff. It is a steady-state diagnostic with explicitly
different dimensions, not the default 100 ms CLI workload.

Validation: 170 public-API Vitest tests pass, including compaction, overlapping
removals, reverse delivery, generative convergence, large uint32 coordinates,
JSON/typed hydration, omitted Footage and later replay. Both TypeScript checks
pass. Available compatibility environments pass 88 checks; Firefox is unavailable
because the Playwright installer cannot find the executable after extraction.
The 100% coverage gate also fails on the unchanged baseline (95.25% statements,
94.09% branches, 96.77% lines); it is tracked separately from test assertions.

Compact snapshots require the new reader. Plain snapshots from 0.0.1 remain
accepted. Gossip interoperability and public method signatures remain unchanged.

```powershell
node --expose-gc archives/optimizations_12_10_2026/streaming_snapshot/measure.mjs dist/index.js target.json 6000
node --expose-gc --import ./archives/optimizations_12_10_2026/sequence_indices/seed.mjs benchmark/index.ts --runs 3 --max-calls 8192 --warmup-cycles 2048 --burst-ms 100000 --output suite.json
```

## Targeted document measurements

Three isolated process pairs, 6,000 authored operations per document shape.
Reported values are medians. Timings below are per public call in µs;
positive changes are regressions. Document generation, GC and serialization are untimed.

| Document | Operation | 0.0.1 µs | 0.0.2 µs | Change |
| --- | --- | ---: | ---: | ---: |
| Append | `length` | 0.084 | 0.085 | +1.5% |
| Append | `value` | 0.120 | 0.160 | +33.0% |
| Append | `values` | 15.403 | 19.736 | +28.1% |
| Append | `sequence` | 5.475 | 7.300 | +33.3% |
| Append | `create` | 14.935 | 15.080 | +1.0% |
| Append | `merge` | 12.415 | 11.960 | -3.7% |
| Prepend | `length` | 0.094 | 0.088 | -6.8% |
| Prepend | `value` | 1.290 | 1.292 | +0.2% |
| Prepend | `values` | 409.870 | 558.663 | +36.3% |
| Prepend | `sequence` | 3293.180 | 1698.510 | -48.4% |
| Prepend | `create` | 2170.400 | 2116.770 | -2.5% |
| Prepend | `merge` | 2653.230 | 1304.630 | -50.8% |
| Random characters | `length` | 0.072 | 0.080 | +10.3% |
| Random characters | `value` | 1.561 | 1.753 | +12.3% |
| Random characters | `values` | 517.967 | 577.141 | +11.4% |
| Random characters | `sequence` | 3346.000 | 1811.325 | -45.9% |
| Random characters | `create` | 2869.035 | 3561.465 | +24.1% |
| Random characters | `merge` | 2527.420 | 1729.530 | -31.6% |
| Random words | `length` | 0.070 | 0.069 | -1.0% |
| Random words | `value` | 1.593 | 1.576 | -1.1% |
| Random words | `values` | 1296.580 | 1393.388 | +7.5% |
| Random words | `sequence` | 3196.325 | 3210.090 | +0.4% |
| Random words | `create` | 3235.775 | 2694.905 | -16.7% |
| Random words | `merge` | 2529.365 | 1634.820 | -35.4% |
| Mixed edits, retained masks | `length` | 0.064 | 0.063 | -1.7% |
| Mixed edits, retained masks | `value` | 1.791 | 1.752 | -2.2% |
| Mixed edits, retained masks | `values` | 329.504 | 316.203 | -4.0% |
| Mixed edits, retained masks | `sequence` | 3574.250 | 2221.465 | -37.8% |
| Mixed edits, retained masks | `create` | 4338.210 | 5066.775 | +16.8% |
| Mixed edits, retained masks | `merge` | 3565.810 | 3622.130 | +1.6% |
| Mixed edits, compaction | `length` | 0.055 | 0.065 | +18.5% |
| Mixed edits, compaction | `value` | 1.811 | 1.864 | +2.9% |
| Mixed edits, compaction | `values` | 357.667 | 358.677 | +0.3% |
| Mixed edits, compaction | `sequence` | 2668.460 | 2227.270 | -16.5% |
| Mixed edits, compaction | `create` | 1107.050 | 1186.170 | +7.1% |
| Mixed edits, compaction | `merge` | 1433.830 | 661.120 | -53.9% |
| Two actors | `length` | 0.081 | 0.092 | +13.8% |
| Two actors | `value` | 1.566 | 2.733 | +74.4% |
| Two actors | `values` | 484.499 | 793.994 | +63.9% |
| Two actors | `sequence` | 3116.565 | 2572.995 | -17.4% |
| Two actors | `create` | 2941.245 | 4211.760 | +43.2% |
| Two actors | `merge` | 2402.725 | 2249.615 | -6.4% |

| Document | gzip bytes, before → after | Brotli bytes, before → after | V8 bytes, before → after | Snapshot heap bytes, before → after |
| --- | ---: | ---: | ---: | ---: |
| Append | 87 → 87 | 49 → 49 | 18,055 → 18,055 | -5,960 → -4,984 |
| Prepend | 29,794 → 16,960 | 11,969 → 18,044 | 289,513 → 93,746 | 338,976 → 135,736 |
| Random characters | 31,265 → 33,166 | 22,639 → 31,307 | 323,693 → 119,496 | 338,928 → 179,792 |
| Random words | 39,051 → 40,437 | 26,606 → 34,806 | 456,202 → 300,920 | 680,096 → 580,336 |
| Mixed edits, retained masks | 43,903 → 49,007 | 32,747 → 41,967 | 382,478 → 267,297 | 387,200 → 325,552 |
| Mixed edits, compaction | 12,943 → 14,427 | 8,699 → 13,304 | 124,587 → 44,289 | 135,360 → 66,920 |
| Two actors | 30,972 → 36,558 | 24,297 → 32,643 | 285,578 → 213,719 | 317,496 → 238,120 |

Snapshot heap is post-GC process heap delta, not native live bytes. A negative
append delta can result from replacing an overallocated Footage array during export.

[All final public-API medians and IQR widths](performance.md) are retained as one
comparison instead of separate reports for each process.
