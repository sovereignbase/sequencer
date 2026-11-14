# Stable traversal block records

Directory relocation previously copied five ordered columns and rewrote a
node-indexed ordinal. The new layout keeps only Frame weights and block tokens
in ordered rows. Stable four-word records contain each block's first node, last
node, node count and physical ordinal. Nodes retain their block token; the
per-node ordinal lane is removed. Relocation copies two words and updates one
ordinal. All storage remains in the existing arena allocation.

This adds four bytes per reserved directory row while removing four bytes per
arena slot. With the subtree endpoint cache included, the arena has eight word
lanes instead of the checkpoint's twelve. Canonical Insertions remain 36 bytes;
exported metadata, Footage and acknowledgement semantics are unchanged.

All 276 existing tests pass with 100% TypeScript coverage. All 192 exact
snapshot/serialization pairs and all 36 eight-author replay cases, including
duplicates, match the checkpoint. No test, expected result or benchmark workload
changes. The [eight-author timings](directory-records-concurrent.md) contain all
samples; 30 medians improve by more than 5%, one worsens by more than 5%, and none
is slower in every pair. These short bursts do not establish full-suite
acceptance.

The [five-pair production lifecycle comparison](directory-records-lifecycle.md)
measures random apply 70.10%, random removal 69.49%, random replacement 61.98%
and random values 83.25% faster than the paired checkpoint. Full-lifecycle head
insertion changes by -2.93%; no lifecycle timing row is slower in all five
pairs. Twelve medians still worsen by more than 5%, so the complete throughput
and tuple guard remains necessary.

The [same-run comparison with the preceding cache build](directory-records-vs-cache.md)
isolates the layout change: head insertion improves 8.35%, tail insertion 6.50%,
while tail replacement's median worsens 5.66% (paired median 2.38%, paired IQR
4.73 percentage points). These results are retained without treating the latter
difference as resolved.

The [allocation and artifact measurements](directory-records-space.md) report
16 fewer native bytes per empty Projection, 48 fewer for an intact positive
Insertion and 306.6864 fewer for the edited eight-Frame fixture. Raw ESM shrinks
1,256 bytes, minified ESM 1,121, minified ESM gzip 204, and raw Wasm 766. Every
measured bundle/module encoding is smaller than the checkpoint. These native
allocation figures exclude reserved Wasm capacity and process RSS.

## Generated code

The final linked production module is extracted from the exact frozen bundle
used for measurement. Its insertion body contains 1,855 disassembly lines,
76 scalar load sites and 34 scalar store sites, compared with the earlier
circular directory's 2,484, 99 and 45. These are static instruction sites, not
dynamic counts; the earlier body also differs in range refresh outlining.
The ordered relocation loops now update two columns and one record ordinal.
Growth copies the stable record table with one `memory.copy` site.

Contiguous Frame reductions retain SIMD: the insertion body has three vector
load and nine vector-add sites, and position lookup also has three and nine.
Lookup's top/group/row selection remains scalar. Independent row-column loads
offer ordinary ILP; no speculative unrolling is added. Structural node walks
remain dependent, and no MLP gain is claimed.

```powershell
node temp/optimization_2026_11_12/production-control.mjs directory-records-lifecycle fixed-table,subtree-cache,directory-records lifecycle-control.mjs 5
node temp/optimization_2026_11_12/lifecycle-report.mjs directory-records-lifecycle fixed-table directory-records 5
node temp/optimization_2026_11_12/directory-concurrent-report.mjs directory-records-concurrent directory-records
node temp/optimization_2026_11_12/extract-linked.mjs directory-records
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_12/directory-records-linked.wasm -o temp/optimization_2026_11_12/directory-records.wat
node temp/optimization_2026_11_12/directory-inspect.mjs directory-records
```

Frozen sources, symbols, raw measurements, hypotheses and disassembly remain
under `temp/optimization_2026_11_12`. No external runner or adapter is modified.
The complete five-pair guard includes an unchanged checkpoint copy to expose
measurement variation; its outcome determines whether this candidate can be
retained.

## Complete guard

All five full runs per build finished. Excluding length, the
[complete checkpoint comparison](directory-records-performance.md) contains
409 timing rows: 140 medians improve more than 5% and 82 worsen more than 5%.
Twenty-six rows are slower in every pair. The
[unchanged checkpoint comparison](directory-records-aa-performance.md) itself
has 74 medians over 5% faster, 79 over 5% slower and 23 rows slower in every pair.
The [second checkpoint comparison](directory-records-control-performance.md)
has nine candidate rows slower in every pair. Variation in a control is not
used to dismiss a candidate regression.

Full-lifecycle random removal improves 66.79%, random replacement 60.16%, tail
replacement 48.47% and random value lookup 83.19% against the primary checkpoint.
No lifecycle/checkpoint timing row is slower in every pair. However, at 1,000
starting Strips, apply(remove) worsens 13.93%, duplicate insert/remove/replace
application worsens 26.52–29.58%, and head removal worsens 15.99%, each slower
in all five pairs against the primary checkpoint. Several short value and
constructor cases also worsen. The all-row condition is not met.

Nineteen native allocation rows shrink, including every changed lifecycle and
tuple allocation row. All 77 other memory/storage rows are unchanged. The
25,000-Strip lifecycle checkpoint uses 9.05% fewer live native bytes; serialized
snapshot sizes remain identical. No external competitor measurement is claimed.

The follow-up selects every throughput row with a median more than 5% slower
against either checkpoint, plus every row slower in all five pairs against
either checkpoint. It retains the production fixtures, warmups, timing bounds,
checks, seeds and original per-scale case order. Scale/case selection differs
from the full suite and its samples will not be pooled with full-suite samples.
Three-build rotating/reversed order and five matched rounds are retained.

```powershell
node temp/optimization_2026_11_12/full.mjs fixed-table,fixed-control,directory-records 5 directoryrecordsfull
node temp/optimization_2026_11_12/compare.mjs directoryrecordsfull fixed-table directory-records 5
node temp/optimization_2026_11_12/compare.mjs directoryrecordsfull fixed-table fixed-control 5
node temp/optimization_2026_11_12/compare.mjs directoryrecordsfull fixed-control directory-records 5
node temp/optimization_2026_11_12/production-control.mjs directory-records-regressions fixed-table,fixed-control,directory-records records-regression-production.mjs 5
```

The [five-pair follow-up](directory-records-regressions.md) covers 91 selected
throughput rows. Against the primary checkpoint, apply(remove) at 1,000 changes
by +1.74% (paired -2.61%, IQR 9.25 pp); duplicate insert/remove/replace application
changes by +1.73%, -0.02% and -0.07%. None is slower in every pair. The full guard's
large losses do not repeat in this subset; samples from the different selections
are not pooled.

Two rows remain slower in every pair against the primary checkpoint:
1,000-Strip tail insertion has median +8.20%, paired +1.23%, IQR 6.08 pp;
20,000-Strip duplicate merge has median +11.06%, paired +9.39%, IQR 3.99 pp.
Against the identical second checkpoint, their paired medians are +4.20% and
+3.76%; neither is slower in every pair. The latter control itself has duplicate
merge +9.05% against the primary checkpoint. These differences remain unresolved,
rather than being declared either proven regressions or harmless noise.

The next independent experiment defers building the traversal directory until a
fallback query actually uses it. Endpoint and gate hits already resolve without
the directory. Currently the ninth linked node starts building and maintaining
one even if no lookup ever needs it. The short small-removal profile confirms
this work inside the timed bursts, but its 103 samples do not support a precise
cost percentage. Raw profiles and the next hypothesis are retained with the
other temporary artifacts.
