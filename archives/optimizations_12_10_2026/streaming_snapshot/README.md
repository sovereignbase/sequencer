# Streaming snapshots and result allocation

## Measured outcome

The two warmed process pairs compare six runs per variant. Of 161 rows with
actual calls, 157 have lower median time. Four lifecycle rows have no calls and
are excluded from this count. All 18 apply rows improve except `apply.remove`
at the smallest checkpoint: +18.3%, with overlapping, widely dispersed samples.
`acceptance-diff.json` preserves every sample and IQR. This does not establish
that every method and document shape improved.

The final three isolated targeted pairs expose remaining read/create regressions,
particularly for two communicating actors. See `final-comparison.json`; these
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
The complete gzip/Brotli/V8 sizes and timing distributions are in
`final-comparison.json`. The ESM grows from 117,880 to 120,899 bytes; gzip grows
from 39,268 to 39,754 bytes. These costs are retained in `artifact-sizes.json`.

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

`paired-*` and `target-comparison.json` retain the earlier representation and
result-handler measurements. `final-current-target.*` records the later inline
splice, reusable values buffer and conditional binding cleanup. Final repeated
measurements use an explicit `final-*` prefix. No intermediate result is silently
replaced by a favorable run.

The complete suite has 165 compared rows: 48 lifecycle rows and 117 throughput
rows, covering all 39 throughput cases at three sizes. The initial three isolated
process pairs have two runs per process, fixed entropy, 2,048 calls and a disabled
time cutoff. `suite-*` and `suite-diff.json` preserve those rows and distributions.
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
