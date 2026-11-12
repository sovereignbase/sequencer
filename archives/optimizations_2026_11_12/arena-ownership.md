# Arena ownership

The Strip arena owns one allocation. Its Insertion lane starts at byte zero, so
the cached `identity` pointer repeats `memory.get()`. Removing that field and
using an inline accessor removes four payload bytes per Projection on wasm32.
No lane layout, canonical coordinate, binding token or snapshot changes.

The comparison builds on the two-entry removal reservation and positive
square-root rounding candidate. Neither candidate is described as an all-row
performance win; the complete regression guard remains the acceptance test.

## Allocation

Three runs measure 1,000 and 10,000 live instances within one Wasm instance.
These are native allocator bytes per instance; unused linear-memory capacity
and the JavaScript heap are separate measurements.

| Shape                       | Session baseline, B | Without cached pointer, B |
| :-------------------------- | ------------------: | ------------------------: |
| Empty                       |              262.56 |                    254.55 |
| Single root                 |              542.56 |                    534.55 |
| Eight-frame sequence        |              542.56 |                    534.55 |
| Eight-slot tuple            |            1,070.61 |                  1,070.55 |
| Edited eight-frame sequence |            3,514.38 |                  3,506.82 |

Allocator size classes usually turn the four-byte field removal into an
eight-byte allocation saving. The tuple result is effectively unchanged.
JavaScript ownership and allocation behavior are unchanged.

## Code and artifacts

All 276 existing tests pass with 100% TypeScript coverage. All 192 canonical
snapshot/serialization pairs match the baseline. Expectations and benchmark
workloads are unchanged.

The accessor has no separate linked Wasm function. The inspected hot functions
retain the same load/store counts as the preceding build: `position_of` 96/49,
`find_frame` 126/48, `remove` 108/106 and `runtime_dispatch` 753/376. This is not a
claim that every machine instruction or timing is identical. No SIMD, ILP or
MLP improvement is claimed: the change deletes duplicate state.

| Artifact            | Session baseline, B | Without cached pointer, B |
| :------------------ | ------------------: | ------------------------: |
| Wasm                |              90,954 |                    90,802 |
| Wasm gzip           |              36,835 |                    36,743 |
| Wasm Brotli         |              30,195 |                    30,127 |
| ESM                 |             151,219 |                   150,768 |
| ESM min             |             123,218 |                   122,936 |
| ESM min + gzip      |              44,257 |                    44,113 |
| ESM min + Brotli    |              36,367 |                    36,296 |
| CommonJS            |             151,372 |                   150,921 |
| CommonJS min        |             124,521 |                   124,239 |
| CommonJS min + gzip |              44,409 |                    44,268 |

Against the preceding rounding candidate, Wasm grows by 46 B while minified ESM
gzip shrinks by 19 B. All artifacts are compared with identical build,
minification and compression settings.

## Timing status

The [five-round production control](arena-control.md) compares the preceding
build, its byte-identical A/A copy and this candidate in separate Node processes.
All 39 production throughput cases run at 1,000, 10,000 and 25,000 Strips. Order
rotates and reverses. Remove and apply(remove) distributions remain mixed; the
control does not establish a speed improvement or resolve all apparent
regressions.

The [complete five-pair guard](owner-performance.md) is finished. Excluding
length, 77 timing medians improve by more than 5% and 113 regress by more than
5%. Random replacement is slower in every pair at 10,000 Strips (+7.17%, paired
IQR 2.69 percentage points) and 25,000 Strips (+6.82%, paired IQR 3.95 points).
The working combination is removed. These measurements do not isolate the
pointer change from the reservation and rounding changes, so they establish
rejection of the combination, not a causal explanation for each regression.
The smaller allocator footprint alone does not satisfy the acceptance rule.

Raw source snapshots, allocation runs, symbols, disassembly and timing samples
remain in `temp/optimization_2026_11_12` under `arena-owner*`, `arena-control*`
and `ownerfull*`. Commands:

```text
node P/control-report.mjs arena-control rounded,rounded-control,arena-owner 5
node P/full.mjs baseline,arena-owner 5 ownerfull
node --expose-gc archives/optimizations_2026_11_10/memory.ts P/arena-owner-workspace/src P/arena-owner-memory.json P/arena-owner-workspace/dist
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe P/arena-owner-memory.wasm -o P/arena-owner.wat
node P/inspect-code.mjs rounded arena-owner
```
