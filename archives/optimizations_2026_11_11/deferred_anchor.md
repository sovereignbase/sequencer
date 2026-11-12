# Defer unused anchor lookups

Apply previously resolved an Insertion's anchor before rejecting its already
materialized identity. The hash/probe result was unused on that path. Positive
tuple Insertions also never consume that anchor result. The lookup now follows
duplicate rejection and is skipped for positive tuple Insertions.

Containment lookup is const and has no side effects. Acknowledgement observation
still precedes duplicate rejection; content release, pending dependencies,
growing snapshots, extensions and placement keep their order and meaning.
No new state, helper, cache or public API is added.

## Targeted replication

Ten matched rounds, four warm-up rounds, public API, 100 and 20,000 canonical
roots. The fixture alternates 32-Frame head/tail Insertions to keep roots
distinct. Fresh operations use 1,000 authored changes; duplicate fixtures are
materialized before timing. Eight small or two large copies per measured burst.
Snapshots, generated Gossip and final values match across builds outside timing.
Each size/method uses the same counts and inputs in all variants, with rotated
and reversed variant order. All valid samples are retained.

Nanoseconds per call; medians and IQR. Current is the frozen continuation
baseline. Inline ACK isolates the previously implemented native Entry change.

| Size / operation             |  Inline ACK (IQR) |      Anchor (IQR) | Isolated change | Change against current |
| ---------------------------- | ----------------: | ----------------: | --------------: | ---------------------: |
| 100/apply.insert             |     369.3 (34.17) |     295.14 (42.7) |         -20.08% |                -37.86% |
| 100/apply.remove             |    813.74 (16.06) |    793.61 (33.45) |          -2.47% |                 -9.76% |
| 100/apply.replace            |  3,426.3 (212.17) | 3,435.41 (117.72) |          +0.27% |                 -2.89% |
| 100/merge.insert             |   777.13 (195.23) |    672.03 (96.04) |         -13.52% |                -34.65% |
| 100/apply.duplicateInsert    |       275.88 (25) |    204.07 (15.34) |         -26.03% |                -52.51% |
| 100/apply.duplicateRemove    |    455.12 (28.44) |    426.31 (20.92) |          -6.33% |                -14.42% |
| 100/apply.duplicateReplace   |     637.6 (48.29) |      603.4 (64.8) |          -5.36% |                -28.28% |
| 20000/apply.insert           |     551.8 (63.22) |    545.43 (44.75) |          -1.16% |                -38.79% |
| 20000/apply.remove           |   866.55 (291.73) |     880.2 (69.54) |          +1.58% |                -12.64% |
| 20000/apply.replace          | 3,546.25 (985.98) |  3,624.8 (205.75) |          +2.22% |                 -3.84% |
| 20000/merge.insert           |    855.47 (81.91) |    891.5 (181.61) |          +4.21% |                -30.54% |
| 20000/apply.duplicateInsert  |    340.88 (37.91) |    342.63 (45.39) |          +0.51% |                 -8.31% |
| 20000/apply.duplicateRemove  |    567.22 (154.4) |      524.1 (78.1) |          -7.60% |                -21.17% |
| 20000/apply.duplicateReplace |    735.23 (145.4) |   614.95 (126.94) |         -16.36% |                -29.31% |

## Artifact bytes

Same release compiler/linker and compression settings as the prior candidate.

| Artifact         | Inline ACK | Anchor | Difference |
| ---------------- | ---------: | -----: | ---------: |
| index.js raw     |     151564 | 151636 |         72 |
| index.js min     |     123392 | 123462 |         70 |
| index.js gzip    |      44208 |  44296 |         88 |
| index.js Brotli  |      36469 |  36474 |          5 |
| index.cjs raw    |     151717 | 151789 |         72 |
| index.cjs min    |     124695 | 124765 |         70 |
| index.cjs gzip   |      44362 |  44451 |         89 |
| index.cjs Brotli |      36547 |  36652 |        105 |
| wasm raw         |      91043 |  91106 |         63 |
| wasm gzip        |      36794 |  36841 |         47 |
| wasm Brotli      |      30175 |  30174 |         -1 |

## Live memory

Median bytes per instance over three runs of 10,000 simultaneously live
Projections in one Wasm instance. No persistent structure changes. JS deltas
are observed after explicit JS process garbage collection.

| Shape     | Native before | Native after | JS before | JS after |
| --------- | ------------: | -----------: | --------: | -------: |
| empty     |        262.56 |       262.56 |    202.56 |   202.56 |
| single    |        542.56 |       542.56 |    402.33 |   402.43 |
| sequence8 |        542.56 |       542.56 |    378.29 |    378.2 |
| tuple8    |      1,392.59 |     1,392.59 |    380.73 |   380.74 |
| edited8   |      3,514.38 |     3,514.38 |       913 |      913 |

## Generated code and verification

Final linked Wasm retains eight static identity-hash constants in apply, but
its duplicate path branches before the anchor hash/probe block. Both artifacts
retain 25 vector loads and 33 vector stores in apply; there is no new SIMD
transformation. This removes unused dependent memory work, rather than adding
MLP. Fresh non-tuple paths still need both lookups; their complete-suite results
are checked for a loss of scheduling overlap. Apply's WAT grows from
5479 to 5515 lines, and Wasm grows
63 bytes. No size reduction
is claimed for the isolated lookup change.

