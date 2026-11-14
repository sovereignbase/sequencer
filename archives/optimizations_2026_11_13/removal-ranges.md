# Removal intervals — both builds rejected

Checkpoint sequence profiling attributes approximately 45% of candidate self
samples to native dispatch, 12.5% to removal-map insertion and 32.4% to JS
Footage materialization. The 20,000-Strip scale-down sequence has the same
breakdown: 42.9%, 13.1% and 34.6%. These are diagnostic sample shares, not
independent elapsed times. The separate concat probe preserves all 12
checkpoints and records span/part counts; the slower down/20,000 case has
16,264 parts, below the existing 16,384-argument chunk boundary. Raising that
boundary would not address this repeated loss.

Try replacing per-original-Frame deletion marks with ordered consumed intervals
and cumulative removed counts. Each interval needs two Words; the per-Insertion
state remains one Word and a vector. Adjacent masks merge. Capacity is bounded
by the maximum number of disjoint, nonadjacent intervals in the original extent.
Export emits surviving gaps directly, and anchors query removed-prefix counts
by binary search. No live Projection field or wire metadata is added.

Both builds pass all 277 Vitest tests at 100% TypeScript coverage and all 192
exact snapshot/serialization comparisons. A supplementary public-API check
compares 27 long, sparse and alternating-removal snapshots, recreated values
and subsequent edits with the retained build; all agree exactly. Every lifecycle
storage row also remains unchanged.

## Inlined prefix lookup

The first build grows Wasm from 90,048 to 91,578 bytes. Prefix lookup is inlined
at its call sites. Its [five-pair lifecycle table](removal-ranges-lifecycle.md)
has 38 medians over 5% faster and 11 over 5% slower against the checkpoint;
empty scale-down sequence is +12.83%, slower in every pair. The
[parent comparison](removal-ranges-vs-parent.md) retains mixed checkpoint results,
including several slower sequence medians. This is not sufficient to retain
the change.

## Outlined prefix lookup

Keeping lookup in one native function reduces Wasm to 90,072 bytes, 1,506 bytes
below the first attempt and 24 above the parent. It passes the same semantic
checks. Its [lifecycle comparison](range-before-lifecycle.md) has 44 medians over
5% faster and nine over 5% slower against the checkpoint; down/20,000 sequence
is still +5.94%, slower in every pair. The
[parent comparison](range-before-vs-parent.md) has an every-pair up/5,000 values
loss of +21.55% (paired +21.73%, IQR 7.81 pp), plus a smaller create loss.

The [five-pair long-Insertion comparison](range-before-long.md) exposes the
representation tradeoff. Against the parent, a 1,024-Frame Insertion with one
removed Frame improves 53.11%; 100,000 Frames with sparse removals improves
42.30%. Eight-Frame alternating removal, however, worsens 9.85%, and
1,024-Frame alternating removal worsens 30.61%, both slower in every pair.
The inlined build has the same tradeoff: 5.99% and 26.62% alternating losses.
These are supplementary workloads; they do not replace the production guard.

Reject both builds and restore the original dense removal-prefix map. No claim
of complete-suite acceptance, lower measured peak heap use or universally faster
compaction is made. The raw profiles, diagnostic copies, exact checks, frozen
sources and every measurement remain under `temp/optimization_2026_11_12/`.

```powershell
node temp/optimization_2026_11_12/prepare-sequence-diagnostics.mjs
node --expose-gc temp/optimization_2026_11_12/profile-sequence-checkpoints.mjs reserved-slot 5
node temp/optimization_2026_11_12/production-control.mjs removal-ranges-lifecycle fixed-table,reserved-slot,removal-ranges lifecycle-control.mjs 5
node temp/optimization_2026_11_12/production-control.mjs range-before-lifecycle fixed-table,reserved-slot,range-before lifecycle-control.mjs 5
node --expose-gc temp/optimization_2026_11_12/check-removal-ranges.mjs reserved-slot removal-ranges range-before
node temp/optimization_2026_11_12/production-control.mjs range-before-long reserved-slot,removal-ranges,range-before long-sequence.mjs 5
```
