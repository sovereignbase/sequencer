# Hidden endpoint traversal

Measured 12 November 2026. Immediate control: wordcheck. The rejected Splice
packing is restored before this candidate is built. Public API, snapshots,
canonical coordinates, ownership and compaction are unchanged.

## Change

The complete throughput profile maps wasm-function[29] to anchor_strip in the
matching linker symbols: 11.53% of sampled burst self time. Its hidden-head repair
walks adjacent Strips, while hidden-tail repair already uses zero-Frame jumps.

Use an existing right jump to skip a hidden head interval for nonpositive edits.
The loop first detaches every positive-distance jump, so any surviving jump has
zero visible distance. The same postcondition removes the tail's repeated
zero-distance check. Positive insertion keeps its previous head walk: the caller
repairs first-fragment jump distances after linking, and an old zero distance
must not be assumed to include new positive content. No cache, field, helper or
index is added. Existing jump construction and Structural Order remain intact.

## Hidden-history guard

A source writes N+1 Frames. A registered peer authors an insertion at their old
end before the source deletes N tail Frames. Applying that insertion leaves two
visible values separated by retained deleted history; acknowledgements are
incomplete, so export retains its masks. Each measured instance hydrates this
snapshot. Twelve measured rounds follow three warmups, rotating and reversing
three-build order; each sample times one public call on each of eight fresh
instances. Construction, explicit JS process garbage collection, public value
assertions, replay of remote Splices and destruction are outside timing.

This measures first calls after hydration, not a warmed scalar-read loop. All
14 cases and valid samples are retained. Nanoseconds/call, median (IQR).

| Hidden Frames | Operation         |        wordcheck (IQR) |    endpointjump (IQR) |  Change |
| ------------: | ----------------- | ---------------------: | --------------------: | ------: |
|           100 | remove.head       |    12,362.5 (5,465.63) |    10,512.5 (5,112.5) | -14.96% |
|           100 | apply.remove.head |      13,700 (5,278.12) |  11,518.75 (5,059.38) | -15.92% |
|           100 | replace.head      |   12,943.75 (4,068.75) |  11,906.25 (5,021.87) |  -8.02% |
|           100 | value.head        |      3,318.75 (731.25) |       3,287.5 (1,475) |  -0.94% |
|           100 | value.tail        |     3,462.5 (1,740.63) |   3,818.75 (1,746.88) | +10.29% |
|           100 | values            |       5,525 (1,559.38) |   4,968.75 (2,496.88) | -10.07% |
|           100 | sequence          |    34,037.5 (5,496.87) |     34,250 (8,471.87) |  +0.62% |
|         10000 | remove.head       |     75,550 (13,109.38) |     25,725 (2,840.62) | -65.95% |
|         10000 | apply.remove.head |    83,612.5 (8,693.75) |   28,737.5 (8,406.25) | -65.63% |
|         10000 | replace.head      |   95,568.75 (9,959.38) |   38,762.5 (5,503.12) | -59.44% |
|         10000 | value.head        |      4,012.5 (2,612.5) |    3,687.5 (1,693.75) |  -8.10% |
|         10000 | value.tail        |       4,250 (1,268.75) |      3,950 (1,268.75) |  -7.06% |
|         10000 | values            |  72,943.75 (27,865.63) | 70,556.25 (31,346.87) |  -3.27% |
|         10000 | sequence          | 749,581.25 (37,015.63) | 738,712.5 (46,671.87) |  -1.45% |

For 10,000 hidden Frames, removal, remote removal and replacement improve about
2.47–2.94 times over wordcheck. Other cases are mixed, including first small
scalar reads. These target results do not establish a universal improvement.

## Memory and artifacts

Three runs with 10,000 simultaneously live instances, one measured Wasm runtime
and no peer, retain the same native live-allocation medians for all five shapes.
The eight-value tuple remains 1,070.61 native bytes and about 380.74 JavaScript
heap bytes per instance, preserving its earlier native saving. JavaScript heap
estimates follow explicit JS process garbage collection; no representation
change is claimed for their small differences. Encoded snapshot comparisons
remain exact.

Same release, three-pass Terser and compression settings; bytes.

| Artifact              |  Before |   After | Difference |
| --------------------- | ------: | ------: | ---------: |
| index.js/rawBytes     | 151,197 | 151,219 |         22 |
| index.js/minBytes     | 123,200 | 123,218 |         18 |
| index.js/gzipBytes    |  44,245 |  44,257 |         12 |
| index.js/brotliBytes  |  36,401 |  36,367 |        -34 |
| index.cjs/rawBytes    | 151,350 | 151,372 |         22 |
| index.cjs/minBytes    | 124,503 | 124,521 |         18 |
| index.cjs/gzipBytes   |  44,397 |  44,409 |         12 |
| index.cjs/brotliBytes |  36,553 |  36,527 |        -26 |
| wasm/rawBytes         |  90,939 |  90,954 |         15 |
| wasm/gzipBytes        |  36,820 |  36,835 |         15 |
| wasm/brotliBytes      |  30,212 |  30,195 |        -17 |

Raw Wasm grows 15 bytes. SIMD is not a solution to this dependent link walk;
the change skips intervals instead. No added ILP/MLP gain is claimed.

## Verification and decision

All 276 tests pass with 100% TypeScript coverage: 434 statements, 293 branches,
32 functions and 388 lines. Both TypeScript checks and 192 exact canonical
snapshot/serialization pairs pass. Existing delivery, DM, fragmentation and
unanimous-ACK expectations are unchanged. The hidden-history guard checks every
result through the public API and replays remote Splices.

The five-run complete guard finished against original e138158, baseline 1c0a007
and wordcheck. All 424 timing and 96 memory/storage rows are recorded against
[original](recovery-endpoint-original-performance.md),
[baseline](recovery-endpoint-performance.md) and
[wordcheck](recovery-endpoint-isolated-performance.md). Length remains in the
tables but is excluded from the 409-row timing decision.

Of the baseline's 102 slower medians against original, 96 improve and 88 become
faster than original. Eight of its 307 earlier faster medians become slower than
original. Against baseline, 372 timing medians improve and 37 slow. These counts
describe measured medians, not statistical significance. The
[historical goal assessment](recoveryendpoint-historical-goal.md) lists the
remaining losses, including checkpoint/down/5000/sequence. The all-row goal is
not met; this is a checkpoint with remaining work, not a regression-free claim.

The measured endpoint change is retained. A subsequent IdentityHash experiment
was built and tested but removed before this checkpoint because its performance
had not been measured. No external workload or competitor is changed or run.
Raw distributions, frozen source and linked artifacts remain under
P = `temp/optimization_2026_11_11`.

Commands:

- `node --expose-gc P/hidden-endpoint-guard.mjs current,wordcheck,endpointjump endpointjump-hidden`
- `node P/full.mjs original,baseline,wordcheck,endpointjump 5 recoveryendpoint`
- `node --expose-gc P/profile-lifecycle-snapshots.mjs endpointjump`

The last command profiles the unchanged production lifecycle at its 15,000-group
checkpoint with editing-pair-0 and no report output. It is diagnostic only; its
timings are not acceptance samples. Among 169 sequence-descendant self samples,
51.48% are in native runtime_dispatch, 24.26% in JavaScript readValues, and 14.79%
in Removed-map insertion. That final category includes insertion work and does
not prove hashing alone costs 14.79%.
