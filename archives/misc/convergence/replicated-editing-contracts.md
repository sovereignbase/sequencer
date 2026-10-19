# Replicated editing contracts

Investigation for issue #5, compared with release 1.0.1 (`2487181`).
Correctness checks pass. Remaining throughput, storage, hydration and memory
regressions are tracked separately in
[issue #6](https://github.com/sovereignbase/sequencer/issues/6).

## Correctness

The changes preserve canonical mask coordinates through overlaps, keep causal
subtrees together, repair traversal jumps at the actual mutation boundary, and
build hydration jumps after all masks have been materialized. Footage spans are
consumed before their bindings are rebased. A contiguous insertion suffix follows
the existing canonical subtree at its old endpoint.

Verification at this checkpoint:

- All nine reduced issue histories pass.
- The eight generated configurations pass across 128 edit seeds: 1,024 histories.
- The eight nontrivial reduced histories pass across 32 Session seeds: 256 runs.
- Packed snapshot merges, including older snapshot redelivery, pass 4,608 checks.
- 212 Vitest tests pass with 100% statements, branches, functions and lines.
- 96 compatibility checks pass. Firefox cannot launch because the matching
  Playwright browser executable is unavailable; that compatibility run reports
  one failure rather than a successful Firefox result.

The tests exercise the public API, independent visible arrays, consumer Splices,
indexed and range reads, duplicate and reordered delivery, JSON snapshots and
subsequent edits. Production Session generation is unchanged.

## Why snapshot coordinates matter

Start with `a b c`, acknowledge removal of `b`, then hydrate one replica from its
compacted snapshot while another replica stays live. In 1.0.1 the snapshot changes
the positive Insertion's length from three to two. Its endpoint now means after
`c`; endpoint two still means before `c` in the live replica.

An acknowledgement frontier does not establish that both replicas have loaded
the same compacted coordinate space. Reusing the original identity with a
shorter coordinate space therefore makes subsequent Gossip ambiguous.

The current experiment retains canonical coordinates, mask identities and ACKs.
It omits acknowledged deleted Footage intervals and maps the surviving original
Frames to packed physical offsets. Gossip still contains six coordinate words;
the snapshot still contains one words array and one Footage array. Existing
plain and packed snapshots remain readable; omitted-interval snapshots require
the new reader.

## Unresolved compaction cost

One Actor starts with `root, tail` and repeatedly replaces the last Frame.
Every snapshot retains exactly two Footage values. Storage uses MessagePack;
gzip is applied to those encoded bytes. Hydration timings are the median of
20 measured constructor calls after five warmups; destruction is outside timing.

| Replacements | Implementation           | Metadata words | MessagePack bytes | Gzip bytes | Median hydration |
| ------------ | ------------------------ | -------------: | ----------------: | ---------: | ---------------: |
| 100          | 1.0.1                    |             15 |                37 |         47 |           4.5 µs |
| 100          | Direct canonical records |          1,513 |             3,401 |        945 |         117.7 µs |
| 1,000        | 1.0.1                    |             15 |                40 |         51 |           4.0 µs |
| 1,000        | Direct canonical records |         15,013 |            38,602 |      9,528 |         655.6 µs |
| 100          | Affine runs              |             73 |               148 |        114 |         188.5 µs |
| 1,000        | Affine runs              |             73 |               160 |        125 |         631.7 µs |

Affine runs now preserve adjacent coordinate patterns without expanding metadata
word count as these repeated edits accumulate. They retain every identity and
original Frame interval. The implementation holds at most six records for
lookahead and keeps the original record order.

Hydration still expands the run and materializes every canonical operation.
The remaining constructor cost prevents treating this branch as a completed
performance-preserving fix. The smaller serialized form alone does not resolve
the runtime memory or materialization cost.

A lazy materialization experiment for completely masked sibling pairs did not
improve this workload, whose operations form an anchor chain. That experiment
was removed. The retained implementation still reconstructs every canonical
operation; no constructor or runtime-memory improvement is claimed.

These timings use Node 24.16.0, V8 13.6.233.17-node.49, win32 x64. The two
implementations use the same Session entropy seed, 42. Separate rows are separate
measurement runs; single-call snapshot timings were not used as acceptance data.

## Throughput measurements

The existing 39-case throughput harness was compared with alternating execution
order, identical initial snapshots, three warmups and 12 measured pairs. Prepared
Gossip was compared for exact equality, including Session words. Short scalar
reads repeated for at least 50 ms; other bursts used the existing 100 ms bound
and 10,000-call limit. Fixture construction and explicit JS process garbage
collection were outside timing.

The complete sweep still contains slower positional mutation results. A targeted
40-pair run alone is insufficient to accept the change. Neither sweep measures
the compaction-heavy hydration workload above.

An unnecessary empty Footage array was also removed from removal-only Splice
construction. This reduces transient JavaScript allocations; it does not resolve
the retained-history regression.
