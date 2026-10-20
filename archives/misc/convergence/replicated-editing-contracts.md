# Replicated editing and acknowledgement contracts

The mask-retention approach in commit `84f20c3` was rejected because it changed
the model. Its passing tests and performance figures do not establish a valid
compaction implementation. PR #7 was closed without merging.

## Required model

Register all active Actors, including offline Actors, before removals. An
Actor-only acknowledgement admits membership. A removal Session is eligible
only when every active Actor reports the same complete Session frontier.
Missing or unequal claims block that Session; compaction is not a minimum
frontier or partial-prefix rule.

Eligible masks, wholly removed positive Insertions, deleted Footage and
compacted Session claims disappear from exported Sequences. Actor membership
remains. Export does not rewrite the running Projection. Retained checkpoints
may shorten positive Insertions and translate surviving anchors.

Unregistered offline replicas do not impose retention requirements. Tests must
not permit compaction and then require those replicas' discarded anchors to
resolve. Registered offline history must arrive before its complete frontier is
acknowledged. Further editing uses compatible retained checkpoint coordinates.

## Correction

Original mask-absence assertions are restored. The invalid tests requiring
permanent historical mask identities are replaced with Actor registration,
blocked compaction, whole-Session agreement, mask removal, retained membership,
JSON checkpoint editing, pending dependencies and consumer Splice checks.

The sparse Footage codec, affine mask-history codec, original Frame interval
maps, physical content-length state and separate packed-snapshot merge path
have been removed. Normal anchoring, overlap, subtree, extension, Splice rebasing
and traversal correctness fixes remain.

