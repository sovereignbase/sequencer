# Rejected: separate snapshot and visible readers

Checkpoint CPU profiles locate about 82% of values samples in JavaScript
`readValues`. The function contains both visible-array copying and snapshot
grouping/concatenation. A diagnostic V8 trace records repeated on-stack
compilation and insufficient-feedback bailouts. The candidate moves the existing
snapshot loop into a separate `readSequence` function and removes the optional
mode argument. Zero/single-span snapshot reads retain their existing path.
No copying algorithm, ownership rule, metadata or public signature changes.

All 276 tests pass, with 100% TypeScript coverage, both type checks and all
192 exact snapshot/serialization pairs. The linked Wasm SHA-256 is unchanged:
`CA40B758062A009D980B8F0BD43B3A243A36108695BF04AC2381B30CB175D2B7`.
No native structure, allocation representation or SIMD loop changes. This
experiment concerns JavaScript function/feedback organization, not SIMD or MLP.

The [five-pair complete lifecycle comparison against the preceding build](footage-readers-vs-parent.md)
rejects the hypothesis. Values improves 59.52% at up/10,000 and 64.17% at
up/15,000, but repeatedly worsens elsewhere:

| Checkpoint / method | Median change | Paired change | Paired IQR, pp | Slower pairs |
| :------------------ | ------------: | ------------: | -------------: | :----------- |
| up/25,000 values    |       +14.64% |       +10.59% |          10.52 | 5/5          |
| down/10,000 values  |       +12.32% |       +25.13% |          22.81 | 5/5          |
| down/5,000 values   |       +67.02% |       +39.64% |          60.91 | 5/5          |
| down/1,000 values   |      +116.63% |      +139.72% |          57.51 | 5/5          |
| down/1,000 sequence |       +17.79% |       +12.39% |          19.38 | 5/5          |

All 75 lifecycle/checkpoint timings and 72 memory/storage rows remain in that
table. The [checkpoint comparison](footage-readers-lifecycle.md) is retained
separately. These targeted results are not pooled with previous full-suite runs.
Production fixtures, warmups, editing, acknowledgement exchange, compaction,
recreation and timing limits remain unchanged. No expectation is weakened.

Rejected and fully reverted from source. No complete throughput/tuple acceptance
is claimed for this failed target. Frozen sources, emitted JS, raw measurements,
test logs and module hashes remain under
`temp/optimization_2026_11_12/footage-readers*`.

```powershell
node temp/optimization_2026_11_12/production-control.mjs footage-readers-lifecycle fixed-table,directory-lazy,footage-readers lifecycle-control.mjs 5
node temp/optimization_2026_11_12/lifecycle-report.mjs footage-readers-lifecycle directory-lazy footage-readers 5
node temp/optimization_2026_11_12/extract-linked.mjs footage-readers
```

The next independent experiment retains the original reader and hoists its
missing-source decision outside the per-Frame copy loop, with no extra helper
or allocation.
