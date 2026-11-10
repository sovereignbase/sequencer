# Rejected weighted traversal indices

Baseline: `e13815837934e5a6814fa7744ffbcaac7526a9e6`. None of the tree
implementations below is retained. Their large-document gains did not satisfy
the requirement to preserve performance on small documents and repeated edits.

## Target and evidence

The unchanged CRDT benchmark workloads exposed expensive position lookup during
concurrent insertion and editing. In the original B4 profile, `position_of`
accounted for 335.8 ms of self time and `find_frame` for 97.9 ms. The first
profiles used the earlier JSON runner. Its encoding cost is not treated as
Sequencer execution time or compared with the subsequently updated MessagePack
runner at `1a3133a`.

The experiment replaced six jump lanes with four weighted-tree lanes: parent,
left child, right child and positive subtree Frame count. Structural links,
canonical anchors, competition, masks, clocks and Acknowledgements retained their
existing rules. Hydration built the tree after materializing history.

This removed about 370 implementation lines and eight bytes per allocated Strip
slot. An intermediate splay implementation reduced the minified ESM bundle from
130,538 to 124,798 bytes, and minified + gzip from 46,273 to 43,702 bytes.
These are rejected-candidate measurements, not improvements in the retained code.

## Why the alternatives were rejected

| Alternative                                    | Observed failure                                                                                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Splay tree with linked endpoint repair         | Tail replacement repeatedly scanned retained masks and became roughly eight times slower.                                                                      |
| Splay tree with weighted endpoint repair       | Fixed the scan and reduced full-lifecycle random apply time by 62.2%, but did not establish an acceptable result for repeated tail edits and small operations. |
| Unrotated lookup and rank reads                | Let long zero-weight paths persist; tail replacement became 755.5% slower on the large fixture.                                                                |
| Depth-triggered lookup rotations               | Fixed tail replacement, but small-document random insert, remove and replace became 36.2%, 15.6% and 22.3% slower.                                             |
| Treap with priorities mixed from arena indices | Reduced rotation work for random insertion, but updating ancestor weights made repeated head and middle edits substantially slower.                            |
| Splay tree with adjacent tree fields           | Improved locality without resolving small-document random edit and read regressions.                                                                           |

The treap used a bijective uint32 mix rather than stored priorities, and built its
Cartesian tree in linear time using parent links as the construction stack. The
packed splay experiment kept canonical and fragment fields in SoA lanes, grouping
only the four tree fields into sixteen-byte nodes. Both variants saved memory;
neither met the performance requirement.

The small random-insertion profile of the depth-triggered version attributed
100.3 ms of self time to `index_splay`, comparable with 101.5 ms in `anchor_strip`.
Avoiding pointer walks alone did not remove enough work: rotations and ancestor
updates became new costs.

## Measurement and correctness

Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U.
Emscripten 7.0.0, Release/LTO, SIMD, bulk memory and Wasm exceptions. Compiler
flags and the repository's benchmark workloads were unchanged.

The fresh baseline and the first two candidates ran all lifecycle, throughput
and tuple benchmarks three times. The complete comparison contained 424 timing
rows. Later candidates were rejected by focused public-API comparisons before
another full-suite run.

Focused comparisons used ten counterbalanced measured rounds after four warmup
rounds, independent named callers and an additional byte-identical baseline
build. Small and large fixtures contained 100 and 20,000 canonical roots of
32 Frames each. Timings excluded fixture hydration and result verification;
every measured receiver's final values were checked. Medians and interquartile
ranges, rather than selected individual runs, determine the rejection.

All final variants of the attempted trees passed the existing 272 tests without
changing their expectations. During development, an omitted insertion-boundary
condition failed two property tests; restoring the complete original condition
fixed the error. An additional two-peer check compared 192 canonical snapshots
with the baseline across append, prepend, random and mixed editing, Session
seeds including zero and UINT32_MAX, ACK exchange and reconstruction. Snapshot
formats were not changed to obtain the memory savings.

## Generated code and parallelism

The tree walks and rotations remained scalar. A lookup's next node depended on
the preceding load, so neither SIMD nor independent memory streams removed that
latency. Packing the four tree fields reduced distinct address calculations and
memory regions touched by a rotation; it did not introduce SIMD or prove an MLP
gain. One rotation variant reused the unchanged total subtree weight instead of
recomputing the rotated root's sum, after ensuring ancestor sums were valid.

The tiny-read investigation also found an apparent fourfold `length()` slowdown
in a full tuple run. The emitted accessor differed only in its native field
offset. Ten-round named-caller checks with a byte-identical control measured
approximately six nanoseconds for all versions. That observation does not excuse
the reproducible mutation regressions above.

Profiles, frozen builds, complete raw reports and measurement scripts remain
locally under `temp/optimization_2026_11_10_competitive/`. Relevant files include
`baseline-b4.cpuprofile`, `splay4-small-random.cpuprofile`,
`splay2-comparison.json`, and the `*-local-summary.json` tables. The rejected
implementation is absent from `src`.