Measurements and remaining performance work are tracked in
[issue #6](https://github.com/sovereignbase/sequencer/issues/6). Use the corrected
ACK contract when interpreting any new results.

## Verification

All 212 Vitest tests pass across 55 files, with 100% TypeScript statement,
branch, function and line coverage. The additional 1,024-case development matrix
passes: eight delivery/restart configurations × 128 seeds × 80 edit intents,
covering 2–5 Actors, unordered and duplicate delivery, Splice replay, reads,
hydration and ACK-gated compaction. Shared compacted restarts also reset the
chronological replay checkpoint.

Compatibility verification passes 96 checks. Firefox is the sole failed runner
because its matching Playwright executable is absent; it does not run the API
suite. Typechecking, formatting and generated TypeScript/C++ documentation are
verified separately. Coverage refers to TypeScript, not native branch coverage.

## Corrected runtime measurements

Compared with 1.0.1 (`2487181`). Each document starts with 1,000 edits, using
1–100 Frames per insertion. The linear fixture is one extended Insertion; the
random fixture has insertions at seeded random visible positions. Both versions
receive identical initial state and matching prepared Gossip, including Session
words. Five warmups precede 24 paired rounds, alternating execution order.
Scalar reads run for at least 50 ms; other methods use the existing 100 ms /
10,000-call burst limit. Preparation, explicit JS process garbage collection and
post-burst visible-value checks are outside timing. If both bursts finish the
same call count, their resulting visible values must match.

Each percentage is the geometric mean of the paired throughput ratios. Brackets
show an approximate 95% interval over log ratios. These are development-machine
measurements of these fixtures, not guarantees for other workloads.

| Method                   | Linear throughput change | Random throughput change |
| ------------------------ | -----------------------: | -----------------------: |
| `apply.duplicate`        |     -0.5% [-3.1%, +2.2%] |     -0.2% [-6.5%, +6.6%] |
| `apply.duplicateRemove`  |     +0.9% [-1.7%, +3.5%] |    -3.2% [-10.3%, +4.5%] |
| `apply.duplicateReplace` |     +0.8% [-1.8%, +3.5%] |     -5.3% [-7.8%, -2.8%] |
| `apply.insert`           |    +5.7% [-1.3%, +13.2%] |     -1.3% [-6.7%, +4.4%] |
| `apply.remove`           |    +8.0% [+5.4%, +10.6%] |    +8.4% [+5.2%, +11.7%] |
| `apply.replace`          |     -1.1% [-3.2%, +1.0%] |     +0.6% [-0.8%, +1.9%] |
| `create.empty`           |     +3.0% [-2.4%, +8.7%] |    +6.3% [+1.6%, +11.3%] |
| `create.sequence`        |     +3.1% [+1.6%, +4.7%] |   +15.5% [+1.9%, +31.0%] |
| `insert.head`            |    +1.2% [-7.5%, +10.6%] |    +3.7% [-5.2%, +13.4%] |
| `insert.middle`          |     -0.3% [-7.4%, +7.3%] |    +2.6% [-4.6%, +10.3%] |
| `insert.random`          |     -2.8% [-6.0%, +0.5%] |     -0.3% [-2.9%, +2.4%] |
| `insert.sameIndex`       |    +6.9% [+1.7%, +12.4%] |    -2.5% [-11.1%, +7.0%] |
| `insert.tail`            |    -3.7% [-10.8%, +3.9%] |     +2.8% [-2.9%, +8.8%] |
| `length`                 |     -0.8% [-5.8%, +4.5%] |  +65.3% [+61.0%, +69.7%] |
| `merge.duplicate`        |     +6.3% [+4.5%, +8.1%] |     -1.4% [-4.0%, +1.3%] |
| `merge.insert`           |     +1.7% [-4.5%, +8.2%] |     -3.4% [-8.1%, +1.6%] |
| `remove.head`            |     -2.2% [-9.2%, +5.4%] |     -0.1% [-2.5%, +2.4%] |
| `remove.middle`          |     +1.5% [-3.3%, +6.5%] |   +10.2% [+8.1%, +12.3%] |
| `remove.random`          |     -1.9% [-3.5%, -0.1%] |   +14.1% [+6.8%, +22.0%] |
| `remove.sameIndex`       |     +0.1% [-1.9%, +2.2%] |  +23.5% [+13.7%, +34.1%] |
| `remove.tail`            |     +3.8% [+0.8%, +6.9%] |    +3.5% [-4.2%, +11.8%] |
| `replace.head`           |     -1.9% [-8.4%, +5.1%] |    -8.0% [-19.0%, +4.7%] |
| `replace.middle`         |     -4.6% [-6.2%, -2.9%] |     +1.4% [-1.4%, +4.2%] |
| `replace.random`         |     +4.3% [+1.9%, +6.6%] |    +2.6% [-5.8%, +11.7%] |
| `replace.sameIndex`      |     -2.2% [-4.7%, +0.4%] |    -6.9% [-14.3%, +1.3%] |
| `replace.tail`           |    +6.6% [-3.9%, +18.3%] |     +0.2% [-2.7%, +3.1%] |
| `retire`                 |   +22.7% [+7.6%, +39.9%] |     -0.1% [-6.4%, +6.6%] |
| `sequence`               |     -3.2% [-7.4%, +1.1%] |     -4.3% [-7.5%, -0.9%] |
| `value.head`             |  +43.0% [+39.0%, +47.1%] |  +42.0% [+37.2%, +47.0%] |
| `value.middle`           |  +31.4% [+24.8%, +38.2%] |  +48.4% [+45.2%, +51.7%] |
| `value.random`           |  +30.3% [+22.2%, +39.1%] |     +0.5% [-3.2%, +4.4%] |
| `value.sameIndex`        |   +22.1% [+8.1%, +37.9%] |  +30.1% [+26.6%, +33.7%] |
| `value.tail`             |  +29.2% [+25.9%, +32.6%] |  +69.9% [+64.4%, +75.4%] |
| `values`                 |     +3.5% [-2.0%, +9.3%] |     +1.7% [-5.1%, +9.0%] |
| `values.head`            |  +36.0% [+19.2%, +55.1%] |     +2.6% [+1.5%, +3.6%] |
| `values.middle`          |  +31.3% [+15.4%, +49.4%] |     +3.6% [+2.3%, +4.9%] |
| `values.random`          |  +31.4% [+15.8%, +49.2%] |     +3.3% [+1.8%, +4.9%] |
| `values.sameIndex`       |  +34.4% [+17.9%, +53.3%] |     +6.4% [+5.0%, +7.8%] |
| `values.tail`            |  +36.9% [+18.9%, +57.8%] |     +7.0% [+5.9%, +8.1%] |

The principal native changes are a direct visible-gate hit, skipping absolute
position searches when only repairing jumps, preserving a rounded jump spacing
until its next integer boundary, reserving the known identity-table capacity,
and advancing directly through the same Insertion’s fragment chain before
walking child subtrees. CPU profiling located the fragmented hydration cost in
`find_containing_fragment` → `subtree_end`. The completed hydration traversal
index is still built from final Structural Order.

Remaining negative intervals include linear `replace.middle` (−4.6%), linear
`remove.random` (−1.9%), random `apply.duplicateReplace` (−5.3%) and random
`sequence` (−4.3%). A subsequent million-call `replace.middle` CPU-profile run
measured approximately 1.90 µs/call versus 1.92 µs/call in 1.0.1, including
automatic JS process garbage collection. That longer run does not invalidate
the shorter paired result. These figures establish several improvements, not
universal absence of regressions. Identical operations such as `length()` can
also differ through JS engine optimization and benchmark context; their
measured ratios are not attributed to a new native algorithm.

## Retained state and one-instance memory

Full snapshots include ACKs, metadata and Footage. The following sizes are
identical in 1.0.1 and the corrected runtime for the matched Session seed 42.

| Document      | Metadata words | MessagePack bytes | Gzip bytes |
| ------------- | -------------: | ----------------: | ---------: |
| linear        |              7 |           132,674 |      2,570 |
| random        |           3986 |           142,421 |     10,750 |
| compacted100  |             15 |                37 |         47 |
| compacted1000 |             15 |                40 |         51 |

The replacement fixtures retain two positive Insertions and no masks. Their
metadata stays at 15 words from 100 to 1,000 replacements; the byte difference
comes from the retained value. No deleted-operation identity list is encoded.

The library estimate counts one instance’s Wasm linear memory plus eight bytes
per retained JS array slot. Values’ own object graphs, JS array headers and JS
process memory are excluded, consistently with the existing benchmark. Each
measurement starts an isolated runtime and excludes peer allocations. Both
versions reserve the same 1,024 KiB Wasm page allocation in these fixtures.

| Document      | Live library estimate, KiB | Rehydrated checkpoint estimate, KiB |
| ------------- | -------------------------: | ----------------------------------: |
| linear        |                    1419.06 |                             1419.06 |
| random        |                    1426.54 |                             1434.34 |
| compacted100  |                    1026.40 |                             1024.08 |
| compacted1000 |                    1047.49 |                             1024.08 |

These estimates are equal to 1.0.1. Initial native Strip arena capacity is
reduced from eight to four slots (688 → 344 bytes); the spacing cache costs
eight bytes per Projection. The net initial native saving is 336 bytes, which
does not reduce the already reserved Wasm page allocation. The arena grows
geometrically as before. Export compacts a snapshot; the live Projection keeps
its graph until destruction or replacement by a retained checkpoint.

An independent constructor check used 500 warmups and 40 alternating paired
batches of 200 constructions, with destruction and explicit JS process garbage
collection outside the timed construction loops. Median per-call times:

| Checkpoint    | 1.0.1, µs | Corrected, µs |
| ------------- | --------: | ------------: |
| linear        |      1.68 |          1.62 |
| random        |    215.91 |        180.08 |
| compacted100  |      1.99 |          1.99 |
| compacted1000 |      2.25 |          1.83 |

Random-document construction improves by 20.8% in this separate paired check
(approximate 95% interval +17.6% to +24.1%). The 1,000-replacement checkpoint
improves by 23.5% (+14.1% to +33.7%). Intervals for the linear and
100-replacement checkpoints include no change.

The generated Wasm module is 92,849 bytes, versus 121,270 bytes in the rejected
implementation and 85,402 bytes in 1.0.1. This is the generated module file size,
not the complete minified package bundle.

Measured on Node v24.16.0, V8 13.6.233.17-node.49, win32 x64,
Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