All 274 tests pass with 100% statements, branches, functions and lines. All
192 canonical snapshot/serialization comparisons match. The previous output
experiment was restored before this candidate. A complete 47-step native build
and linked-symbol inspection verify the original Gossip-return signatures and
absence of Entry shrink_to_fit. Earlier deferred-* measurements used stale
output objects and are explicitly invalid for isolated attribution; none of
their timings are used here.

## Decision

Five complete matched runs produced 241 timing medians over 5% faster and
46 over 5% slower against current. Against inlineack alone, 79 improve over 5%
and 70 slow over 5%. [All rows against current](recovery-anchor-performance.md)
and [all isolated rows](recovery-anchor-native-performance.md) include the full
424 timing and 96 memory/storage quantities. Length latency is recorded but
excluded from acceptance. The all-method objective remains unmet.

Isolated repeat losses include throughput value.tail at 5,000 groups (+7.1%),
checkpoint sequence at 25,000 up (+6.7%) and 10,000 down (+8.2%), each slower in
all five pairs. This is not accepted as a standalone improvement; further
experiments retain anchor as a frozen intermediate, with current and inlineack
still available for comparison. No regression is relabelled a confirmed gain.

## Matched linear read follow-up

Twelve measured rounds after four warm-up rounds use each frozen workspace's
unchanged benchmark IIFE factory. A second current factory is a byte-identical
A/A control with an independent native instance. Linear fixtures use 1–100
Frames per group, matching the benchmark range length. Eight hydrated states
per variant; public read results and restored snapshots are checked outside
timing. These are direct API bursts, with index preparation outside timing;
they supplement rather than replace the complete benchmark's call context.

Nanoseconds per call, median (IQR). All fifteen rows are retained.

| Groups / operation  |                   Current |           Current control |                Inline ACK |                 Anchor | Current → anchor |
| ------------------- | ------------------------: | ------------------------: | ------------------------: | ---------------------: | ---------------: |
| 100/value.middle    |              30.85 (5.82) |              30.61 (4.05) |              29.02 (3.07) |           28.49 (2.84) |           -7.65% |
| 100/values.middle   |            169.09 (26.34) |             166.97 (9.12) |            178.77 (55.08) |         175.96 (44.93) |           +4.06% |
| 100/values.random   |            176.78 (10.51) |              175.6 (6.26) |            180.17 (13.78) |          182.15 (9.72) |           +3.04% |
| 100/values          |          6,645.7 (557.23) |       6,396.09 (1,303.52) |        6,369.14 (1,270.7) |       6,716.8 (827.93) |           +1.07% |
| 100/sequence        |           379.69 (223.83) |              525 (411.72) |            487.5 (310.94) |        476.95 (290.43) |          +25.62% |
| 15000/value.middle  |              33.43 (4.19) |              33.08 (3.54) |              32.74 (3.14) |           30.68 (3.59) |           -8.22% |
| 15000/values.middle |            174.19 (37.95) |            192.56 (22.19) |            186.02 (26.46) |         199.93 (28.34) |          +14.78% |
| 15000/values.random |            339.54 (84.99) |            340.34 (40.85) |            333.86 (61.47) |         331.98 (45.31) |           -2.23% |
| 15000/values        | 1,578,656.25 (225,709.38) | 1,474,318.75 (499,265.62) | 1,524,743.75 (394,853.13) | 1,492,000 (361,215.63) |           -5.49% |
| 15000/sequence      |           882.42 (284.57) |           801.56 (188.67) |           769.53 (319.92) |        796.09 (241.02) |           -9.78% |
| 25000/value.middle  |              29.21 (1.69) |              32.13 (2.45) |               28.1 (3.84) |           27.24 (4.99) |           -6.75% |
| 25000/values.middle |            188.95 (32.32) |            181.68 (26.04) |            179.83 (18.89) |         184.69 (38.43) |           -2.25% |
| 25000/values.random |            352.89 (77.16) |            364.85 (44.49) |            362.21 (38.65) |         345.42 (25.39) |           -2.12% |
| 25000/values        |  3,027,156.25 (446,637.5) |    3,158,775 (694,006.25) |  3,460,712.5 (569,346.87) |    2,969,900 (171,350) |           -1.89% |
| 25000/sequence      |           877.73 (226.95) |           881.64 (275.39) |           814.06 (123.24) |        907.03 (183.98) |           +3.34% |

The 15,000-group middle-range median remains +14.8% against current, while
the identical current control is itself +10.5%. Large full-values medians improve;
small snapshot results are mixed. Neither this A/A variation nor the targeted
apply gains establishes that every other regression is noise.

## Reproduction

Environment and fixed Session/workload seeds match [the round](README.md).
Raw samples and frozen artifacts remain in temp/optimization_2026_11_11/.

```text
node --expose-gc P/inlineack-replication.mjs current,inlineack,anchor anchor
node P/summarize-replication.mjs anchor inlineack anchor
node P/summarize-replication.mjs anchor current anchor
node P/full.mjs current,inlineack,anchor 5 recoveryanchor
node P/anchor-inspect.mjs
```
