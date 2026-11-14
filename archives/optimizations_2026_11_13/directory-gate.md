# Reuse known gate ownership

Follow-up to [head ownership](directory-head.md). Owner selection now also
returns the positive gate when it contains the requested Frame, including its
first Frame during insertion. The original-coordinate boundary rules still run
after selection. This removes an unnecessary directory lookup without changing
mask anchors or adding state.

All 276 existing tests pass with 100% TypeScript coverage; all 192 exact
snapshot/serialization pairs match. The frozen build is `directory-gate`.

The [five-round targeted comparison](directory-gate-target.md) retains twelve
production cases at 1,000, 10,000 and 25,000 starting Strips, with unchanged
preparation, warmup, work, timing and verification. Of 36 medians, 14 improve
over 5% and 5 slow over 5%; none is slower in every matched pair. Apply
replacement remains 81.52–85.80% faster than the checkpoint. Same-index insertion
is -13.38%, +10.19% and +2.53%; head insertion is +3.95%, +1.07% and +12.14%.
Random value is +31.19% at 10,000 and +20.60% at 25,000. All differences and IQRs
are retained; the slower rows are not declared noise or accepted.

The known gate fix is necessary to avoid rediscovering an already located owner,
but this intermediate build does not establish an all-row improvement. It is
not accepted or published. The next experiment replaces circular directory
placement with a movable zero-weight gap. This removes repeated interior row
shifts at one editing location and two/three redundant prefix reductions in
Frame/position lookup, with the same field count and arena allocation. Its
random movement cost must also be measured.

```powershell
node temp/optimization_2026_11_12/production-control.mjs directory-gate-target fixed-table,directory-head,directory-gate head-production.mjs 5
```

All raw samples and sources remain under `temp/optimization_2026_11_12`.
Selected subsets are not pooled with complete-suite samples. No external runner
or adapter is changed or executed.
