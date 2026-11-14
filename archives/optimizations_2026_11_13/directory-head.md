# Reuse known head ownership

Follow-up to the [directory experiment](directory.md). The head-insert profile
finds directory lookup in 15 of 120 classified insert self samples. Splitting
the visible head at its first Frame leaves the original fragment with zero
weight. The visible right fragment is already known, but generic endpoint repair
rediscovers it through the directory.

The candidate hands head ownership to that right fragment during splitting.
Positive placement can then recognize insertion immediately before the visible
head. Frame lookup also uses the maintained head when its visible extent owns
the requested position. Original-coordinate boundary rules still run after
owner selection; canonical anchors are unchanged.

Arena growth also transfers its former owner only after successful allocation,
retaining it until the directory view is rebound. Allocation failure therefore
keeps the previous arena owned; no new allocation or retained state is added.

All 276 existing tests pass with 100% TypeScript coverage, and all 192 exact
snapshot/serialization pairs match. The frozen candidate is `directory-head`.

The [five-round targeted comparison](directory-head-target.md) includes twelve
unchanged production cases at 1,000, 10,000 and 25,000 starting Strips. Its
checkpoint → candidate medians for head insertion are +1.44%, +0.56% and -0.03%,
and none is slower in all five pairs. This removes the earlier large head loss
in that subset. Apply replacement remains 83.66–86.03% faster. Random removal
and replacement improve by 21.13–24.57% and 15.13–16.65% respectively.

The candidate is not accepted as an all-row improvement. Same-index insertion
still slows by 16.69% at 10,000 and 26.82% at 25,000 Strips, both slower in every
pair. Head removal at 10,000 is +0.71%, also slower in every pair. All slower
rows, IQRs and raw samples remain visible. This selected subset is not pooled
with complete-suite timings.

The same-index path exposes the next redundant lookup: owner selection checks
the gate's neighbors but omits the positive gate itself when insertion requests
its first Frame. The initial cache path excludes that boundary because it still
requires original-coordinate boundary handling. Returning the known gate from
owner selection preserves that handling while removing directory lookup. This
is measured as a separate candidate, `directory-gate`.

```powershell
node temp/optimization_2026_11_12/production-control.mjs directory-head-target fixed-table,directory,directory-head head-production.mjs 5
```

Raw output and frozen builds remain under `temp/optimization_2026_11_12`.
No complete guard is claimed for this rejected intermediate candidate; the
known same-index regressions already prevent acceptance. No external benchmark
runner or adapter was changed or executed.
