# Splice span presence

Measured 12 November 2026. Immediate control: wordcheck. Only the native Splice
payload and its ABI exposure change. A zero span count denotes a removal-only
Splice; positive counts still represent inserted Frames, including undefined
content. Tuple empty registers remain a one-Frame replacement. Public Splices,
wire words, coordinates, ownership and compaction are unchanged.

## Representation and generated code

Replacing optional<Span> with Span removes its separate presence word. A static
assertion verifies wasm32 Splice size 20 bytes instead of 24, a 16.7% reduction
in raw vector-element space. Allocator rounding can erase the saving for a single
small allocation. This is transient Result storage, not a persistent reduction
for every Projection. Existing many-instance live-allocation estimates remain
unchanged for all five shapes.

The linked vector growth helper has 156 WAT lines in both builds. Its stride
changes from 24 to 20 bytes and it retains one vector load and one vector store.
No new SIMD, ILP or MLP gain is claimed. A removal-only Span now initializes
three zero words rather than an optional discriminator; the smaller record does
not by itself establish a CPU improvement.

## Remote-operation guard

Ten measured rounds after four warmups, rotating/reversing build order; fixture
creation, duplicate preparation, JS process garbage collection and public-value
assertions are outside timing. Nanoseconds/call, median (IQR). All samples retained.

| Case                         |     Before (IQR) |       After (IQR) |  Change | Paired change (IQR pp) |
| ---------------------------- | ---------------: | ----------------: | ------: | ---------------------: |
| 100/apply.insert             |   383.69 (29.74) |    340.94 (18.97) | -11.14% |        -11.79% (13.35) |
| 100/apply.remove             |    916.2 (33.17) |    857.32 (11.84) |  -6.43% |          -6.37% (1.64) |
| 100/apply.replace            | 3,429.99 (254.7) | 3,456.34 (160.26) |  +0.77% |          -0.43% (3.27) |
| 100/merge.insert             |   700.22 (37.16) |     658.21 (57.8) |  -6.00% |          -4.00% (6.37) |
| 100/apply.duplicateInsert    |   305.34 (39.53) |    252.66 (21.24) | -17.25% |        -18.25% (10.16) |
| 100/apply.duplicateRemove    |   518.72 (16.64) |    473.67 (14.28) |  -8.68% |          -9.05% (5.06) |
| 100/apply.duplicateReplace   |    698.46 (35.1) |    653.02 (19.98) |  -6.51% |          -7.54% (2.88) |
| 20000/apply.insert           |   526.27 (53.75) |    554.9 (106.81) |  +5.44% |         -2.94% (13.55) |
| 20000/apply.remove           |   914.9 (123.75) |    869.73 (66.64) |  -4.94% |         -5.39% (16.46) |
| 20000/apply.replace          | 3,505.35 (88.49) |   3,429.8 (221.7) |  -2.16% |          -1.32% (7.42) |
| 20000/merge.insert           |   809.98 (84.36) |    775.85 (41.26) |  -4.21% |          -0.93% (9.94) |
| 20000/apply.duplicateInsert  |    350.37 (34.7) |     294.8 (22.09) | -15.86% |         -17.06% (11.7) |
| 20000/apply.duplicateRemove  |      577 (38.99) |      502.9 (75.5) | -12.84% |        -11.75% (10.35) |
| 20000/apply.duplicateReplace |   747.45 (89.43) |     672.9 (83.29) |  -9.97% |         -6.51% (14.97) |

Some duplicate cases change despite producing no Splices. These are observations
of the isolated build, not proof that smaller Splices caused every timing change.
The fresh 20,000-group apply.insert median is 5.44% slower, with paired IQR 13.55
points. No universal improvement follows from this target guard. The five-run
[100-group production repetition](wordcheck-repeat-100.md) contains all 39
throughput cases; against wordcheck three non-length paired medians improve over
5% and five slow over 5%, with none slower in all five pairs.

## Artifacts

Identical release, three-pass Terser and compression settings; bytes.

| Artifact              |  Before |   After | Difference |
| --------------------- | ------: | ------: | ---------: |
| index.js/rawBytes     | 151,197 | 151,450 |        253 |
| index.js/minBytes     | 123,200 | 123,425 |        225 |
| index.js/gzipBytes    |  44,245 |  44,313 |         68 |
| index.js/brotliBytes  |  36,401 |  36,495 |         94 |
| index.cjs/rawBytes    | 151,350 | 151,603 |        253 |
| index.cjs/minBytes    | 124,503 | 124,728 |        225 |
| index.cjs/gzipBytes   |  44,397 |  44,469 |         72 |
| index.cjs/brotliBytes |  36,553 |  36,618 |         65 |
| wasm/rawBytes         |  90,939 |  91,105 |        166 |
| wasm/gzipBytes        |  36,820 |  36,893 |         73 |
| wasm/brotliBytes      |  30,212 |  30,213 |          1 |

## Verification and decision

All 276 tests pass with 100% TypeScript coverage: 434 statements, 293 branches,
32 functions and 388 lines. Both TypeScript checks and 192 exact canonical
snapshot/serialization comparisons pass. Existing Splice, missing-content, tuple
hole, delivery, compaction and ownership assertions are unchanged.

The five-run complete guard of current, tuplerange, wordcheck and splicecount is
complete: [all continuation rows](recovery-splice-performance.md) and
[all isolated rows](recovery-splice-isolated-performance.md). Of 409 non-length
rows, 306 paired medians improve over 5% and nine slow over 5% against current.
Against wordcheck, 39 improve over 5% and 52 slow over 5%. All-pair isolated losses
include tuple/2 value.random (+10.70%, paired IQR 4.17 points), 15,000-group
values.sameIndex (+7.85%, IQR 1.45), and the 15,000-group checkpoint sequence
(+9.60%, IQR 5.75). The tuple/2 read is also slower in every pair against current
(+10.64%, IQR 0.88). All 96 memory/storage medians match wordcheck.

Rejected and restored optional<Span> plus its previous ABI exposure. Transient
record packing and mixed target timings do not justify these complete-suite
losses and the deterministic artifact increases. No persistent tuple-memory
optimization is reverted. Length is recorded but excluded from the decision.
No external benchmark or competitor is run or modified. Raw samples and frozen builds remain under P =
`temp/optimization_2026_11_11`.

Commands:

- `node P/stride-throughput.mjs tuplerange,wordcheck,splicecount 5 wordcheck-repeat-100 100`
- `node --expose-gc P/inlineack-replication.mjs tuplerange,wordcheck,splicecount splicecount`
- `node P/summarize-replication.mjs splicecount wordcheck splicecount`
- `node P/splicecount-inspect.mjs`
- `node P/full.mjs current,tuplerange,wordcheck,splicecount 5 recoverysplicecount`
