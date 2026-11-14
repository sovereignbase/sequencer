# Direct zero-distance jump merging

Checkpoint: `d3108d5`, frozen as `fixed-table`. The candidate is `direct-zero`.
Decision: rejected. The complete five-pair regression guard and production
follow-up do not establish an all-row improvement. Native source is removed.

Earlier profiling found repeated tail replacement walking almost 100 million
hidden Strips over 10,000 operations. Two consecutive symmetric zero-distance
jumps can be joined without changing visible positions. Previous attempts used
the general `link_jumps` routine; this candidate directly rewires the known
three endpoints, adds structural distances and detaches the middle endpoint.
The zero Frame distances already agree and need no rewriting. Merging remains
limited to the first nonpositive fragment, before secondary-fragment indexing.

A proposed shortcut from the sole surviving visible Strip was not implemented:
the endpoint count alone would not establish that skipped jump invalidations
remain correct. No cache, field, allocation, wire word or Session restriction is
introduced by the actual candidate.

All 276 tests pass with 100% TypeScript coverage. All 192 canonical snapshot and
serialization comparisons match the original baseline. The separate
[concurrent replay diagnostic](direct-zero-concurrent.md) checks eight authors,
ordered/reversed/shuffled delivery and duplicate replay. Its targeted timings
remain mixed and do not substitute for the complete suite.

Three allocation runs with 10,000 live instances per shape give the same native
bytes per instance as the checkpoint: empty 254.55, single 534.55, sequence8
534.55, tuple8 1,054.61 and edited8 3,505.26. No snapshot saving is claimed.

| Artifact                 | Checkpoint bytes | Candidate bytes |
| :----------------------- | ---------------: | --------------: |
| Wasm                     |           90,876 |          91,094 |
| ESM                      |          151,339 |         151,568 |
| ESM minified             |          123,281 |         123,500 |
| ESM minified + gzip      |           44,271 |          44,360 |
| ESM Brotli               |           36,532 |          36,527 |
| CommonJS minified + gzip |           44,424 |          44,512 |

Final linked Wasm inspection shows unchanged normalized dispatch, length,
find_frame, position_of, destructor and identity-table reservation bodies.
The anchor body grows from 3,055 to 3,235 WAT lines, with the same 88 static
conditional branches, 13 additional static i32 loads and six additional static
i32 stores. These static counts do not describe dynamic traversal frequency.
There is no SIMD, ILP or MLP claim: the intended gain eliminates repeated
dependent traversal rather than parallelizing it.

The [complete five-pair comparison](direct-zero-performance.md) contains 409
non-length timings and 96 memory/storage rows. Replicated replacement is
80.46–84.33% faster at 1,000, 10,000 and 25,000 starting Strips. However, 89 timing
medians are over 5% slower; 25,000-Strip empty creation is 23.10% slower and
15,000-Strip head reads are 15.85% slower, each slower in all five matched pairs.
All memory and storage rows are unchanged.

The [five-round follow-up](direct-zero-followup.md) uses an identical-build
checkpoint copy as an A/A control and rotates three-build order. Large empty
creation losses do not repeat: at 25,000 Strips the candidate is 11.26% faster.
But 15,000-Strip snapshot creation remains 9.28% slower, with a paired median
of 14.55% and paired IQR of 7.48 percentage points, slower in all five pairs;
the A/A median is 6.97% faster. Other full-suite differences also remain
unresolved. The targeted replacement gain does not meet the acceptance rule.

Evidence remains under `temp/optimization_2026_11_12` (`P`):

```text
node P/full.mjs fixed-table 3 checkpointfresh
node --expose-gc P/shape-check.mjs direct-zero
node --expose-gc P/concurrent-guard.mjs direct-zero-concurrent fixed-table,direct-zero 5
node --expose-gc archives/optimizations_2026_11_10/memory.ts P/direct-zero-workspace/src P/direct-zero-memory.json P/direct-zero-workspace/dist
wasm-dis.exe P/direct-zero-memory.wasm -o P/direct-zero.wat
node P/inspect-code.mjs fixed-table direct-zero
node P/normalize-wat.mjs fixed-table direct-zero
node P/full.mjs fixed-table,direct-zero 5 directzerofull
node P/production-control.mjs direct-zero-followup fixed-table,fixed-control,direct-zero direct-regression-production.mjs 5
```
