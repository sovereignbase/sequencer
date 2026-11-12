# Rejected unified Footage ownership

The candidate removed `Insertion.content_owned` and `Tuple.Binding.owned` and
used `FootageState::Private` for writable ownership. Before sharing a snapshot,
private bindings and fragments became Retained, then JavaScript copied and
marked them Snapshot. Already retained or shared chains skipped the repeated
ownership-revocation walk. Caller arrays kept their original behavior.

All 274 tests passed with 100% TypeScript coverage, both type checks passed and
192 canonical snapshot/serialization comparisons matched. The failed-map retry,
snapshot immutability, acknowledged compaction and DM expectations were intact.

The change is **rejected and fully reverted**. Five complete matched runs show
repeatable non-length regressions against the previous anchor candidate,
including apply.insert at 25,000 groups: 1,313.43 → 1,478.13 ns (+12.5% between
medians; all five candidate samples are slower). The paired-change IQR is
1.59 percentage points. Other repeated losses include value.sameIndex at 25,000
(+8.7%), scale-down value.tail (+5.8%), checkpoint sequence at 1,000 down
(+18.2%) and four-field projection apply.replace (+7.7%).

[All 424 timing and 96 memory/storage rows against anchor](recovery-unified-native-performance.md)
record 48 timing medians over 5% faster and 90 over 5% slower.
[The continuation-baseline comparison](recovery-unified-performance.md)
records 246 over 5% faster and 30 over 5% slower. Neither aggregate establishes
the required absence of regression, and length is excluded from the decision.

## Targeted replication

Ten measured rounds followed four warm-up rounds. Every fixture and final result
matched across current, anchor and unified. Inputs, counts and rotated/reversed
variant order match the earlier replication guard. Nanoseconds per call:

| Groups / operation         | Anchor | Unified |  Change |
| -------------------------- | -----: | ------: | ------: |
| 100 / apply.insert         |  354.0 |   310.8 | -12.22% |
| 100 / apply.remove         |  899.8 |   741.1 | -17.64% |
| 100 / apply.replace        | 3295.5 |  3372.7 |  +2.34% |
| 100 / merge.insert         |  811.7 |   696.4 | -14.21% |
| 100 / duplicate insert     |  260.3 |   214.1 | -17.73% |
| 100 / duplicate remove     |  479.5 |   428.5 | -10.64% |
| 100 / duplicate replace    |  672.7 |   629.9 |  -6.36% |
| 20,000 / apply.insert      |  525.1 |   507.3 |  -3.39% |
| 20,000 / apply.remove      |  934.8 |   927.4 |  -0.78% |
| 20,000 / apply.replace     | 3588.7 |  3521.7 |  -1.86% |
| 20,000 / merge.insert      |  897.0 |   817.5 |  -8.86% |
| 20,000 / duplicate insert  |  330.4 |   278.6 | -15.68% |
| 20,000 / duplicate remove  |  642.2 |   497.0 | -22.61% |
| 20,000 / duplicate replace |  765.2 |   637.2 | -16.72% |

Raw per-round samples, medians and IQRs remain in
`temp/optimization_2026_11_11/unified-anchor-to-unified-summary.json`.
The complete guard takes precedence over these targeted gains.

## Fragmented snapshot follow-up

Twelve matched rounds after four warm-up rounds. A registered second Actor has
not yet acknowledged the removals, so their masks must remain. One positive
root starts with four Frames per removal; random single-Frame removals fragment
it. Snapshot contents, restored values and retained snapshot immutability are
checked outside timing. Median ns (IQR), all three cases:

| Removals |                  Current |                    Anchor |                   Unified |
| -------- | -----------------------: | ------------------------: | ------------------------: |
| 100      |      8,174.61 (1,123.05) |         8,309.18 (940.53) |       8,501.37 (1,621.00) |
| 2,000    |    146,831.25 (9,358.59) |     143,892.19 (9,935.16) |     139,270.31 (6,004.69) |
| 20,000   | 2,235,287.50 (89,518.75) | 2,238,343.75 (109,168.75) | 2,125,331.25 (367,040.63) |

The largest median improves about 5%, but has materially higher dispersion.
The smallest median slows about 2%. These results do not justify the full-suite
apply regression.

## Memory and artifacts

Insertion remains 36 bytes, Tuple Binding 12 and Version 40. Three-run live
allocation measurements at 10,000 instances are unchanged in all five native
shapes. JavaScript estimates are unchanged; this removes duplicate flags but
does not reduce their padded structure sizes.

| Artifact bytes        |  Anchor | Unified |
| --------------------- | ------: | ------: |
| Wasm                  |  91,106 |  91,292 |
| ESM raw               | 151,636 | 151,876 |
| ESM min               | 123,462 | 123,708 |
| ESM min + gzip        |  44,296 |  44,418 |
| ESM min + Brotli      |  36,474 |  36,533 |
| CommonJS raw          | 151,789 | 152,029 |
| CommonJS min          | 124,765 | 125,011 |
| CommonJS min + gzip   |  44,451 |  44,575 |
| CommonJS min + Brotli |  36,652 |  36,677 |

Final linked-Wasm inspection confirms Tuple.erase byte stores fall from three
to two. Extend changes from five halfword stores to two, but byte stores rise
from one to three and one additional vector store appears. General dispatch
grows from 13,061 to 13,075 WAT lines; the total Wasm grows 186 bytes. No new
SIMD, ILP or MLP benefit is claimed. Skipping a dependent fragment walk removes
work rather than creating parallel loads.

## Reproduction

Environment and unchanged build flags match [the round](README.md). Frozen
sources, artifacts, all valid raw samples and inspection JSON remain under
`temp/optimization_2026_11_11` (`P`).

```text
node --expose-gc P/inlineack-replication.mjs current,anchor,unified unified
node --expose-gc P/fragmented-snapshots.mjs current,anchor,unified unified-fragmented
node P/full.mjs current,anchor,unified 5 recoveryunified
node P/unified-inspect.mjs
```
