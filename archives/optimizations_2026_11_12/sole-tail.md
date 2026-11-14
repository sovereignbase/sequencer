# Tail discovery with one surviving visible Strip

Candidate: `sole-tail`, compared with checkpoint `d3108d5` (`fixed-table`). The
complete regression guard has finished; this is not an accepted all-row
improvement. Copying is being investigated in the
[continuation](../optimizations_2026_11_13/README.md).

The tail repair loop discovers the preceding visible Strip through hidden
history. After repairing head, if its positive extent equals the entire
remaining visible Frame count, it is necessarily also the visible tail. This
candidate uses that identity only for the first negative incoming fragment.
The existing invalidation at the old tail still runs before taking the shortcut.
Predecessor jump intervals do not include the old tail's contribution, and
earlier fragments of the same mask have not yet changed their distances.
Secondary mask fragments retain the original traversal and invalidation path.
No link compression, index, field or allocation is added.

All 276 tests and 192 exact canonical snapshot/serialization comparisons pass.
Eight-author concurrent insert/remove/replace replay also passes with ordered,
reverse and shuffled delivery, including duplicates. No existing test or
benchmark expectation changes.

Three live-allocation runs give the same native bytes as the checkpoint for all
five shapes: empty 254.55, single 534.55, sequence8 534.55, tuple8 1,054.61 and
edited8 3,505.26. Serialization sizes are unchanged in the snapshot guard.

| Artifact                 | Checkpoint bytes | Candidate bytes |
| :----------------------- | ---------------: | --------------: |
| Wasm                     |           90,876 |          90,934 |
| ESM                      |          151,339 |         151,404 |
| ESM minified             |          123,281 |         123,349 |
| ESM minified + gzip      |           44,271 |          44,311 |
| ESM Brotli               |           36,532 |          36,506 |
| CommonJS minified + gzip |           44,424 |          44,464 |

The [five-round targeted control](sole-tail-followup.md) includes a byte-identical
checkpoint copy. Replicated replacement is 86.08–87.39% faster across the four
selected sizes. Snapshot creation remains 11.97% slower at 15,000 Strips and
11.94% slower at 25,000, each slower in all five pairs. The corresponding A/A
medians are 7.08% and 3.28% slower. These are unresolved differences, not accepted
tradeoffs or proof of a constructor algorithm regression.

Normalized final Wasm dispatch, length, find_frame, position_of, destructor and
identity-table reservation bodies are unchanged. The anchor body grows by 51
WAT lines, two conditional branch sites, three static i32 loads and one static
i32 store. Eliminating a dependent walk is the intended gain; no SIMD, ILP or
MLP improvement is claimed.

The [complete five-round comparison](sole-tail-performance.md) records 73
non-length medians over 5% faster and 51 over 5% slower. Both the
[identical-build comparison](sole-tail-aa-performance.md) and the
[alternate-control comparison](sole-tail-control-performance.md) are retained.
The A/A comparison itself has 60 medians over 5% faster and 65 over 5% slower.
All 96 memory/storage medians are unchanged in all three comparisons.

Full values at 25,000 Strips is 8.76% slower than the checkpoint and 10.28%
slower than its identical copy, in all five pairs against each. Paired changes
are 12.05% (IQR 3.71 percentage points) and 14.35% (IQR 4.51), respectively.
Other timing differences also remain unresolved. These results do not establish
that unchanged native routines regress causally, and do not justify accepting
the candidate by its replacement gain alone.

Raw evidence and frozen builds remain in `temp/optimization_2026_11_12` (`P`):

```text
node --expose-gc P/shape-check.mjs sole-tail
node --expose-gc P/concurrent-guard.mjs sole-tail-concurrent fixed-table,sole-tail 5
node --expose-gc archives/optimizations_2026_11_10/memory.ts P/sole-tail-workspace/src P/sole-tail-memory.json P/sole-tail-workspace/dist
wasm-dis.exe P/sole-tail-memory.wasm -o P/sole-tail.wat
node P/normalize-wat.mjs fixed-table sole-tail
node P/production-control.mjs sole-tail-followup fixed-table,fixed-control,sole-tail direct-regression-production.mjs 5
node P/full.mjs fixed-table,fixed-control,sole-tail 5 soletailfull
```
