# Reuse fitting snapshot output buffers

The ABI already owns the last native snapshot. Export now fills that object
instead of constructing another pair of vectors and moving them over the previous
result. Clear its words, spans and sharing candidate before writing. If either
old capacity exceeds this call's original reservation hint, release both first.
Otherwise reuse fitting buffers or reserve the same capacity as before.

This preserves the original starting capacities and subsequent vector growth.
A smaller snapshot cannot retain the previous larger snapshot's buffers. The
change differs from the rejected Gossip reuse experiment: it does not shrink
completed output, so it introduces no final shrink allocation or copy. No
per-Projection field, public API, compaction rule, encoded word or Footage order
changes. This removes allocations; it adds no SIMD, ILP or MLP claim.

All 279 tests pass with 100% TypeScript coverage: 441 statements, 302 branches,
32 functions and 395 lines. All 192 exact snapshot and encoding pairs match.
A separate diagnostic alternates large, repeated large, small, repeated small,
large again, empty, tuple, small after tuple and empty snapshots. Every snapshot
and final native allocated-byte count matches the parent exactly across all
nine phases. The shared library allocation is 397,848 B after large exports,
336,480 B after small exports, 336,448 B after empty exports and 336,936 B after
the tuple export. These totals include all simultaneously live fixture instances.
Raw comparisons and assertions are in `temp/optimization_2026_11_12/snapshot-buffer-memory*`.

The [five-pair target](snapshot-reuse-target.md) selects seven unchanged
production cases at six checkpoints. Against the checkpoint, 21 of 42 medians
improve and six worsen by more than 5%. Short sequence calls at 1,000–25,000
improve 14.08–24.53%; the 100-Strip median remains +35.77%, with mixed pairs.
Apply.insert at 20,000 is +1.08% (paired +1.63%, IQR 1.97 pp), and snapshot
construction at 100 is +9.80% (paired +7.62%, IQR 13.14 pp), both slower in every
pair. These rows are retained.

Against the [immediate parent](snapshot-reuse-vs-parent.md), twenty medians
improve and six worsen by more than 5%. The only every-pair loss is scalar tail
read at 10,000 (+4.20%, paired +6.28%, IQR 7.29 pp). These selected samples are
not pooled with complete-suite results.

The [collector](snapshot-reuse-space.md) confirms unchanged native allocation
shapes. Wasm shrinks from 88,969 to 88,952 B; ESM raw shrinks 121 B, but minified
ESM grows 45 B, gzip 4 B and Brotli 58 B against the parent. Several Brotli
encodings remain larger than the checkpoint; no all-artifact win is claimed.
The linked dispatcher remains inlined at 14,997 WAT lines versus 15,001; the
constructor remains one 759-line body. The fitting-capacity branch controls
reuse; no engine-specific vectorization benefit is assumed.

The complete five-pair, three-build guard uses raw prefix
`temp/optimization_2026_11_12/snapshotreusefull-*`. Frozen sources and diagnostic
artifacts remain under `snapshot-reuse*` in that directory. Acceptance is open.

## Complete guard

The [primary five-pair comparison](snapshot-reuse-performance.md) has 206 of 409
non-length medians over 5% faster and 57 over 5% slower, with twenty every-pair
losses. The [identical-control comparison](snapshot-reuse-aa-performance.md) has
46 faster and 82 slower medians, with fifteen every-pair losses despite identical
code. The [second checkpoint comparison](snapshot-reuse-control-performance.md)
has 217 faster and 58 slower medians, with fourteen every-pair losses. Twenty
space rows shrink; the remaining 76, including serialized sizes, match.

Full-lifecycle random apply improves 70.21%, random removal 69.00%, random
replacement 60.89%, tail replacement 49.33% and random scalar reads 82.98%.
The large gains remain, but all-row acceptance is not achieved.

Three cases are slower in every pair against both independently run checkpoints:

| Case                         | Change vs primary | Paired change | Paired IQR, pp |
| :--------------------------- | ----------------: | ------------: | -------------: |
| 1,000/apply.duplicate        |           +12.18% |       +10.74% |          12.46 |
| 25,000/apply.duplicateRemove |            +6.70% |        +8.44% |           8.08 |
| 10,000/create.sequence       |           +16.13% |       +16.76% |           0.42 |

The other primary every-pair losses, including range reads and 100-Strip tail
insertion, remain in the full table. They are not cleared by the intersection
filter. The next experiment reduces the identity table's minimum allocation
without adding state or changing its load limit.
